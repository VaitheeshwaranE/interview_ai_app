'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, ArrowRight, Trophy, RotateCcw, CheckCircle2 } from 'lucide-react';

const STORIES = [
  {
    id: 'first-day-google',
    title: 'First Day at Google',
    description: 'Navigate your first day, impress your manager, and make lasting connections',
    cover: '🏢',
    difficulty: 'medium',
    scenes: [
      {
        narration: 'You walk into the Google campus for your first day. Your manager, Sarah, greets you with a warm smile.',
        avatarLine: 'Welcome! We\'re so excited to have you. Quick question — how do you prefer to learn? Diving straight in, or would you like a structured onboarding?',
        choices: [
          { text: '"I love diving in — give me a task right away!"', nextScene: 1, consequence: '+confidence, risk: overwhelming' },
          { text: '"I\'d appreciate a structured plan to get started."', nextScene: 2, consequence: '+preparation' },
          { text: '"I\'m flexible — whatever works best for the team!"', nextScene: 3, consequence: '+teamwork, neutral' },
        ],
      },
      {
        narration: 'Sarah is impressed by your confidence. She assigns you to a live project immediately.',
        avatarLine: 'Bold choice! Here\'s a critical bug affecting 10,000 users. The team is counting on you. How do you approach it?',
        choices: [
          { text: '"I\'ll analyze the logs and trace the root cause first."', nextScene: 4, consequence: '+technical' },
          { text: '"Let me pair with a senior engineer for guidance."', nextScene: 5, consequence: '+collaboration' },
          { text: '"I\'ll deploy a quick fix and monitor."', nextScene: 6, consequence: 'risky' },
        ],
      },
      {
        narration: 'Your structured approach pays off. You complete onboarding and understand the codebase thoroughly.',
        avatarLine: 'Fantastic! You\'ve impressed the whole team with your preparation. Ready for your first PR review?',
        choices: [
          { text: '"Absolutely! I\'ve reviewed best practices."', nextScene: 4, consequence: '+readiness' },
          { text: '"Yes, I have some questions about the style guide first."', nextScene: 5, consequence: '+thoroughness' },
        ],
      },
      {
        narration: 'You show natural team leadership. Your manager notes your collaborative spirit.',
        avatarLine: 'That flexibility is rare. We\'d love to have you lead the new-hire buddy program. Interested?',
        choices: [
          { text: '"I\'d be honored to mentor new hires!"', nextScene: 4, consequence: '+leadership' },
          { text: '"Let me settle in first, then absolutely!"', nextScene: 5, consequence: '+maturity' },
        ],
      },
      {
        narration: 'Your systematic approach resolves the bug within hours. The CEO sends a Slack message commending you.',
        avatarLine: 'Outstanding work! You\'ve already made an impact. This calls for a celebration — any feedback for the team?',
        choices: [
          { text: '"Credit belongs to the team — I just connected the dots."', nextScene: -1, consequence: 'SUCCESS +humility' },
          { text: '"I noticed three more potential issues — shall I document them?"', nextScene: -1, consequence: 'SUCCESS +initiative' },
        ],
        isEnding: true,
        endingType: 'success',
      },
    ],
  },
  {
    id: 'negotiating-salary',
    title: 'Negotiating Your Salary',
    description: 'Practice the art of salary negotiation with confidence and professionalism',
    cover: '💰',
    difficulty: 'hard',
    scenes: [
      {
        narration: 'You\'ve received a job offer from your dream company. The recruiter calls to discuss compensation.',
        avatarLine: 'Great news! We\'d like to offer you ₹12 LPA. What do you think?',
        choices: [
          { text: '"That\'s wonderful! I accept!"', nextScene: 1, consequence: 'accepted without negotiating' },
          { text: '"Thank you! I was expecting ₹15-17 LPA based on my research."', nextScene: 2, consequence: '+negotiation' },
          { text: '"I appreciate the offer. Can I have some time to consider?"', nextScene: 3, consequence: '+professional' },
        ],
      },
    ],
  },
];

type GamePhase = 'browse' | 'playing' | 'complete';

