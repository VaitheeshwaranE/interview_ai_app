'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Play,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { JOURNEY_STAGES, getXPProgress } from '@/lib/utils';

const STAGE_CONTENT: Record<
  string,
  {
    description: string;
    modules: string[];
    skills: string[];
    duration: string;
  }
> = {
  foundation: {
    description:
      'Build your communication foundation. Learn basic sentence structure, clear pronunciation, and simple professional phrases.',
    modules: [
      'Basic Sentence Construction',
      'Pronunciation Fundamentals',
      'Common Professional Phrases',
      'Body Language Basics',
      'Active Listening',
    ],
    skills: ['Clarity', 'Pronunciation', 'Basic Grammar'],
    duration: '1-2 weeks',
  },

  'daily-english': {
    description:
      'Master everyday professional English for emails, meetings, and casual office conversations.',
    modules: [
      'Email Writing',
      'Meeting Vocabulary',
      'Small Talk Mastery',
      'Phone Etiquette',
      'Written Communication',
    ],
    skills: [
      'Email Communication',
      'Meeting Participation',
      'Written Fluency',
    ],
    duration: '2-3 weeks',
  },

  'professional-english': {
    description:
      'Advance to corporate-level communication with industry vocabulary and structured expression.',
    modules: [
      'Corporate Vocabulary',
      'Report Writing',
      'Presentation Language',
      'Persuasion Techniques',
      'Data Communication',
    ],
    skills: [
      'Corporate Vocabulary',
      'Presentation',
      'Persuasion',
    ],
    duration: '3-4 weeks',
  },

  'interview-communication': {
    description:
      'Master interview-specific communication. Learn STAR method, behavioral responses, and answer structuring.',
    modules: [
      'STAR Method',
      'Behavioral Questions',
      'Situational Answers',
      'Answer Structuring',
      'Confidence Building',
    ],
    skills: [
      'STAR Method',
      'Structured Responses',
      'Interview Confidence',
    ],
    duration: '3-4 weeks',
  },

  'group-discussion': {
    description:
      'Excel at GDs with strong arguments, active leadership, and effective team communication.',
    modules: [
      'GD Strategies',
      'Leadership Language',
      'Debate Techniques',
      'Counter-Arguments',
      'Summarization',
    ],
    skills: [
      'Leadership Communication',
      'Debate',
      'Team Dynamics',
    ],
    duration: '2-3 weeks',
  },

  'presentation-skills': {
    description:
      'Command any room with professional presentations, storytelling, and public speaking mastery.',
    modules: [
      'Slide Narration',
      'Executive Presence',
      'Storytelling',
      'Q&A Handling',
      'Voice Modulation',
    ],
    skills: [
      'Public Speaking',
      'Storytelling',
      'Executive Presence',
    ],
    duration: '3-4 weeks',
  },

  'dream-company': {
    description:
      'Company-specific interview preparation for FAANG, startups, and your target organization.',
    modules: [
      'Company Research',
      'Culture Fit Questions',
      'Technical Rounds',
      'System Design Communication',
      'Offer Negotiation',
    ],
    skills: [
      'Company-Specific Prep',
      'Technical Communication',
      'Negotiation',
    ],
    duration: '4-6 weeks',
  },
};

/*
 * Continue button routes
 *
 * When the user clicks "Continue This Stage",
 * the current stage is mapped to its first module.
 */
const CONTINUE_ROUTES: Record<string, string> = {
  foundation:
    '/dashboard/journey/foundation/basic-sentence-construction',
};

