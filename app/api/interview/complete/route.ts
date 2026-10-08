import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const body = await req.json();

    let userId: string | null = null;
    if (token) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
        if (user) userId = user.id;
      } catch {}
    }

    const { type, avatarId, duration, messages, overallScore } = body;

    if (!userId) {
      return NextResponse.json({ success: true, xpEarned: 50, coinsEarned: 25, message: 'Interview completed (guest)' });
    }

    // Calculate rewards
    const xpEarned = Math.round(overallScore * 1.5 + (duration > 600 ? 50 : 0));
    const coinsEarned = Math.round(overallScore * 0.5);

    // Create interview session
    const session = await prisma.interviewSession.create({
      data: {
        userId,
        type: type || 'hr',
        avatarId: avatarId || 'hr-manager',
        duration: duration || 0,
        overallScore: overallScore || 70,
        grammarScore: Math.round(overallScore * 0.9 + Math.random() * 10),
        vocabularyScore: Math.round(overallScore * 0.85 + Math.random() * 15),
        confidenceScore: Math.round(overallScore * 0.8 + Math.random() * 20),
        fluencyScore: Math.round(overallScore * 0.9 + Math.random() * 10),
        speakingSpeed: 130 + Math.floor(Math.random() * 40),
        xpEarned,
        coinsEarned,
        completedAt: new Date(),
        questions: {
          create: messages
            ?.filter((m: { role: string }) => m.role === 'interviewer')
            ?.map((m: { content: string }, i: number) => ({
              question: m.content,
              orderIndex: i,
            })) || [],
        },
      },
    });

    // Update user XP, coins, profile
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpEarned },
        coins: { increment: coinsEarned },
        profile: {
          update: {
            totalInterviews: { increment: 1 },
            confidenceScore: { set: Math.min(100, Math.round(overallScore * 0.8 + 15)) },
          },
        },
      },
    });

    // Update streak
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { lastActiveDate: true, streak: true, longestStreak: true } });
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
      lastActive?.setHours(0, 0, 0, 0);
      const isYesterday = lastActive && (today.getTime() - lastActive.getTime() === 86400000);
      const isToday = lastActive && lastActive.getTime() === today.getTime();

      const newStreak = isYesterday ? user.streak + 1 : isToday ? user.streak : 1;
      await prisma.user.update({
        where: { id: userId },
        data: {
          streak: newStreak,
          longestStreak: Math.max(newStreak, user.longestStreak),
          lastActiveDate: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      xpEarned,
      coinsEarned,
      message: 'Interview session saved!',
    });
  } catch (error) {
    console.error('Interview complete error:', error);
    return NextResponse.json({ success: true, xpEarned: 50, coinsEarned: 25 });
  }
}
