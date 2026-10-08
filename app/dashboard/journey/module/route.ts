import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

const MODULES = [
  // Foundation
  'basic-sentence-construction',
  'pronunciation-fundamentals',
  'common-professional-phrases',
  'body-language-basics',
  'active-listening',

  // Daily English
  'vocabulary-building',
  'daily-conversation',
  'common-mistakes',
  'reading-practice',
  'speaking-practice',
];

const XP_REWARD = 20;

// GET: Check module progress
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
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const moduleId =
      req.nextUrl.searchParams.get('moduleId');

    // If moduleId is provided, return that module's status
    if (moduleId) {
      const progress =
        await prisma.journeyProgress.findFirst({
          where: {
            userId: user.id,
            moduleId,
          },
        });

      return NextResponse.json({
        completed: progress?.completed ?? false,
        moduleId,
      });
    }

    // Otherwise return all module progress
    const progress =
      await prisma.journeyProgress.findMany({
        where: {
          userId: user.id,
        },
        select: {
          moduleId: true,
          completed: true,
        },
      });

    return NextResponse.json({
      progress,
    });
  } catch (error) {
    console.error('Module status error:', error);

    return NextResponse.json(
      { error: 'Failed to get module status' },
      { status: 500 }
    );
  }
}

// POST: Complete a module and award XP
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { moduleId } = body;

    // Validate module ID
    if (!moduleId || !MODULES.includes(moduleId)) {
      return NextResponse.json(
        { error: 'Invalid module ID' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: decoded.uid,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check whether the module was already completed
    const existingProgress =
      await prisma.journeyProgress.findFirst({
        where: {
          userId: user.id,
          moduleId,
        },
      });

    // Prevent duplicate XP
    if (existingProgress?.completed) {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        xpAdded: 0,
        totalXP: user.xp,
      });
    }

    // Save module completion
    if (existingProgress) {
      await prisma.journeyProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          completed: true,
        },
      });
    } else {
      await prisma.journeyProgress.create({
        data: {
          userId: user.id,
          moduleId,
          completed: true,
        },
      });
    }

    // Award 20 XP
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        xp: {
          increment: XP_REWARD,
        },
      },
    });

    // Count completed modules
    const completedModules =
      await prisma.journeyProgress.count({
        where: {
          userId: user.id,
          completed: true,
        },
      });

    // Find next module
    const currentIndex =
      MODULES.indexOf(moduleId);

    const nextModule =
      currentIndex >= 0 &&
      currentIndex < MODULES.length - 1
        ? MODULES[currentIndex + 1]
        : null;

    return NextResponse.json({
      success: true,
      completed: true,
      xpAdded: XP_REWARD,
      totalXP: updatedUser.xp,
      completedModules,
      nextModule,
    });
  } catch (error) {
    console.error(
      'Module completion error:',
      error
    );

    return NextResponse.json(
      { error: 'Failed to complete module' },
      { status: 500 }
    );
  }
}