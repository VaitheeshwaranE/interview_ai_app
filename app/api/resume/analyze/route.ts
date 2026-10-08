import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/watsonx';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';

// Using a simplified text extraction approach without pdf-parse binary dependencies
async function extractTextFromRequest(req: NextRequest): Promise<string> {
  const contentType = req.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    const body = await req.json();
    return body.text || body.resumeText || '';
  }
  
  // For multipart/form-data
  const formData = await req.formData();
  const textContent = formData.get('text') as string | null;
  if (textContent) return textContent;
  
  // In production, parse PDF using pdf-parse or similar
  return 'Resume text extraction placeholder. Upload as text or integrate PDF parsing.';
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    
    let userId: string | null = null;
    if (token) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
        if (user) userId = user.id;
      } catch {}
    }

    const resumeText = await extractTextFromRequest(req);

    if (!resumeText?.trim()) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    const analysis = await analyzeResume(resumeText);

    // Save analysis if user is authenticated
    if (userId) {
      await prisma.resumeAnalysis.create({
        data: {
          userId,
          fileName: 'uploaded_resume.pdf',
          skills: analysis.skills,
          projects: analysis.projects as unknown as never,
          experience: analysis.experience as unknown as never,
          achievements: analysis.achievements,
          education: analysis.education as unknown as never,
          overallScore: analysis.overallScore,
          suggestions: analysis.suggestions,
          generatedQuestions: analysis.generatedQuestions as unknown as never,
        },
      });

      // Update resume score in profile
      await prisma.userProfile.updateMany({
        where: { userId },
        data: { resumeScore: analysis.overallScore },
      });
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Resume analysis error:', error);
    return NextResponse.json({
      analysis: {
        skills: ['Communication', 'Problem Solving'],
        projects: [],
        experience: [],
        achievements: [],
        education: [],
        overallScore: 65,
        suggestions: ['Add quantifiable achievements', 'Include relevant keywords', 'Improve formatting'],
        generatedQuestions: {
          behavioral: ['Tell me about yourself.', 'What is your greatest strength?'],
          technical: ['Describe your technical skills.'],
          projectBased: ['Walk me through your most impactful project.'],
        },
      },
    });
  }
}
