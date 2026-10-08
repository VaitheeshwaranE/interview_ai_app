import { NextRequest, NextResponse } from 'next/server';
import { evaluateInterviewAnswer, correctSpeech } from '@/lib/watsonx';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, answer, type, avatarId } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer required' }, { status: 400 });
    }

    // Run evaluation and speech correction in parallel
    const [evaluation, correction] = await Promise.all([
      evaluateInterviewAnswer({ question, answer, type: type || 'hr', role: 'Software Engineer' }),
      correctSpeech(answer),
    ]);

    return NextResponse.json({
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      betterAnswer: evaluation.betterAnswer,
      corrections: correction.corrections,
      improvedText: correction.improvedText,
      fillerWords: correction.fillerWords,
      grammarScore: correction.score,
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json({
      score: 70,
      feedback: 'Your answer showed effort. Consider adding specific examples and quantifiable achievements.',
      strengths: ['Clear communication', 'Relevant topic coverage'],
      improvements: ['Add STAR method structure', 'Include specific metrics'],
      betterAnswer: 'Use the STAR method: Situation, Task, Action, Result.',
      corrections: [],
      fillerWords: [],
      grammarScore: 72,
    });
  }
}
