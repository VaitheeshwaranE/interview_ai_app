import { NextRequest, NextResponse } from 'next/server';
import { mentorChat } from '@/lib/watsonx';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], context } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get user context if authenticated
    let userId: string | null = null;
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
        if (user) userId = user.id;
      } catch {}
    }

    const response = await mentorChat({ message, conversationHistory: history, userContext: context });

    // Save conversation to DB if user is authenticated
    if (userId) {
      await prisma.mentorChat.createMany({
        data: [
          { userId, role: 'user', content: message, category: detectCategory(message) },
          { userId, role: 'assistant', content: response },
        ],
      });
    }

    return NextResponse.json({
      response,
      category: detectCategory(message),
    });
  } catch (error) {
    console.error('Mentor chat error:', error);
    return NextResponse.json({
      response: "I'm here to help with your interview preparation! Could you ask your question again?",
      category: 'general',
    });
  }
}

function detectCategory(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('grammar') || lower.includes('correct') || lower.includes('sentence')) return 'grammar';
  if (lower.includes('resume') || lower.includes('cv')) return 'resume';
  if (lower.includes('interview') || lower.includes('question') || lower.includes('answer')) return 'interview';
  if (lower.includes('company') || lower.includes('google') || lower.includes('amazon') || lower.includes('microsoft')) return 'company';
  if (lower.includes('career') || lower.includes('job') || lower.includes('role')) return 'career';
  if (lower.includes('motivat') || lower.includes('anxious') || lower.includes('nervous')) return 'motivation';
  return 'general';
}
