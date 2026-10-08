import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

/*
|--------------------------------------------------------------------------
| XP REWARDS
|--------------------------------------------------------------------------
*/

const MODULE_XP: Record<string, number> = {
  // Foundation
  'basic-sentence-construction': 20,
  'pronunciation-fundamentals': 20,
  'common-professional-phrases': 20,
  'body-language-basics': 20,
  'active-listening': 20,

  // Daily English
  'vocabulary-building': 20,
  'daily-conversation': 20,
  'common-mistakes': 20,
  'reading-practice': 20,
  'speaking-practice': 20,

  // Professional English
  'corporate-vocabulary': 20,
  'report-writing': 20,
  'presentation-language': 20,
  'persuasion-techniques': 20,
  'data-communication': 20,

  // Interview Communication
  'self-introduction': 20,
  'answering-interview-questions': 20,
  'star-method-behavioral': 20,
  'handling-difficult-questions': 20,
  'interview-confidence-closing': 20,
};

/*
|--------------------------------------------------------------------------
| POST - Complete Journey Module  b
|--------------------------------------------------------------------------
*/

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader =
      request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    // Get Firebase token
    const token = authHeader.split('Bearer ')[1];

    // Verify Firebase user
    const decodedToken =
      await adminAuth.verifyIdToken(token);

    // Find user in PostgreSQL
    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: decodedToken.uid,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
        },
        {
          status: 404,
        }
      );
    }

    // Get module ID
    const body = await request.json();

    const moduleId = body.moduleId;

    if (!moduleId) {
      return NextResponse.json(
        {
          error: 'Module ID is required',
        },
        {
          status: 400,
        }
      );
    }

    // Get XP reward
    const xpReward = MODULE_XP[moduleId];

    if (!xpReward) {
      return NextResponse.json(
        {
          error: `Invalid module ID: ${moduleId}`,
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check whether module is already completed
    |--------------------------------------------------------------------------
    */

    const existingProgress =
      await prisma.journeyProgress.findUnique({
        where: {
          userId_moduleId: {
            userId: user.id,
            moduleId,
          },
        },
      });

    if (existingProgress?.completed) {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        xpEarned: 0,
        totalXP: user.xp,
        level: user.level,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Save module completion
    |--------------------------------------------------------------------------
    */

    await prisma.journeyProgress.upsert({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId,
        },
      },

      update: {
        completed: true,
        completedAt: new Date(),
      },

      create: {
        userId: user.id,
        moduleId,
        completed: true,
        completedAt: new Date(),
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Add XP
    |--------------------------------------------------------------------------
    */

    const updatedUser =
      await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          xp: {
            increment: xpReward,
          },
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      success: true,
      alreadyCompleted: false,
      xpEarned: xpReward,
      totalXP: updatedUser.xp,
      level: updatedUser.level,
    });
  } catch (error) {
    console.error(
      'Journey module completion error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Failed to complete module',
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| GET - Get Journey Progress
|--------------------------------------------------------------------------
*/

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader =
      request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    // Get Firebase token
    const token = authHeader.split('Bearer ')[1];

    // Verify Firebase user
    const decodedToken =
      await adminAuth.verifyIdToken(token);

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        firebaseUid: decodedToken.uid,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
        },
        {
          status: 404,
        }
      );
    }

    // Get all journey progress
    const progress =
      await prisma.journeyProgress.findMany({
        where: {
          userId: user.id,
        },

        orderBy: {
          completedAt: 'asc',
        },
      });

    return NextResponse.json({
      success: true,
      progress,
      totalXP: user.xp,
      level: user.level,
    });
  } catch (error) {
    console.error(
      'Journey progress error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Failed to get journey progress',
      },
      {
        status: 500,
      }
    );
  }
}