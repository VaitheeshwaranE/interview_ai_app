import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const body = await req.json();

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
    if (existing) {
      const user = await prisma.user.findUnique({
        where: { firebaseUid: decoded.uid },
        include: { profile: true },
      });
      return NextResponse.json({ user, message: 'User already exists' });
    }

    // Create new user with profile
    const user = await prisma.user.create({
      data: {
        firebaseUid: decoded.uid,
        email: body.email || decoded.email || '',
        name: body.name || decoded.name || 'User',
        avatar: body.avatar || decoded.picture,
        profile: {
          create: {
            grammarScore: 50,
            vocabularyScore: 50,
            confidenceScore: 50,
            fluencyScore: 50,
            pronunciationScore: 50,
            hrReadinessScore: 40,
            technicalScore: 40,
            resumeScore: 30,
          },
        },
      },
      include: { profile: true },
    });

    // Award welcome bonus
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: 50, coins: 150 },
    });

    return NextResponse.json({ user, message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
