'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Flame, Clock, BookOpen, Mic, Award,
  Target, Users, Star, Brain, ChevronRight, Calendar
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { getScoreColor } from '@/lib/utils';

const WEEKLY = [
  { day: 'Mon', score: 65, xp: 120, words: 8, minutes: 25 },
  { day: 'Tue', score: 70, xp: 200, words: 12, minutes: 40 },
  { day: 'Wed', score: 68, xp: 150, words: 6, minutes: 20 },
  { day: 'Thu', score: 78, xp: 280, words: 15, minutes: 55 },
  { day: 'Fri', score: 82, xp: 350, words: 18, minutes: 70 },
  { day: 'Sat', score: 85, xp: 180, words: 10, minutes: 35 },
  { day: 'Sun', score: 88, xp: 420, words: 20, minutes: 90 },
];

const SKILL_BREAKDOWN = [
  { skill: 'Grammar', score: 72, prev: 65, color: '#5b6ef5' },
  { skill: 'Vocabulary', score: 65, prev: 55, color: '#8b5cf6' },
  { skill: 'Confidence', score: 58, prev: 50, color: '#06b6d4' },
  { skill: 'Fluency', score: 70, prev: 62, color: '#10b981' },
  { skill: 'Pronunciation', score: 63, prev: 58, color: '#f59e0b' },
  { skill: 'Speed', score: 75, prev: 70, color: '#ef4444' },
];

const RADAR_DATA = SKILL_BREAKDOWN.map((s) => ({ subject: s.skill, score: s.score, fullMark: 100 }));

const MONTHLY = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  score: 55 + Math.random() * 35,
  fluency: 50 + Math.random() * 40,
}));

const WEAK_TOPICS = [
  { topic: 'Grammar — Past Perfect', severity: 'high', sessions: 3 },
  { topic: 'Filler Words ("um", "uh")', severity: 'high', sessions: 5 },
  { topic: 'Speaking Pace', severity: 'medium', sessions: 4 },
  { topic: 'Technical Vocabulary', severity: 'medium', sessions: 2 },
  { topic: 'Answer Structure (STAR)', severity: 'low', sessions: 1 },
];

const SESSIONS_HISTORY = [
  { type: 'HR Interview', score: 82, date: '2h ago', duration: '18 min', avatar: '👩‍💼', trend: '+8' },
  { type: 'Technical', score: 74, date: 'Yesterday', duration: '25 min', avatar: '⚙️', trend: '+4' },
  { type: 'Behavioral', score: 89, date: '2 days ago', duration: '20 min', avatar: '🌟', trend: '+12' },
  { type: 'System Design', score: 67, date: '3 days ago', duration: '30 min', avatar: '🏗️', trend: '-2' },
  { type: 'HR Interview', score: 78, date: '4 days ago', duration: '15 min', avatar: '👩‍💼', trend: '+5' },
];

export default function AnalyticsPage() {
  const { userProfile } = useAuth();
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [activeMetric, setActiveMetric] = useState<'score' | 'xp' | 'words' | 'minutes'>('score');

  const metricKey = activeMetric;

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Communication Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Track your learning progress and identify improvement areas</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${period === p ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'}`}>
              {p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: 'Day Streak', value: userProfile?.streak || 12, color: 'from-orange-500 to-red-600', sub: 'Best: 21 days' },
          { icon: Clock, label: 'Practice Hours', value: '24h 30m', color: 'from-brand-500 to-violet-600', sub: 'This week' },
          { icon: BookOpen, label: 'Words Learned', value: 89, color: 'from-emerald-500 to-teal-600', sub: '+20 this week' },
          { icon: Mic, label: 'Sessions Done', value: 23, color: 'from-cyan-500 to-blue-600', sub: 'Avg 82% score' },
        ].map(({ icon: Icon, label, value, color, sub }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-slate-400 text-sm">{label}</div>
            <div className="text-slate-500 text-xs mt-1">{sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Skill Radar */}
        <div className="glass-card p-5">
          <h2 className="text-white font-bold mb-1">Skill Radar</h2>
          <p className="text-slate-400 text-xs mb-4">Your communication profile</p>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke="#5b6ef5" fill="#5b6ef5" fillOpacity={0.2}
                dot={{ r: 3, fill: '#8b5cf6' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold">Progress Trend</h2>
              <p className="text-slate-400 text-xs">Performance over time</p>
            </div>
            <div className="flex gap-1.5">
              {(['score', 'xp', 'words', 'minutes'] as const).map((m) => (
                <button key={m} onClick={() => setActiveMetric(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${activeMetric === m ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={WEEKLY}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b6ef5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5b6ef5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(10,17,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Area type="monotone" dataKey={metricKey} stroke="#5b6ef5" strokeWidth={2.5} fill="url(#areaGrad)"
                dot={{ r: 4, fill: '#5b6ef5', stroke: '#fff', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#8b5cf6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill Breakdown Bars */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-bold">Skill Breakdown</h2>
            <p className="text-slate-400 text-xs">Your scores vs last week</p>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-4">
          {SKILL_BREAKDOWN.map(({ skill, score, prev, color }) => {
            const improvement = score - prev;
            return (
              <div key={skill}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-300 font-medium">{skill}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${improvement > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {improvement > 0 ? '+' : ''}{improvement}
                    </span>
                    <span className={`font-bold text-sm ${getScoreColor(score)}`}>{score}/100</span>
                  </div>
                </div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  {/* Previous score */}
                  <div className="absolute h-full rounded-full opacity-30" style={{ width: `${prev}%`, backgroundColor: color }} />
                  {/* Current score */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="absolute h-full rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weak Topics */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold">Top Weak Areas</h2>
              <p className="text-slate-400 text-xs">AI-identified improvement zones</p>
            </div>
            <Brain className="w-5 h-5 text-brand-400" />
          </div>
          <div className="space-y-3">
            {WEAK_TOPICS.map(({ topic, severity, sessions }) => (
              <div key={topic} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  severity === 'high' ? 'bg-red-400' : severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-slate-300 text-sm font-medium truncate">{topic}</div>
                  <div className="text-slate-500 text-xs">Detected in {sessions} sessions</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  severity === 'high' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                  severity === 'medium' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                  'text-blue-400 border-blue-500/30 bg-blue-500/10'
                }`}>{severity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold">Interview History</h2>
              <p className="text-slate-400 text-xs">Last 5 sessions</p>
            </div>
            <Calendar className="w-5 h-5 text-brand-400" />
          </div>
          <div className="space-y-3">
            {SESSIONS_HISTORY.map((session, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                <div className="text-2xl">{session.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-300 text-sm font-medium">{session.type}</div>
                  <div className="text-slate-500 text-xs">{session.duration} · {session.date}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${getScoreColor(session.score)}`}>{session.score}%</div>
                  <div className={`text-xs ${session.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {session.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