export default function JourneyPage() {
  const router = useRouter();

  const { userProfile, user } = useAuth();

  const [selectedStage, setSelectedStage] =
    useState<string | null>(null);

  const [journeyData, setJourneyData] =
    useState<any>(null);

  const [journeyLoading, setJourneyLoading] =
    useState(true);

  useEffect(() => {
    const loadJourney = async () => {
      try {
        if (!user) {
          setJourneyLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const res = await fetch('/api/journey', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to load journey data');
        }

        const data = await res.json();

        setJourneyData(data);
      } catch (error) {
        console.error('Journey loading error:', error);
      } finally {
        setJourneyLoading(false);
      }
    };

    loadJourney();
  }, [user]);

  // Dynamic XP from API
  const totalXP =
    journeyData?.xp ?? userProfile?.xp ?? 0;

  // Dynamic level calculation
  const xpProgress = getXPProgress(totalXP);

  // Find the user's current stage based on XP
  const foundStageIdx = JOURNEY_STAGES.findLastIndex(
    (stage) => totalXP >= stage.xpRequired
  );

  const currentStageIdx = Math.max(
    0,
    foundStageIdx
  );

  // Loading screen
  if (journeyLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">
          Loading your journey...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">
            AI Communication Journey
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Your path from beginner to interview champion
          </p>
        </div>

        <div className="text-right">
          <div className="badge-xp text-sm px-4 py-2">
            <Zap className="w-4 h-4" />
            {totalXP} XP
          </div>

          <div className="text-slate-500 text-xs mt-1">
            Level {xpProgress.level}
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white font-semibold">
            Overall Journey Progress
          </div>

          <div className="text-brand-400 font-bold text-sm">
            {Math.round(
              ((currentStageIdx + 1) /
                JOURNEY_STAGES.length) *
                100
            )}
            %
          </div>
        </div>

        <div className="xp-bar h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${
                ((currentStageIdx + 1) /
                  JOURNEY_STAGES.length) *
                100
              }%`,
            }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
            className="xp-bar-fill"
          />
        </div>

        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Foundation</span>
          <span>Dream Company Interview</span>
        </div>
      </div>

      {/* Journey Stages */}
      <div className="relative">

        {/* Connecting line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-brand-500/60 via-violet-500/30 to-white/5" />

        <div className="space-y-3">

          {JOURNEY_STAGES.map((stage, idx) => {

            const isCompleted =
              idx < currentStageIdx;

            const isCurrent =
              idx === currentStageIdx;

            const isLocked =
              idx > currentStageIdx;

            const content =
              STAGE_CONTENT[stage.id];

            const isExpanded =
              selectedStage === stage.id;

            return (
              <motion.div
                key={stage.id}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: idx * 0.05,
                }}
              >

                <div
                  className={`ml-3 cursor-pointer transition-all duration-300 rounded-2xl border ${
                    isCurrent
                      ? 'glass-card border-brand-500/30 bg-brand-500/5'
                      : isCompleted
                      ? 'glass-card border-emerald-500/20 bg-emerald-500/3'
                      : isLocked
                      ? 'glass-card border-white/5 opacity-60'
                      : 'glass-card'
                  }`}
                  onClick={() =>
                    !isLocked &&
                    setSelectedStage(
                      isExpanded
                        ? null
                        : stage.id
                    )
                  }
                >

                  <div className="p-4 flex items-center gap-4">

                    {/* Stage Icon */}
                    <div className="relative flex-shrink-0 ml-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black"
                        style={{
                          background: isCompleted
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : isCurrent
                            ? `linear-gradient(135deg, ${stage.color}, ${stage.color}99)`
                            : 'rgba(255,255,255,0.05)',

                          boxShadow: isCurrent
                            ? `0 0 20px ${stage.color}40`
                            : undefined,
                        }}
                      >
                        {isCompleted
                          ? '✓'
                          : isLocked
                          ? '🔒'
                          : stage.icon}
                      </div>
                    </div>

                    {/* Stage Info */}
                    <div className="flex-1 min-w-0">

                      <div className="flex items-center gap-2 flex-wrap">

                        <h3
                          className={`font-bold ${
                            isCurrent
                              ? 'text-white'
                              : isCompleted
                              ? 'text-emerald-300'
                              : 'text-slate-400'
                          }`}
                        >
                          {stage.title}
                        </h3>

                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-brand-500/20 text-brand-300 border border-brand-500/30 font-medium">
                            Current
                          </span>
                        )}

                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                            Completed ✓
                          </span>
                        )}

                      </div>

                      <div className="text-slate-400 text-xs mt-0.5">
                        {content?.duration ?? 'N/A'} ·{' '}
                        {content?.modules.length ?? 0} modules
                      </div>

                    </div>

                    {/* XP Requirement */}
                    <div className="text-right flex-shrink-0">

                      {isLocked ? (
                        <div className="text-xs text-slate-500">

                          <div className="font-bold">
                            {stage.xpRequired}
                          </div>

                          <div>
                            XP needed
                          </div>

                        </div>
                      ) : (
                        <ArrowRight
                          className={`w-4 h-4 ${
                            isCurrent
                              ? 'text-brand-400'
                              : 'text-slate-600'
                          } transition-transform ${
                            isExpanded
                              ? 'rotate-90'
                              : ''
                          }`}
                        />
                      )}

                    </div>

                  </div>

                  {/* Expanded Content */}
                  {isExpanded && content && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="px-6 pb-5 border-t border-white/5 mt-2 pt-4"
                    >

                      <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        {content.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                        {/* Modules */}
                        <div>

                          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                            Modules
                          </div>

                          <div className="space-y-1.5">

                            {content.modules.map((m) => (
                              <div
                                key={m}
                                className="flex items-center gap-2 text-sm text-slate-300"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                                {m}
                              </div>
                            ))}

                          </div>

                        </div>

                        {/* Skills */}
                        <div>

                          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                            Skills You&apos;ll Gain
                          </div>

                          <div className="flex flex-wrap gap-2">

                            {content.skills.map((s) => (
                              <span
                                key={s}
                                className="px-3 py-1 rounded-full text-xs bg-brand-500/10 text-brand-300 border border-brand-500/20 font-medium"
                              >
                                {s}
                              </span>
                            ))}

                          </div>

                          <div className="mt-4 p-3 rounded-xl bg-white/3 border border-white/5 text-xs text-slate-400">

                            ⏱️ Estimated time:{' '}

                            <span className="text-white font-medium">
                              {content.duration}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* Continue Button */}
                      {isCurrent && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();

                            const route =
                              CONTINUE_ROUTES[stage.id];

                            if (route) {
                              router.push(route);
                            }
                          }}
                          className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Continue This Stage
                        </button>
                      )}

                    </motion.div>
                  )}

                </div>

              </motion.div>
            );
          })}

        </div>
      </div>

    </div>
  );
}