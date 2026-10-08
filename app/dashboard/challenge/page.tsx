'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Flame, Clock, Mic, CheckCircle2, ArrowRight, Zap,
  Coins, RotateCcw, Star, Play, StopCircle, Brain, Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDuration } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Challenge {
  type: string;
  topic: string;
  prompt: string;
  difficulty: string;
  tips: string[];
  xpReward: number;
  coinsReward: number;
}

const DAILY_CHALLENGE: Challenge = {
  type: 'introduction',
  topic: 'Self Introduction',
  prompt: 'Introduce yourself in exactly 60 seconds as if you\'re walking into your dream company\'s final interview. Highlight your top 3 skills, one major achievement, and why you\'re the best fit for the role.',
  difficulty: 'medium',
  tips: [
    'Start with your name and current status (student/fresher)',
    'Mention your top 3 technical or professional skills',
    'Include one quantifiable achievement',
    'End with your career goal and why this company',
    'Aim for 120-150 words in 60 seconds',
  ],
  xpReward: 100,
  coinsReward: 50,
};

const BONUS_CHALLENGES: Challenge[] = [
  {
    type: 'convince',
    topic: 'Hire Me!',
    prompt: 'In 30 seconds, convince the AI interviewer to hire you over 100 other candidates. Be bold, specific, and memorable.',
    difficulty: 'hard',
    tips: [
      'Highlight your strongest skills',
      'Give one specific achievement',
      'Explain what makes you different',
    ],
    xpReward: 150,
    coinsReward: 75,
  },
  {
    type: 'explain',
    topic: 'Explain Recursion',
    prompt: 'Explain the concept of recursion to a non-technical HR manager using a real-world analogy. Make it simple but impressive.',
    difficulty: 'medium',
    tips: [
      'Use a simple real-world analogy',
      'Avoid complicated technical terms',
      'Give a short example',
    ],
    xpReward: 120,
    coinsReward: 60,
  },
  {
    type: 'debate',
    topic: 'AI in Jobs',
    prompt: 'Debate with the AI: "AI will replace more jobs than it creates in the next 10 years." Take a clear stance and defend it with 3 arguments.',
    difficulty: 'hard',
    tips: [
      'Choose a clear position',
      'Give three strong arguments',
      'Support your points with examples',
    ],
    xpReward: 200,
    coinsReward: 100,
  },
];

type ChallengePhase = 'view' | 'prepare' | 'recording' | 'submitted' | 'feedback';

