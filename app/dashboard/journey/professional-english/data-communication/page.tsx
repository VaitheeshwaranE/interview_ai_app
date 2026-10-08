'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  XCircle,
  Trophy,
  Lightbulb,
  RotateCcw,
  MessageSquare,
  Target,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULE_ID = 'data-communication';
const XP_REWARD = 20;

const communicationSections = [
  {
    title: '1. Know Your Data',
    description:
      'Before communicating data, understand what the numbers represent and identify the most important findings.',
    examples: [
      'Identify the key numbers before presenting.',
      'Understand the reason behind major changes.',
      'Focus on information that matters to your audience.',
    ],
  },
  {
    title: '2. Use Simple Language',
    description:
      'Explain technical or complex information in a way that your audience can easily understand.',
    examples: [
      'Instead of saying "revenue declined significantly", say "revenue decreased by 15%".',
      'Explain technical terms when necessary.',
      'Avoid unnecessary jargon.',
    ],
  },
  {
    title: '3. Highlight Trends',
    description:
      'When presenting data, explain important patterns, increases, decreases, and comparisons.',
    examples: [
      'Sales increased by 20% compared with last quarter.',
      'Customer complaints decreased steadily.',
      'The data shows a significant improvement in performance.',
    ],
  },
  {
    title: '4. Use Visuals Effectively',
    description:
      'Charts, graphs, and tables can make complex information easier to understand.',
    examples: [
      'Use a bar chart to compare categories.',
      'Use a line chart to show changes over time.',
      'Use a pie chart when showing simple proportions.',
    ],
  },
  {
    title: '5. Give Meaning to the Data',
    description:
      'Do not simply read numbers. Explain what the findings mean and what action should be taken.',
    examples: [
      'The results suggest that we should improve customer support.',
      'This trend indicates an opportunity for growth.',
      'Based on these findings, I recommend increasing investment in this area.',
    ],
  },
];

const professionalPhrases = [
  'According to the data...',
  'The results indicate that...',
  'There has been a significant increase in...',
  'The data shows a decline in...',
  'Compared with the previous quarter...',
  'The main finding is...',
  'This trend suggests that...',
  'Based on these findings, I recommend...',
];

const communicationTips = [
  'Know your numbers before presenting.',
  'Focus on the most important findings.',
  'Use simple language when explaining data.',
  'Choose charts that match the information.',
  'Explain trends instead of only reading numbers.',
  'Connect data to business decisions.',
];

const questions = [
  {
    question:
      'What should you do before presenting data to an audience?',
    options: [
      'Memorize every number without understanding it.',
      'Understand the data and identify the key findings.',
      'Use as many technical terms as possible.',
      'Avoid looking at the data.',
    ],
    answer: 1,
    explanation:
      'Understanding the data and identifying the key findings helps you communicate information clearly and confidently.',
  },
  {
    question:
      'What is the best way to explain complex technical data to a non-technical audience?',
    options: [
      'Use more technical terminology.',
      'Read every number from the table.',
      'Use simple language and explain important concepts clearly.',
      'Avoid explaining the data.',
    ],
    answer: 2,
    explanation:
      'Simple language helps non-technical audiences understand complex information without unnecessary jargon.',
  },
  {
    question:
      'Which statement communicates a data trend professionally?',
    options: [
      'The numbers are weird.',
      'The graph looks nice.',
      'Sales increased by 20% compared with the previous quarter.',
      'I think the numbers are probably good.',
    ],
    answer: 2,
    explanation:
      'The statement clearly communicates the change and provides a specific comparison supported by data.',
  },
  {
    question:
      'Which visual is generally suitable for showing changes over time?',
    options: [
      'Line chart',
      'Random collection of numbers',
      'Unformatted paragraph',
      'Decorative image',
    ],
    answer: 0,
    explanation:
      'A line chart is commonly used to show trends and changes over a period of time.',
  },
  {
    question:
      'After presenting an important data finding, what should you explain?',
    options: [
      'Nothing. The audience can guess the meaning.',
      'Only the title of the report.',
      'What the finding means and what action may be appropriate.',
      'An unrelated personal story.',
    ],
    answer: 2,
    explanation:
      'Effective data communication connects findings to their meaning and possible actions or decisions.',
  },
];

