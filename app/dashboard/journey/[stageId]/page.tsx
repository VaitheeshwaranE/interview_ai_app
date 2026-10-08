'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

const STAGE_CONTENT: Record<
  string,
  {
    title: string;
    description: string;
    duration: string;
    modules: string[];
  }
> = {
  foundation: {
    title: 'Foundation',
    description:
      'Build your communication foundation. Complete each module step by step and improve your basic communication skills.',
    duration: '1-2 weeks',
    modules: [
      'Basic Sentence Construction',
      'Pronunciation Fundamentals',
      'Common Professional Phrases',
      'Body Language Basics',
      'Active Listening',
    ],
  },

  'daily-english': {
    title: 'Daily English',
    description:
      'Master everyday professional English for emails, meetings, and casual office conversations.',
    duration: '2-3 weeks',
    modules: [
      'Email Writing',
      'Meeting Vocabulary',
      'Small Talk Mastery',
      'Phone Etiquette',
      'Written Communication',
    ],
  },

  'professional-english': {
    title: 'Professional English',
    description:
      'Advance to corporate-level communication with industry vocabulary and structured expression.',
    duration: '3-4 weeks',
    modules: [
      'Corporate Vocabulary',
      'Report Writing',
      'Presentation Language',
      'Persuasion Techniques',
      'Data Communication',
    ],
  },

  'interview-communication': {
    title: 'Interview Communication',
    description:
      'Master interview-specific communication and learn how to answer confidently.',
    duration: '3-4 weeks',
    modules: [
      'STAR Method',
      'Behavioral Questions',
      'Situational Answers',
      'Answer Structuring',
      'Confidence Building',
    ],
  },

  'group-discussion': {
    title: 'Group Discussion',
    description:
      'Improve your discussion, leadership, argument, and teamwork communication skills.',
    duration: '2-3 weeks',
    modules: [
      'GD Strategies',
      'Leadership Language',
      'Debate Techniques',
      'Counter Arguments',
      'Summarization',
    ],
  },

  'presentation-skills': {
    title: 'Presentation Skills',
    description:
      'Learn professional presentation, storytelling, and public speaking skills.',
    duration: '3-4 weeks',
    modules: [
      'Slide Narration',
      'Executive Presence',
      'Storytelling',
      'Q&A Handling',
      'Voice Modulation',
    ],
  },

  'dream-company': {
    title: 'Dream Company Interview',
    description:
      'Prepare specifically for your target company and interview process.',
    duration: '4-6 weeks',
    modules: [
      'Company Research',
      'Culture Fit Questions',
      'Technical Rounds',
      'System Design Communication',
      'Offer Negotiation',
    ],
  },
};

/*
 * Database module IDs
 *
 * These IDs must match the IDs used by:
 * app/api/journey/module/route.ts
 */
const STAGE_MODULE_IDS: Record<string, string[]> = {
  foundation: [
    'basic-sentence-construction',
    'pronunciation-fundamentals',
    'common-professional-phrases',
    'body-language-basics',
    'active-listening',
  ],

  'daily-english': [
    'email-writing',
    'meeting-vocabulary',
    'small-talk-mastery',
    'phone-etiquette',
    'written-communication',
  ],

  'professional-english': [
    'corporate-vocabulary',
    'report-writing',
    'presentation-language',
    'persuasion-techniques',
    'data-communication',
  ],

  'interview-communication': [
    'star-method',
    'behavioral-questions',
    'situational-answers',
    'answer-structuring',
    'confidence-building',
  ],

  'group-discussion': [
    'gd-strategies',
    'leadership-language',
    'debate-techniques',
    'counter-arguments',
    'summarization',
  ],

  'presentation-skills': [
    'slide-narration',
    'executive-presence',
    'storytelling',
    'qa-handling',
    'voice-modulation',
  ],

  'dream-company': [
    'company-research',
    'culture-fit-questions',
    'technical-rounds',
    'system-design-communication',
    'offer-negotiation',
  ],
};

/*
 * Routes that currently exist in the project.
 *
 * We only add a route when the actual page exists.
 */
const MODULE_ROUTES: Record<string, Record<number, string>> = {
  foundation: {
    0: '/dashboard/journey/foundation/basic-sentence-construction',
    1: '/dashboard/journey/foundation/pronunciation-fundamentals',
    2: '/dashboard/journey/foundation/common-professional-phrases',
    3: '/dashboard/journey/foundation/body-language-basics',
    4: '/dashboard/journey/foundation/active-listening',
  },
};

