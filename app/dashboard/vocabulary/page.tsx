'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Volume2, Star, ChevronRight, ArrowRight, Search,
  RotateCcw, CheckCircle2, XCircle, Zap, Award, BookMarked,
  Brain, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Word {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  partOfSpeech: string;
  synonyms: string[];
  antonyms: string[];
  exampleSentence: string;
  interviewUsage: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'advanced';
  category: string;
  learned?: boolean;
  bookmarked?: boolean;
  mastery?: number;
}

const SAMPLE_WORDS: Word[] = [
  {
    id: '1', word: 'Articulate', meaning: 'Able to express thoughts and ideas clearly and coherently',
    pronunciation: '/ɑːrˈtɪkjʊlɪt/', partOfSpeech: 'adjective',
    synonyms: ['eloquent', 'fluent', 'expressive'], antonyms: ['inarticulate', 'tongue-tied'],
    exampleSentence: 'She was an articulate speaker who clearly explained complex ideas.',
    interviewUsage: 'Being articulate is key during interviews — structure your answers using the STAR method.',
    difficulty: 'medium', category: 'professional', mastery: 75, learned: true,
  },
  {
    id: '2', word: 'Proactive', meaning: 'Taking initiative and acting in anticipation of future problems',
    pronunciation: '/prəʊˈæktɪv/', partOfSpeech: 'adjective',
    synonyms: ['initiative', 'forward-thinking', 'anticipatory'], antonyms: ['reactive', 'passive'],
    exampleSentence: 'The proactive employee identified the bug before it reached production.',
    interviewUsage: 'Use "proactive" when describing how you took initiative: "I proactively reached out to the client."',
    difficulty: 'easy', category: 'behavioral', mastery: 90, learned: true,
  },
  {
    id: '3', word: 'Synergy', meaning: 'Combined effect greater than the sum of individual parts',
    pronunciation: '/ˈsɪnərdʒi/', partOfSpeech: 'noun',
    synonyms: ['collaboration', 'cooperation', 'combined effort'], antonyms: ['conflict', 'discord'],
    exampleSentence: 'The synergy between the teams led to a 40% increase in productivity.',
    interviewUsage: 'Perfect for team questions: "Our team\'s synergy made the project a success."',
    difficulty: 'medium', category: 'professional', mastery: 45, learned: false,
  },
  {
    id: '4', word: 'Scalable', meaning: 'Able to grow or be expanded efficiently without performance degradation',
    pronunciation: '/ˈskeɪləbl/', partOfSpeech: 'adjective',
    synonyms: ['expandable', 'flexible', 'adaptable'], antonyms: ['limited', 'rigid'],
    exampleSentence: 'We built a scalable microservices architecture that handles millions of requests.',
    interviewUsage: 'Essential for technical interviews: "The solution is scalable to handle 10x traffic."',
    difficulty: 'medium', category: 'technical', mastery: 60, learned: false,
  },
  {
    id: '5', word: 'Meticulous', meaning: 'Showing extreme care and precision in attention to detail',
    pronunciation: '/mɪˈtɪkjʊləs/', partOfSpeech: 'adjective',
    synonyms: ['thorough', 'precise', 'careful'], antonyms: ['careless', 'negligent'],
    exampleSentence: 'Her meticulous code reviews caught every potential bug before deployment.',
    interviewUsage: 'Use to show quality focus: "I am meticulous about testing before any release."',
    difficulty: 'hard', category: 'professional', mastery: 20, learned: false,
  },
  {
    id: '6', word: 'Leverage', meaning: 'To use something to maximum advantage; to utilize effectively',
    pronunciation: '/ˈlevərɪdʒ/', partOfSpeech: 'verb',
    synonyms: ['utilize', 'exploit', 'capitalize on'], antonyms: ['ignore', 'waste'],
    exampleSentence: 'We leveraged existing APIs to reduce development time by 60%.',
    interviewUsage: 'Power word: "I leveraged my React skills to build the dashboard in half the time."',
    difficulty: 'easy', category: 'professional', mastery: 85, learned: true,
  },
];

type ViewMode = 'cards' | 'quiz' | 'flashcard';

