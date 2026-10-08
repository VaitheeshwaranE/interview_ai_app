'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Presentation,
  CheckCircle,
  XCircle,
  Trophy,
  Lightbulb,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULE_ID = 'presentation-language';
const XP_REWARD = 20;

const presentationSections = [
  {
    title: '1. Opening the Presentation',
    description:
      'Start confidently by greeting the audience and introducing the topic.',
    examples: [
      'Good morning everyone. Today I would like to talk about...',
      'Thank you for joining me today.',
      'The purpose of this presentation is to...',
    ],
  },
  {
    title: '2. Introducing the Topic',
    description:
      'Clearly explain what your presentation will cover.',
    examples: [
      'Today, I will discuss three important areas.',
      'Let me begin by explaining...',
      'First, I would like to focus on...',
    ],
  },
  {
    title: '3. Moving Between Topics',
    description:
      'Use transition phrases to connect different parts of your presentation.',
    examples: [
      'Let us now move on to the next point.',
      'Moving on to the second topic...',
      'This brings us to the next important area.',
    ],
  },
  {
    title: '4. Explaining Data and Slides',
    description:
      'Use clear language when explaining charts, graphs, and other visual information.',
    examples: [
      'As you can see from this chart...',
      'This graph shows that...',
      'The data indicates that...',
    ],
  },
  {
    title: '5. Handling Questions',
    description:
      'Respond to questions politely and professionally.',
    examples: [
      'Thank you for your question.',
      'That is an interesting point.',
      'Let me explain that in more detail.',
    ],
  },
];

const professionalPhrases = [
  'Good morning everyone. Today I would like to...',
  'The purpose of this presentation is to...',
  'Let us begin with...',
  'As you can see from this slide...',
  'Let us now move on to...',
  'The key point here is...',
  'To summarize...',
  'Thank you for your attention.',
];

const questions = [
  {
    question:
      'Which is the best way to start a professional presentation?',
    options: [
      'Hey guys, let us finish this quickly.',
      'Good morning everyone. Today I would like to discuss...',
      'You already know everything about this topic.',
      'I do not know what to say, so let us begin.',
    ],
    answer: 1,
    explanation:
      'A professional presentation should begin with a polite greeting and a clear introduction to the topic.',
  },
  {
    question:
      'Which phrase is useful when moving to a new topic?',
    options: [
      'I am finished with everything.',
      'Whatever, let us continue.',
      'Let us now move on to the next point.',
      'I do not care about the next topic.',
    ],
    answer: 2,
    explanation:
      'Transition phrases help the audience understand that the presentation is moving to a new topic.',
  },
  {
    question:
      'Which phrase is best when explaining a chart?',
    options: [
      'This picture is nice.',
      'As you can see from this chart, the results have increased.',
      'Look at this thing.',
      'I have no idea what this chart means.',
    ],
    answer: 1,
    explanation:
      'Professional presentations should explain visual information clearly and directly.',
  },
  {
    question:
      'What is a professional way to respond when someone asks a question?',
    options: [
      'That is a stupid question.',
      'I do not want to answer that.',
      'Thank you for your question. Let me explain.',
      'Why are you asking me?',
    ],
    answer: 2,
    explanation:
      'Thanking the person and responding politely demonstrates professionalism and confidence.',
  },
  {
    question:
      'Which phrase is suitable for ending a presentation?',
    options: [
      'Okay, I am done. Bye.',
      'That is all. You can leave now.',
      'Thank you for your attention. I would be happy to answer any questions.',
      'I have nothing else to say.',
    ],
    answer: 2,
    explanation:
      'A professional closing should thank the audience and provide an opportunity for questions.',
  },
];

const presentationTips = [
  'Maintain eye contact with the audience.',
  'Speak clearly and avoid speaking too quickly.',
  'Use short and understandable sentences.',
  'Use transition phrases between different topics.',
  'End the presentation with a clear summary.',
];

export default function PresentationLanguagePage() {
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
            Loading Presentation Language...
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
              Presentation Language Completed!
            </h1>

            <p className="text-muted-foreground mb-6">
              Excellent work! You completed the third
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
                Persuasion Techniques is now unlocked.
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

                  <Presentation
                    className="w-7 h-7 text-primary"
                  />

                </div>

                <span className="text-sm font-medium text-primary">
                  PROFESSIONAL ENGLISH • MODULE 3
                </span>

              </div>

              <h1 className="text-3xl font-bold mb-2">
                Presentation Language
              </h1>

              <p className="text-muted-foreground">
                Learn professional language for
                confident and effective presentations.
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
              'How to open a professional presentation',
              'How to introduce your topic clearly',
              'How to transition between topics',
              'How to explain charts and slides',
              'How to answer audience questions',
              'How to close a presentation professionally',
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

        {/* PRESENTATION SECTIONS */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <Presentation
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Professional Presentation Language
            </h2>

          </div>

          <div className="space-y-5">

            {presentationSections.map(
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
                      (example, exampleIndex) => (

                        <div
                          key={exampleIndex}
                          className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                        >

                          <MessageSquare
                            size={17}
                            className="text-primary mt-0.5 flex-shrink-0"
                          />

                          <p className="text-sm text-muted-foreground">
                            "{example}"
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

        {/* USEFUL PHRASES */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <MessageSquare
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Useful Presentation Phrases
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
              Presentation Tips
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {presentationTips.map(
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
                Presentation Language Quiz
              </h2>

              <p className="text-muted-foreground mt-1">
                Choose the best professional response.
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

            /* RESULT */

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
                      Presentation Language quiz.
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
          Complete this module to unlock Persuasion Techniques.
        </div>

      </div>

    </div>
  );
}