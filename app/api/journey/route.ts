import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers
      .get('Authorization')
      ?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: decoded.uid,
      },
      include: {
        profile: true,
        roadmapProgress: {
          include: {
            roadmap: {
              include: {
                stages: {
                  orderBy: {
                    orderIndex: 'asc',
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      xp: user.xp,
      level: user.level,
      profile: user.profile,
      roadmaps: user.roadmapProgress,
    });
  } catch (error) {
    console.error('Journey API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}