'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Award,
  Play,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function DailyConversationPage() {
  const router = useRouter();
  const { user } = useAuth();

  const MODULE_ID = 'daily-conversation';

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const conversations = [
    {
      title: 'Greeting a Colleague',
      situation: 'You meet a colleague at the office in the morning.',
      example: 'Good morning! How are you doing today?',
      response: 'Good morning! I’m doing well, thank you. How about you?',
    },
    {
      title: 'Asking for Help',
      situation: 'You need help with a task at work.',
      example: 'Could you please help me with this task?',
      response: 'Sure. I’d be happy to help you.',
    },
    {
      title: 'Starting a Conversation',
      situation: 'You want to start a friendly conversation.',
      example: 'How was your weekend?',
      response: 'It was great. I spent some time with my family.',
    },
  ];

  const questions: Question[] = [
    {
      question: 'What is a polite way to ask a colleague for help?',
      options: [
        'Give me that.',
        'Could you please help me?',
        'You must help me.',
        'Do it for me.',
      ],
      answer: 'Could you please help me?',
    },
    {
      question: 'Which is a suitable morning greeting at work?',
      options: [
        'Hey, wake up!',
        'Good morning! How are you?',
        'What do you want?',
        'Why are you here?',
      ],
      answer: 'Good morning! How are you?',
    },
    {
      question: 'How can you politely start a casual conversation?',
      options: [
        'How was your weekend?',
        'Tell me everything.',
        'Why are you talking?',
        'Answer me now.',
      ],
      answer: 'How was your weekend?',
    },
    {
      question: 'Which response is appropriate when someone offers help?',
      options: [
        'No, go away.',
        'I don’t care.',
        'Sure, I’d be happy to help.',
        'Do it yourself.',
      ],
      answer: 'Sure, I’d be happy to help.',
    },
    {
      question: 'Which sentence sounds professional and polite?',
      options: [
        'Send it now.',
        'Can you send me the report, please?',
        'Give me the report.',
        'I need it. Hurry.',
      ],
      answer: 'Can you send me the report, please?',
    },
  ];

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

  const selectAnswer = (answer: string) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    if (answer === questions[currentQuestion].answer) {
      setScore((previous) => previous + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedAnswer('');
      setAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const completeModule = async () => {
    try {
      if (!user) {
        setError('Please sign in first.');
        return;
      }

      if (completed || completing) return;

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
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading Daily Conversation...
        </div>
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
            <MessageCircle className="w-7 h-7 text-brand-400" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">
              Daily Conversation
            </h1>

            <p className="text-slate-400 mt-1">
              Practice common English conversations used in daily life.
            </p>

            <p className="text-brand-300 text-sm mt-2">
              +20 XP on completion
            </p>
          </div>

        </div>
      </div>

      {/* Learning Content */}
      <div className="glass-card p-6">

        <h2 className="text-lg font-bold text-white mb-5">
          Conversation Practice
        </h2>

        <div className="space-y-4">

          {conversations.map((conversation, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-white/10 bg-white/5"
            >

              <h3 className="font-semibold text-brand-300 mb-2">
                {index + 1}. {conversation.title}
              </h3>

              <p className="text-slate-400 text-sm mb-3">
                <span className="text-white font-medium">
                  Situation:
                </span>{' '}
                {conversation.situation}
              </p>

              <div className="space-y-2">

                <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20">
                  <p className="text-slate-300 text-sm">
                    <span className="text-brand-300 font-semibold">
                      You:
                    </span>{' '}
                    {conversation.example}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-slate-300 text-sm">
                    <span className="text-emerald-300 font-semibold">
                      Response:
                    </span>{' '}
                    {conversation.response}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Quiz */}
      {!quizFinished && !completed && (
        <div className="glass-card p-6">

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">
              Quick Practice
            </h2>

            <span className="text-sm text-slate-400">
              Question {currentQuestion + 1} / {questions.length}
            </span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full mb-6">
            <div
              className="h-2 bg-brand-500 rounded-full transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>

          <p className="text-white font-semibold mb-5">
            {questions[currentQuestion].question}
          </p>

          <div className="space-y-3">

            {questions[currentQuestion].options.map((option) => {

              const isCorrect =
                option === questions[currentQuestion].answer;

              const isSelected =
                option === selectedAnswer;

              let className =
                'w-full text-left p-4 rounded-xl border transition ';

              if (!answered) {
                className +=
                  'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200';
              } else if (isCorrect) {
                className +=
                  'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
              } else if (isSelected) {
                className +=
                  'border-red-500/40 bg-red-500/10 text-red-300';
              } else {
                className +=
                  'border-white/10 bg-white/5 text-slate-500';
              }

              return (
                <button
                  key={option}
                  onClick={() => selectAnswer(option)}
                  disabled={answered}
                  className={className}
                >
                  <div className="flex items-center justify-between">

                    <span>{option}</span>

                    {answered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}

                    {answered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}

                  </div>
                </button>
              );
            })}

          </div>

          {answered && (
            <div className="mt-5">

              <p
                className={
                  selectedAnswer === questions[currentQuestion].answer
                    ? 'text-emerald-400 text-sm'
                    : 'text-red-400 text-sm'
                }
              >
                {selectedAnswer === questions[currentQuestion].answer
                  ? 'Correct! Good job.'
                  : `Correct answer: ${questions[currentQuestion].answer}`}
              </p>

              <button
                onClick={nextQuestion}
                className="btn-primary mt-4 px-6 py-2.5"
              >
                {currentQuestion === questions.length - 1
                  ? 'Finish Practice'
                  : 'Next Question'}
              </button>

            </div>
          )}

        </div>
      )}

      {/* Quiz Result */}
      {quizFinished && !completed && (
        <div className="glass-card p-6 text-center">

          <Award className="w-12 h-12 text-brand-400 mx-auto mb-3" />

          <h2 className="text-xl font-bold text-white">
            Practice Completed
          </h2>

          <p className="text-slate-400 mt-2">
            You scored{' '}
            <span className="text-brand-300 font-bold">
              {score}/{questions.length}
            </span>
          </p>

          {score >= 4 ? (
            <>
              <p className="text-emerald-400 mt-3">
                Excellent! You passed the practice.
              </p>

              <button
                onClick={completeModule}
                disabled={completing}
                className="btn-primary mt-5 w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60"
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
              <p className="text-red-400 mt-3">
                You need at least 4/5 correct answers to complete this module.
              </p>

              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswer('');
                  setScore(0);
                  setAnswered(false);
                  setQuizFinished(false);
                }}
                className="btn-primary mt-5 px-6 py-2.5"
              >
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
        <div className="glass-card p-6 text-center border border-emerald-500/30">

          <Award className="w-10 h-10 text-emerald-400 mx-auto mb-3" />

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
            className="btn-primary mt-5 px-6 py-2.5 inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Back to Daily English
          </button>

        </div>
      )}

    </div>
  );
}