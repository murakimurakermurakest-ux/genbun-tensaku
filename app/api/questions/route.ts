import { questions, materials } from '@/lib/questionBank';

export async function GET() {
  return Response.json({ questions, materials });
}
