'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Brain, CheckCircle2, Zap, Star, Target,
  Award, ArrowRight, Loader2, AlertCircle, Code, Users
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ResumeAnalysis {
  skills: string[];
  projects: Array<{ name: string; description: string; technologies: string[] }>;
  experience: Array<{ company: string; role: string; duration: string; highlights: string[] }>;
  achievements: string[];
  education: Array<{ institution: string; degree: string; year: string }>;
  overallScore: number;
  suggestions: string[];
  generatedQuestions: {
    behavioral: string[];
    technical: string[];
    projectBased: string[];
  };
}

export default function ResumeAIPage() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'suggestions'>('overview');
  const [questionType, setQuestionType] = useState<'behavioral' | 'technical' | 'projectBased'>('behavioral');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.includes('text') && !file.name.endsWith('.txt')) {
      toast.error('Please upload a PDF or text file');
      return;
    }

    // Read file as text (for .txt) or show upload success for PDF
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const text = await file.text();
      setResumeText(text);
      toast.success('Resume loaded!');
    } else {
      toast.success(`PDF "${file.name}" loaded! Click Analyze to process.`);
      setResumeText(`[PDF Resume: ${file.name}] - Content will be extracted and analyzed.`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const analyzeResume = async () => {
    const textToAnalyze = resumeText.trim();
    if (!textToAnalyze) {
      toast.error('Please upload or paste your resume first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      toast.success('Resume analyzed! 🎉');
    } catch {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white">Resume AI Analyzer</h1>
        <p className="text-slate-400 text-sm mt-1">Upload your resume — AI extracts skills, projects, and generates targeted interview questions</p>
      </div>

      {!analysis ? (
        <div className="space-y-4">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`glass-card p-10 text-center cursor-pointer transition-all border-2 border-dashed ${
              isDragActive ? 'border-brand-500/60 bg-brand-500/5' : 'border-white/10 hover:border-brand-500/30 hover:bg-white/3'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-brand-400' : 'text-slate-500'}`} />
            <div className="text-white font-bold text-lg mb-2">
              {isDragActive ? 'Drop your resume here!' : 'Upload Your Resume'}
            </div>
            <div className="text-slate-400 text-sm mb-4">
              Drag & drop PDF or TXT file, or click to browse
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs">
              <FileText className="w-3.5 h-3.5" /> PDF / TXT · Max 5MB
            </div>
          </div>

          {/* OR paste text */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-500">
              <span className="bg-[#050816] px-3">or paste your resume text</span>
            </div>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
            rows={10}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 text-sm resize-none focus:outline-none focus:border-brand-500/50 transition-all font-mono"
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={analyzeResume}
            disabled={isAnalyzing || !resumeText.trim()}
            className="btn-primary w-full py-4 text-base rounded-2xl disabled:opacity-50"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with IBM watsonx.ai...
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                <Brain className="w-5 h-5" /> Analyze Resume
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </motion.button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Score Banner */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-violet-500/10" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle cx="32" cy="32" r="28" fill="none"
                      stroke={analysis.overallScore >= 70 ? '#10b981' : '#f59e0b'} strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - analysis.overallScore / 100)}`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-sm">{analysis.overallScore}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Resume Score</div>
                  <div className="text-slate-400 text-sm">
                    {analysis.overallScore >= 80 ? '🎉 Excellent resume!' : analysis.overallScore >= 60 ? '📈 Good foundation, small improvements needed' : '🔧 Needs significant improvements'}
                  </div>
                </div>
              </div>
              <button onClick={() => setAnalysis(null)} className="btn-secondary text-sm py-2 px-4">
                ↑ Upload New
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(['overview', 'questions', 'suggestions'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-white/5 text-slate-400 border border-white/5 hover:text-white'}`}>
                {tab === 'overview' ? '📊 Overview' : tab === 'questions' ? '❓ Interview Questions' : '💡 Suggestions'}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Skills */}
              <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Code className="w-4 h-4 text-brand-400" />Extracted Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full text-xs bg-brand-500/10 text-brand-300 border border-brand-500/20 font-medium">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" />Projects</h3>
                <div className="space-y-2">
                  {analysis.projects.slice(0, 3).map((p) => (
                    <div key={p.name} className="p-3 rounded-xl bg-white/3 border border-white/5">
                      <div className="text-white text-sm font-medium">{p.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5 line-clamp-2">{p.description}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.technologies?.slice(0, 4).map((t) => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" />Experience</h3>
                <div className="space-y-2">
                  {analysis.experience.map((e) => (
                    <div key={e.company} className="p-3 rounded-xl bg-white/3 border border-white/5">
                      <div className="text-white text-sm font-medium">{e.role}</div>
                      <div className="text-slate-400 text-xs">{e.company} · {e.duration}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-purple-400" />Achievements</h3>
                <div className="space-y-2">
                  {analysis.achievements.map((a) => (
                    <div key={a} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {(['behavioral', 'technical', 'projectBased'] as const).map((t) => (
                  <button key={t} onClick={() => setQuestionType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${questionType === t ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'}`}>
                    {t === 'behavioral' ? '👥 Behavioral' : t === 'technical' ? '💻 Technical' : '🏗️ Project-Based'}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {analysis.generatedQuestions[questionType].map((q, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-slate-200 text-sm leading-relaxed">{q}</p>
                      <button className="text-brand-400 text-xs mt-2 hover:text-brand-300 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Practice this question
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="space-y-3">
              {analysis.suggestions.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm leading-relaxed">{s}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
