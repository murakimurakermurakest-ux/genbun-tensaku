import { questions } from '@/lib/questionBank';

function normalizeJapanese(value: string) {
  return value.replace(/[\s　]/g, '').replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
}

function fallbackEssayGrade(answer: string, q: typeof questions[number]) {
  const normalized = normalizeJapanese(answer);
  const model = normalizeJapanese(q.modelAnswer);
  const modelTerms = Array.from(new Set((q.modelAnswer.match(/[一-龥ぁ-んァ-ヶー]{2,}/g) ?? [])
    .filter((term) => term.length >= 2)
    .slice(0, 8)));
  const hitTerms = modelTerms.filter((term) => normalized.includes(normalizeJapanese(term)));
  const ratio = modelTerms.length ? hitTerms.length / modelTerms.length : 0;
  const length = Array.from(normalized).length;
  const lengthOk = q.maxChars ? length <= q.maxChars : true;
  const score = Math.max(1, Math.min(5, Math.round(ratio * 4 + (lengthOk ? 1 : 0))));

  return `【簡易添削モード】\n\n【模範解答】\n${q.modelAnswer}\n\n【点数】\n${score} / 5点\n\n【採点基準】\n${hitTerms.length ? '○' : '△'} 模範解答に近い重要語句を含めて説明している\n${lengthOk ? '○' : '×'} 字数条件を守っている${q.maxChars ? `（${length}/${q.maxChars}字）` : ''}\n△ 理由や内容のつながりが明確かどうかは、AI接続後により詳しく判定します\n\n【解説】\n現在はOpenAI APIキー未設定のため、簡易判定で表示しています。AI接続後は、模範解答をもとに採点基準を作成し、○△×と5点満点で詳しく添削します。`;
}

function gradeChoice(studentAnswer: string, q: typeof questions[number]) {
  const answer = normalizeJapanese(studentAnswer).toUpperCase();
  const correct = q.correctChoice ?? q.modelAnswer;
  const ok = answer === correct;
  return `${ok ? '○ 正解' : '× 不正解'}\n\n【あなたの解答】\n${studentAnswer}\n\n【正答】\n${correct}\n\n【解説】\n${q.explanation ?? '正答を確認し、本文や設問の条件と照らし合わせて復習しましょう。'}`;
}

function gradeExtract(studentAnswer: string, q: typeof questions[number]) {
  const answer = normalizeJapanese(studentAnswer);
  const correct = normalizeJapanese(q.modelAnswer.replace(/（.*?）/g, ''));
  const ok = answer === correct || correct.includes(answer) || answer.includes(correct);
  return `${ok ? '○ 正解' : '△ 要確認'}\n\n【あなたの解答】\n${studentAnswer}\n\n【正答例】\n${q.modelAnswer}\n\n【解説】\n抜き出し問題は、表記の違いで判定がずれることがあります。正答例と照らして、抜き出した範囲が一致しているか確認してください。`;
}

export async function POST(req: Request) {
  const { questionId, studentAnswer } = await req.json();
  const q = questions.find((item) => item.id === questionId);
  if (!q) return Response.json({ error: '設問が見つかりません。' }, { status: 404 });
  if (!studentAnswer || !studentAnswer.trim()) return Response.json({ error: '解答を入力してください。' }, { status: 400 });

  if (q.type === 'choice') {
    return Response.json({ result: gradeChoice(studentAnswer, q), mode: 'choice' });
  }

  if (q.type === 'extract') {
    return Response.json({ result: gradeExtract(studentAnswer, q), mode: 'extract' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ result: fallbackEssayGrade(studentAnswer, q), mode: 'fallback' });
  }

  const prompt = `
あなたは高校現代文の教師です。生徒の記述答案を添削してください。
このアプリは自学支援用です。断定しすぎず、学習者が次に何を直せばよいかが分かるように説明してください。

【教材】
${q.materialTitle}

【設問】
${q.question}

【模範解答】
${q.modelAnswer}

【字数条件】
${q.maxChars ? `${q.maxChars}字以内` : '指定なし'}

【生徒答案】
${studentAnswer}

次の4項目を必ずすべて出力してください。
【模範解答】【点数】【採点基準】【解説】の見出しを省略してはいけません。

【模範解答】
${q.modelAnswer}

【点数】
0〜5の整数で「n / 5点」と表示してください。
小数は使わないでください。

【採点基準】
採点基準を3〜5個作成し、各項目の先頭に必ず ○・△・× のどれかを付けてください。

形式：
○ 〜〜〜
△ 〜〜〜
× 〜〜〜

○：十分に満たしている
△：一部は満たしているが不十分
×：満たしていない

【解説】
生徒答案の良い点と改善点を、100〜180字程度で具体的に説明する。

最後に次の注意書きをそのまま表示してください。

※この添削はAIによる参考評価です。最終的な理解は、授業・教科書・配布資料で確認してください。
`;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!geminiRes.ok) {
    const errorText = await geminiRes.text();
    console.error('Gemini API error:', errorText);
    return Response.json(
      { result: fallbackEssayGrade(studentAnswer, q), mode: 'fallback', warning: 'Gemini APIの呼び出しに失敗したため、簡易添削で表示しました。' },
      { status: 200 }
    );
  }

  const geminiData = await geminiRes.json();
  console.log(geminiData);
  const result = geminiData?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('') || '添削結果を取得できませんでした。';

  return Response.json({ result, mode: 'gemini' });
}
