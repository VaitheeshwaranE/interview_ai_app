'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mic,
  CheckCircle,
  XCircle,
  Trophy,
  MessageSquare,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULE_ID = 'speaking-practice';
const XP_REWARD = 20;

const questions = [
  {
    question:
      'An interviewer says: "Tell me about yourself." Which is the best response?',
    options: [
      'I am a student. That is all.',
      'I am an engineering student with experience in programming and projects. I enjoy solving problems and learning new technologies.',
      'I do not know what to say.',
      'Can we skip this question?',
    ],
    answer: 1,
    explanation:
      'A good self-introduction should briefly mention your education, skills, experience, and interests.',
  },
  {
    question:
      'You do not understand an interviewer’s question. What should you say?',
    options: [
      'What are you saying?',
      'I do not understand anything.',
      'Could you please clarify the question?',
      'Ask someone else.',
    ],
    answer: 2,
    explanation:
      'Asking politely for clarification shows professionalism and confidence.',
  },
  {
    question:
      'You disagree with someone during a discussion. Which response is best?',
    options: [
      'You are completely wrong.',
      'I disagree with you.',
      'I understand your point, but I have a different perspective.',
      'That makes no sense.',
    ],
    answer: 2,
    explanation:
      'Professional disagreement should respect the other person while clearly presenting your own view.',
  },
  {
    question:
      'An interviewer asks: "What is your strength?" Which is the best response?',
    options: [
      'I have no weaknesses.',
      'I am good at problem-solving and I always try to learn from challenges.',
      'Everything is my strength.',
      'My friends say I am strong.',
    ],
    answer: 1,
    explanation:
      'Give a specific strength and briefly explain how you demonstrate it.',
  },
  {
    question:
      'An interviewer asks: "Tell me about a challenge you faced." What is the best approach?',
    options: [
      'I have never faced any challenge.',
      'I cannot remember.',
      'Describe the challenge, explain what you did, and mention the result.',
      'Talk negatively about your teammates.',
    ],
    answer: 2,
    explanation:
      'A strong answer explains the situation, your action, and the positive result or lesson learned.',
  },
];

const speakingTips = [
  'Speak clearly and avoid speaking too fast.',
  'Maintain a confident and natural tone.',
  'Use complete sentences.',
  'Pause briefly when you need to think.',
  'Avoid unnecessary filler words such as "um", "uh", and "like".',
];

