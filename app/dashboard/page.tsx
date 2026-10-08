'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame, Zap, Trophy, Mic, BookOpen, Target, BarChart3, Star,
  TrendingUp, ArrowRight, Brain, Play, Clock, CheckCircle2,
  Award, Coins, Users, ChevronRight, Bot, Map
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getXPProgress, getScoreColor, JOURNEY_STAGES, AVATAR_INTERVIEWERS } from '@/lib/utils';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const RECENT_INTERVIEWS = [
  { type: 'HR Interview', score: 82, avatar: '👩‍💼', date: '2h ago', duration: '18 min' },
  { type: 'Technical', score: 74, avatar: '⚙️', date: 'Yesterday', duration: '25 min' },
  { type: 'Behavioral', score: 89, avatar: '🌟', date: '2 days ago', duration: '20 min' },
];

const WEEKLY_DATA = [
  { day: 'Mon', score: 65, xp: 120 },
  { day: 'Tue', score: 70, xp: 200 },
  { day: 'Wed', score: 68, xp: 150 },
  { day: 'Thu', score: 78, xp: 280 },
  { day: 'Fri', score: 82, xp: 350 },
  { day: 'Sat', score: 85, xp: 180 },
  { day: 'Sun', score: 88, xp: 420 },
];

const ACHIEVEMENTS_PREVIEW = [
  { icon: '🎯', name: 'First Interview', earned: true },
  { icon: '🔥', name: 'Week Warrior', earned: true },
  { icon: '📚', name: 'Word Wizard', earned: false },
  { icon: '💯', name: 'Perfectionist', earned: false },
  { icon: '🏆', name: 'Interview Pro', earned: false },
  { icon: '✨', name: 'Job Ready', earned: false },
];

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <TrendingUp className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-2xl font-black text-white mb-0.5">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const [greeting, setGreeting] = useState('Good morning');
  const xpProgress = userProfile ? getXPProgress(userProfile.xp) : { level: 1, currentXP: 0, nextLevelXP: 100, percentage: 0 };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
    else if (hour >= 17) setGreeting('Good evening');
  }, []);

  const radarData = [
    { subject: 'Grammar', score: userProfile?.profile?.grammarScore ?? 72, fullMark: 100 },
    { subject: 'Vocabulary', score: userProfile?.profile?.vocabularyScore ?? 65, fullMark: 100 },
    { subject: 'Confidence', score: userProfile?.profile?.confidenceScore ?? 58, fullMark: 100 },
    { subject: 'Fluency', score: userProfile?.profile?.fluencyScore ?? 70, fullMark: 100 },
    { subject: 'Pronunciation', score: 63, fullMark: 100 },
    { subject: 'Speed', score: 75, fullMark: 100 },
  ];

  const currentStageIdx = JOURNEY_STAGES.findIndex(s => s.id === (userProfile?.profile?.currentJourneyStage ?? 'foundation'));
  const currentStage = JOURNEY_STAGES[currentStageIdx] || JOURNEY_STAGES[0];
  const nextStage = JOURNEY_STAGES[currentStageIdx + 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            {greeting}, <span className="gradient-text">{userProfile?.name?.split(' ')[0] || 'Learner'}</span>! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {userProfile?.streak ? `${userProfile.streak} day streak 🔥 Keep it going!` : 'Start your learning journey today!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/interview" className="btn-primary text-sm">
            <Mic className="w-4 h-4" /> Start Interview
          </Link>
          <Link href="/dashboard/challenge" className="btn-secondary text-sm">
            <Target className="w-4 h-4" /> Daily Challenge
          </Link>
        </div>
      </motion.div>

      {/* Job Readiness Banner */}
      {userProfile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-violet-500/10" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="url(#scoreGrad)" strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - (userProfile.jobReadyScore || 65) / 100)}`}
                    strokeLinecap="round" />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5b6ef5" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-black text-sm">{userProfile.jobReadyScore || 65}%</span>
                </div>
              </div>
              <div>
                <div className="text-white font-bold text-lg">Job Readiness Score</div>
                <div className="text-slate-400 text-sm">
                  {userProfile.jobReadyScore >= 80 ? '🎉 Excellent! You are interview-ready!' :
                   userProfile.jobReadyScore >= 60 ? '📈 Good progress! Keep practicing.' :
                   '🚀 Build your skills to unlock opportunities.'}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500">Level {xpProgress.level}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-brand-400">{xpProgress.currentXP}/{xpProgress.nextLevelXP} XP to next level</span>
                </div>
              </div>
            </div>
            <Link href="/dashboard/analytics" className="btn-secondary text-sm flex-shrink-0">
              View Full Report <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Day Streak" value={`${userProfile?.streak || 0}🔥`}
          sub="Keep it going!" color="from-orange-500 to-red-600" delay={0.1} />
        <StatCard icon={Zap} label="Total XP" value={userProfile?.xp || 0}
          sub={`Level ${xpProgress.level}`} color="from-brand-500 to-violet-600" delay={0.15} />
        <StatCard icon={Mic} label="Interviews" value={userProfile?.profile?.totalInterviews || 0}
          sub="Sessions done" color="from-cyan-500 to-blue-600" delay={0.2} />
        <StatCard icon={BookOpen} label="Words Learned" value={userProfile?.profile?.wordsLearned || 0}
          sub="Vocabulary" color="from-emerald-500 to-teal-600" delay={0.25} />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Performance Radar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold">Performance Radar</h2>
              <p className="text-slate-400 text-xs mt-0.5">Your communication skills breakdown</p>
            </div>
            <BarChart3 className="w-5 h-5 text-brand-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(148,163,184,0.8)', fontSize: 11 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#5b6ef5"
                fill="#5b6ef5"
                fillOpacity={0.25}
                dot={{ r: 3, fill: '#8b5cf6' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold">Weekly Progress</h2>
              <p className="text-slate-400 text-xs mt-0.5">Score improvement this week</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[40, 100]} />
              <Tooltip
                contentStyle={{ background: 'rgba(10,17,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                cursor={{ stroke: 'rgba(91,110,245,0.3)' }}
              />
              <Line type="monotone" dataKey="score" stroke="#5b6ef5" strokeWidth={2.5}
                dot={{ r: 4, fill: '#5b6ef5', stroke: '#fff', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Interviews */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Recent Interviews</h2>
            <Link href="/dashboard/interview" className="text-brand-400 hover:text-brand-300 text-xs font-medium flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_INTERVIEWS.map((i, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                <div className="text-2xl">{i.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{i.type}</div>
                  <div className="text-slate-500 text-xs">{i.duration} • {i.date}</div>
                </div>
                <div className={`text-sm font-bold ${getScoreColor(i.score)}`}>{i.score}%</div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/interview" className="btn-primary w-full mt-4 py-2.5 text-sm">
            <Mic className="w-4 h-4" /> New Interview
          </Link>
        </motion.div>

        {/* Journey Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Your Journey</h2>
            <Link href="/dashboard/journey" className="text-brand-400 hover:text-brand-300 text-xs font-medium flex items-center gap-1">
              Full Map <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {JOURNEY_STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              const isLocked = idx > currentStageIdx;
              return (
                <div key={stage.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${isCurrent ? 'bg-brand-500/10 border border-brand-500/20' : 'bg-white/3'}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                    isCurrent ? 'bg-brand-500/30 text-brand-300' :
                    'bg-white/5 text-slate-600'
                  }`}>
                    {isCompleted ? '✓' : isLocked ? '🔒' : stage.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-white' : 'text-slate-600'}`}>
                      {stage.title}
                    </div>
                    {isCurrent && <div className="text-xs text-slate-400 mt-0.5">In Progress</div>}
                  </div>
                  {isLocked && <span className="text-xs text-slate-600">{stage.xpRequired} XP</span>}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Achievements + Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          {/* Achievements */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Achievements</h2>
              <Trophy className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ACHIEVEMENTS_PREVIEW.map(({ icon, name, earned }) => (
                <div key={name}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-colors ${
                    earned ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/3 opacity-40'
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-xs text-slate-400 leading-tight">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-5">
            <h2 className="text-white font-bold mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: '/dashboard/mentor', icon: Bot, label: 'Ask AI Mentor', color: 'text-brand-400' },
                { href: '/dashboard/vocabulary', icon: BookOpen, label: 'Learn Words', color: 'text-emerald-400' },
                { href: '/dashboard/stories', icon: Star, label: 'Story Builder', color: 'text-yellow-400' },
                { href: '/dashboard/resume', icon: Award, label: 'Analyze Resume', color: 'text-cyan-400' },
              ].map(({ href, icon: Icon, label, color }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 hover:bg-white/6 text-slate-300 hover:text-white transition-all group"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm font-medium flex-1">{label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
