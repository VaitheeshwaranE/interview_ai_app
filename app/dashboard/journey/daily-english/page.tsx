'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Trophy,
  Lock,
  Play,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ModuleProgress {
  moduleId: string;
  completed: boolean;
}

const MODULES = [
  {
    id: 'vocabulary-building',
    title: 'Vocabulary Building',
    description: 'Learn useful English words and improve your vocabulary.',
  },
  {
    id: 'daily-conversation',
    title: 'Daily Conversation',
    description: 'Practice common English conversations used in daily life.',
  },
  {
    id: 'common-mistakes',
    title: 'Common Mistakes',
    description: 'Identify and avoid common English communication mistakes.',
  },
  {
    id: 'reading-practice',
    title: 'Reading Practice',
    description: 'Improve your reading ability and understanding of English.',
  },
  {
    id: 'speaking-practice',
    title: 'Speaking Practice',
    description: 'Practice speaking clearly and confidently in English.',
  },
];

const REQUIRED_XP = 200;

export default function DailyEnglishPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();

  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
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
          throw new Error('Failed to load journey progress');
        }

        const data = await response.json();

        setProgress(data.progress || []);
      } catch (error) {
        console.error('Daily English progress error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadProgress();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading Daily English...
        </div>
      </div>
    );
  }

  const currentXP = userProfile?.xp || 0;

  const completedCount = MODULES.filter((module) =>
    progress.some(
      (item) => item.moduleId === module.id && item.completed
    )
  ).length;

  const progressPercentage = (completedCount / MODULES.length) * 100;

  const stageUnlocked = currentXP >= REQUIRED_XP;

  const isModuleCompleted = (moduleId: string) => {
    return progress.some(
      (item) => item.moduleId === moduleId && item.completed
    );
  };

  const isModuleUnlocked = (index: number) => {
    if (!stageUnlocked) return false;

    if (index === 0) return true;

    return isModuleCompleted(MODULES[index - 1].id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back */}
      <button
        onClick={() => router.push('/dashboard/journey')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Journey
      </button>

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-brand-400" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                Daily English
              </h1>

              <p className="text-slate-400 mt-1">
                Build your everyday English communication skills.
              </p>

              <p className="text-slate-500 text-sm mt-2">
                2-3 weeks • 5 modules
              </p>
            </div>

          </div>

          <div className="px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/30">
            <p className="text-brand-300 font-bold">
              100 XP
            </p>
          </div>

        </div>
      </div>

      {/* Locked Stage */}
      {!stageUnlocked && (
        <div className="glass-card p-6 border border-yellow-500/20 bg-yellow-500/5">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-yellow-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-yellow-300">
                Daily English is Locked
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                You need {REQUIRED_XP} XP to unlock this stage.
              </p>

              <p className="text-slate-500 text-sm mt-1">
                Current XP: {currentXP} XP
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Progress */}
      <div className="glass-card p-6">

        <div className="flex items-center justify-between mb-3">

          <h2 className="text-lg font-bold text-white">
            Stage Progress
          </h2>

          <span className="text-brand-300 font-bold">
            {progressPercentage}%
          </span>

        </div>

        <div className="h-3 rounded-full bg-slate-800 overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />

        </div>

        <div className="flex justify-between mt-3 text-sm text-slate-500">

          <span>
            {completedCount} of {MODULES.length} completed
          </span>

          <span>
            2-3 weeks
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

            const completed = isModuleCompleted(module.id);
            const unlocked = isModuleUnlocked(index);

            return (
              <div
                key={module.id}
                className={`p-4 rounded-xl border transition ${
                  completed
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : unlocked
                    ? 'border-white/10 bg-white/5'
                    : 'border-white/5 bg-white/[0.02] opacity-50'
                }`}
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        completed
                          ? 'bg-emerald-500/10'
                          : unlocked
                          ? 'bg-brand-500/10'
                          : 'bg-white/5'
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : unlocked ? (
                        <span className="text-brand-300 font-bold">
                          {index + 1}
                        </span>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    <div>

                      <h3 className="font-semibold text-white">
                        {module.title}
                      </h3>

                      <p className="text-slate-500 text-sm mt-1">
                        +20 XP on completion
                      </p>

                    </div>

                  </div>

                  {completed ? (
                    <span className="text-emerald-400 text-sm font-semibold">
                      Completed ✓
                    </span>
                  ) : unlocked ? (
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/journey/daily-english/${module.id}`
                        )
                      }
                      className="btn-primary px-5 py-2 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-600" />
                  )}

                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* Completion */}
      {completedCount === MODULES.length && (
        <div className="glass-card p-8 text-center border border-emerald-500/30">

          <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-emerald-400">
            Stage Completed! 🎉
          </h2>

          <p className="text-slate-400 mt-2">
            You completed all modules in Daily English.
          </p>

          <p className="text-emerald-300 font-semibold mt-3">
            Total XP earned: 100 XP
          </p>

          <button
            onClick={() => router.push('/dashboard/journey')}
            className="btn-primary mt-6 px-6 py-2.5"
          >
            Back to Journey
          </button>

        </div>
      )}

    </div>
  );
}