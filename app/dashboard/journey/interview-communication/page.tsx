'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  Lock,
  MessageCircle,
  Trophy,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULES = [
  {
    id: 'self-introduction',
    title: 'Self Introduction',
    description:
      'Learn how to confidently introduce yourself in an interview.',
    xp: 20,
    path: '/dashboard/journey/interview-communication/self-introduction',
  },
  {
    id: 'answering-interview-questions',
    title: 'Answering Interview Questions',
    description:
      'Learn how to understand questions and give clear, structured answers.',
    xp: 20,
    path: '/dashboard/journey/interview-communication/answering-interview-questions',
  },
  {
    id: 'star-method-behavioral',
    title: 'STAR Method & Behavioral',
    description:
      'Learn how to answer behavioral questions using the STAR method.',
    xp: 20,
    path: '/dashboard/journey/interview-communication/star-method-behavioral',
  },
  {
    id: 'handling-difficult-questions',
    title: 'Handling Difficult Questions',
    description:
      'Learn how to professionally handle difficult and unexpected questions.',
    xp: 20,
    path: '/dashboard/journey/interview-communication/handling-difficult-questions',
  },
  {
    id: 'interview-confidence-closing',
    title: 'Interview Confidence & Closing',
    description:
      'Improve confidence, body language, and professional interview closing.',
    xp: 20,
    path: '/dashboard/journey/interview-communication/interview-confidence-closing',
  },
];

export default function InterviewCommunicationPage() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [completedModules, setCompletedModules] =
    useState<string[]>([]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    loadProgress();
  }, [user, authLoading]);

  const loadProgress = async () => {
    try {
      if (!user) return;

      const token = await user.getIdToken();

      const response = await fetch(
        '/api/journey/module',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      );

      if (response.ok) {
        const data = await response.json();

        const completed =
          data.progress
            ?.filter(
              (item: any) =>
                item.completed &&
                MODULES.some(
                  (module) =>
                    module.id === item.moduleId
                )
            )
            .map(
              (item: any) =>
                item.moduleId
            ) || [];

        setCompletedModules(completed);
      }
    } catch (error) {
      console.error(
        'Error loading journey progress:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const isModuleUnlocked = (index: number) => {
    if (index === 0) {
      return true;
    }

    return completedModules.includes(
      MODULES[index - 1].id
    );
  };

  const completedCount =
    completedModules.length;

  const progress =
    (completedCount / MODULES.length) * 100;

  /* =========================
     LOADING
  ========================= */

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />

          <p className="text-muted-foreground">
            Loading Interview Communication...
          </p>

        </div>
      </div>
    );
  }

  /* =========================
     MAIN PAGE
  ========================= */

  return (
    <div className="min-h-screen px-4 py-8">

      <div className="max-w-4xl mx-auto">

        {/* BACK */}

        <button
          onClick={() =>
            router.push('/dashboard/journey')
          }
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={20} />

          Back to Journey
        </button>

        {/* HEADER */}

        <div className="glass-card p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="p-3 rounded-xl bg-primary/10">

                  <MessageCircle
                    className="w-7 h-7 text-primary"
                  />

                </div>

                <span className="text-sm font-medium text-primary">
                  INTERVIEW COMMUNICATION
                </span>

              </div>

              <h1 className="text-3xl font-bold mb-2">
                Interview Communication
              </h1>

              <p className="text-muted-foreground">
                Build the communication skills you
                need to answer interview questions
                confidently and professionally.
              </p>

            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold">

              <Trophy size={20} />

              100 XP Total

            </div>

          </div>

        </div>

        {/* PROGRESS */}

        <div className="glass-card p-6 mb-8">

          <div className="flex items-center justify-between mb-3">

            <div>

              <h2 className="font-bold">
                Stage Progress
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                {completedCount} of {MODULES.length}{' '}
                completed
              </p>

            </div>

            <span className="text-primary font-bold">
              {progress}%
            </span>

          </div>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">

            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <div className="flex justify-between mt-2 text-xs text-muted-foreground">

            <span>
              Interview Communication
            </span>

            <span>
              100 XP total
            </span>

          </div>

        </div>

        {/* MODULES */}

        <div className="glass-card p-8">

          <h2 className="text-xl font-bold mb-6">
            Your Learning Modules
          </h2>

          <div className="space-y-4">

            {MODULES.map(
              (module, index) => {

                const completed =
                  completedModules.includes(
                    module.id
                  );

                const unlocked =
                  isModuleUnlocked(index);

                return (
                  <button
                    key={module.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => {
                      if (unlocked) {
                        router.push(
                          module.path
                        );
                      }
                    }}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
                      completed
                        ? 'border-green-500/50 bg-green-500/5'
                        : unlocked
                        ? 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                        : 'border-border opacity-40 cursor-not-allowed'
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      {/* NUMBER / ICON */}

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          completed
                            ? 'bg-green-500/10'
                            : unlocked
                            ? 'bg-primary/10'
                            : 'bg-muted'
                        }`}
                      >

                        {completed ? (
                          <CheckCircle
                            size={22}
                            className="text-green-500"
                          />
                        ) : unlocked ? (
                          <span className="font-bold text-primary">
                            {index + 1}
                          </span>
                        ) : (
                          <Lock
                            size={19}
                            className="text-muted-foreground"
                          />
                        )}

                      </div>

                      {/* CONTENT */}

                      <div className="flex-1 min-w-0">

                        <h3 className="font-bold">
                          {module.title}
                        </h3>

                        <p className="text-sm text-muted-foreground mt-1">
                          {module.description}
                        </p>

                        <p className="text-xs text-muted-foreground mt-2">
                          +{module.xp} XP on completion
                        </p>

                      </div>

                      {/* STATUS */}

                      <div className="flex-shrink-0 text-sm">

                        {completed ? (
                          <span className="text-green-500 font-semibold">
                            Completed ✓
                          </span>
                        ) : unlocked ? (
                          <span className="text-primary font-semibold">
                            Unlocked
                          </span>
                        ) : (
                          <Lock
                            size={18}
                            className="text-muted-foreground"
                          />
                        )}

                      </div>

                    </div>

                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* COMPLETION */}

        {completedCount === MODULES.length && (
          <div className="glass-card p-8 mt-6 text-center border-green-500/30">

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">

              <Trophy
                className="text-green-500"
                size={32}
              />

            </div>

            <h2 className="text-2xl font-bold text-green-500 mb-2">
              Interview Communication Completed! 🎉
            </h2>

            <p className="text-muted-foreground mb-4">
              You completed all 5 Interview
              Communication modules.
            </p>

            <p className="font-semibold text-green-500">
              Total XP earned: 100 XP
            </p>

          </div>
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Complete each module to unlock the next one.
        </div>

      </div>

    </div>
  );
}