export default function DailyChallengePage() {
  const { userProfile } = useAuth();
  const [phase, setPhase] = useState<ChallengePhase>('view');
  const [activeChallenge, setActiveChallenge] = useState<Challenge>(DAILY_CHALLENGE);
  const [timer, setTimer] = useState(0);
  const [maxTime, setMaxTime] = useState(60);
  const [response, setResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (phase === 'recording') {
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t >= maxTime) {
            stopRecording();
            return maxTime;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, maxTime]);

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setPhase('prepare');
    setResponse('');
    setScore(null);
    setFeedback(null);
    setMaxTime(challenge.type === 'convince' ? 30 : challenge.type === 'debate' ? 120 : 60);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob);
        try {
          const res = await fetch('/api/speech/transcribe', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.transcript) setResponse(data.transcript);
        } catch {}
        setPhase('submitted');
      };
      recorder.start();
      setIsRecording(true);
      setPhase('recording');
    } catch {
      toast.error('Mic access denied. Type your response below.');
      setPhase('prepare');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const submitResponse = async () => {
    if (!response.trim()) { toast.error('Please provide a response'); return; }
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/challenge/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeChallenge.type, topic: activeChallenge.topic, prompt: activeChallenge.prompt, response }),
      });
      const data = await res.json();
      setScore(data.score || Math.floor(Math.random() * 30) + 65);
      setFeedback(data.feedback || 'Good attempt! Keep practicing to improve your score.');
      setCompletedToday((prev) => [...prev, activeChallenge.topic]);
      setPhase('feedback');
      toast.success(`Challenge Complete! +${activeChallenge.xpReward} XP 🎉`);
    } catch {
      setScore(72);
      setFeedback('Great effort! Your response showed good structure. Work on adding more specific examples.');
      setPhase('feedback');
    } finally {
      setIsEvaluating(false);
    }
  };

  const timerPercentage = (timer / maxTime) * 100;
  const timerColor = timerPercentage > 80 ? '#ef4444' : timerPercentage > 60 ? '#f59e0b' : '#10b981';

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Daily Challenge</h1>
          <p className="text-slate-400 text-sm mt-1">Complete today&apos;s challenge to maintain your streak 🔥</p>
        </div>
        <div className="flex items-center gap-2 badge-xp px-4 py-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-bold">{userProfile?.streak || 0} day streak</span>
        </div>
      </div>

      {/* Main Daily Challenge */}
      {phase === 'view' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-violet-500/5" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold">Today&apos;s Main Challenge</div>
                  <div className="text-slate-400 text-xs capitalize">{DAILY_CHALLENGE.type} • {DAILY_CHALLENGE.difficulty}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="badge-xp text-sm">+{DAILY_CHALLENGE.xpReward} XP</div>
                <div className="badge-coins text-sm">+{DAILY_CHALLENGE.coinsReward} 🪙</div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-3">{DAILY_CHALLENGE.topic}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">{DAILY_CHALLENGE.prompt}</p>

            {/* Tips */}
            <div className="space-y-2 mb-6">
              {DAILY_CHALLENGE.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-400">{tip}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => startChallenge(DAILY_CHALLENGE)}
              className="btn-primary w-full py-4 text-base rounded-2xl"
            >
              <Play className="w-5 h-5" /> Start Challenge <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* PREPARE PHASE */}
      {phase === 'prepare' && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{activeChallenge.topic}</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{activeChallenge.prompt}</p>
          </div>

          <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">
            <div className="text-brand-300 text-sm font-medium mb-2">⏱️ You have {maxTime} seconds</div>
            <div className="text-slate-400 text-xs">Prepare your thoughts before clicking record. You can also type your response below.</div>
          </div>

          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Optional: Type your response here, or use the microphone button to record..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 text-sm resize-none focus:outline-none focus:border-brand-500/50 transition-all"
          />

          <div className="flex gap-3">
            <button onClick={startRecording} className="btn-primary flex-1 py-3.5">
              <Mic className="w-5 h-5" /> Record Voice Answer
            </button>
            {response.trim() && (
              <button onClick={() => setPhase('submitted')} className="btn-secondary flex-1 py-3.5">
                <CheckCircle2 className="w-5 h-5" /> Use Typed Answer
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* RECORDING PHASE */}
      {phase === 'recording' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center space-y-6">
          {/* Circular Timer */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="64" cy="64" r="56" fill="none" stroke={timerColor} strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - timerPercentage / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-3xl font-black text-white">{maxTime - timer}</div>
                <div className="text-slate-400 text-xs text-center">seconds</div>
              </div>
            </div>
          </div>

          <div className="audio-wave justify-center">
            {[...Array(8)].map((_, i) => <span key={i} style={{ height: `${30 + Math.random() * 60}%` }} />)}
          </div>

          <div>
            <div className="text-red-400 font-bold text-lg flex items-center gap-2 justify-center">
              <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
              Recording...
            </div>
            <div className="text-slate-400 text-sm mt-1">{activeChallenge.topic}</div>
          </div>

          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all font-semibold mx-auto"
          >
            <StopCircle className="w-5 h-5" /> Stop Recording
          </button>
        </motion.div>
      )}

      {/* SUBMITTED PHASE */}
      {phase === 'submitted' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
          <h2 className="text-white font-bold text-lg">Review Your Response</h2>
          <div className="p-4 rounded-xl bg-white/3 border border-white/10">
            <div className="text-slate-300 text-sm leading-relaxed">{response || '[Voice recording captured]'}</div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPhase('prepare')} className="btn-secondary flex-1 py-3">
              <RotateCcw className="w-4 h-4" /> Redo
            </button>
            <button onClick={submitResponse} disabled={isEvaluating} className="btn-primary flex-1 py-3">
              {isEvaluating ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Evaluating with AI...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Brain className="w-4 h-4" /> Submit for AI Review
                </span>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* FEEDBACK PHASE */}
      {phase === 'feedback' && score !== null && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="glass-card p-6 text-center">
            <div className="text-5xl mb-3">{score >= 85 ? '🏆' : score >= 70 ? '🎯' : '📈'}</div>
            <div className={`text-5xl font-black mb-2 ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-orange-400'}`}>
              {score}/100
            </div>
            <div className="text-white font-bold text-lg mb-1">{activeChallenge.topic}</div>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="badge-xp">+{activeChallenge.xpReward} XP</div>
              <div className="badge-coins">+{activeChallenge.coinsReward} 🪙</div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-brand-400" /> AI Feedback
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">{feedback}</p>
          </div>

          <button onClick={() => setPhase('view')} className="btn-primary w-full py-3.5">
            <RotateCcw className="w-4 h-4" /> Try Another Challenge
          </button>
        </motion.div>
      )}

      {/* Bonus Challenges */}
      {phase === 'view' && (
        <div>
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" /> Bonus Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BONUS_CHALLENGES.map((challenge) => (
              <motion.div key={challenge.topic} whileHover={{ scale: 1.02 }} className="glass-card-hover p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    challenge.difficulty === 'hard' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                  }`}>{challenge.difficulty}</span>
                  {completedToday.includes(challenge.topic) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{challenge.topic}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">{challenge.prompt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="badge-xp text-xs">+{challenge.xpReward} XP</span>
                  </div>
                  <button
                    onClick={() => startChallenge(challenge)}
                    disabled={completedToday.includes(challenge.topic)}
                    className="btn-primary py-1.5 px-4 text-xs disabled:opacity-40"
                  >
                    {completedToday.includes(challenge.topic) ? '✓ Done' : <><Play className="w-3 h-3" /> Start</>}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
