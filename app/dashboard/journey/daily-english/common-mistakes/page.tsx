'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Award,
  RotateCcw,
  Loader2,
  BookOpen,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULE_ID = 'common-mistakes';
const XP_REWARD = 20;
const PASSING_SCORE = 4;

const lessons = [
  {
    title: 'Subject–Verb Agreement',
    wrong: 'He go to college every day.',
    correct: 'He goes to college every day.',
    explanation:
      'With he, she, or it, we normally add -s or -es to the verb in the present tense.',
  },
  {
    title: 'Using the Correct Tense',
    wrong: 'I am working here since 2024.',
    correct: 'I have been working here since 2024.',
    explanation:
      'For an action that started in the past and is still continuing, present perfect continuous is commonly used.',
  },
  {
    title: 'Articles',
    wrong: 'I am engineer.',
    correct: 'I am an engineer.',
    explanation:
      'We use "an" before a word beginning with a vowel sound, such as "engineer".',
  },
  {
    title: 'Prepositions',
    wrong: 'I am good in programming.',
    correct: 'I am good at programming.',
    explanation:
      'The natural expression is "good at" when talking about a skill or ability.',
  },
  {
    title: 'Professional Communication',
    wrong: 'I didn’t understood the question.',
    correct: 'I didn’t understand the question.',
    explanation:
      'After "did" or "didn’t", use the base form of the verb: understand, not understood.',
  },
];

const questions = [
  {
    question: 'Choose the correct sentence.',
    options: [
      'He don’t like coding.',
      'He doesn’t like coding.',
      'He doesn’t likes coding.',
      'He not like coding.',
    ],
    answer: 1,
    explanation:
      'The correct sentence is "He doesn’t like coding." After "doesn’t", use the base form "like".',
  },
  {
    question: 'Choose the correct sentence.',
    options: [
      'I am working here since 2024.',
      'I working here since 2024.',
      'I have been working here since 2024.',
      'I has been working here since 2024.',
    ],
    answer: 2,
    explanation:
      '"I have been working here since 2024" correctly describes an action that started in the past and continues now.',
  },
  {
    question: 'Choose the correct sentence.',
    options: [
      'I am engineer.',
      'I am a engineer.',
      'I am an engineer.',
      'I am the engineer always.',
    ],
    answer: 2,
    explanation:
      '"Engineer" begins with a vowel sound, so we use "an": "I am an engineer."',
  },
  {
    question: 'Choose the correct sentence.',
    options: [
      'I am good in programming.',
      'I am good at programming.',
      'I am good on programming.',
      'I am good with programming skills are.',
    ],
    answer: 1,
    explanation:
      'The correct expression is "good at" when describing a skill.',
  },
  {
    question: 'Choose the correct sentence.',
    options: [
      'I didn’t understood the question.',
      'I didn’t understanding the question.',
      'I didn’t understand the question.',
      'I didn’t understands the question.',
    ],
    answer: 2,
    explanation:
      'After "didn’t", always use the base form of the verb: "understand".',
  },
];

