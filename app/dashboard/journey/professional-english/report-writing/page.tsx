'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  Trophy,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULE_ID = 'report-writing';
const XP_REWARD = 20;

const reportSections = [
  {
    title: '1. Title',
    description:
      'Clearly state what the report is about.',
    example: 'Project Progress Report',
  },
  {
    title: '2. Introduction',
    description:
      'Explain the purpose, background, and scope of the report.',
    example:
      'This report presents the current progress of the software development project.',
  },
  {
    title: '3. Findings',
    description:
      'Present the important information, observations, or results.',
    example:
      'The development team has completed 80% of the planned features.',
  },
  {
    title: '4. Conclusion',
    description:
      'Summarize the main findings and important outcomes.',
    example:
      'The project is progressing according to the planned schedule.',
  },
  {
    title: '5. Recommendations',
    description:
      'Suggest actions that can improve the situation or project.',
    example:
      'It is recommended that additional testing be conducted before deployment.',
  },
];

const professionalPhrases = [
  'According to the findings...',
  'The purpose of this report is to...',
  'The results indicate that...',
  'Based on the analysis...',
  'It is recommended that...',
  'In conclusion...',
];

const questions = [
  {
    question:
      'What is the main purpose of a professional report?',
    options: [
      'To entertain the reader',
      'To present information clearly and systematically',
      'To use as many difficult words as possible',
      'To write personal opinions only',
    ],
    answer: 1,
    explanation:
      'A professional report presents information, findings, and conclusions in a clear and organized way.',
  },
  {
    question:
      'Which section usually explains the purpose and background of a report?',
    options: [
      'Introduction',
      'Conclusion',
      'Recommendations',
      'Title',
    ],
    answer: 0,
    explanation:
      'The introduction explains the purpose, background, and scope of the report.',
  },
  {
    question:
      'Where should the main observations and results be presented?',
    options: [
      'Title',
      'Introduction',
      'Findings',
      'Signature',
    ],
    answer: 2,
    explanation:
      'The findings section presents the important observations, information, and results.',
  },
  {
    question:
      'Which phrase is most suitable for a professional report?',
    options: [
      'I think this thing is pretty good.',
      'This is totally awesome.',
      'The results indicate that the project is progressing as planned.',
      'I guess everything is okay.',
    ],
    answer: 2,
    explanation:
      'Professional reports should use clear, objective, and formal language.',
  },
  {
    question:
      'What should the recommendations section contain?',
    options: [
      'Funny stories',
      'Suggested actions based on the findings',
      'Only the report title',
      'Unrelated personal information',
    ],
    answer: 1,
    explanation:
      'Recommendations suggest practical actions based on the findings or analysis.',
  },
];

const reportTips = [
  'Use clear and formal language.',
  'Organize information using headings and sections.',
  'Present facts objectively.',
  'Avoid unnecessary informal expressions.',
  'Support important findings with relevant information.',
];

export default function ReportWritingPage() {
  const router = useRouter();

  const {
    user,
    refreshProfile,
    loading: authLoading,
  } = useAuth();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    []
  );
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

  /* ==============================
     LOADING
  ============================== */

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />

          <p className="text-muted-foreground">
            Loading Report Writing...
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
              Report Writing Completed!
            </h1>

            <p className="text-muted-foreground mb-6">
              Excellent work! You completed the second
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
                Presentation Language is now unlocked.
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

        {/* BACK */}

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

        {/* HEADER */}

        <div className="glass-card p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="p-3 rounded-xl bg-primary/10">

                  <FileText
                    className="w-7 h-7 text-primary"
                  />

                </div>

                <span className="text-sm font-medium text-primary">
                  PROFESSIONAL ENGLISH • MODULE 2
                </span>

              </div>

              <h1 className="text-3xl font-bold mb-2">
                Report Writing
              </h1>

              <p className="text-muted-foreground">
                Learn how to structure and write clear,
                professional reports.
              </p>

            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold">

              <Trophy size={20} />

              +{XP_REWARD} XP

            </div>

          </div>

        </div>

        {/* LEARNING OBJECTIVE */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <BookOpen
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              What You'll Learn
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {[
              'Understand the structure of a professional report',
              'Write clear introductions and conclusions',
              'Present findings in an organized way',
              'Use formal language in reports',
              'Write practical recommendations',
              'Communicate information objectively',
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

        {/* REPORT STRUCTURE */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <FileText
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Professional Report Structure
            </h2>

          </div>

          <div className="space-y-4">

            {reportSections.map(
              (section, index) => (

                <div
                  key={index}
                  className="p-5 rounded-xl bg-muted/40 border border-border"
                >

                  <h3 className="text-lg font-bold text-primary mb-2">
                    {section.title}
                  </h3>

                  <p className="text-sm leading-6 mb-3">
                    {section.description}
                  </p>

                  <div className="p-3 rounded-lg bg-background/50">

                    <p className="text-sm text-muted-foreground">

                      <span className="font-semibold text-foreground">
                        Example:
                      </span>{' '}

                      {section.example}

                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* SAMPLE REPORT */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <BookOpen
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Example Report
            </h2>

          </div>

          <div className="p-6 rounded-xl bg-muted/40 space-y-5">

            <div>

              <h3 className="font-bold text-lg mb-2">
                Project Progress Report
              </h3>

              <p className="text-sm text-muted-foreground">
                This report presents the current progress
                of the software development project.
              </p>

            </div>

            <div>

              <h4 className="font-semibold mb-1">
                Findings
              </h4>

              <p className="text-sm text-muted-foreground leading-6">
                The development team has completed 80%
                of the planned features. Testing has
                started for the completed modules.
              </p>

            </div>

            <div>

              <h4 className="font-semibold mb-1">
                Conclusion
              </h4>

              <p className="text-sm text-muted-foreground leading-6">
                The project is progressing according to
                the planned schedule.
              </p>

            </div>

            <div>

              <h4 className="font-semibold mb-1">
                Recommendation
              </h4>

              <p className="text-sm text-muted-foreground leading-6">
                It is recommended that additional testing
                be conducted before deployment.
              </p>

            </div>

          </div>

        </div>

        {/* PROFESSIONAL PHRASES */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <Lightbulb
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Useful Report-Writing Phrases
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {professionalPhrases.map(
              (phrase, index) => (

                <div
                  key={index}
                  className="p-4 rounded-xl bg-primary/5 border border-primary/10"
                >

                  <p className="text-sm font-medium">
                    "{phrase}"
                  </p>

                </div>

              )
            )}

          </div>

        </div>

        {/* TIPS */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <Lightbulb
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Report Writing Tips
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {reportTips.map(
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

        {/* QUIZ */}

        <div className="glass-card p-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold">
                Report Writing Quiz
              </h2>

              <p className="text-muted-foreground mt-1">
                Choose the best professional answer.
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

                                <span className="text-sm leading-6">
                                  {option}
                                </span>

                                {isCorrect && (
                                  <CheckCircle
                                    className="text-green-500 ml-auto flex-shrink-0"
                                    size={20}
                                  />
                                )}

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

          {/* SUBMIT / RESULT */}

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
                      Report Writing quiz.
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
                      Review the lesson and try again.
                    </p>
                  </>

                )}

              </div>

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

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Complete this module to unlock Presentation Language.
        </div>

      </div>
    </div>
  );
}