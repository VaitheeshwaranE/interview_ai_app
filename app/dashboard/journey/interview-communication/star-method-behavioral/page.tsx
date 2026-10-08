'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  Trophy,
  Target,
  Lightbulb,
  RotateCcw,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULE_ID = 'star-method-behavioral';
const XP_REWARD = 20;
const PASS_SCORE = 4;

const questions = [
  {
    question:
      'What does the "S" in the STAR method stand for?',
    options: [
      'Solution',
      'Situation',
      'Strength',
      'Strategy',
    ],
    correctAnswer: 1,
    explanation:
      'S stands for Situation. Explain the background or context of the situation you faced.',
  },
  {
    question:
      'What should you explain in the "Task" part of a STAR answer?',
    options: [
      'The final result only',
      'What your responsibility or objective was',
      'Your personal hobbies',
      'What the interviewer should do',
    ],
    correctAnswer: 1,
    explanation:
      'Task explains what you were responsible for or what you needed to accomplish.',
  },
  {
    question:
      'What is the main purpose of the "Action" part?',
    options: [
      'Explain what you personally did to handle the situation',
      'Describe what your manager did',
      'Talk about the company history',
      'Mention only the problem',
    ],
    correctAnswer: 0,
    explanation:
      'Action focuses on the specific steps you personally took to solve the problem or complete the task.',
  },
  {
    question:
      'What should you include in the "Result" part?',
    options: [
      'Only the difficulties you faced',
      'Your educational qualification',
      'The outcome or impact of your actions',
      'Your future career plans',
    ],
    correctAnswer: 2,
    explanation:
      'Result explains what happened because of your actions and, when possible, includes a measurable or positive outcome.',
  },
  {
    question:
      'Which is the best STAR answer for: "Tell me about a time you solved a difficult problem."?',
    options: [
      'I am a good problem solver.',
      'I have solved many problems.',
      'I explain the situation, my responsibility, the actions I took, and the final result.',
      'I usually ask someone else to solve difficult problems.',
    ],
    correctAnswer: 2,
    explanation:
      'A strong behavioral answer follows the complete STAR structure: Situation, Task, Action, and Result.',
  },
];

