'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight, CheckCircle2, BookOpen, Mic, Code, FileText, ArrowRight, Lock } from 'lucide-react';
import { CAREER_ROADMAPS } from '@/lib/utils';

const ROADMAP_DETAILS: Record<string, {
  description: string;
  stages: Array<{ title: string; type: string; icon: string; completed: boolean; topics: string[] }>;
}> = {
  'software-engineer': {
    description: 'Master technical communication, system design discussions, and coding interview prep for top tech companies.',
    stages: [
      { title: 'Core Vocabulary', type: 'vocabulary', icon: '📚', completed: true, topics: ['Data Structures', 'Algorithms', 'System Design', 'OOP concepts'] },
      { title: 'Technical Communication', type: 'communication', icon: '💬', completed: true, topics: ['Code walkthroughs', 'Architecture explanations', 'Technical writing'] },
      { title: 'HR Round Prep', type: 'mock-interview', icon: '👔', completed: false, topics: ['Behavioral questions', 'STAR method', 'Culture fit'] },
      { title: 'Technical Mock Interview', type: 'mock-interview', icon: '💻', completed: false, topics: ['DSA problems', 'System design', 'Coding explanations'] },
      { title: 'Resume Review', type: 'resume', icon: '📄', completed: false, topics: ['Project descriptions', 'Skills section', 'Achievement metrics'] },
      { title: 'FAANG Interview Simulation', type: 'mock-interview', icon: '🏆', completed: false, topics: ['Google-style', 'Amazon LP', 'Meta system design'] },
    ],
  },
  'data-scientist': {
    description: 'Communicate data insights effectively, present ML models to stakeholders, and ace data science interviews.',
    stages: [
      { title: 'Data Science Vocabulary', type: 'vocabulary', icon: '📊', completed: false, topics: ['ML terminology', 'Statistics', 'Data engineering'] },
      { title: 'Stakeholder Communication', type: 'communication', icon: '📈', completed: false, topics: ['Data storytelling', 'Presenting insights', 'Business impact'] },
      { title: 'Technical Interview Prep', type: 'mock-interview', icon: '🤖', completed: false, topics: ['ML case studies', 'Statistics questions', 'SQL rounds'] },
      { title: 'Project Presentation', type: 'mock-interview', icon: '🎯', completed: false, topics: ['Portfolio walkthrough', 'Impact metrics', 'Technical depth'] },
    ],
  },
  'ui-ux-designer': {
    description: 'Present design decisions confidently, communicate user research findings, and ace design interviews.',
    stages: [
      { title: 'Design Vocabulary', type: 'vocabulary', icon: '🎨', completed: false, topics: ['UX principles', 'Design systems', 'Accessibility'] },
      { title: 'Portfolio Communication', type: 'communication', icon: '🖼️', completed: false, topics: ['Case study narration', 'Design rationale', 'User empathy'] },
      { title: 'Design Interview Prep', type: 'mock-interview', icon: '✏️', completed: false, topics: ['Design challenges', 'Whiteboard exercises', 'Portfolio defense'] },
    ],
  },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  vocabulary: BookOpen,
  communication: Mic,
  'mock-interview': Mic,
  project: Code,
  resume: FileText,
};

export default function CareerRoadmapsPage() {
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);

  const details = selectedRoadmap ? ROADMAP_DETAILS[selectedRoadmap] : null;
  const roadmap = selectedRoadmap ? CAREER_ROADMAPS.find((r) => r.slug === selectedRoadmap) : null;

  if (selectedRoadmap && details && roadmap) {
    const completed = details.stages.filter((s) => s.completed).length;
    const pct = Math.round((completed / details.stages.length) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <button onClick={() => setSelectedRoadmap(null)} className="btn-ghost text-slate-400 hover:text-white text-sm">
          ← Back to Roadmaps
        </button>

        <div className="glass-card p-6 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${roadmap.color} opacity-5`} />
          <div className="relative z-10 flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roadmap.color} flex items-center justify-center text-3xl flex-shrink-0`}>
              {roadmap.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{roadmap.title}</h1>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">{details.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-slate-400 text-xs">~{roadmap.weeks} weeks</span>
                <span className="text-slate-400 text-xs">{details.stages.length} stages</span>
                <span className={`text-xs font-bold ${pct > 0 ? 'text-brand-400' : 'text-slate-500'}`}>{pct}% complete</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-4">
            <div className="xp-bar h-2">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                className="xp-bar-fill" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {details.stages.map((stage, i) => {
            const Icon = TYPE_ICONS[stage.type] || BookOpen;
            const isLocked = !stage.completed && i > 0 && !details.stages[i - 1].completed;
            return (
              <motion.div key={stage.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`glass-card p-4 flex items-center gap-4 ${isLocked ? 'opacity-50' : 'cursor-pointer hover:bg-white/6'} transition-all`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                  stage.completed ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/5 border border-white/10'
                }`}>
                  {isLocked ? '🔒' : stage.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold text-sm ${stage.completed ? 'text-emerald-300' : 'text-white'}`}>{stage.title}</h3>
                    {stage.completed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {stage.topics.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">{t}</span>
                    ))}
                  </div>
                </div>
                {!isLocked && <ArrowRight className={`w-4 h-4 flex-shrink-0 ${stage.completed ? 'text-emerald-400' : 'text-brand-400'}`} />}
              </motion.div>
            );
          })}
        </div>

        <button className="btn-primary w-full py-4 text-base rounded-2xl">
          <TrendingUp className="w-5 h-5" /> Continue Your {roadmap.title} Journey
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white">Career Roadmaps</h1>
        <p className="text-slate-400 text-sm mt-1">Structured learning paths tailored to your target career</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAREER_ROADMAPS.map((r, i) => (
          <motion.div
            key={r.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-5 cursor-pointer"
            onClick={() => setSelectedRoadmap(r.slug)}
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center text-3xl mb-4`}>
              {r.icon}
            </div>
            <h3 className="text-white font-bold text-base mb-1">{r.title}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
              <span>~{r.weeks} weeks</span>
              <span>•</span>
              <span>{ROADMAP_DETAILS[r.slug]?.stages.length || 5} stages</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['Vocabulary', 'Mock Interviews', 'Resume'].map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">{tag}</span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">Start your journey</div>
              <ChevronRight className="w-4 h-4 text-brand-400" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