export default function CommonMistakesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const response = await fetch(
          `/api/journey/module?moduleId=${MODULE_ID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load module progress');
        }

        const data = await response.json();

        setCompleted(data.completed === true);
      } catch (error) {
        console.error(error);
        setError('Failed to load module progress.');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user]);

  const selectAnswer = (index: number) => {
    if (answered) return;

    setSelectedAnswer(index);
    setAnswered(true);

    if (index === questions[currentQuestion].answer) {
      setScore((previousScore) => previousScore + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      setQuizFinished(true);
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswered(false);
    setQuizFinished(false);
    setError('');
  };

  const completeModule = async () => {
    try {
      if (!user) {
        setError('Please sign in first.');
        return;
      }

      if (completed || completing) return;

      if (score < PASSING_SCORE) {
        setError(
          `You need at least ${PASSING_SCORE}/${questions.length} to complete this module.`
        );
        return;
      }

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
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

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

          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-orange-400" />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">
              Common Mistakes
            </h1>

            <p className="text-slate-400 mt-1">
              Learn and avoid common English mistakes in daily and
              professional communication.
            </p>

            <p className="text-brand-300 text-sm mt-2">
              +20 XP on completion
            </p>
          </div>

        </div>
      </div>

      {/* Learning Content */}
      {!quizFinished && (
        <div className="glass-card p-6">

          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-5 h-5 text-brand-400" />

            <h2 className="text-lg font-bold text-white">
              Learning Content
            </h2>
          </div>

          <div className="space-y-4">

            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-white/10 bg-white/5"
              >
                <h3 className="font-semibold text-brand-300 mb-3">
                  {index + 1}. {lesson.title}
                </h3>

                <div className="space-y-2 text-sm">

                  <div>
                    <span className="text-red-400 font-semibold">
                      ❌ Wrong:
                    </span>

                    <span className="text-slate-300 ml-2">
                      {lesson.wrong}
                    </span>
                  </div>

                  <div>
                    <span className="text-emerald-400 font-semibold">
                      ✅ Correct:
                    </span>

                    <span className="text-slate-300 ml-2">
                      {lesson.correct}
                    </span>
                  </div>

                  <p className="text-slate-400 mt-2 leading-relaxed">
                    {lesson.explanation}
                  </p>

                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Quiz */}
      {!quizFinished && (
        <div className="glass-card p-6">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-lg font-bold text-white">
                Quick Quiz
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20">
              <span className="text-brand-300 text-sm font-semibold">
                Score: {score}/{questions.length}
              </span>
            </div>

          </div>

          {/* Progress */}
          <div className="w-full h-2 rounded-full bg-slate-800 mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestion + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>

          {/* Question */}
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">

            <h3 className="text-lg font-semibold text-white mb-5">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-3">

              {questions[currentQuestion].options.map(
                (option, index) => {

                  const isCorrect =
                    index === questions[currentQuestion].answer;

                  const isSelected =
                    selectedAnswer === index;

                  let optionClass =
                    'border-white/10 bg-white/5 hover:bg-white/10';

                  if (answered && isCorrect) {
                    optionClass =
                      'border-emerald-500/50 bg-emerald-500/10';
                  } else if (
                    answered &&
                    isSelected &&
                    !isCorrect
                  ) {
                    optionClass =
                      'border-red-500/50 bg-red-500/10';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      disabled={answered}
                      className={`w-full text-left p-4 rounded-xl border transition ${optionClass}`}
                    >
                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-slate-300">
                          {String.fromCharCode(65 + index)}
                        </div>

                        <span className="text-slate-200">
                          {option}
                        </span>

                        {answered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                        )}

                        {answered &&
                          isSelected &&
                          !isCorrect && (
                            <AlertCircle className="w-5 h-5 text-red-400 ml-auto" />
                          )}

                      </div>
                    </button>
                  );
                }
              )}

            </div>

            {/* Explanation */}
            {answered && (
              <div className="mt-5 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">

                <p className="text-brand-300 font-semibold mb-1">
                  Explanation
                </p>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {questions[currentQuestion].explanation}
                </p>

              </div>
            )}

          </div>

          {/* Next */}
          {answered && (
            <button
              onClick={nextQuestion}
              className="btn-primary w-full py-3 mt-5"
            >
              {currentQuestion === questions.length - 1
                ? 'View Result'
                : 'Next Question'}
            </button>
          )}

        </div>
      )}

      {/* Quiz Result */}
      {quizFinished && !completed && (
        <div className="glass-card p-8 text-center">

          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-brand-400" />
          </div>

          <h2 className="text-2xl font-black text-white">
            Quiz Completed!
          </h2>

          <p className="text-slate-400 mt-2">
            Your score
          </p>

          <div className="text-5xl font-black text-brand-400 mt-3">
            {score}/{questions.length}
          </div>

          {score >= PASSING_SCORE ? (
            <>
              <div className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-emerald-400 font-semibold">
                  🎉 Excellent! You passed the module.
                </p>

                <p className="text-slate-300 text-sm mt-1">
                  You need at least {PASSING_SCORE}/
                  {questions.length} to pass.
                </p>
              </div>

              <button
                onClick={completeModule}
                disabled={completing}
                className="btn-primary w-full py-3 mt-5 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {completing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Complete Module & Earn 20 XP
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 font-semibold">
                  You need at least {PASSING_SCORE}/
                  {questions.length} to pass.
                </p>

                <p className="text-slate-300 text-sm mt-1">
                  Review the lessons and try the quiz again.
                </p>
              </div>

              <button
                onClick={retryQuiz}
                className="btn-primary w-full py-3 mt-5 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
            </>
          )}

        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Completed */}
      {completed && (
        <div className="glass-card p-8 text-center border border-emerald-500/30">

          <Award className="w-12 h-12 text-emerald-400 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-emerald-400">
            Module Completed! 🎉
          </h2>

          <p className="text-slate-300 mt-2">
            You earned +20 XP.
          </p>

          <p className="text-slate-400 text-sm mt-2">
            Reading Practice is now unlocked.
          </p>

          <button
            onClick={() =>
              router.push('/dashboard/journey/daily-english')
            }
            className="btn-primary mt-6 px-6 py-3 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Daily English
          </button>

        </div>
      )}

    </div>
  );
}