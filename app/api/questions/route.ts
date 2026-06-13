import { publicQuestions } from '@/lib/questionBank';

export async function GET() {
  return Response.json({ questions: publicQuestions });
}
