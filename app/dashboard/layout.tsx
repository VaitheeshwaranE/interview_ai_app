'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, LayoutDashboard, Mic, BookOpen, Target, BarChart3, Map,
  Trophy, Users, MessageSquare, Upload, Flame, Coins, Star,
  Bell, Settings, LogOut, ChevronRight, Menu, X, Zap, Shield,
  TrendingUp, Bot
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getXPProgress } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { href: '/dashboard/journey', icon: Map, label: 'Journey', badge: null },
  { href: '/dashboard/interview', icon: Mic, label: 'Mock Interview', badge: 'HOT' },
  { href: '/dashboard/challenge', icon: Target, label: 'Daily Challenge', badge: '🔥' },
  { href: '/dashboard/vocabulary', icon: BookOpen, label: 'Vocabulary', badge: null },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics', badge: null },
  { href: '/dashboard/roadmaps', icon: TrendingUp, label: 'Career Roadmaps', badge: null },
  { href: '/dashboard/mentor', icon: Bot, label: 'AI Mentor', badge: 'AI' },
  { href: '/dashboard/stories', icon: Star, label: 'Story Builder', badge: null },
  { href: '/dashboard/resume', icon: Upload, label: 'Resume AI', badge: null },
  { href: '/dashboard/social', icon: Users, label: 'Social', badge: null },
  { href: '/dashboard/leaderboard', icon: Trophy, label: 'Leaderboard', badge: null },
];

function LoadingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto animate-pulse"
            style={{ background: 'linear-gradient(135deg, #5b6ef5, #8b5cf6)' }}>
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="text-slate-400 text-sm">Loading InterviewVerse...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userProfile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const xpProgress = userProfile ? getXPProgress(userProfile.xp) : { level: 1, currentXP: 0, nextLevelXP: 100, percentage: 0 };

  return (
    <LoadingGuard>
      <div className="min-h-screen bg-[#050816] flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 h-full z-40 border-r border-white/5"
          style={{ background: 'linear-gradient(180deg, rgba(10,17,40,0.95) 0%, rgba(5,8,22,0.98) 100%)' }}>
          {/* Logo */}
          <div className="p-5 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5b6ef5, #8b5cf6)' }}>
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">InterviewVerse</div>
                <div className="text-xs text-brand-400 font-medium">AI Platform</div>
              </div>
            </Link>
          </div>

          {/* User Profile */}
          {userProfile && (
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #5b6ef5, #8b5cf6)' }}>
                  {userProfile.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{userProfile.name}</div>
                  <div className="text-slate-400 text-xs">Level {xpProgress.level} • {userProfile.coins} 🪙</div>
                </div>
              </div>
              {/* XP Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>XP {xpProgress.currentXP}</span>
                  <span>{xpProgress.nextLevelXP}</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-bar-fill" style={{ width: `${xpProgress.percentage}%` }} />
                </div>
              </div>
              {/* Streak */}
              <div className="flex items-center gap-2 mt-2">
                <Flame className="w-3.5 h-3.5 text-orange-400 streak-fire" />
                <span className="text-orange-400 text-xs font-bold">{userProfile.streak} day streak</span>
                {userProfile.jobReadyScore > 0 && (
                  <>
                    <span className="text-slate-600">•</span>
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold">{userProfile.jobReadyScore}% ready</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map(({ href, icon: Icon, label, badge }) => {
              const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    active ? 'nav-active text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      badge === 'HOT' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      badge === 'AI' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' :
                      'text-base'
                    }`}>
                      {badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3 h-3 text-brand-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-white/5 space-y-0.5">
            <Link href="/dashboard/settings" className="btn-ghost w-full justify-start">
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <button onClick={signOut} className="btn-ghost w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed left-0 top-0 h-full w-64 z-50 lg:hidden border-r border-white/5"
                style={{ background: 'rgba(5,8,22,0.98)' }}
              >
                <div className="p-4 flex justify-between items-center border-b border-white/5">
                  <span className="text-white font-bold gradient-text">InterviewVerse AI</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="p-3 space-y-0.5">
                  {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                    return (
                      <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'nav-active text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-brand-400' : 'text-slate-500'}`} />
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5"
            style={{ background: 'rgba(5,8,22,0.9)', backdropFilter: 'blur(20px)' }}>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-3">
              {/* Coins */}
              <div className="badge-coins hidden sm:flex">
                <Coins className="w-3 h-3" /> {userProfile?.coins || 0}
              </div>
              {/* XP */}
              <div className="badge-xp hidden sm:flex">
                <Zap className="w-3 h-3" /> {userProfile?.xp || 0} XP
              </div>
              {/* Streak */}
              <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 streak-fire" />
                <span>{userProfile?.streak || 0}</span>
              </div>
              {/* Notifications */}
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-400 rounded-full" />
              </button>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5b6ef5, #8b5cf6)' }}>
                {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </LoadingGuard>
  );
}
