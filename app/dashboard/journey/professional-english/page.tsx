'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Play,
  Trophy,
  Zap,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const STAGE_ID = 'professional-english';

const MODULES = [
  {
    id: 'corporate-vocabulary',
    title: 'Corporate Vocabulary',
    description:
      'Learn essential workplace and corporate vocabulary.',
    route:
      '/dashboard/journey/professional-english/corporate-vocabulary',
  },
  {
    id: 'report-writing',
    title: 'Report Writing',
    description:
      'Learn how to write clear and professional reports.',
    route: null,
  },
  {
    id: 'presentation-language',
    title: 'Presentation Language',
    description:
      'Learn professional language for presentations.',
    route: null,
  },
  {
    id: 'persuasion-techniques',
    title: 'Persuasion Techniques',
    description:
      'Develop persuasive communication skills.',
    route: null,
  },
  {
    id: 'data-communication',
    title: 'Data Communication',
    description:
      'Learn how to explain data clearly and professionally.',
    route: null,
  },
];

export default function ProfessionalEnglishPage() {
  const router = useRouter();

  const { user } = useAuth();

  const [completedModules, setCompletedModules] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    const loadProgress = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        setLoading(true);
        setError('');

        const token = await user.getIdToken();

        const response = await fetch(
          '/api/journey/module',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              'Failed to load module progress'
          );
        }

        const progress = Array.isArray(data.progress)
          ? data.progress
          : [];

        const completed = progress
          .filter(
            (item: {
              moduleId: string;
              completed: boolean;
            }) =>
              item.completed &&
              MODULES.some(
                (module) =>
                  module.id === item.moduleId
              )
          )
          .map(
            (item: {
              moduleId: string;
              completed: boolean;
            }) => item.moduleId
          );

        setCompletedModules(completed);
      } catch (err) {
        console.error(
          'Professional English progress error:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load progress'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  const isCompleted = (moduleId: string) =>
    completedModules.includes(moduleId);

  const isUnlocked = (index: number) => {
    if (index === 0) return true;

    return isCompleted(
      MODULES[index - 1].id
    );
  };

  const completedCount =
    completedModules.length;

  const progress =
    Math.round(
      (completedCount / MODULES.length) * 100
    );

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading Professional English...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-8">

      {/* Back */}
      <button
        onClick={() =>
          router.push('/dashboard/journey')
        }
        className="flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Journey
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="glass-card p-6">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

          <div>

            <div className="flex items-center gap-3 mb-4">

              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-brand-400" />
              </div>

              <div>

                <h1 className="text-2xl font-black text-white">
                  Professional English
                </h1>

                <p className="text-slate-400 text-sm mt-1">
                  3–4 weeks
                </p>

              </div>

            </div>

            <p className="text-slate-300 leading-relaxed">
              Advance to corporate-level communication
              with industry vocabulary and structured
              expression.
            </p>

          </div>

          <div className="badge-xp px-4 py-2 text-sm whitespace-nowrap flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {completedCount * 20} XP
          </div>

        </div>

      </div>

      {/* Progress */}
      <div className="glass-card p-5">

        <div className="flex justify-between mb-3">

          <span className="font-semibold text-white">
            Stage Progress
          </span>

          <span className="text-brand-400 font-bold">
            {progress}%
          </span>

        </div>

        <div className="xp-bar h-3">

          <div
            className="xp-bar-fill"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="flex justify-between mt-3 text-xs text-slate-400">

          <span>
            {completedCount} of {MODULES.length}{' '}
            completed
          </span>

          <span>
            {MODULES.length * 20} XP total
          </span>

        </div>

      </div>

      {/* Modules */}
      <div className="glass-card p-6">

        <h2 className="text-lg font-bold text-white mb-5">
          Your Learning Modules
        </h2>

        <div className="space-y-3">

          {MODULES.map((module, index) => {

            const completed =
              isCompleted(module.id);

            const unlocked =
              isUnlocked(index);

            return (
              <div
                key={module.id}
                className={`rounded-xl border p-4 transition ${
                  completed
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : unlocked
                    ? 'border-white/10 hover:border-brand-500/30'
                    : 'border-white/5 opacity-50'
                }`}
              >

                <div className="flex items-center gap-4">

                  {/* Status */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 flex-shrink-0">

                    {completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : unlocked ? (
                      <span className="font-bold text-brand-400">
                        {index + 1}
                      </span>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}

                  </div>

                  {/* Information */}
                  <div className="flex-1 min-w-0">

                    <h3
                      className={`font-semibold ${
                        unlocked
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {module.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      {module.description}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      +20 XP on completion
                    </p>

                  </div>

                  {/* Action */}
                  {completed ? (

                    <div className="text-emerald-400 text-sm font-medium whitespace-nowrap">
                      Completed ✓
                    </div>

                  ) : unlocked && module.route ? (

                    <button
                      onClick={() =>
                        router.push(
                          module.route!
                        )
                      }
                      className="btn-primary text-sm px-4 py-2 flex items-center gap-2 whitespace-nowrap"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>

                  ) : unlocked ? (

                    <span className="text-brand-400 text-sm font-medium whitespace-nowrap">
                      Unlocked
                    </span>

                  ) : (

                    <Lock className="w-4 h-4 text-slate-500" />

                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Completion */}
      {completedCount === MODULES.length && (

        <div className="glass-card border border-emerald-500/30 p-6 text-center">

          <Trophy className="w-10 h-10 text-emerald-400 mx-auto mb-3" />

          <h2 className="text-xl font-bold text-white">
            Professional English Completed! 🎉
          </h2>

          <p className="text-slate-400 mt-2">
            You completed all Professional English
            modules.
          </p>

          <p className="text-emerald-400 font-semibold mt-3">
            Total XP earned: 100 XP
          </p>

          <button
            onClick={() =>
              router.push('/dashboard/journey')
            }
            className="btn-primary mt-5 px-6 py-3"
          >
            Back to Journey
          </button>

        </div>

      )}

    </div>
  );
}