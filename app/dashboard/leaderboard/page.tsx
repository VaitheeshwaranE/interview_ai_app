'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Medal, Star, Zap, Flame, Users, Search,
  Crown, TrendingUp, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Ananya Krishnan', college: 'IIT Bombay', xp: 15420, streak: 42, interviews: 87, avatar: 'AK', badge: '👑', delta: 0 },
  { rank: 2, name: 'Rahul Mehta', college: 'NIT Trichy', xp: 14200, streak: 35, interviews: 72, avatar: 'RM', badge: '🥈', delta: 2 },
  { rank: 3, name: 'Priya Singh', college: 'VIT Vellore', xp: 13850, streak: 28, interviews: 65, avatar: 'PS', badge: '🥉', delta: -1 },
  { rank: 4, name: 'Arjun Kumar', college: 'BITS Pilani', xp: 12300, streak: 21, interviews: 58, avatar: 'AK', badge: '', delta: 3 },
  { rank: 5, name: 'Sneha Reddy', college: 'IIT Hyderabad', xp: 11900, streak: 19, interviews: 54, avatar: 'SR', badge: '', delta: -2 },
  { rank: 6, name: 'Vikram Sharma', college: 'DTU Delhi', xp: 10500, streak: 15, interviews: 48, avatar: 'VS', badge: '', delta: 1 },
  { rank: 7, name: 'Meera Patel', college: 'IIIT Hyderabad', xp: 9800, streak: 12, interviews: 42, avatar: 'MP', badge: '', delta: 0 },
  { rank: 8, name: 'Karthik Rajan', college: 'Amrita University', xp: 8900, streak: 10, interviews: 38, avatar: 'KR', badge: '', delta: 4 },
  { rank: 9, name: 'Divya Nair', college: 'Manipal Institute', xp: 7600, streak: 8, interviews: 31, avatar: 'DN', badge: '', delta: -3 },
  { rank: 10, name: 'Rohan Gupta', college: 'Jadavpur University', xp: 6400, streak: 7, interviews: 27, avatar: 'RG', badge: '', delta: 2 },
];

const RANK_COLORS = ['from-yellow-400 to-orange-500', 'from-slate-300 to-slate-400', 'from-orange-400 to-amber-600'];

export default function LeaderboardPage() {
  const { userProfile } = useAuth();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  const [search, setSearch] = useState('');

  const filtered = LEADERBOARD_DATA.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.college.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Leaderboard</h1>
        <p className="text-slate-400 text-sm mt-1">Compete with learners across colleges</p>
      </div>

      {/* Period Filter */}
      <div className="glass-card p-1 flex gap-1">
        {(['weekly', 'monthly', 'all-time'] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${period === p ? 'bg-brand-500/20 text-brand-300' : 'text-slate-400 hover:text-white'}`}>
            {p === 'weekly' ? '📅 This Week' : p === 'monthly' ? '📆 This Month' : '🏆 All Time'}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {[LEADERBOARD_DATA[1], LEADERBOARD_DATA[0], LEADERBOARD_DATA[2]].map((user, i) => {
          const pos = i === 0 ? 2 : i === 1 ? 1 : 3;
          return (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-4 text-center ${pos === 1 ? 'ring-1 ring-yellow-500/30' : ''}`}
              style={{ marginTop: pos === 1 ? 0 : pos === 2 ? '20px' : '40px' }}
            >
              <div className="text-2xl mb-2">{user.badge || `#${pos}`}</div>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${RANK_COLORS[pos - 1] || 'from-brand-500 to-violet-600'} flex items-center justify-center text-white font-bold text-sm mx-auto mb-2`}>
                {user.avatar}
              </div>
              <div className="text-white font-bold text-sm truncate">{user.name.split(' ')[0]}</div>
              <div className="text-slate-500 text-xs truncate">{user.college.split(' ')[0]}</div>
              <div className="text-brand-400 text-xs font-bold mt-1">{user.xp.toLocaleString()} XP</div>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input type="text" placeholder="Search by name or college..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500/40 transition-all" />
      </div>

      {/* Full List */}
      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto] gap-0 divide-y divide-white/5">
          {filtered.map((user, i) => {
            const isCurrentUser = userProfile?.name === user.name;
            return (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`contents ${isCurrentUser ? 'text-brand-300' : ''}`}
              >
                <div className={`flex items-center justify-center w-14 py-4 ${isCurrentUser ? 'bg-brand-500/5' : ''}`}>
                  <span className={`font-black text-sm ${user.rank <= 3 ? 'text-yellow-400' : 'text-slate-500'}`}>
                    {user.rank <= 3 ? user.badge : `#${user.rank}`}
                  </span>
                </div>

                <div className={`flex items-center gap-3 py-4 pr-4 ${isCurrentUser ? 'bg-brand-500/5' : ''}`}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className={`font-semibold text-sm ${isCurrentUser ? 'text-brand-300' : 'text-white'}`}>
                      {user.name} {isCurrentUser && <span className="text-xs text-brand-400">(You)</span>}
                    </div>
                    <div className="text-slate-500 text-xs truncate">{user.college}</div>
                  </div>
                </div>

                <div className={`flex items-center gap-4 pr-4 py-4 ${isCurrentUser ? 'bg-brand-500/5' : ''}`}>
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                      <Flame className="w-3 h-3 text-orange-400" /> {user.streak}d
                    </div>
                    <div className="text-xs text-slate-500">{user.interviews} sessions</div>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <div className="text-brand-400 font-bold text-sm">{user.xp.toLocaleString()}</div>
                    <div className="text-slate-600 text-xs">XP</div>
                  </div>
                  <div className="w-4">
                    {user.delta > 0 ? <ArrowUp className="w-3 h-3 text-emerald-400" /> :
                     user.delta < 0 ? <ArrowDown className="w-3 h-3 text-red-400" /> :
                     <Minus className="w-3 h-3 text-slate-600" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Your Rank */}
      <div className="glass-card p-4 flex items-center gap-4 border border-brand-500/20 bg-brand-500/5">
        <Trophy className="w-8 h-8 text-yellow-400 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-white font-bold">Your Current Rank</div>
          <div className="text-slate-400 text-sm">
            Keep practicing daily to climb the leaderboard!
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-brand-400">#247</div>
          <div className="text-slate-500 text-xs">Global rank</div>
        </div>
      </div>
    </div>
  );
}
