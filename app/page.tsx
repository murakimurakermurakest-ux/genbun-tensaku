'use client';

import { useEffect, useMemo, useState } from 'react';

type QuestionType = 'essay' | 'choice' | 'extract';

type Choice = { label: string; text: string };

type PublicQuestion = {
  id: string;
  materialId: string;
  materialTitle: string;
  number: number;
  page: string;
  line: string;
  type: QuestionType;
  title: string;
  question: string;
  maxChars: number | null;
  choices?: Choice[];
};

type Material = { id: string; title: string };

export default function Home() {
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialId, setMaterialId] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [choiceAnswer, setChoiceAnswer] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/questions')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions ?? []);
        setMaterials(data.materials ?? []);
        const firstMaterial = data.materials?.[0]?.id ?? '';
        const firstQuestion = data.questions?.find((q: PublicQuestion) => q.materialId === firstMaterial)?.id ?? data.questions?.[0]?.id ?? '';
        setMaterialId(firstMaterial);
        setQuestionId(firstQuestion);
      });
  }, []);

  const filteredQuestions = useMemo(() => questions.filter((q) => q.materialId === materialId), [questions, materialId]);
  const current = useMemo(() => questions.find((q) => q.id === questionId), [questions, questionId]);
  const answerForSubmit = current?.type === 'choice' ? choiceAnswer : studentAnswer;
  const charCount = Array.from(studentAnswer.replace(/\s/g, '')).length;

  function resetAnswer(nextQuestionId?: string) {
    setQuestionId(nextQuestionId ?? '');
    setResult('');
    setStudentAnswer('');
    setChoiceAnswer('');
    setError('');
  }

  async function handleGrade() {
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, studentAnswer: answerForSubmit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '採点に失敗しました。');
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <span className="badge">試作版｜本文非表示</span>
        <h1>現代文 自学サポート</h1>
        <p className="small">教科書・プリントを手元に置き、設問への解答だけを入力して確認します。</p>
      </section>

      <div className="grid">
        <section className="card">
          <label htmlFor="material">教材</label>
          <select
            id="material"
            value={materialId}
            onChange={(e) => {
              const nextMaterial = e.target.value;
              setMaterialId(nextMaterial);
              const first = questions.find((q) => q.materialId === nextMaterial);
              resetAnswer(first?.id ?? '');
            }}
          >
            {materials.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>

          <label htmlFor="question" style={{ marginTop: 14 }}>設問</label>
          <select id="question" value={questionId} onChange={(e) => resetAnswer(e.target.value)}>
            {filteredQuestions.map((q) => <option key={q.id} value={q.id}>{q.title}：{q.type === 'choice' ? '選択' : q.type === 'extract' ? '抜き出し' : '記述'}</option>)}
          </select>

          {current && (
            <>
              <div className="meta">
                <span>教材：{current.materialTitle}</span>
                <span>p.{current.page} / 行 {current.line}</span>
                <span>{current.type === 'choice' ? '選択問題' : current.type === 'extract' ? '抜き出し問題' : '記述問題'}</span>
                {current.maxChars && <span>{current.maxChars}字以内</span>}
              </div>
              <div className="question">{current.question}</div>
              {current.choices && (
                <div className="choices">
                  {current.choices.map((choice) => (
                    <label key={choice.label} className="choice">
                      <input
                        type="radio"
                        name="choice"
                        value={choice.label}
                        checked={choiceAnswer === choice.label}
                        onChange={(e) => setChoiceAnswer(e.target.value)}
                      />
                      <span>{choice.label}　{choice.text}</span>
                    </label>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <section className="card">
          {current?.type === 'choice' ? (
            <>
              <label>あなたの解答</label>
              <p className="small">選択肢を一つ選んでください。</p>
            </>
          ) : (
            <>
              <label htmlFor="answer">あなたの解答</label>
              <textarea
                id="answer"
                placeholder={current?.type === 'extract' ? '本文から抜き出した語句を入力' : 'ここに記述答案を入力'}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
              />
              <div className="counter">
                {charCount}字{current?.maxChars ? ` / ${current.maxChars}字以内` : ''}
              </div>
            </>
          )}
          <button onClick={handleGrade} disabled={loading || !answerForSubmit.trim() || !questionId}>
            {loading ? '確認中...' : current?.type === 'choice' ? '答えを確認する' : '添削する'}
          </button>
          {error && <p className="small" style={{ color: '#b91c1c' }}>{error}</p>}
        </section>
      </div>

      <section className="card" style={{ marginTop: 18 }}>
        <label>結果</label>
        <div className="result">{result || 'ここに結果が表示されます。'}</div>
      </section>
    </main>
  );
}
