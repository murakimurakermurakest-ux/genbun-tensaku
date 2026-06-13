'use client';

import { useEffect, useMemo, useState } from 'react';

type PublicQuestion = {
  id: string;
  number: number;
  page: string;
  line: string;
  title: string;
  question: string;
  maxChars: number | null;
  requiredTerms: string[];
};

export default function Home() {
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [questionId, setQuestionId] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/questions')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setQuestionId(data.questions?.[0]?.id ?? '');
      });
  }, []);

  const current = useMemo(() => questions.find((q) => q.id === questionId), [questions, questionId]);
  const charCount = Array.from(studentAnswer.replace(/\s/g, '')).length;

  async function handleGrade() {
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, studentAnswer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '添削に失敗しました。');
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
        <h1>現代文記述添削アプリ</h1>
        <p className="small">教科書・プリントを手元に置き、答案だけを入力して添削します。</p>
      </section>

      <div className="grid">
        <section className="card">
          <label htmlFor="question">設問</label>
          <select id="question" value={questionId} onChange={(e) => { setQuestionId(e.target.value); setResult(''); setStudentAnswer(''); }}>
            {questions.map((q) => <option key={q.id} value={q.id}>{q.title}（p.{q.page}）</option>)}
          </select>

          {current && (
            <>
              <div className="meta">
                <span>作品：ミロのヴィーナス</span>
                <span>p.{current.page} / 行 {current.line}</span>
                {current.maxChars && <span>{current.maxChars}字以内</span>}
              </div>
              <div className="question">{current.question}</div>
            </>
          )}
        </section>

        <section className="card">
          <label htmlFor="answer">あなたの答案</label>
          <textarea
            id="answer"
            placeholder="ここに記述答案を入力"
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
          />
          <div className="counter">
            {charCount}字{current?.maxChars ? ` / ${current.maxChars}字以内` : ''}
          </div>
          <button onClick={handleGrade} disabled={loading || !studentAnswer.trim() || !questionId}>
            {loading ? '添削中...' : '添削する'}
          </button>
          {error && <p className="small" style={{ color: '#b91c1c' }}>{error}</p>}
        </section>
      </div>

      <section className="card" style={{ marginTop: 18 }}>
        <label>添削結果</label>
        <div className="result">{result || 'ここに添削結果が表示されます。'}</div>
      </section>
    </main>
  );
}