export default function SpeakingPracticePage() {
  const router = useRouter();

  const {
    user,
    refreshProfile,
    loading: authLoading,
  } = useAuth();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    checkCompletion();
  }, [user, authLoading]);

  const checkCompletion = async () => {
    try {
      const token = await user?.getIdToken();

      if (!token) return;

      const response = await fetch(
        `/api/journey/module?moduleId=${MODULE_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      );

      if (response.ok) {
        const data = await response.json();

        const moduleProgress = data.progress?.find(
          (item: any) => item.moduleId === MODULE_ID
        );

        if (moduleProgress?.completed) {
          setCompleted(true);
        }
      }
    } catch (error) {
      console.error(
        'Error checking module completion:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (
    questionIndex: number,
    answerIndex: number
  ) => {
    if (submitted) return;

    setSelectedAnswers((previous) => {
      const updated = [...previous];
      updated[questionIndex] = answerIndex;
      return updated;
    });
  };

  const submitQuiz = () => {
    if (selectedAnswers.length !== questions.length) {
      alert(
        'Please answer all 5 questions before submitting.'
      );
      return;
    }

    let correct = 0;

    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);
  };

  const retryQuiz = () => {
    setSelectedAnswers([]);
    setSubmitted(false);
    setScore(0);
  };

  const completeModule = async () => {
    if (score < 4) return;

    if (!user) {
      alert('Please login again.');
      return;
    }

    setSubmitting(true);

    try {
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
        throw new Error(
          data.error || 'Failed to complete module'
        );
      }

      // Immediately update XP in the UI
      await refreshProfile();

      setCompleted(true);
    } catch (error) {
      console.error(
        'Error completing module:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />

          <p className="text-muted-foreground">
            Loading Speaking Practice...
          </p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto">

          <button
            onClick={() =>
              router.push(
                '/dashboard/journey/daily-english'
              )
            }
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft size={20} />
            Back to Daily English
          </button>

          <div className="glass-card p-8 text-center">

            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <Trophy
                className="w-10 h-10 text-green-500"
              />
            </div>

            <h1 className="text-3xl font-bold mb-3">
              Speaking Practice Completed!
            </h1>

            <p className="text-muted-foreground mb-6">
              Excellent work! You completed the final
              Daily English module.
            </p>

            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/10 text-primary font-semibold mb-8">
              <Trophy size={20} />
              +{XP_REWARD} XP Earned
            </div>

            <div className="p-5 rounded-xl bg-muted/40 mb-8">

              <div className="flex items-center justify-center gap-3 mb-2">
                <CheckCircle
                  className="text-green-500"
                  size={24}
                />

                <span className="font-semibold">
                  Daily English Complete
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                You have completed all 5 Daily English
                modules.
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  '/dashboard/journey/daily-english'
                )
              }
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Back to Daily English
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">

      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() =>
            router.push(
              '/dashboard/journey/daily-english'
            )
          }
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={20} />
          Back to Daily English
        </button>

        {/* Header */}
        <div className="glass-card p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="p-3 rounded-xl bg-primary/10">
                  <Mic
                    className="w-7 h-7 text-primary"
                  />
                </div>

                <span className="text-sm font-medium text-primary">
                  DAILY ENGLISH • MODULE 5
                </span>

              </div>

              <h1 className="text-3xl font-bold mb-2">
                Speaking Practice
              </h1>

              <p className="text-muted-foreground">
                Build confidence and communicate
                professionally in interviews and everyday
                situations.
              </p>

            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold">
              <Trophy size={20} />
              +{XP_REWARD} XP
            </div>

          </div>
        </div>

        {/* Speaking Lesson */}
        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">
            <MessageSquare
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              How to Speak Professionally
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="p-5 rounded-xl bg-muted/40">

              <h3 className="font-semibold mb-3">
                Interview Introduction
              </h3>

              <p className="text-muted-foreground text-sm leading-6">
                “Good morning. My name is Vaitheeshwaran.
                I am an engineering student with a strong
                interest in technology and software
                development. I enjoy solving problems,
                learning new technologies, and working on
                real-world projects.”
              </p>

            </div>

            <div className="p-5 rounded-xl bg-muted/40">

              <h3 className="font-semibold mb-3">
                Useful Professional Sentences
              </h3>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • “Could you please clarify the question?”
                </li>

                <li>
                  • “In my opinion...”
                </li>

                <li>
                  • “I understand your point, however...”
                </li>

                <li>
                  • “One of my strengths is...”
                </li>

                <li>
                  • “The main challenge was..., and I solved
                  it by...”
                </li>
              </ul>

            </div>

          </div>

          {/* Tips */}
          <div className="mt-6 p-5 rounded-xl border border-primary/20 bg-primary/5">

            <div className="flex items-center gap-2 mb-4">

              <Lightbulb
                className="text-primary"
                size={20}
              />

              <h3 className="font-semibold">
                Speaking Tips
              </h3>

            </div>

            <div className="grid md:grid-cols-2 gap-3">

              {speakingTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle
                    size={17}
                    className="text-green-500 mt-0.5 flex-shrink-0"
                  />

                  <span>{tip}</span>
                </div>
              ))}

            </div>

          </div>
        </div>

        {/* Quiz */}
        <div className="glass-card p-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold">
                Speaking Situations
              </h2>

              <p className="text-muted-foreground mt-1">
                Choose the most professional response.
              </p>

            </div>

            <div className="text-sm font-medium">
              {selectedAnswers.length}/{questions.length}
            </div>

          </div>

          <div className="space-y-8">

            {questions.map(
              (question, questionIndex) => {

                const selected =
                  selectedAnswers[questionIndex];

                return (
                  <div
                    key={questionIndex}
                    className="border-b border-border pb-8 last:border-b-0"
                  >

                    <h3 className="font-semibold text-lg mb-4">
                      {questionIndex + 1}.{' '}
                      {question.question}
                    </h3>

                    <div className="space-y-3">

                      {question.options.map(
                        (option, optionIndex) => {

                          const isSelected =
                            selected === optionIndex;

                          const isCorrect =
                            submitted &&
                            optionIndex ===
                              question.answer;

                          const isWrong =
                            submitted &&
                            isSelected &&
                            optionIndex !==
                              question.answer;

                          /*
                           * Selected answer:
                           * Purple background + border + ring
                           */
                          let optionClass =
                            'border-border hover:border-indigo-500/70 hover:bg-indigo-500/5';

                          if (
                            isSelected &&
                            !submitted
                          ) {
                            optionClass =
                              'border-indigo-500 bg-indigo-500/20 ring-2 ring-indigo-500/40 shadow-lg';
                          }

                          /*
                           * Correct answer after submission
                           */
                          if (isCorrect) {
                            optionClass =
                              'border-green-500 bg-green-500/20 ring-2 ring-green-500/30';
                          }

                          /*
                           * Wrong selected answer after submission
                           */
                          if (isWrong) {
                            optionClass =
                              'border-red-500 bg-red-500/20 ring-2 ring-red-500/30';
                          }

                          return (
                            <button
                              key={optionIndex}
                              onClick={() =>
                                selectAnswer(
                                  questionIndex,
                                  optionIndex
                                )
                              }
                              disabled={submitted}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${optionClass}`}
                            >

                              <div className="flex items-start gap-3">

                                {/* A / B / C / D circle */}
                                <div
                                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-medium flex-shrink-0 transition-all ${
                                    isSelected &&
                                    !submitted
                                      ? 'border-indigo-500 bg-indigo-500 text-white'
                                      : isCorrect
                                      ? 'border-green-500 bg-green-500 text-white'
                                      : isWrong
                                      ? 'border-red-500 bg-red-500 text-white'
                                      : 'border-border'
                                  }`}
                                >
                                  {String.fromCharCode(
                                    65 + optionIndex
                                  )}
                                </div>

                                {/* Answer text */}
                                <span className="text-sm leading-6">
                                  {option}
                                </span>

                                {/* Correct icon */}
                                {isCorrect && (
                                  <CheckCircle
                                    className="text-green-500 ml-auto flex-shrink-0"
                                    size={20}
                                  />
                                )}

                                {/* Wrong icon */}
                                {isWrong && (
                                  <XCircle
                                    className="text-red-500 ml-auto flex-shrink-0"
                                    size={20}
                                  />
                                )}

                              </div>

                            </button>
                          );
                        }
                      )}

                    </div>

                    {/* Explanation */}
                    {submitted && (
                      <div className="mt-4 p-4 rounded-xl bg-muted/40 text-sm">

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

          {/* Submit */}
          {!submitted ? (

            <button
              onClick={submitQuiz}
              disabled={
                selectedAnswers.length !==
                questions.length
              }
              className="btn-primary w-full mt-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answers
            </button>

          ) : (

            <div className="mt-8">

              {/* Result */}
              <div
                className={`p-6 rounded-xl text-center ${
                  score >= 4
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
              >

                {score >= 4 ? (
                  <CheckCircle
                    className="mx-auto text-green-500 mb-3"
                    size={40}
                  />
                ) : (
                  <XCircle
                    className="mx-auto text-red-500 mb-3"
                    size={40}
                  />
                )}

                <h3 className="text-2xl font-bold mb-2">
                  {score}/5 Correct
                </h3>

                {score >= 4 ? (
                  <>
                    <p className="text-green-600 dark:text-green-400 mb-2">
                      Excellent! You passed the
                      speaking practice.
                    </p>

                    <p className="text-sm text-muted-foreground">
                      You need at least 4/5 to complete
                      this module.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-red-600 dark:text-red-400 mb-2">
                      You need at least 4/5 to pass.
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Review the explanations and try
                      again.
                    </p>
                  </>
                )}

              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">

                {score < 4 && (
                  <button
                    onClick={retryQuiz}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-muted"
                  >
                    <RotateCcw size={18} />
                    Try Again
                  </button>
                )}

                {score >= 4 && (
                  <button
                    onClick={completeModule}
                    disabled={submitting}
                    className="btn-primary flex-1 py-3 rounded-xl disabled:opacity-50"
                  >
                    {submitting
                      ? 'Completing...'
                      : `Complete Module & Earn +${XP_REWARD} XP`}
                  </button>
                )}

              </div>

            </div>
          )}

        </div>

        {/* Bottom note */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Complete this module to finish the Daily English stage.
        </div>

      </div>
    </div>
  );
}