export default function VocabularyPage() {
  const [words, setWords] = useState<Word[]>(SAMPLE_WORDS);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'learned' | 'bookmarked' | 'review'>('all');
  const [quizWord, setQuizWord] = useState<Word | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [newWord, setNewWord] = useState('');

  const filtered = words.filter((w) => {
    const matchSearch = w.word.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'learned') return w.learned;
    if (filter === 'bookmarked') return w.bookmarked;
    if (filter === 'review') return (w.mastery || 0) < 60;
    return true;
  });

  const startQuiz = () => {
    const randomWord = filtered[Math.floor(Math.random() * filtered.length)];
    const others = filtered.filter((w) => w.id !== randomWord.id);
    const wrongOptions = others.sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w.meaning);
    const options = [randomWord.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);
    setQuizWord(randomWord);
    setQuizOptions(options);
    setQuizAnswered(null);
  };

  const handleQuizAnswer = (option: string) => {
    setQuizAnswered(option);
    const correct = option === quizWord?.meaning;
    if (correct) {
      toast.success('+10 XP! Correct! 🎉');
      setWords((prev) => prev.map((w) => w.id === quizWord?.id
        ? { ...w, mastery: Math.min(100, (w.mastery || 0) + 15), learned: (w.mastery || 0) >= 80 }
        : w
      ));
    } else {
      toast.error('Not quite! Review this word again.');
    }
  };

  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const addWord = async () => {
    if (!newWord.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/vocabulary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: newWord.trim() }),
      });
      const data = await res.json();
      if (data.word) {
        setWords((prev) => [{ id: Date.now().toString(), word: newWord, ...data.word, mastery: 0, learned: false }, ...prev]);
        toast.success(`"${newWord}" added!`);
        setNewWord('');
      }
    } catch {
      toast.error('Failed to generate word data');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (d: string) => {
    if (d === 'easy') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (d === 'medium') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    if (d === 'hard') return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Vocabulary Builder</h1>
          <p className="text-slate-400 text-sm mt-1">
            {words.filter((w) => w.learned).length} learned · {words.filter((w) => (w.mastery || 0) < 60).length} need review
          </p>
        </div>
        <div className="flex gap-2">
          {(['cards', 'quiz', 'flashcard'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => { setViewMode(mode); if (mode === 'quiz') startQuiz(); if (mode === 'flashcard') setFlashcardIndex(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${viewMode === mode ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'}`}
            >
              {mode === 'cards' ? '📚 Cards' : mode === 'quiz' ? '🧠 Quiz' : '🃏 Flashcard'}
            </button>
          ))}
        </div>
      </div>

      {/* Add Word */}
      <div className="glass-card p-4 flex items-center gap-3">
        <Brain className="w-5 h-5 text-brand-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Add any word — AI will generate meaning, pronunciation, examples..."
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addWord()}
          className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none"
        />
        <button onClick={addWord} disabled={isLoading || !newWord.trim()} className="btn-primary py-2 px-4 text-xs disabled:opacity-40">
          {isLoading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Zap className="w-3 h-3" /> Generate</>}
        </button>
      </div>

      {/* Search + Filter */}
      {viewMode === 'cards' && (
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500/40 transition-all"
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'learned', 'bookmarked', 'review'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-white/5 text-slate-500 border border-white/5 hover:text-white'}`}
              >
                {f === 'all' ? 'All' : f === 'learned' ? '✅' : f === 'bookmarked' ? '🔖' : '🔁'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((word) => (
            <motion.div
              key={word.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-hover p-5 cursor-pointer"
              onClick={() => setSelectedWord(selectedWord?.id === word.id ? null : word)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-lg">{word.word}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-400 text-xs italic">{word.pronunciation}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); playPronunciation(word.word); }}
                      className="w-6 h-6 rounded-md flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(word.difficulty)}`}>
                    {word.difficulty}
                  </span>
                  {word.learned && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-3 leading-relaxed">{word.meaning}</p>

              {/* Mastery Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Mastery</span>
                  <span>{word.mastery || 0}%</span>
                </div>
                <div className="xp-bar">
                  <div
                    className="xp-bar-fill"
                    style={{ width: `${word.mastery || 0}%`, background: (word.mastery || 0) >= 80 ? '#10b981' : undefined }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">{word.partOfSpeech}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">{word.category}</span>
                <ChevronRight className="w-3 h-3 text-slate-600 ml-auto" />
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedWord?.id === word.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white/10 space-y-3"
                  >
                    <div>
                      <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Synonyms</div>
                      <div className="flex flex-wrap gap-1.5">
                        {word.synonyms.map((s) => (
                          <span key={s} className="px-2 py-1 rounded-lg bg-brand-500/10 text-brand-300 text-xs border border-brand-500/20">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Example Sentence</div>
                      <p className="text-slate-300 text-sm italic">&ldquo;{word.exampleSentence}&rdquo;</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-xs text-emerald-400 font-medium mb-1">💼 Interview Usage</div>
                      <p className="text-slate-300 text-xs">{word.interviewUsage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* QUIZ VIEW */}
      {viewMode === 'quiz' && quizWord && (
        <div className="max-w-lg mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="text-4xl font-black text-white mb-2">{quizWord.word}</div>
            <div className="text-slate-400 text-sm mb-2 italic">{quizWord.pronunciation}</div>
            <button onClick={() => playPronunciation(quizWord.word)} className="btn-ghost text-xs mb-8">
              <Volume2 className="w-3.5 h-3.5" /> Hear pronunciation
            </button>
            <div className="text-slate-400 text-sm mb-6">What does this word mean?</div>

            <div className="space-y-3">
              {quizOptions.map((option) => {
                const isCorrect = option === quizWord.meaning;
                const isSelected = option === quizAnswered;
                return (
                  <button
                    key={option}
                    onClick={() => !quizAnswered && handleQuizAnswer(option)}
                    disabled={!!quizAnswered}
                    className={`w-full p-4 rounded-xl text-sm text-left transition-all border ${
                      !quizAnswered
                        ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                        : isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : isSelected
                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                        : 'bg-white/3 border-white/5 text-slate-500'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {quizAnswered && (isCorrect
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        : isSelected
                        ? <XCircle className="w-4 h-4 text-red-400" />
                        : null)}
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {quizAnswered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <div className={`text-sm font-medium mb-4 ${quizAnswered === quizWord.meaning ? 'text-emerald-400' : 'text-red-400'}`}>
                  {quizAnswered === quizWord.meaning ? '✅ Correct! +10 XP' : `❌ The answer was: "${quizWord.meaning}"`}
                </div>
                <button onClick={startQuiz} className="btn-primary py-2.5 px-8 text-sm">
                  Next Word <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* FLASHCARD VIEW */}
      {viewMode === 'flashcard' && filtered.length > 0 && (
        <div className="max-w-md mx-auto">
          <div className="text-center text-slate-400 text-sm mb-4">
            {flashcardIndex + 1} / {filtered.length} — Click card to flip
          </div>
          <motion.div
            key={`${flashcardIndex}-${flashcardFlipped}`}
            className="glass-card p-8 text-center cursor-pointer min-h-[240px] flex flex-col items-center justify-center"
            onClick={() => setFlashcardFlipped(!flashcardFlipped)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <AnimatePresence mode="wait">
              {!flashcardFlipped ? (
                <motion.div key="front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                  <div className="text-xs text-slate-500 mb-4 uppercase tracking-widest">Word</div>
                  <div className="text-4xl font-black text-white mb-2">{filtered[flashcardIndex].word}</div>
                  <div className="text-slate-400 italic text-sm">{filtered[flashcardIndex].pronunciation}</div>
                  <button onClick={(e) => { e.stopPropagation(); playPronunciation(filtered[flashcardIndex].word); }}
                    className="mt-4 btn-ghost text-xs">
                    <Volume2 className="w-3.5 h-3.5" /> Play
                  </button>
                  <div className="mt-6 text-slate-600 text-xs">Tap to reveal meaning →</div>
                </motion.div>
              ) : (
                <motion.div key="back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-3">
                  <div className="text-xs text-slate-500 uppercase tracking-widest">Meaning</div>
                  <div className="text-white text-base leading-relaxed">{filtered[flashcardIndex].meaning}</div>
                  <div className="text-slate-400 text-xs italic">&ldquo;{filtered[flashcardIndex].exampleSentence}&rdquo;</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => { setFlashcardIndex(Math.max(0, flashcardIndex - 1)); setFlashcardFlipped(false); }}
              disabled={flashcardIndex === 0}
              className="btn-secondary px-5 py-2 text-sm disabled:opacity-40"
            >
              ← Previous
            </button>
            <div className="flex gap-2">
              <button onClick={() => { toast.error('Need more practice'); setFlashcardIndex((i) => (i + 1) % filtered.length); setFlashcardFlipped(false); }}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
              <button onClick={() => { toast.success('+5 XP! Got it!'); setFlashcardIndex((i) => (i + 1) % filtered.length); setFlashcardFlipped(false); }}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => { setFlashcardIndex(Math.min(filtered.length - 1, flashcardIndex + 1)); setFlashcardFlipped(false); }}
              disabled={flashcardIndex === filtered.length - 1}
              className="btn-secondary px-5 py-2 text-sm disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
