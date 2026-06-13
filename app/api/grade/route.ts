import OpenAI from 'openai';
import { questions } from '@/lib/questionBank';

function fallbackGrade(answer: string, q: typeof questions[number]) {
  const normalized = answer.replace(/\s/g, '');
  const length = Array.from(normalized).length;
  const terms = q.requiredTerms.filter((term) => normalized.includes(term));
  const missing = q.requiredTerms.filter((term) => !normalized.includes(term));
  const lengthNote = q.maxChars ? `${length}字 / 上限${q.maxChars}字` : `${length}字`;
  const scoreBase = Math.min(10, Math.round((terms.length / Math.max(q.requiredTerms.length, 1)) * 7 + (answer.length > 10 ? 2 : 0)));
  return `【簡易添削モード】\n得点目安：${scoreBase}/10\n字数：${lengthNote}\n\n良い点：\n・答案を本文のキーワードに寄せようとしているかを確認できます。\n・含まれている要素：${terms.length ? terms.join('・') : 'まだ少なめ'}\n\n不足している可能性：\n・${missing.length ? missing.join('・') : '主要語はおおむね入っています'}\n\n改善の方向：\n・単なる感想ではなく、「なぜそう言えるのか」を因果でまとめる。\n・設問の指定語句や本文中の表現を使い、最後を「〜から」で閉じると記述答案らしくなります。\n\n模範解答例：\n${q.modelAnswer}`;
}

export async function POST(req: Request) {
  const { questionId, studentAnswer } = await req.json();
  const q = questions.find((item) => item.id === questionId);
  if (!q) return Response.json({ error: '設問が見つかりません。' }, { status: 404 });
  if (!studentAnswer || !studentAnswer.trim()) return Response.json({ error: '答案を入力してください。' }, { status: 400 });

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ result: fallbackGrade(studentAnswer, q), mode: 'fallback' });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `
あなたは高校現代文の教師です。生徒の記述答案を、本文理解にもとづいて具体的に添削してください。
ただし、本文全文は生徒に提示しません。添削は設問と採点基準に基づいて行います。

【作品】ミロのヴィーナス
【設問】
${q.question}

【模範解答・採点基準として使う情報】
${q.modelAnswer}

【指定語・重要語】
${q.requiredTerms.join('、') || 'なし'}

【生徒答案】
${studentAnswer}

次の形式で返してください。
1. 得点目安（10点満点）
2. 良い点
3. 不足している要素
4. 誤答パターン（因果ズレ／条件落ち／言い過ぎ／本文根拠不足など）
5. 改善答案
6. 次に意識すること（一文）
`;

  const completion = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      { role: 'system', content: 'あなたは高校国語の記述添削に特化した、厳しすぎず具体的な教師です。' },
      { role: 'user', content: prompt },
    ],
  });

  return Response.json({ result: completion.choices[0]?.message?.content ?? '添削結果を取得できませんでした。', mode: 'ai' });
}
