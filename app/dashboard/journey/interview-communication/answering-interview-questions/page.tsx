'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  Trophy,
  MessageCircle,
  Lightbulb,
  Target,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULE_ID = 'answering-interview-questions';
const XP_REWARD = 20;
const PASS_SCORE = 4;

const questions = [
  {
    question:
      'An interviewer asks: "Tell me about yourself." What is the best approach?',
    options: [
      'Talk about your entire personal life.',
      'Give a short professional introduction covering your education, skills, and relevant experience.',
      'Say only your name.',
      'Talk about your salary expectations.',
    ],
    correctAnswer: 1,
    explanation:
      'A good self-introduction should be concise and focus on your education, skills, experience, and career goals.',
  },
  {
    question:
      'What should you do if you do not understand an interview question?',
    options: [
      'Guess the answer immediately.',
      'Remain silent.',
      'Politely ask the interviewer to clarify the question.',
      'Change the topic.',
    ],
    correctAnswer: 2,
    explanation:
      'Asking for clarification professionally shows that you want to understand the question before answering.',
  },
  {
    question:
      'What is the best way to answer a technical question?',
    options: [
      'Give a random answer quickly.',
      'Explain your understanding clearly and provide an example when appropriate.',
      'Say that you know everything.',
      'Avoid answering the question.',
    ],
    correctAnswer: 1,
    explanation:
      'A structured explanation with a relevant example demonstrates both knowledge and communication skills.',
  },
  {
    question:
      'An interviewer asks: "Why should we hire you?" What is the best response?',
    options: [
      'Because I need a job.',
      'Because I am better than everyone else.',
      'Explain your relevant skills, strengths, and how you can contribute to the company.',
      'Because my friends recommended me.',
    ],
    correctAnswer: 2,
    explanation:
      'Connect your skills and strengths with the requirements of the role and explain the value you can bring.',
  },
  {
    question:
      'What should you do when you need a few seconds to think about an answer?',
    options: [
      'Immediately say "I dont know."',
      'Stay silent for a long time.',
      'Take a brief moment and organize your thoughts before answering.',
      'Change the subject.',
    ],
    correctAnswer: 2,
    explanation:
      'Taking a short pause is completely acceptable. It helps you give a thoughtful and organized answer.',
  },
];

export default function AnsweringInterviewQuestionsPage() {
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
        throw new Error('Failed to load module progress');
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

      // Update XP immediately in the UI
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
              Answering Interview Questions Completed!
            </h1>

            <p className="text-muted-foreground mb-6">
              Excellent work! You completed the
              second Interview Communication module.
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
                STAR Method & Behavioral is now
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
     MAIN MODULE
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
                MODULE 2
              </p>

              <h1 className="text-3xl font-bold">
                Answering Interview Questions
              </h1>

            </div>

          </div>

          <p className="text-muted-foreground">
            Learn how to understand interview
            questions, organize your thoughts, and
            give clear and professional answers.
          </p>

        </div>

        {/* LESSON */}

        <div className="glass-card p-8 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <Lightbulb
              className="text-yellow-400"
              size={24}
            />

            <h2 className="text-xl font-bold">
              How to Answer Interview Questions
            </h2>

          </div>

          <div className="space-y-5">

            <div>

              <h3 className="font-semibold mb-2">
                1. Listen Carefully
              </h3>

              <p className="text-muted-foreground text-sm">
                Listen to the complete question before
                starting your answer. Do not interrupt
                the interviewer.
              </p>

            </div>

            <div>

              <h3 className="font-semibold mb-2">
                2. Understand the Question
              </h3>

              <p className="text-muted-foreground text-sm">
                Identify what the interviewer is really
                asking. If the question is unclear,
                politely ask for clarification.
              </p>

            </div>

            <div>

              <h3 className="font-semibold mb-2">
                3. Organize Your Answer
              </h3>

              <p className="text-muted-foreground text-sm">
                Take a short moment to organize your
                thoughts. Give your answer in a logical
                order.
              </p>

            </div>

            <div>

              <h3 className="font-semibold mb-2">
                4. Give Relevant Examples
              </h3>

              <p className="text-muted-foreground text-sm">
                When appropriate, support your answer
                with a real project, internship,
                academic experience, or practical
                example.
              </p>

            </div>

            <div>

              <h3 className="font-semibold mb-2">
                5. Keep It Clear and Concise
              </h3>

              <p className="text-muted-foreground text-sm">
                Avoid unnecessarily long answers. Focus
                on the information that is relevant to
                the question.
              </p>

            </div>

          </div>

        </div>

        {/* QUICK TIPS */}

        <div className="glass-card p-8 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <Target
              className="text-primary"
              size={24}
            />

            <h2 className="text-xl font-bold">
              Quick Interview Tips
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Maintain eye contact
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Speak clearly
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Avoid memorized answers
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Use examples
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Stay positive
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-semibold">
                ✓ Be honest
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
                  Excellent! You passed the
                  Answering Interview Questions quiz.
                </p>
              ) : (
                <p className="text-red-400">
                  You need at least 4/5 to complete
                  this module. Try again.
                </p>
              )}

            </div>
          )}

          {/* BUTTONS */}

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
          Complete this module to unlock STAR
          Method & Behavioral.
        </div>

      </div>

    </div>
  );
}