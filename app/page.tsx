'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Brain, Zap, Trophy, Mic, Target, BookOpen, BarChart3, Users,
  Star, ArrowRight, CheckCircle2, Sparkles, Play, Globe, Shield,
  ChevronRight, Flame, Award, TrendingUp
} from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'AI Avatar Interviewer', desc: 'Practice with 5 unique AI personas — HR Manager, Google Recruiter, Startup Founder, Tech Lead, and Mentor. Each has a distinct style and voice.', color: 'from-violet-500 to-purple-600', delay: 0 },
  { icon: Mic, title: 'Real-Time Speech Correction', desc: 'Speak and instantly see grammar errors, filler words, speaking speed and confidence flagged in real time — powered by IBM watsonx.', color: 'from-cyan-500 to-blue-600', delay: 0.1 },
  { icon: Target, title: 'AI Communication Journey', desc: '7-stage learning roadmap from Foundation to Dream Company Interview. Unlock each stage with XP and track your growth visually.', color: 'from-brand-500 to-indigo-600', delay: 0.2 },
  { icon: BarChart3, title: 'Interview Heat Map', desc: 'Radar charts, heat maps, and timelines show your Grammar, Fluency, Confidence, Pronunciation, and Speaking Speed after every session.', color: 'from-emerald-500 to-teal-600', delay: 0.3 },
  { icon: BookOpen, title: 'Vocabulary Builder', desc: 'Professional English words with meanings, pronunciation, interview examples, spaced repetition, flashcards, and mini-quizzes.', color: 'from-orange-500 to-red-600', delay: 0.4 },
  { icon: Trophy, title: 'Gamification Engine', desc: 'XP, Levels, Coins, Daily Streaks, Badges, Treasure Boxes, Spin Wheel, and Weekly Missions — learning feels like an adventure.', color: 'from-yellow-500 to-orange-600', delay: 0.5 },
  { icon: Users, title: 'Social & Leaderboard', desc: 'Challenge friends, join college leaderboards, weekly tournaments, communication battles, and study groups.', color: 'from-pink-500 to-rose-600', delay: 0.6 },
  { icon: Zap, title: 'Resume AI Analyzer', desc: 'Upload your PDF resume. AI extracts skills, projects, experience and auto-generates behavioral, technical, and project-based questions.', color: 'from-lime-500 to-green-600', delay: 0.7 },
];

const STATS = [
  { value: '50K+', label: 'Students Trained', icon: Users },
  { value: '1M+', label: 'Interview Sessions', icon: Mic },
  { value: '94%', label: 'Placement Rate', icon: TrendingUp },
  { value: '4.9★', label: 'User Rating', icon: Star },
];

const JOURNEY_STAGES = [
  { stage: '01', title: 'Foundation', desc: 'Basic communication & confidence', color: '#6366f1' },
  { stage: '02', title: 'Daily English', desc: 'Everyday professional vocabulary', color: '#8b5cf6' },
  { stage: '03', title: 'Professional English', desc: 'Corporate communication skills', color: '#06b6d4' },
  { stage: '04', title: 'Interview Communication', desc: 'Structured interview responses', color: '#10b981' },
  { stage: '05', title: 'Group Discussion', desc: 'Leadership & debate skills', color: '#f59e0b' },
  { stage: '06', title: 'Presentation Skills', desc: 'Public speaking mastery', color: '#ef4444' },
  { stage: '07', title: 'Dream Company', desc: 'Company-specific interview prep', color: '#ec4899' },
];

