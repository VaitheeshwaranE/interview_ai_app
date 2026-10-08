'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  CheckCircle,
  XCircle,
  Trophy,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULE_ID = 'corporate-vocabulary';
const XP_REWARD = 20;

const vocabulary = [
  {
    word: 'Deadline',
    meaning:
      'The latest time or date by which something must be completed.',
    example:
      'We need to complete the project before the deadline.',
  },
  {
    word: 'Collaboration',
    meaning:
      'Working together with others to achieve a common goal.',
    example:
      'Successful collaboration helped our team finish the project.',
  },
  {
    word: 'Deliverable',
    meaning:
      'A specific result or product that must be completed and delivered.',
    example:
      'The final report is one of the key deliverables.',
  },
  {
    word: 'Stakeholder',
    meaning:
      'A person or group that has an interest in or is affected by a project.',
    example:
      'We discussed the requirements with the stakeholders.',
  },
  {
    word: 'Agenda',
    meaning:
      'A list of topics or activities planned for a meeting.',
    example:
      "The first item on today's agenda is the project update.",
  },
  {
  word: 'Feedback',
  meaning:
    "Comments or suggestions about someone's work or performance.",
  example:
    'My manager gave me useful feedback on my presentation.',
},
  {
    word: 'Prioritize',
    meaning:
      'To arrange tasks according to their importance or urgency.',
    example:
      'We need to prioritize the most important tasks first.',
  },
  {
    word: 'Initiative',
    meaning:
      'The ability to take action or make decisions without being asked.',
    example:
      'She showed great initiative by improving the workflow.',
  },
];

const questions = [
  {
    question: 'What does "deadline" mean in a workplace?',
    options: [
      'A meeting room',
      'The latest time something must be completed',
      'A project manager',
      'A break during work',
    ],
    answer: 1,
    explanation:
      'A deadline is the final time or date by which a task must be completed.',
  },
  {
    question:
      'Which word describes working together to achieve a common goal?',
    options: [
      'Deadline',
      'Agenda',
      'Collaboration',
      'Deliverable',
    ],
    answer: 2,
    explanation:
      'Collaboration means working together with other people toward a common goal.',
  },
  {
    question:
      'A final report that must be submitted to a client is an example of a:',
    options: [
      'Stakeholder',
      'Deliverable',
      'Deadline',
      'Feedback',
    ],
    answer: 1,
    explanation:
      'A deliverable is a specific output or result that needs to be completed and delivered.',
  },
  {
    question:
      'What is the purpose of a meeting agenda?',
    options: [
      'To list the topics planned for discussion',
      'To calculate employee salaries',
      'To record attendance only',
      'To assign office rooms',
    ],
    answer: 0,
    explanation:
      'An agenda provides the topics and activities planned for a meeting.',
  },
  {
    question:
      'What does it mean to "prioritize" your tasks?',
    options: [
      'Ignore all tasks',
      'Complete tasks randomly',
      'Arrange tasks according to importance or urgency',
      'Give all tasks the same priority',
    ],
    answer: 2,
    explanation:
      'Prioritizing means deciding which tasks should receive attention first based on importance or urgency.',
  },
];

const professionalTips = [
  'Use precise words instead of informal expressions.',
  'Use professional vocabulary in emails and meetings.',
  'Learn workplace terms together with real examples.',
  'Use new vocabulary repeatedly to remember it.',
  'Avoid unnecessary slang in professional communication.',
];

