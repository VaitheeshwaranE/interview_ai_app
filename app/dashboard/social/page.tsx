'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, Search, MessageSquare, Trophy, Swords,
  CheckCircle2, Clock, Zap, Flame, Star, Crown
} from 'lucide-react';

const FRIENDS = [
  { id: '1', name: 'Rahul Mehta', college: 'NIT Trichy', xp: 14200, streak: 35, online: true, avatar: 'RM', rank: 2 },
  { id: '2', name: 'Priya Singh', college: 'VIT Vellore', xp: 13850, streak: 28, online: true, avatar: 'PS', rank: 3 },
  { id: '3', name: 'Arjun Kumar', college: 'BITS Pilani', xp: 12300, streak: 21, online: false, avatar: 'AK', rank: 4 },
  { id: '4', name: 'Meera Patel', college: 'IIIT Hyderabad', xp: 9800, streak: 12, online: false, avatar: 'MP', rank: 7 },
];

const CHALLENGES = [
  { challenger: 'Rahul Mehta', type: 'Vocabulary Battle', status: 'pending', avatar: 'RM', timeAgo: '2m ago' },
  { challenger: 'Priya Singh', type: 'Mock Interview Race', status: 'accepted', avatar: 'PS', timeAgo: '1h ago' },
];

const STUDY_GROUPS = [
  { name: 'FAANG Aspirants 2025', members: 24, activity: 'Active now', category: 'Placement Prep' },
  { name: 'Communication Masters', members: 18, activity: '2h ago', category: 'English Skills' },
  { name: 'IIT Alumni Network', members: 45, activity: 'Active now', category: 'Alumni Connect' },
];

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'challenges' | 'groups'>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white">Social</h1>
        <p className="text-slate-400 text-sm mt-1">Connect, compete, and grow with fellow learners</p>
      </div>

      {/* Tabs */}
      <div className="glass-card p-1 flex gap-1">
        {(['friends', 'challenges', 'groups'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-brand-500/20 text-brand-300' : 'text-slate-400 hover:text-white'}`}>
            {tab === 'friends' ? `👥 Friends (${FRIENDS.length})` : tab === 'challenges' ? `⚔️ Challenges (${CHALLENGES.length})` : '🏫 Study Groups'}
          </button>
        ))}
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Find friends by name or college..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500/40 transition-all" />
          </div>

          <div className="space-y-3">
            {FRIENDS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((friend, i) => (
              <motion.div key={friend.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                    {friend.avatar}
                  </div>
                  <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#050816] ${friend.online ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">{friend.name}</div>
                  <div className="text-slate-500 text-xs">{friend.college}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-brand-400 text-xs font-bold flex items-center gap-0.5"><Zap className="w-3 h-3" />{friend.xp.toLocaleString()}</span>
                    <span className="text-orange-400 text-xs flex items-center gap-0.5"><Flame className="w-3 h-3" />{friend.streak}d</span>
                    <span className="text-slate-500 text-xs flex items-center gap-0.5"><Crown className="w-3 h-3" />#{friend.rank}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors border border-brand-500/20">
                    <Swords className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="btn-secondary w-full py-3 text-sm">
            <UserPlus className="w-4 h-4" /> Find More Friends
          </button>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {CHALLENGES.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{c.challenger}</div>
                    <div className="text-slate-400 text-xs">challenged you to: <span className="text-brand-300">{c.type}</span></div>
                    <div className="text-slate-500 text-xs">{c.timeAgo}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${c.status === 'pending' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
                    {c.status}
                  </span>
                </div>
                {c.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="btn-primary flex-1 py-2 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Accept</button>
                    <button className="btn-secondary flex-1 py-2 text-xs text-red-400 hover:bg-red-500/10">Decline</button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <button className="btn-primary w-full py-3 text-sm">
            <Swords className="w-4 h-4" /> Challenge a Friend
          </button>
        </div>
      )}

      {/* Study Groups Tab */}
      {activeTab === 'groups' && (
        <div className="space-y-3">
          {STUDY_GROUPS.map((group, i) => (
            <motion.div key={group.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card-hover p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">{group.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1"><Users className="w-3 h-3" /> {group.members} members</span>
                    <span className="text-slate-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {group.activity}</span>
                  </div>
                  <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs bg-brand-500/10 text-brand-400 border border-brand-500/20">{group.category}</span>
                </div>
                <button className="btn-primary py-1.5 px-4 text-xs">Join</button>
              </div>
            </motion.div>
          ))}

          <button className="btn-secondary w-full py-3 text-sm">
            <Users className="w-4 h-4" /> Create Study Group
          </button>
        </div>
      )}
    </div>
  );
}