export default function StagePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const stageId = Array.isArray(params.stageId)
    ? params.stageId[0]
    : (params.stageId as string);

  const stage = STAGE_CONTENT[stageId];

  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /*
   * Load completed modules from PostgreSQL
   */
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        setError('');

        if (!user || !stage) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const response = await fetch('/api/journey/module', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Failed to load module progress'
          );
        }

        const progress = Array.isArray(data.progress)
          ? data.progress
          : [];

        const moduleIds = STAGE_MODULE_IDS[stageId] || [];

        /*
         * Convert database module IDs into module indexes.
         *
         * Example:
         * basic-sentence-construction
         *        ↓
         * index 0
         */
        const completedIndexes = progress
          .filter(
            (item: {
              moduleId: string;
              completed: boolean;
            }) => item.completed === true
          )
          .map(
            (item: {
              moduleId: string;
              completed: boolean;
            }) => moduleIds.indexOf(item.moduleId)
          )
          .filter((index: number) => index !== -1);

        setCompletedModules(completedIndexes);
      } catch (err) {
        console.error('Journey progress error:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load journey progress'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user, stageId, stage]);

  /*
   * Stage progress
   */
  const progress =
    stage && stage.modules.length > 0
      ? Math.round(
          (completedModules.length / stage.modules.length) * 100
        )
      : 0;

  /*
   * Stage not found
   */
  if (!stage) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold text-white">
          Stage not found
        </h1>

        <button
          onClick={() => router.push('/dashboard/journey')}
          className="btn-primary mt-5 px-6 py-3"
        >
          Back to Journey
        </button>
      </div>
    );
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading journey progress...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard/journey')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Journey
      </button>

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-brand-400" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-white">
                  {stage.title}
                </h1>

                <p className="text-slate-400 text-sm mt-1">
                  {stage.duration}
                </p>
              </div>
            </div>

            <p className="text-slate-300 mt-5 leading-relaxed">
              {stage.description}
            </p>
          </div>

          <div className="badge-xp px-4 py-2 text-sm whitespace-nowrap flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {completedModules.length * 20} XP
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="glass-card p-5">
        <div className="flex justify-between mb-3">
          <div className="font-semibold text-white">
            Stage Progress
          </div>

          <div className="text-brand-400 font-bold">
            {progress}%
          </div>
        </div>

        <div className="xp-bar h-3">
          <div
            className="xp-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between mt-3 text-xs text-slate-400">
          <span>
            {completedModules.length} of {stage.modules.length} completed
          </span>

          <span>{stage.duration}</span>
        </div>
      </div>

      {/* Modules */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-5">
          Your Learning Modules
        </h2>

        <div className="space-y-3">
          {stage.modules.map((module, index) => {
            const isCompleted = completedModules.includes(index);

            /*
             * Module 1 is always unlocked.
             *
             * Every next module becomes unlocked
             * only after the previous module is completed.
             */
            const isUnlocked =
              index === 0 ||
              completedModules.includes(index - 1);

            const moduleRoute =
              MODULE_ROUTES[stageId]?.[index];

            return (
              <div
                key={module}
                className={`rounded-xl border p-4 transition ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : isUnlocked
                    ? 'border-white/10 hover:border-brand-500/30'
                    : 'border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">

                  {/* Module Number / Status */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isUnlocked ? (
                      <span className="font-bold text-brand-400">
                        {index + 1}
                      </span>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  {/* Module Name */}
                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        isUnlocked
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {module}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      +20 XP on completion
                    </p>
                  </div>

                  {/* Button / Status */}
                  {isCompleted ? (
                    <div className="text-emerald-400 text-sm font-medium">
                      Completed ✓
                    </div>
                  ) : isUnlocked && moduleRoute ? (
                    <button
                      onClick={() => router.push(moduleRoute)}
                      className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  ) : isUnlocked ? (
                    <span className="text-slate-400 text-sm">
                      Coming Soon
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

      {/* Stage Completion */}
      {completedModules.length === stage.modules.length && (
        <div className="glass-card border border-emerald-500/30 p-6 text-center">
          <Trophy className="w-10 h-10 text-emerald-400 mx-auto mb-3" />

          <h2 className="text-xl font-bold text-white">
            Stage Completed! 🎉
          </h2>

          <p className="text-slate-400 mt-2">
            You completed all modules in {stage.title}.
          </p>

          <p className="text-emerald-400 font-semibold mt-3">
            Total XP earned: {stage.modules.length * 20} XP
          </p>

          <button
            onClick={() => router.push('/dashboard/journey')}
            className="btn-primary mt-5 px-6 py-3"
          >
            Back to Journey
          </button>
        </div>
      )}
    </div>
  );
}