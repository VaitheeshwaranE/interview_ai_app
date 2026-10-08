import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestion } from '@/lib/watsonx';

export async function POST(req: NextRequest) {
  let body: any = {};

  try {
    body = await req.json();

    const {
      type,
      avatarId,
      difficulty,
      previousQuestions = [],
      questionNumber = 1,
    } = body;

    const question = await generateInterviewQuestion({
      type: type || 'hr',
      role: body.role || 'Software Engineer',
      company: body.company,
      previousQuestions,
      difficulty: difficulty || 'medium',
    });

    return NextResponse.json({ question, questionNumber });
  } catch (error) {
    console.error('Interview question error:', error);

    const fallbacks: Record<string, string[]> = {
      hr: [
        'Tell me about yourself and your journey so far.',
        'What motivates you to work hard?',
        'Describe a time when you faced a challenge at work.',
        'Where do you see yourself in 5 years?',
        'Why do you want to join our company?',
      ],
      technical: [
        'Explain the difference between stack and heap memory.',
        'What is time complexity? Give an example.',
        'How does a REST API differ from GraphQL?',
        'Describe the MVC design pattern.',
        'What is the significance of Big O notation?',
      ],
      behavioral: [
        'Tell me about a time you led a project.',
        'Describe a conflict with a teammate and how you resolved it.',
        'Give an example of when you showed initiative.',
        'Tell me about your biggest professional failure and what you learned.',
        'How do you handle tight deadlines?',
      ],
    };

    const typeKey = body.type?.toLowerCase() || 'hr';
    const questions = fallbacks[typeKey] || fallbacks.hr;
    const question = questions[Math.floor(Math.random() * questions.length)];

    return NextResponse.json({
      question,
      questionNumber: body.questionNumber || 1,
    });
  }
}
