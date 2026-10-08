'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  User,
  Lightbulb,
  MessageSquare,
  Target,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MODULE_ID = 'self-introduction';
const XP_REWARD = 20;

const questions = [
  {
    question:
      'What is the best way to start your self-introduction in an interview?',
    options: [
      'Start by talking about your salary expectations.',
      'Introduce yourself and briefly mention your educational background.',
      'Immediately ask the interviewer about the company.',
      'Talk about your personal problems.',
    ],
    answer: 1,
    explanation:
      'A professional introduction should begin with who you are and briefly explain your educational or professional background.',
  },
  {
    question:
      'Which information should you include when discussing your technical skills?',
    options: [
      'Only list every programming language you have heard of.',
      'Mention relevant skills and briefly explain how you have used them.',
      'Say that you are an expert in everything.',
      'Avoid mentioning technical skills.',
    ],
    answer: 1,
    explanation:
      'Mention relevant technical skills and support them with projects, internships, coursework, or practical experience.',
  },
  {
    question:
      'What is a good way to talk about your projects during a self-introduction?',
    options: [
      'Only mention the project name.',
      'Explain the project, your role, technologies used, and the result.',
      'Spend ten minutes explaining every line of code.',
      'Say that someone else completed the project.',
    ],
    answer: 1,
    explanation:
      'A short explanation of the project, your contribution, technologies, and outcome makes your introduction stronger.',
  },
  {
    question:
      'Which statement is the most professional way to discuss your career goal?',
    options: [
      'I just want a high salary.',
      'I have no idea what I want to do.',
      'I want to develop my skills and contribute to the organization while growing professionally.',
      'I will leave as soon as I get a better offer.',
    ],
    answer: 2,
    explanation:
      'A good career goal connects your professional growth with the value you can contribute to the organization.',
  },
  {
    question:
      'What is the ideal length for a typical self-introduction in an interview?',
    options: [
      'Around 1–2 minutes with relevant information.',
      '30 minutes.',
      'Only one word.',
      'As long as possible.',
    ],
    answer: 0,
    explanation:
      'A concise 1–2 minute introduction usually gives enough time to present your background, skills, experience, and goals without becoming repetitive.',
  },
];

const introductionSteps = [
  {
    title: '1. Greeting & Name',
    description:
      'Start confidently and introduce yourself.',
    example:
      'Good morning. Thank you for giving me this opportunity. My name is Vaitheeshwaran.',
  },
  {
    title: '2. Education',
    description:
      'Briefly mention your degree and area of study.',
    example:
      'I am currently pursuing my engineering degree with a focus on cybersecurity and modern technologies.',
  },
  {
    title: '3. Technical Skills',
    description:
      'Mention skills relevant to the position.',
    example:
      'I have experience with Java, Python, C++, databases, web development, and cybersecurity concepts.',
  },
  {
    title: '4. Projects & Experience',
    description:
      'Talk briefly about your strongest project or experience.',
    example:
      'I have worked on projects involving web applications, AI-based systems, and real-world problem solving.',
  },
  {
    title: '5. Career Goal',
    description:
      'End by connecting your goal with the position.',
    example:
      'I am looking forward to applying my skills, learning from experienced professionals, and contributing to the organization.',
  },
];

const usefulTips = [
  'Keep your introduction around 1–2 minutes.',
  'Speak clearly and maintain eye contact.',
  'Focus on information relevant to the job.',
  'Do not memorize every sentence word-for-word.',
  'Practice your introduction before the interview.',
  'End your introduction positively and confidently.',
];

export default function SelfIntroductionPage() {
  const router = useRouter();

  const {
    user,
    refreshProfile,
    loading: authLoading,
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

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
          : 'Failed to complete module'
      );
    } finally {
      setSubmitting(false);
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
            Loading Self Introduction...
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
      <div className="min-h-screen px-4 py-8">
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

          <div className="glass-card p-8 text-center">

            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <Trophy
                className="w-10 h-10 text-green-500"
              />
            </div>

            <h1 className="text-3xl font-bold mb-3">
              Self Introduction Completed!
            </h1>

            <p className="text-muted-foreground mb-6">
              Excellent work! You completed the
              first Interview Communication module.
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
                Answering Interview Questions is now
                unlocked.
              </p>

            </div>

            <button
              onClick={() =>
                router.push(
                  '/dashboard/journey/interview-communication'
                )
              }
              className="btn-primary px-6 py-3 rounded-xl"
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

        <div className="glass-card p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="p-3 rounded-xl bg-primary/10">
                  <User
                    className="w-7 h-7 text-primary"
                  />
                </div>

                <span className="text-sm font-medium text-primary">
                  INTERVIEW COMMUNICATION • MODULE 1
                </span>

              </div>

              <h1 className="text-3xl font-bold mb-2">
                Self Introduction
              </h1>

              <p className="text-muted-foreground">
                Learn how to confidently introduce
                yourself and create a strong first
                impression in an interview.
              </p>

            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold">
              <Trophy size={20} />
              +{XP_REWARD} XP
            </div>

          </div>

        </div>

        {/* WHAT YOU WILL LEARN */}

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
              'How to introduce yourself professionally',
              'How to structure your introduction',
              'How to highlight relevant skills',
              'How to discuss projects and experience',
              'How to communicate your career goals',
              'How to create a strong first impression',
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

        {/* INTRODUCTION STRUCTURE */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <MessageSquare
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              How to Structure Your Introduction
            </h2>

          </div>

          <div className="space-y-5">

            {introductionSteps.map(
              (step, index) => (

                <div
                  key={index}
                  className="p-5 rounded-xl bg-muted/40 border border-border"
                >

                  <h3 className="text-lg font-bold text-primary mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-3">
                    {step.description}
                  </p>

                  <div className="p-4 rounded-lg bg-background/60 border border-border">

                    <p className="text-sm italic">
                      "{step.example}"
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* SAMPLE INTRODUCTION */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-5">

            <User
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Sample Self Introduction
            </h2>

          </div>

          <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">

            <p className="text-sm leading-7">
              "Good morning. Thank you for giving me
              this opportunity. My name is
              Vaitheeshwaran. I am currently pursuing
              my engineering degree. I have a strong
              interest in software development,
              cybersecurity, and emerging technologies.
              I have experience with programming
              languages such as Java, Python, and C++,
              along with databases and web development.
              I have also worked on academic projects
              where I developed practical solutions to
              real-world problems. I am a quick learner
              and enjoy solving technical problems.
              My goal is to continuously improve my
              technical and communication skills while
              contributing effectively to the
              organization."
            </p>

          </div>

        </div>

        {/* IMPORTANT TIPS */}

        <div className="glass-card p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <Target
              className="text-primary"
              size={24}
            />

            <h2 className="text-2xl font-bold">
              Important Interview Tips
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {usefulTips.map((tip, index) => (

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

            ))}

          </div>

        </div>

        {/* QUIZ */}

        <div className="glass-card p-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold">
                Self Introduction Quiz
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
                              type="button"
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
              type="button"
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
                      Self Introduction quiz.
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
                    type="button"
                    onClick={retryQuiz}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-muted"
                  >
                    <RotateCcw size={18} />
                    Try Again
                  </button>
                )}

                {score >= 4 && (
                  <button
                    type="button"
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
          Complete this module to unlock Answering Interview Questions.
        </div>

      </div>
    </div>
  );
}