export default function StarMethodBehavioralPage() {
  const router = useRouter();

  const {
    user,
    refreshProfile,
    loading: authLoading,
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] =
    useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    checkModuleProgress();
  }, [user, authLoading]);

  const checkModuleProgress = async () => {
    try {
      if (!user) return;

      const token = await user.getIdToken();

      const response = await fetch(
        `/api/journey/module?moduleId=${MODULE_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to load module progress'
        );
      }

      const data = await response.json();

      const moduleProgress =
        data.progress?.find(
          (item: any) =>
            item.moduleId === MODULE_ID &&
            item.completed
        );

      if (moduleProgress) {
        setCompleted(true);
      }
    } catch (err) {
      console.error(
        'Error checking module progress:',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (
    questionIndex: number,
    answerIndex: number
  ) => {
    if (submitted || completed) return;

    setSelectedAnswers((previous) => ({
      ...previous,
      [questionIndex]: answerIndex,
    }));
  };

  const checkAnswers = () => {
    if (
      Object.keys(selectedAnswers).length !==
      questions.length
    ) {
      setError(
        'Please answer all 5 questions before checking your answers.'
      );
      return;
    }

    setError('');

    let correct = 0;

    questions.forEach((question, index) => {
      if (
        selectedAnswers[index] ===
        question.correctAnswer
      ) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);
  };

  const retryQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setError('');
  };

  const completeModule = async () => {
    if (score < PASS_SCORE) return;

    if (!user) {
      setError('You are not logged in.');
      return;
    }

    try {
      setCompleting(true);
      setError('');

      const token = await user.getIdToken();

      const response = await fetch(
        '/api/journey/module',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            moduleId: MODULE_ID,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to complete module'
        );
      }

      // Immediately update XP in AuthContext
      await refreshProfile();

      setCompleted(true);
    } catch (err: any) {
      console.error(
        'Error completing module:',
        err
      );

      setError(
        err.message || 'Failed to complete module'
      );
    } finally {
      setCompleting(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />

          <p className="text-muted-foreground">
            Loading module...
          </p>

        </div>
      </div>
    );
  }

  /* =========================
     COMPLETED SCREEN
  ========================= */

  if (completed) {
    return (
      <div className="min-h-screen px-4 py-10">

        <div className="max-w-3xl mx-auto">

          <button
            onClick={() =>
              router.push(
                '/dashboard/journey/interview-communication'
              )
            }
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft size={20} />

            Back to Interview Communication
          </button>

          <div className="glass-card p-10 text-center">

            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">

              <Trophy
                size={34}
                className="text-green-500"
              />

            </div>

            <h1 className="text-3xl font-bold mb-3">
              STAR Method & Behavioral Completed!
            </h1>

            <p className="text-muted-foreground mb-6">
              Excellent work! You completed the
              third Interview Communication module.
            </p>

            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/10 text-primary font-semibold mb-8">

              <Trophy size={20} />

              +20 XP Earned

            </div>

            <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/20 mb-8">

              <div className="flex items-center justify-center gap-2 text-green-500 font-semibold mb-2">

                <CheckCircle size={20} />

                Module Completed

              </div>

              <p className="text-sm text-muted-foreground">
                Handling Difficult Questions is now
                unlocked.
              </p>

            </div>

            <button
              onClick={() =>
                router.push(
                  '/dashboard/journey/interview-communication'
                )
              }
              className="btn-primary px-8 py-3"
            >
              Back to Interview Communication
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =========================
     MAIN PAGE
  ========================= */

  return (
    <div className="min-h-screen px-4 py-8">

      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}

        <button
          onClick={() =>
            router.push(
              '/dashboard/journey/interview-communication'
            )
          }
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={20} />

          Back to Interview Communication
        </button>

        {/* HEADER */}

        <div className="glass-card p-8 mb-6">

          <div className="flex items-center gap-3 mb-4">

            <div className="p-3 rounded-xl bg-primary/10">

              <MessageCircle
                className="w-7 h-7 text-primary"
              />

            </div>

            <div>

              <p className="text-sm text-primary font-semibold">
                MODULE 3
              </p>

              <h1 className="text-3xl font-bold">
                STAR Method & Behavioral
              </h1>

            </div>

          </div>

          <p className="text-muted-foreground">
            Learn how to answer behavioral interview
            questions using the STAR method and
            communicate your experiences clearly.
          </p>

        </div>

        {/* STAR LESSON */}

        <div className="glass-card p-8 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <Lightbulb
              className="text-yellow-400"
              size={24}
            />

            <h2 className="text-xl font-bold">
              What is the STAR Method?
            </h2>

          </div>

          <p className="text-muted-foreground text-sm mb-6">
            The STAR method is a structured way to
            answer behavioral interview questions.
            It helps you explain your experience in a
            clear and organized way.
          </p>

          <div className="space-y-4">

            {/* S */}

            <div className="p-5 rounded-xl border border-border">

              <div className="flex items-center gap-3 mb-2">

                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  S
                </div>

                <h3 className="font-bold">
                  Situation
                </h3>

              </div>

              <p className="text-sm text-muted-foreground">
                Describe the situation or background.
                Explain what was happening and provide
                enough context for the interviewer.
              </p>

            </div>

            {/* T */}

            <div className="p-5 rounded-xl border border-border">

              <div className="flex items-center gap-3 mb-2">

                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  T
                </div>

                <h3 className="font-bold">
                  Task
                </h3>

              </div>

              <p className="text-sm text-muted-foreground">
                Explain your responsibility or objective.
                What were you expected to accomplish?
              </p>

            </div>

            {/* A */}

            <div className="p-5 rounded-xl border border-border">

              <div className="flex items-center gap-3 mb-2">

                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  A
                </div>

                <h3 className="font-bold">
                  Action
                </h3>

              </div>

              <p className="text-sm text-muted-foreground">
                Explain the specific actions you took.
                Focus on what <strong>you</strong> did,
                rather than only describing what your
                team did.
              </p>

            </div>

            {/* R */}

            <div className="p-5 rounded-xl border border-border">

              <div className="flex items-center gap-3 mb-2">

                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  R
                </div>

                <h3 className="font-bold">
                  Result
                </h3>

              </div>

              <p className="text-sm text-muted-foreground">
                Explain the final outcome. Mention
                improvements, achievements, measurable
                results, or what you learned.
              </p>

            </div>

          </div>

        </div>

        {/* EXAMPLE */}

        <div className="glass-card p-8 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <Target
              className="text-primary"
              size={24}
            />

            <h2 className="text-xl font-bold">
              Example STAR Answer
            </h2>

          </div>

          <div className="space-y-4">

            <div>
              <h3 className="font-semibold text-primary">
                Question
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                "Tell me about a time you faced a
                difficult problem."
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Situation
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                During a college project, our team
                faced an unexpected technical issue
                shortly before the demonstration.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Task
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                I was responsible for identifying the
                issue and helping the team prepare the
                project for the demonstration.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Action
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                I analyzed the error, discussed possible
                solutions with my teammates, tested the
                changes, and implemented the most
                reliable solution.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Result
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                We successfully fixed the issue and
                completed the demonstration on time. I
                also learned the importance of systematic
                debugging and teamwork.
              </p>
            </div>

          </div>

        </div>

        {/* QUICK TIPS */}

        <div className="glass-card p-8 mb-6">

          <h2 className="text-xl font-bold mb-5">
            STAR Interview Tips
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Keep your answer structured
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Focus on your actions
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Use real examples
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Mention measurable results
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Keep answers concise
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Be honest about your experience
              </p>
            </div>

          </div>

        </div>

        {/* QUIZ */}

        <div className="glass-card p-8">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold">
                Quick Practice
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Answer all 5 questions.
              </p>

            </div>

            <div className="text-sm text-primary font-semibold">
              {Object.keys(selectedAnswers).length}/5
            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* QUESTIONS */}

          <div className="space-y-8">

            {questions.map(
              (question, questionIndex) => {

                const selected =
                  selectedAnswers[
                    questionIndex
                  ];

                return (
                  <div
                    key={questionIndex}
                    className="space-y-3"
                  >

                    <h3 className="font-semibold">
                      {questionIndex + 1}.{' '}
                      {question.question}
                    </h3>

                    <div className="space-y-3">

                      {question.options.map(
                        (option, optionIndex) => {

                          const isSelected =
                            selected ===
                            optionIndex;

                          const isCorrect =
                            submitted &&
                            optionIndex ===
                              question.correctAnswer;

                          const isWrong =
                            submitted &&
                            isSelected &&
                            optionIndex !==
                              question.correctAnswer;

                          return (
                            <button
                              key={optionIndex}
                              type="button"
                              disabled={submitted}
                              onClick={() =>
                                handleAnswerSelect(
                                  questionIndex,
                                  optionIndex
                                )
                              }
                              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                                isCorrect
                                  ? 'border-green-500 bg-green-500/10'
                                  : isWrong
                                  ? 'border-red-500 bg-red-500/10'
                                  : isSelected
                                  ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
                              }`}
                            >

                              <span
                                className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 text-sm font-semibold ${
                                  isCorrect
                                    ? 'border-green-500 text-green-500'
                                    : isWrong
                                    ? 'border-red-500 text-red-500'
                                    : isSelected
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-muted-foreground/30'
                                }`}
                              >
                                {String.fromCharCode(
                                  65 + optionIndex
                                )}
                              </span>

                              <span className="text-sm pt-1">
                                {option}
                              </span>

                              {isCorrect && (
                                <CheckCircle
                                  size={18}
                                  className="ml-auto text-green-500 flex-shrink-0"
                                />
                              )}

                            </button>
                          );
                        }
                      )}

                    </div>

                    {submitted && (
                      <div className="p-4 rounded-xl bg-muted/30 text-sm">

                        <span className="font-semibold">
                          Explanation:
                        </span>{' '}

                        <span className="text-muted-foreground">
                          {question.explanation}
                        </span>

                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>

          {/* RESULT */}

          {submitted && (
            <div
              className={`mt-8 p-6 rounded-xl text-center border ${
                score >= PASS_SCORE
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-red-500/30 bg-red-500/5'
              }`}
            >

              {score >= PASS_SCORE ? (
                <CheckCircle
                  size={42}
                  className="mx-auto mb-3 text-green-500"
                />
              ) : (
                <RotateCcw
                  size={42}
                  className="mx-auto mb-3 text-red-400"
                />
              )}

              <h3 className="text-2xl font-bold mb-2">
                {score}/5 Correct
              </h3>

              {score >= PASS_SCORE ? (
                <p className="text-green-500">
                  Excellent! You passed the STAR
                  Method & Behavioral quiz.
                </p>
              ) : (
                <p className="text-red-400">
                  You need at least 4/5 to complete
                  this module. Try again.
                </p>
              )}

            </div>
          )}

          {/* ACTION BUTTON */}

          <div className="mt-8">

            {!submitted ? (
              <button
                type="button"
                onClick={checkAnswers}
                className="w-full btn-primary py-4"
              >
                Check Answers
              </button>
            ) : score >= PASS_SCORE ? (
              <button
                type="button"
                onClick={completeModule}
                disabled={completing}
                className="w-full btn-primary py-4 disabled:opacity-50"
              >
                {completing
                  ? 'Completing...'
                  : 'Complete Module +20 XP'}
              </button>
            ) : (
              <button
                type="button"
                onClick={retryQuiz}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />

                Retry Quiz
              </button>
            )}

          </div>

        </div>

        {/* BOTTOM */}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Complete this module to unlock Handling
          Difficult Questions.
        </div>

      </div>

    </div>
  );
}