export default function DataCommunicationPage() {
  const router = useRouter();

  const {
    user,
    refreshProfile,
    loading: authLoading,
  } = useAuth();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedAnswers, setSelectedAnswers] =
    useState<number[]>([]);

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
          (item: any) =>
            item.moduleId === MODULE_ID
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
    if (
      selectedAnswers.length !==
      questions.length
    ) {
      alert(
        'Please answer all 5 questions before submitting.'
      );
      return;
    }

    let correct = 0;

    questions.forEach(
      (question, index) => {
        if (
          selectedAnswers[index] ===
          question.answer
        ) {
          correct++;
        }
      }
    );

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
      const token =
        await user.getIdToken();

      const response = await fetch(
        '/api/journey/module',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            moduleId: MODULE_ID,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to complete module'
        );
      }

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

  /* ============================
     LOADING
  ============================ */

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />

          <p className="text-muted-foreground">
            Loading Data Communication...
          </p>

        </div>

      </div>
    );
  }

  /* ============================
     COMPLETED SCREEN
  ============================ */

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
              Data Communication Completed!
            </h1>

            <p className="text-muted-foreground mb-6">
              Excellent work! You completed the
              final Professional English module.
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
                  Professional English Completed
                </span>

              </div>

              <p className="text-sm text-muted-foreground">
                You have completed all 5 Professional
                English modules.
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

  /* ============================
     MAIN PAGE
  ============================ */

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

                  <BarChart3
                    className="w-7 h-7 text-primary"
                  />

                </div>

                <span className="text-sm font-medium text-primary">
                  PROFESSIONAL ENGLISH • MODULE 5
                </span>

              </div>

              <h1 className="text-3xl font-bold mb-2">
                Data Communication
              </h1>

              <p className="text-muted-foreground">
                Learn how to explain data, present
                trends, communicate findings, and
                turn information into clear decisions.
              </p>

            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold">

              <Trophy size={20} />

              +{XP_REWARD} XP

            </div>

          </div>

        </div>

        {/* LEARNING OBJECTIVES */}

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
              'Understand the key findings in your data',
              'Explain technical information clearly',
              'Describe trends and comparisons',
              'Choose appropriate charts and visuals',
              'Connect findings to business decisions',
              'Present data confidently to an audience',
            ].map(
              (item, index) => (

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

              )
            )}

          </div>

        </div>

        {/* DATA COMMUNICATION SECTIONS */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <BarChart3
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Effective Data Communication
            </h2>

          </div>

          <div className="space-y-5">

            {communicationSections.map(
              (section, index) => (

                <div
                  key={index}
                  className="p-5 rounded-xl bg-muted/40 border border-border"
                >

                  <h3 className="text-lg font-bold text-primary mb-2">
                    {section.title}
                  </h3>

                  <p className="text-sm leading-6 mb-4">
                    {section.description}
                  </p>

                  <div className="space-y-2">

                    {section.examples.map(
                      (
                        example,
                        exampleIndex
                      ) => (

                        <div
                          key={exampleIndex}
                          className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                        >

                          <MessageSquare
                            size={17}
                            className="text-primary mt-0.5 flex-shrink-0"
                          />

                          <p className="text-sm text-muted-foreground">
                            {example}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* CHART GUIDE */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <FileText
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Choosing the Right Visual
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-4">

            <div className="p-5 rounded-xl bg-muted/40">

              <h3 className="font-bold text-primary mb-2">
                Bar Chart
              </h3>

              <p className="text-sm text-muted-foreground">
                Best for comparing different
                categories.
              </p>

            </div>

            <div className="p-5 rounded-xl bg-muted/40">

              <h3 className="font-bold text-primary mb-2">
                Line Chart
              </h3>

              <p className="text-sm text-muted-foreground">
                Best for showing trends and
                changes over time.
              </p>

            </div>

            <div className="p-5 rounded-xl bg-muted/40">

              <h3 className="font-bold text-primary mb-2">
                Pie Chart
              </h3>

              <p className="text-sm text-muted-foreground">
                Useful for showing simple
                proportions or percentages.
              </p>

            </div>

          </div>

        </div>

        {/* PROFESSIONAL PHRASES */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <MessageSquare
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Useful Data Communication Phrases
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

            <Target
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Professional Data Communication Tips
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {communicationTips.map(
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
                Data Communication Quiz
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
              (
                question,
                questionIndex
              ) => {

                const selected =
                  selectedAnswers[
                    questionIndex
                  ];

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
                        (
                          option,
                          optionIndex
                        ) => {

                          const isSelected =
                            selected ===
                            optionIndex;

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
                                    65 +
                                      optionIndex
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

          {/* CHECK ANSWERS */}

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
                      Data Communication quiz.
                    </p>

                    <p className="text-sm text-muted-foreground">
                      You need at least 4/5 to
                      complete this module.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-red-600 dark:text-red-400 mb-2">
                      You need at least 4/5 to pass.
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Review the lesson and try
                      again.
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
          Complete this module to finish Professional English.
        </div>

      </div>

    </div>
  );
}