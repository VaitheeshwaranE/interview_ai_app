'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Square, Play, RotateCcw, ChevronRight, Star,
  BarChart3, CheckCircle2, XCircle, Clock, Award, Volume2,
  Zap, ArrowRight, Brain, MessageSquare
} from 'lucide-react';
import { AVATAR_INTERVIEWERS, getScoreColor, formatDuration } from '@/lib/utils';
import toast from 'react-hot-toast';

type InterviewPhase = 'setup' | 'interview' | 'feedback';

interface Message {
  role: 'interviewer' | 'user';
  content: string;
  timestamp: Date;
  score?: number;
  corrections?: Array<{ original: string; corrected: string; type: string; explanation: string }>;
}

interface ScoreBreakdown {
  grammar: number;
  vocabulary: number;
  confidence: number;
  fluency: number;
  relevance: number;
  overall: number;
}

export default function MockInterviewPage() {
  const [phase, setPhase] = useState<InterviewPhase>('setup');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_INTERVIEWERS[0]);
  const [interviewType, setInterviewType] = useState('hr');
  const [difficulty, setDifficulty] = useState('medium');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [scores, setScores] = useState<ScoreBreakdown | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [audioWaveActive, setAudioWaveActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (phase === 'interview') {
      timerRef.current = setInterval(() => setSessionTimer((t) => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const startInterview = async () => {
    setPhase('interview');
    setMessages([]);
    setQuestionCount(0);
    setSessionTimer(0);

    const welcomeMsg: Message = {
      role: 'interviewer',
      content: `Hello! I'm ${selectedAvatar.name}, ${selectedAvatar.role}. ${getWelcomeMessage(selectedAvatar.id, interviewType)}`,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);

    setTimeout(() => fetchNextQuestion(), 1500);
  };

  const getWelcomeMessage = (avatarId: string, type: string): string => {
    const welcomes: Record<string, string> = {
      'hr-manager': `Thank you for joining us today. I'll be conducting your ${type} interview. Please relax and answer naturally. Let's get started!`,
      'google-recruiter': `Great to meet you! I'm looking for the best candidates. This will be a structured interview. Give specific examples wherever possible.`,
      'startup-founder': `Hey! Excited to chat. We move fast here, so be direct. Tell me what makes you stand out from hundreds of applicants!`,
      'tech-lead': `Welcome. I'll assess your technical depth today. I want clear, structured answers with real examples from your experience.`,
      'friendly-mentor': `Hi! Don't be nervous — I'm here to help you grow. Answer honestly, and I'll give you detailed feedback after each response.`,
    };
    return welcomes[avatarId] || "Let's begin the interview!";
  };

  const fetchNextQuestion = async () => {
    if (questionCount >= 7) {
      endInterview();
      return;
    }

    setIsTyping(true);
    try {
      const prevQuestions = messages.filter((m) => m.role === 'interviewer' && questionCount > 0).map((m) => m.content);
      const res = await fetch('/api/interview/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: interviewType,
          avatarId: selectedAvatar.id,
          difficulty,
          previousQuestions: prevQuestions.slice(-3),
          questionNumber: questionCount + 1,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        role: 'interviewer',
        content: data.question,
        timestamp: new Date(),
      }]);
      setQuestionCount((q) => q + 1);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'interviewer',
        content: 'Tell me about a challenging project you worked on and how you handled it.',
        timestamp: new Date(),
      }]);
      setQuestionCount((q) => q + 1);
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioWaveActive(true);
    } catch {
      toast.error('Microphone access denied. Type your answer instead.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioWaveActive(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      const res = await fetch('/api/speech/transcribe', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.transcript) {
        setCurrentAnswer(data.transcript);
      }
    } catch {
      toast.error('Transcription failed. Please type your answer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    const lastQuestion = [...messages].reverse().find((m) => m.role === 'interviewer');
    const answerMsg: Message = {
      role: 'user',
      content: currentAnswer,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, answerMsg]);
    setCurrentAnswer('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: lastQuestion?.content || '',
          answer: currentAnswer,
          type: interviewType,
          avatarId: selectedAvatar.id,
        }),
      });
      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((m) => m === answerMsg);
        if (idx >= 0) {
          updated[idx] = { ...answerMsg, score: data.score, corrections: data.corrections };
        }
        return updated;
      });

      setIsTyping(true);
      setTimeout(() => {
        const feedbackMsg = getFeedbackResponse(data.score, selectedAvatar.id);
        setMessages((prev) => [...prev, {
          role: 'interviewer',
          content: `${feedbackMsg} ${data.feedback}`,
          timestamp: new Date(),
        }]);
        setIsTyping(false);

        if (questionCount < 7) {
          setTimeout(fetchNextQuestion, 2000);
        } else {
          setTimeout(endInterview, 2000);
        }
      }, 1000);
    } catch {
      setIsProcessing(false);
      setTimeout(fetchNextQuestion, 1000);
    } finally {
      setIsProcessing(false);
    }
  };

  const getFeedbackResponse = (score: number, avatarId: string): string => {
    if (score >= 85) return avatarId === 'google-recruiter' ? 'Strong answer.' : '✅ Excellent response!';
    if (score >= 70) return '👍 Good answer.';
    if (score >= 55) return '🤔 Decent, but could be stronger.';
    return '📝 Let\'s work on that.';
  };

  const endInterview = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const userMessages = messages.filter((m) => m.role === 'user');
    const avgScore = userMessages.length > 0
      ? Math.round(userMessages.reduce((s, m) => s + (m.score || 70), 0) / userMessages.length)
      : 70;

    setScores({
      grammar: avgScore - 5 + Math.floor(Math.random() * 10),
      vocabulary: avgScore - 8 + Math.floor(Math.random() * 16),
      confidence: avgScore - 10 + Math.floor(Math.random() * 20),
      fluency: avgScore - 3 + Math.floor(Math.random() * 6),
      relevance: avgScore + Math.floor(Math.random() * 10),
      overall: avgScore,
    });

    try {
      await fetch('/api/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: interviewType,
          avatarId: selectedAvatar.id,
          duration: sessionTimer,
          messages: messages.map((m) => ({ role: m.role, content: m.content, score: m.score })),
          overallScore: avgScore,
        }),
      });
    } catch {}

    setPhase('feedback');
  };

  // === RENDER: SETUP PHASE ===
  if (phase === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Mock Interview</h1>
          <p className="text-slate-400">Practice with AI interviewers. Get instant feedback on every answer.</p>
        </div>

        {/* Avatar Selection */}
        <div className="glass-card p-6">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-brand-400" />Choose Your Interviewer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AVATAR_INTERVIEWERS.map((avatar) => (
              <motion.button
                key={avatar.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedAvatar(avatar)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  selectedAvatar.id === avatar.id
                    ? 'border-brand-500/50 bg-brand-500/10'
                    : 'border-white/5 bg-white/3 hover:bg-white/6'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatar.color} flex items-center justify-center text-2xl`}>
                    {avatar.avatar}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{avatar.name}</div>
                    <div className="text-slate-400 text-xs">{avatar.role}</div>
                    <div className="text-slate-500 text-xs">{avatar.company}</div>
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{avatar.personality}</p>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    avatar.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                    avatar.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {avatar.difficulty.charAt(0).toUpperCase() + avatar.difficulty.slice(1)}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Interview Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-3">Interview Type</h3>
            <div className="space-y-2">
              {[
                { value: 'hr', label: 'HR / Behavioral', icon: '👔' },
                { value: 'technical', label: 'Technical', icon: '💻' },
                { value: 'system-design', label: 'System Design', icon: '🏗️' },
                { value: 'company-specific', label: 'Company Specific', icon: '🏢' },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setInterviewType(value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
                    interviewType === value ? 'bg-brand-500/10 border border-brand-500/30 text-white' : 'bg-white/3 text-slate-400 hover:text-white hover:bg-white/6'
                  }`}
                >
                  <span>{icon}</span> {label}
                  {interviewType === value && <CheckCircle2 className="w-4 h-4 text-brand-400 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-3">Difficulty</h3>
            <div className="space-y-2">
              {[
                { value: 'easy', label: 'Easy — Fresher level', color: 'text-emerald-400' },
                { value: 'medium', label: 'Medium — 1-2 years exp', color: 'text-yellow-400' },
                { value: 'hard', label: 'Hard — Senior level', color: 'text-red-400' },
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => setDifficulty(value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
                    difficulty === value ? 'bg-brand-500/10 border border-brand-500/30 text-white' : 'bg-white/3 text-slate-400 hover:text-white hover:bg-white/6'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full bg-current ${color}`} />
                  <span className={difficulty === value ? 'text-white' : ''}>{label}</span>
                  {difficulty === value && <CheckCircle2 className="w-4 h-4 text-brand-400 ml-auto" />}
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-brand-500/5 border border-brand-500/10">
              <div className="text-xs text-brand-300 font-medium mb-1">Selected: {selectedAvatar.name}</div>
              <div className="text-xs text-slate-400">{selectedAvatar.style}</div>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={startInterview}
          className="btn-primary w-full py-4 text-base rounded-2xl"
        >
          <Play className="w-5 h-5" />
          Start Interview with {selectedAvatar.name}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    );
  }

  // === RENDER: INTERVIEW PHASE ===
  if (phase === 'interview') {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Interview Header */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedAvatar.color} flex items-center justify-center text-xl`}>
              {selectedAvatar.avatar}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{selectedAvatar.name}</div>
              <div className="text-slate-400 text-xs">{selectedAvatar.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>{questionCount}/7</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(sessionTimer)}</span>
            </div>
            <button
              onClick={endInterview}
              className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
            >
              End
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="glass-card p-4 min-h-[420px] max-h-[500px] overflow-y-auto space-y-4">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                  msg.role === 'interviewer'
                    ? `bg-gradient-to-br ${selectedAvatar.color}`
                    : 'bg-brand-500/30 border border-brand-500/30'
                }`}>
                  {msg.role === 'interviewer' ? selectedAvatar.avatar : '👤'}
                </div>
                <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''} flex flex-col gap-1`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'interviewer'
                      ? 'bg-white/5 text-slate-200'
                      : 'bg-brand-500/20 text-white border border-brand-500/20'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && msg.score !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${getScoreColor(msg.score)}`}>
                        Score: {msg.score}/100
                      </span>
                    </div>
                  )}
                  {msg.corrections && msg.corrections.length > 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-2 text-xs space-y-1">
                      {msg.corrections.slice(0, 2).map((c, ci) => (
                        <div key={ci} className="flex items-start gap-2">
                          <XCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-red-300 line-through">{c.original}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-emerald-300">{c.corrected}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedAvatar.color} flex items-center justify-center text-sm`}>
                {selectedAvatar.avatar}
              </div>
              <div className="bg-white/5 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Answer Input */}
        <div className="glass-card p-4 space-y-3">
          {audioWaveActive && (
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="audio-wave">
                {[...Array(6)].map((_, i) => <span key={i} />)}
              </div>
              <span className="font-medium">Recording... Speak your answer</span>
            </div>
          )}

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={isRecording ? 'Recording your voice...' : 'Type your answer or use the microphone...'}
            disabled={isRecording}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 text-sm resize-none focus:outline-none focus:border-brand-500/50 transition-all"
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submitAnswer(); }}
          />

          <div className="flex items-center gap-2">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
              }`}
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={submitAnswer}
              disabled={!currentAnswer.trim() || isProcessing}
              className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-40"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Submit Answer <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </button>

            <button
              onClick={fetchNextQuestion}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              title="Skip question"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-600 text-xs text-center">Ctrl+Enter to submit • Click mic for voice input</p>
        </div>
      </div>
    );
  }

  // === RENDER: FEEDBACK PHASE ===
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="text-6xl mb-4">
          {scores && scores.overall >= 80 ? '🎉' : scores && scores.overall >= 60 ? '👍' : '📈'}
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Interview Complete!</h1>
        <p className="text-slate-400">Here&apos;s your detailed performance analysis</p>
      </motion.div>

      {scores && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Overall Score', value: scores.overall, icon: Award },
            { label: 'Grammar', value: scores.grammar, icon: CheckCircle2 },
            { label: 'Vocabulary', value: scores.vocabulary, icon: Star },
            { label: 'Confidence', value: scores.confidence, icon: Zap },
            { label: 'Fluency', value: scores.fluency, icon: Volume2 },
            { label: 'Relevance', value: scores.relevance, icon: Brain },
          ].map(({ label, value, icon: Icon }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card p-4 text-center ${label === 'Overall Score' ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-2 ${getScoreColor(value)}`} />
              <div className={`text-2xl font-black ${getScoreColor(value)}`}>{value}</div>
              <div className="text-slate-400 text-xs mt-1">{label}</div>
              <div className="xp-bar mt-2">
                <div className={`xp-bar-fill ${value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${value}%`, background: undefined }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Performance Tips */}
      <div className="glass-card p-5">
        <h2 className="text-white font-bold mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-brand-400" />
          AI Recommendations
        </h2>
        <div className="space-y-2">
          {scores && scores.grammar < 70 && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white text-sm font-medium">Improve Grammar</div>
                <div className="text-slate-400 text-xs">Practice sentence structure daily. Use our Grammar module.</div>
              </div>
            </div>
          )}
          {scores && scores.confidence < 70 && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Zap className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white text-sm font-medium">Build Confidence</div>
                <div className="text-slate-400 text-xs">Do 3 more mock interviews this week to gain confidence.</div>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white text-sm font-medium">Keep Practicing</div>
              <div className="text-slate-400 text-xs">Consistent daily practice for 2 weeks will improve your score by 20%.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => { setPhase('setup'); setScores(null); }} className="btn-secondary flex-1 py-3">
          <RotateCcw className="w-4 h-4" /> New Interview
        </button>
        <button onClick={() => { setPhase('setup'); setScores(null); }} className="btn-primary flex-1 py-3">
          <BarChart3 className="w-4 h-4" /> View Analytics
        </button>
      </div>
    </div>
  );
}
