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

interface Lesson {
  title: string;
  content: string;
}

interface Props {
  moduleId: string;
  title: string;
  description: string;
  practiceText: string;
  lessons: Lesson[];
}

export default function DailyEnglishModule({
  moduleId,
  title,
  description,
  practiceText,
  lessons,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const response = await fetch('/api/journey/module', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load module progress');
        }

        const data = await response.json();

        const moduleProgress = data.progress?.find(
          (item: { moduleId: string; completed: boolean }) =>
            item.moduleId === moduleId
        );

        setCompleted(moduleProgress?.completed === true);
      } catch (error) {
        console.error('Module status error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user, moduleId]);

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
          moduleId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to complete module'
        );
      }

      setCompleted(true);
    } catch (error) {
      console.error('Module completion error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading module...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <button
        onClick={() =>
          router.push('/dashboard/journey/daily-english')
        }
        className="flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Daily English
      </button>

      <div className="glass-card p-6">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-brand-400" />
          </div>

          <div>

            <h1 className="text-2xl font-black text-white">
              {title}
            </h1>

            <p className="text-slate-400 mt-1">
              {description}
            </p>

            <p className="text-brand-300 text-sm mt-2">
              +20 XP on completion
            </p>

          </div>

        </div>

      </div>

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

      <div className="glass-card p-6">

        <h2 className="text-lg font-bold text-white mb-3">
          Quick Practice
        </h2>

        <p className="text-slate-400 text-sm mb-4">
          Practice saying this sentence:
        </p>

        <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
          <p className="text-white font-medium">
            {practiceText}
          </p>
        </div>

      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

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
            Your progress has been saved.
          </p>

          <button
            onClick={() =>
              router.push('/dashboard/journey/daily-english')
            }
            className="btn-primary mt-5 px-6 py-2.5 inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Back to Daily English
          </button>

        </div>
      )}

    </div>
  );
}