'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Award,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULE_ID = 'reading-practice';

const questions = [
  {
    question: 'What is the main purpose of communication in the workplace?',
    options: [
      'To avoid working with others',
      'To share information clearly and work effectively',
      'To speak as much as possible',
      'To impress everyone',
    ],
    answer: 1,
  },
  {
    question: 'Which skill helps you understand what another person is saying?',
    options: [
      'Active listening',
      'Fast speaking',
      'Memorization',
      'Writing',
    ],
    answer: 0,
  },
  {
    question: 'What should you do when speaking in a professional environment?',
    options: [
      'Use unclear language',
      'Avoid eye contact',
      'Speak clearly and confidently',
      'Speak very quickly',
    ],
    answer: 2,
  },
  {
    question: 'Why is reading useful for improving English?',
    options: [
      'It helps build vocabulary and understanding',
      'It prevents communication',
      'It only improves handwriting',
      'It makes conversations unnecessary',
    ],
    answer: 0,
  },
  {
    question: 'What is a good way to improve English communication?',
    options: [
      'Never practice',
      'Practice regularly',
      'Avoid learning new words',
      'Only use one sentence',
    ],
    answer: 1,
  },
];

export default function ReadingPracticePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Check previous completion
  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const response = await fetch('/api/journey/module', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load module progress');
        }

        const data = await response.json();

        const moduleProgress = data.progress?.find(
          (item: { moduleId: string; completed: boolean }) =>
            item.moduleId === MODULE_ID
        );

        setCompleted(moduleProgress?.completed === true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user]);

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    if (completed || score !== null) return;

    setAnswers((previous) => {
      const updated = [...previous];
      updated[questionIndex] = answerIndex;
      return updated;
    });
  };

  const checkAnswers = () => {
    if (answers.length !== questions.length) {
      setError('Please answer all 5 questions before checking your score.');
      return;
    }

    let correct = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correct++;
      }
    });

    setScore(correct);
    setError('');
  };

  const completeModule = async () => {
    if (!user) {
      setError('Please sign in first.');
      return;
    }

    if (completed || completing) return;

    if (score === null) {
      setError('Please complete the quiz first.');
      return;
    }

    if (score < 4) {
      setError('You need at least 4/5 correct answers to complete this module.');
      return;
    }

    try {
      setCompleting(true);
      setError('');

      const token = await user.getIdToken();

      const response = await fetch('/api/journey/module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          moduleId: MODULE_ID,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete module');
      }

      setCompleted(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back */}
      <button
        onClick={() =>
          router.push('/dashboard/journey/daily-english')
        }
        className="flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Daily English
      </button>

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-brand-400" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">
              Reading Practice
            </h1>

            <p className="text-slate-400 mt-1">
              Improve your reading comprehension and English understanding.
            </p>

            <p className="text-brand-300 text-sm mt-2">
              +20 XP on completion
            </p>
          </div>

        </div>
      </div>

      {/* Reading Passage */}
      <div className="glass-card p-6">

        <h2 className="text-lg font-bold text-white mb-4">
          Reading Passage
        </h2>

        <div className="p-5 rounded-xl bg-white/5 border border-white/10">

          <h3 className="text-brand-300 font-semibold text-lg mb-3">
            The Importance of Communication
          </h3>

          <p className="text-slate-300 leading-7">
            Good communication is an important skill in both daily life and
            professional environments. It helps people share ideas, understand
            each other, and work together effectively.
          </p>

          <p className="text-slate-300 leading-7 mt-4">
            In the workplace, employees need to communicate clearly with
            colleagues, managers, and customers. Active listening is also
            important because it helps people understand what others are
            saying.
          </p>

          <p className="text-slate-300 leading-7 mt-4">
            Reading regularly can improve vocabulary, comprehension, and
            confidence. By practicing every day, learners can gradually
            improve their English communication skills.
          </p>

        </div>

      </div>

      {/* Questions */}
      <div className="glass-card p-6">

        <h2 className="text-lg font-bold text-white mb-6">
          Comprehension Questions
        </h2>

        <div className="space-y-8">

          {questions.map((question, questionIndex) => (
            <div key={questionIndex}>

              <h3 className="text-white font-semibold mb-4">
                {questionIndex + 1}. {question.question}
              </h3>

              <div className="space-y-3">

                {question.options.map((option, optionIndex) => {

                  const selected =
                    answers[questionIndex] === optionIndex;

                  const isCorrect =
                    score !== null &&
                    optionIndex === question.answer;

                  const isWrong =
                    score !== null &&
                    selected &&
                    optionIndex !== question.answer;

                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      onClick={() =>
                        selectAnswer(questionIndex, optionIndex)
                      }
                      disabled={score !== null || completed}
                      className={`w-full text-left p-4 rounded-xl border transition ${
                        isCorrect
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                          : isWrong
                          ? 'border-red-500/50 bg-red-500/10 text-red-300'
                          : selected
                          ? 'border-brand-500/50 bg-brand-500/10 text-white'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">

                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>

                        <span>{option}</span>

                        {isCorrect && (
                          <CheckCircle2 className="w-5 h-5 ml-auto text-emerald-400" />
                        )}

                        {isWrong && (
                          <XCircle className="w-5 h-5 ml-auto text-red-400" />
                        )}

                      </div>
                    </button>
                  );
                })}

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Check Score */}
      {score === null && !completed && (
        <button
          onClick={checkAnswers}
          disabled={answers.length !== questions.length}
          className="btn-primary w-full py-3 disabled:opacity-50"
        >
          Check My Answers
        </button>
      )}

      {/* Score */}
      {score !== null && !completed && (
        <div
          className={`glass-card p-6 text-center border ${
            score >= 4
              ? 'border-emerald-500/30'
              : 'border-red-500/30'
          }`}
        >

          {score >= 4 ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />

              <h2 className="text-xl font-bold text-emerald-400">
                Excellent Work! 🎉
              </h2>

              <p className="text-slate-300 mt-2">
                You scored <strong>{score}/5</strong>.
              </p>

              <p className="text-slate-400 text-sm mt-1">
                You passed the Reading Practice module.
              </p>

              <button
                onClick={completeModule}
                disabled={completing}
                className="btn-primary w-full mt-5 py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {completing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    Complete Module & Earn 20 XP
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />

              <h2 className="text-xl font-bold text-red-400">
                Keep Practicing
              </h2>

              <p className="text-slate-300 mt-2">
                You scored <strong>{score}/5</strong>.
              </p>

              <p className="text-slate-400 text-sm mt-2">
                You need at least 4 correct answers to pass.
              </p>

              <button
                onClick={() => {
                  setAnswers([]);
                  setScore(null);
                  setError('');
                }}
                className="btn-primary mt-5 px-6 py-2.5"
              >
                Try Again
              </button>
            </>
          )}

        </div>
      )}

      {/* Completed */}
      {completed && (
        <div className="glass-card p-6 text-center border border-emerald-500/30">

          <Award className="w-12 h-12 text-emerald-400 mx-auto mb-3" />

          <h2 className="text-xl font-bold text-emerald-400">
            Module Completed! 🎉
          </h2>

          <p className="text-slate-300 mt-2">
            You earned +20 XP.
          </p>

          <button
            onClick={() =>
              router.push('/dashboard/journey/daily-english')
            }
            className="btn-primary mt-5 px-6 py-2.5"
          >
            Back to Daily English
          </button>

        </div>
      )}

    </div>
  );
}