const TESTIMONIALS = [
  { name: 'Ananya Krishnan', college: 'IIT Bombay', company: 'Google', text: 'InterviewVerse turned my 40% communication score to 92% in 6 weeks. Landed Google SWE!', avatar: 'AK', color: 'from-blue-500 to-indigo-600' },
  { name: 'Rahul Mehta', college: 'NIT Trichy', company: 'Microsoft', text: 'The AI avatar interviews are so realistic. I was confident on my actual interview day.', avatar: 'RM', color: 'from-violet-500 to-purple-600' },
  { name: 'Priya Singh', college: 'VIT Vellore', company: 'Amazon', text: 'The vocabulary builder and speech correction changed how I speak. Got Amazon SDE offer!', avatar: 'PS', color: 'from-emerald-500 to-teal-600' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] -top-48 -left-48 bg-brand-500/8" style={{ animationDelay: '0s' }} />
        <div className="orb w-[400px] h-[400px] top-1/3 -right-32 bg-violet-500/8" style={{ animationDelay: '2s' }} />
        <div className="orb w-[300px] h-[300px] bottom-1/4 left-1/4 bg-cyan-500/6" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(1px 1px at 20% 30%, rgba(91,110,245,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 10%, rgba(139,92,246,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 60%, rgba(6,182,212,0.2) 0%, transparent 100%)`,
        }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5b6ef5, #8b5cf6)' }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">InterviewVerse AI</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-center gap-8"
        >
          {['Features', 'Journey', 'Pricing', 'Blog'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
              {item}
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          {user ? (
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost text-slate-300">Sign In</Link>
              <Link href="/auth/register" className="btn-primary">
                Start Free <Sparkles className="w-4 h-4" />
              </Link>
            </>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-brand-300 bg-brand-500/10 border border-brand-500/20">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Powered by IBM watsonx.ai • Used by 50,000+ students
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black leading-tight mb-6"
        >
          <span className="gradient-text">Master Interview</span>
          <br />
          <span className="text-white">Communication with AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          The world&apos;s most engaging AI learning platform combining{' '}
          <span className="text-white font-semibold">Duolingo engagement</span>,{' '}
          <span className="text-white font-semibold">ChatGPT intelligence</span>, and{' '}
          <span className="text-white font-semibold">realistic mock interviews</span>.
          Land your dream job with confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/auth/register" className="btn-primary text-base px-8 py-4 rounded-2xl">
            Start Learning Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/demo" className="btn-secondary text-base px-8 py-4 rounded-2xl">
            <Play className="w-5 h-5 text-brand-400" />
            Watch Demo
          </Link>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
        >
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="glass-card p-6 text-center">
              <Icon className="w-6 h-6 text-brand-400 mx-auto mb-2" />
              <div className="text-3xl font-black gradient-text">{value}</div>
              <div className="text-sm text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Ace Any Interview</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            20+ AI-powered features designed specifically for college students and young professionals targeting top placements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color, delay }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay }}
              className="glass-card-hover p-6 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Communication Journey */}
      <section id="journey" className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Your <span className="gradient-text">7-Stage Journey</span>
          </h2>
          <p className="text-slate-400 text-lg">A structured path from complete beginner to interview-ready professional.</p>
        </motion.div>

        <div className="relative">
          <div className="journey-line h-full top-0" />
          <div className="space-y-6 relative z-10">
            {JOURNEY_STAGES.map(({ stage, title, desc, color }, i) => (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1">
                  <div className={`glass-card p-5 ${i % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <div className="text-xs font-bold text-slate-500 mb-1">STAGE {stage}</div>
                    <div className="text-white font-bold text-lg mb-1">{title}</div>
                    <div className="text-slate-400 text-sm">{desc}</div>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}99)`, boxShadow: `0 0 20px ${color}40` }}>
                  {stage}
                </div>
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black mb-4">
            Students Who <span className="gradient-text">Made It</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, college, company, text, avatar, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm`}>
                  {avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{name}</div>
                  <div className="text-slate-400 text-xs">{college} → <span className="text-emerald-400 font-medium">{company}</span></div>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">&ldquo;{text}&rdquo;</p>
              <div className="flex text-yellow-400 mt-3 gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-violet-500/10" />
          <div className="relative z-10">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl font-black mb-4 text-white">
              Ready to Land Your <span className="gradient-text">Dream Job?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ students who transformed their communication skills and got placed at top companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn-primary text-base px-10 py-4 rounded-2xl">
                Start Your Journey Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/login" className="btn-secondary text-base px-10 py-4 rounded-2xl">
                Sign In
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" />Free Forever Plan</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" />No Credit Card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" />Instant Access</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5b6ef5, #8b5cf6)' }}>
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">InterviewVerse AI</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            {['Privacy', 'Terms', 'Contact', 'Blog'].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <div className="text-slate-500 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Powered by IBM watsonx.ai
          </div>
        </div>
      </footer>
    </div>
  );
}
