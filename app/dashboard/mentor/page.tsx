'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Mic, MicOff, RotateCcw, Brain, Sparkles,
  User, BookOpen, Target, Award, TrendingUp, MessageSquare,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
}

const SUGGESTED_PROMPTS = [
  { text: 'How do I answer "Tell me about yourself"?', icon: '🎯', category: 'interview' },
  { text: 'Review my elevator pitch', icon: '📢', category: 'communication' },
  { text: 'Prepare me for Amazon SDE interview', icon: '🏢', category: 'company' },
  { text: 'Fix my grammar: "I have completed the project yesterday"', icon: '✏️', category: 'grammar' },
  { text: 'What is STAR method?', icon: '⭐', category: 'interview' },
  { text: 'How to negotiate salary confidently?', icon: '💰', category: 'career' },
];

export default function MentorPage() {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hey ${userProfile?.name?.split(' ')[0] || 'there'}! 👋 I'm **Alex**, your AI career mentor. I'm here to help you crush interviews and land your dream job!\n\nI can help you with:\n• **Interview prep** — STAR method, common questions, company research\n• **Grammar & communication** — Real-time corrections\n• **Resume review** — Targeted feedback\n• **Career guidance** — Roadmaps, skill gaps\n• **Motivation** — When you need a boost 💪\n\nWhat's on your mind today?`,
      timestamp: new Date(),
      category: 'intro',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    try {
      const history = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history,
          context: {
            name: userProfile?.name,
            targetRole: userProfile?.targetRole,
            targetCompany: userProfile?.targetCompany,
            jobReadyScore: userProfile?.jobReadyScore,
          },
        }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'I\'m here to help! Could you rephrase your question?',
        timestamp: new Date(),
        category: data.category,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an issue. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob, 'voice.webm');
        try {
          const res = await fetch('/api/speech/transcribe', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.transcript) setInput(data.transcript);
        } catch {
          toast.error('Voice transcription failed');
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error('Microphone access needed for voice input');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
      .replace(/•/g, '•');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="glass-card p-4 mb-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center relative">
            <Bot className="w-6 h-6 text-white" />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#050816] animate-pulse" />
          </div>
          <div>
            <div className="text-white font-bold">Alex — Your AI Mentor</div>
            <div className="text-emerald-400 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Online · Ready to help
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="badge-xp text-xs">IBM watsonx.ai</div>
          <button
            onClick={() => setMessages([{ id: 'clear', role: 'assistant', content: 'Chat cleared! How can I help you today?', timestamp: new Date() }])}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-brand-500 to-violet-600'
                  : 'bg-white/10 border border-white/10'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-slate-300" />}
              </div>

              {/* Bubble */}
              <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-white/5 text-slate-200'
                    : 'bg-brand-500/20 text-white border border-brand-500/20'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                  ) : (
                    msg.content
                  )}
                </div>
                <div className="text-slate-600 text-xs mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/5 px-4 py-3 rounded-2xl">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
                <span className="text-slate-500 text-xs ml-2">Alex is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts — shown when only welcome message */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 flex-shrink-0">
          {SUGGESTED_PROMPTS.map(({ text, icon }) => (
            <button
              key={text}
              onClick={() => sendMessage(text)}
              className="flex items-start gap-2 p-3 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 hover:border-brand-500/30 text-left transition-all text-xs text-slate-300 hover:text-white"
            >
              <span className="text-base flex-shrink-0">{icon}</span>
              <span className="line-clamp-2">{text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="glass-card p-3 flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              placeholder="Ask Alex anything about your career, interviews, grammar..."
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 text-sm resize-none focus:outline-none focus:border-brand-500/50 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-slate-400 hover:text-white hover:bg-white/15'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl flex items-center justify-center btn-primary disabled:opacity-40 disabled:cursor-not-allowed p-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-slate-600 text-xs mt-2 text-center">
          Press Enter to send · Shift+Enter for new line · Click 🎤 for voice
        </div>
      </div>
    </div>
  );
}
