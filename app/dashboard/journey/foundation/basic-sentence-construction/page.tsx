'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Award,
  Play,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function BasicSentenceConstructionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  const MODULE_ID = 'basic-sentence-construction';

  const lessons = [
    {
      title: 'What is a Sentence?',
      content:
        'A sentence is a group of words that expresses a complete thought.',
    },
    {
      title: 'Basic Sentence Structure',
      content:
        'The basic English sentence structure is Subject + Verb + Object.',
    },
    {
      title: 'Example',
      content:
        'I play football. Here, I is the Subject, play is the Verb, and football is the Object.',
    },
  ];

  // Check whether this module was already completed
  useEffect(() => {
    const checkModuleStatus = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const response = await fetch(
  `/api/journey/module?moduleId=${MODULE_ID}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        if (!response.ok) {
          throw new Error('Failed to load module progress');
        }

        const data = await response.json();

        const moduleProgress = data.progress?.find(
          (item: { moduleId: string; completed: boolean }) =>
            item.moduleId === MODULE_ID
        );

        setCompleted(moduleProgress?.completed === true);
      } catch (err) {
        console.error('Module status error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkModuleStatus();
  }, [user]);

  // Complete module and earn XP
  const completeModule = async () => {
    try {
      if (!user) {
        setError('Please sign in first.');
        return;
      }

      if (completed || completing) return;

      setCompleting(true);
      setError('');

      const token = await user.getIdToken();

      const response = await fetch('/api/journey/module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          moduleId: MODULE_ID,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete module');
      }

      setCompleted(true);
    } catch (err) {
      console.error('Module completion error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading module...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard/journey/foundation')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Foundation
      </button>

      {/* Module Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-brand-400" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">
              Basic Sentence Construction
            </h1>

            <p className="text-slate-400 mt-1">
              Learn how to build clear and correct English sentences.
            </p>

            <p className="text-brand-300 text-sm mt-2">
              +20 XP on completion
            </p>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-5">
          Learning Content
        </h2>

        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-white/10 bg-white/5"
            >
              <h3 className="font-semibold text-brand-300 mb-2">
                {index + 1}. {lesson.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                {lesson.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Practice */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-3">
          Quick Practice
        </h2>

        <p className="text-slate-400 text-sm mb-4">
          Arrange these words into a correct sentence:
        </p>

        <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
          <p className="text-white font-medium">
            football / I / play
          </p>
        </div>

        <div className="mt-4">
          <p className="text-slate-400 text-sm">
            Answer:
          </p>

          <p className="text-emerald-400 mt-2 font-medium">
            I play football.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Complete Module */}
      {!completed ? (
        <button
          onClick={completeModule}
          disabled={completing}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {completing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Completing...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Complete Module & Earn 20 XP
            </>
          )}
        </button>
      ) : (
        <div className="glass-card p-6 text-center border border-emerald-500/30">
          <Award className="w-10 h-10 text-emerald-400 mx-auto mb-3" />

          <h2 className="text-xl font-bold text-emerald-400">
            Module Completed! 🎉
          </h2>

          <p className="text-slate-300 mt-2">
            You earned +20 XP.
          </p>

          <p className="text-slate-400 text-sm mt-1">
            Your progress has been saved. The next module is now unlocked.
          </p>

          <button
            onClick={() => router.push('/dashboard/journey/foundation')}
            className="btn-primary mt-5 px-6 py-2.5 inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Continue to Next Module
          </button>
        </div>
      )}
    </div>
  );
}