export default function CorporateVocabularyPage() {
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
      if (
        selectedAnswers[index] === question.answer
      ) {
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
          data.error ||
            'Failed to complete module'
        );
      }

      // Update XP immediately in the UI
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

  /* ==============================
     LOADING
  ============================== */

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />

          <p className="text-muted-foreground">
            Loading Corporate Vocabulary...
          </p>

        </div>
      </div>
    );
  }

  /* ==============================
     COMPLETED SCREEN
  ============================== */

  if (completed) {
    return (
      <div className="min-h-screen px-4 py-8">

        <div className="max-w-3xl mx-auto">

          <button
            onClick={() =>
              router.push(
                '/dashboard/journey/professional-english'
              )
            }
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft size={20} />

            Back to Professional English
          </button>

          <div className="glass-card p-8 text-center">

            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">

              <Trophy
                className="w-10 h-10 text-green-500"
              />

            </div>

            <h1 className="text-3xl font-bold mb-3">
              Corporate Vocabulary Completed!
            </h1>

            <p className="text-muted-foreground mb-6">
              Excellent work! You completed the first
              Professional English module.
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
                  Module Completed
                </span>

              </div>

              <p className="text-sm text-muted-foreground">
                Report Writing is now unlocked.
              </p>

            </div>

            <button
              onClick={() =>
                router.push(
                  '/dashboard/journey/professional-english'
                )
              }
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Back to Professional English
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* ==============================
     MAIN PAGE
  ============================== */

  return (
    <div className="min-h-screen px-4 py-8">

      <div className="max-w-4xl mx-auto">

        {/* ==============================
            BACK BUTTON
        ============================== */}

        <button
          onClick={() =>
            router.push(
              '/dashboard/journey/professional-english'
            )
          }
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={20} />

          Back to Professional English
        </button>

        {/* ==============================
            HEADER
        ============================== */}

        <div className="glass-card p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="p-3 rounded-xl bg-primary/10">

                  <Briefcase
                    className="w-7 h-7 text-primary"
                  />

                </div>

                <span className="text-sm font-medium text-primary">
                  PROFESSIONAL ENGLISH • MODULE 1
                </span>

              </div>

              <h1 className="text-3xl font-bold mb-2">
                Corporate Vocabulary
              </h1>

              <p className="text-muted-foreground">
                Learn essential workplace vocabulary
                used in corporate communication.
              </p>

            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold">

              <Trophy size={20} />

              +{XP_REWARD} XP

            </div>

          </div>

        </div>

        {/* ==============================
            LEARNING OBJECTIVE
        ============================== */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <Lightbulb
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              What You'll Learn
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {[
              'Common corporate vocabulary',
              'Workplace terminology',
              'How to use professional words correctly',
              'How to communicate effectively in meetings',
              'How to use professional vocabulary in emails',
              'How to communicate more professionally',
            ].map((item, index) => (

              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-muted/40"
              >

                <CheckCircle
                  size={20}
                  className="text-green-500 mt-0.5 flex-shrink-0"
                />

                <span className="text-sm">
                  {item}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* ==============================
            VOCABULARY LESSON
        ============================== */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <BookOpen
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Essential Corporate Vocabulary
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {vocabulary.map((item) => (

              <div
                key={item.word}
                className="p-5 rounded-xl bg-muted/40 border border-border"
              >

                <h3 className="text-xl font-bold text-primary mb-2">
                  {item.word}
                </h3>

                <p className="text-sm leading-6 mb-4">
                  {item.meaning}
                </p>

                <div className="p-3 rounded-lg bg-background/50">

                  <p className="text-sm text-muted-foreground leading-6">

                    <span className="font-semibold text-foreground">
                      Example:
                    </span>{' '}

                    {item.example}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* ==============================
            PROFESSIONAL TIPS
        ============================== */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <Lightbulb
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Professional Vocabulary Tips
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {professionalTips.map(
              (tip, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10"
                >

                  <CheckCircle
                    size={20}
                    className="text-green-500 mt-0.5 flex-shrink-0"
                  />

                  <span className="text-sm text-muted-foreground">
                    {tip}
                  </span>

                </div>

              )
            )}

          </div>

        </div>

        {/* ==============================
            QUIZ
        ============================== */}

        <div className="glass-card p-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold">
                Vocabulary Quiz
              </h2>

              <p className="text-muted-foreground mt-1">
                Choose the correct professional term.
              </p>

            </div>

            <div className="text-sm font-medium">
              {selectedAnswers.length}/
              {questions.length}
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

                          let optionClass =
                            'border-border hover:border-indigo-500/70 hover:bg-indigo-500/5';

                          if (
                            isSelected &&
                            !submitted
                          ) {

                            optionClass =
                              'border-indigo-500 bg-indigo-500/20 ring-2 ring-indigo-500/40 shadow-lg';

                          }

                          if (isCorrect) {

                            optionClass =
                              'border-green-500 bg-green-500/20 ring-2 ring-green-500/30';

                          }

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

                                {/* A / B / C / D */}

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

                                {/* Answer */}

                                <span className="text-sm leading-6">
                                  {option}
                                </span>

                                {/* Correct */}

                                {isCorrect && (

                                  <CheckCircle
                                    className="text-green-500 ml-auto flex-shrink-0"
                                    size={20}
                                  />

                                )}

                                {/* Wrong */}

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

          {/* ==============================
              BEFORE SUBMISSION
          ============================== */}

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

            /* ==============================
               AFTER SUBMISSION
            ============================== */

            <div className="mt-8">

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
                      Corporate Vocabulary quiz.
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
                      Review the vocabulary and try
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

        {/* Bottom */}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Complete this module to unlock Report Writing.
        </div>

      </div>

    </div>
  );
}