export default function StoriesPage() {
  const [phase, setPhase] = useState<GamePhase>('browse');
  const [activeStory, setActiveStory] = useState<typeof STORIES[0] | null>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [lastConsequence, setLastConsequence] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<'success' | 'failure' | null>(null);

  const startStory = (story: typeof STORIES[0]) => {
    setActiveStory(story);
    setCurrentScene(0);
    setChoices([]);
    setLastConsequence(null);
    setOutcome(null);
    setPhase('playing');
  };

  const makeChoice = (choice: { text: string; nextScene: number; consequence: string }) => {
    setLastConsequence(choice.consequence);
    setChoices((prev) => [...prev, choice.text]);

    if (choice.nextScene === -1 || !activeStory) {
      setOutcome('success');
      setPhase('complete');
    } else if (choice.nextScene >= activeStory.scenes.length) {
      setOutcome('success');
      setPhase('complete');
    } else {
      setCurrentScene(choice.nextScene);
    }
  };

  if (phase === 'browse') {
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-black text-white">AI Story Builder</h1>
          <p className="text-slate-400 text-sm mt-1">Interactive roleplay scenarios — your choices shape the story and outcome</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-5 cursor-pointer"
              onClick={() => startStory(story)}
            >
              <div className="text-5xl mb-4">{story.cover}</div>
              <h3 className="text-white font-bold text-base mb-1">{story.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{story.description}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                  story.difficulty === 'hard' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                }`}>{story.difficulty}</span>
                <button className="btn-primary py-1.5 px-4 text-xs">
                  <Play className="w-3 h-3" /> Play
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'playing' && activeStory) {
    const scene = activeStory.scenes[currentScene];

    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => setPhase('browse')} className="btn-ghost text-slate-400 text-sm">← Exit Story</button>
          <div className="text-slate-400 text-xs">Scene {currentScene + 1} / {activeStory.scenes.length}</div>
        </div>

        <div className="glass-card p-1 h-2 overflow-hidden">
          <motion.div
            animate={{ width: `${(currentScene / activeStory.scenes.length) * 100}%` }}
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
          />
        </div>

        <motion.div
          key={currentScene}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-5"
        >
          {/* Narration */}
          <div className="text-slate-300 text-sm leading-relaxed border-l-2 border-brand-500/40 pl-4 italic">
            {scene.narration}
          </div>

          {/* Avatar speech bubble */}
          {scene.avatarLine && (
            <div className="flex gap-3">
              <div className="text-3xl flex-shrink-0">{activeStory.cover}</div>
              <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex-1">
                <div className="text-white text-sm leading-relaxed">{scene.avatarLine}</div>
              </div>
            </div>
          )}

          {lastConsequence && (
            <div className="text-xs text-emerald-400 text-right italic">{lastConsequence}</div>
          )}
        </motion.div>

        {/* Choices */}
        <div className="space-y-3">
          <div className="text-slate-400 text-xs text-center">Choose your response:</div>
          {scene.choices.map((choice, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => makeChoice(choice)}
              className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-brand-500/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-500/30">
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-slate-200 text-sm leading-relaxed group-hover:text-white">{choice.text}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center py-12 space-y-6">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="text-7xl mb-4">{outcome === 'success' ? '🏆' : '📈'}</div>
        <h1 className="text-3xl font-black text-white mb-2">
          {outcome === 'success' ? 'Excellent Outcome!' : 'Good Attempt!'}
        </h1>
        <p className="text-slate-400">
          {outcome === 'success'
            ? 'Your communication choices led to a great outcome!'
            : 'Every choice teaches you something. Try again!'}
        </p>
      </motion.div>

      <div className="glass-card p-5">
        <div className="text-white font-bold mb-3">Your Story Path</div>
        <div className="space-y-2">
          {choices.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              {c}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-brand-400 text-sm font-medium">
          <Trophy className="w-4 h-4" /> +75 XP · +30 Coins earned
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => activeStory && startStory(activeStory)} className="btn-secondary flex-1 py-3">
          <RotateCcw className="w-4 h-4" /> Replay Story
        </button>
        <button onClick={() => setPhase('browse')} className="btn-primary flex-1 py-3">
          More Stories <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
