import { NextRequest } from 'next/server';

// Mock IBM watsonx
jest.mock('@/lib/watsonx', () => ({
  generateInterviewQuestion: jest.fn().mockResolvedValue('Tell me about yourself.'),
  evaluateInterviewAnswer: jest.fn().mockResolvedValue({
    score: 78,
    feedback: 'Good answer.',
    strengths: ['Clear structure'],
    improvements: ['Add examples'],
    betterAnswer: 'Use STAR method.',
  }),
  correctSpeech: jest.fn().mockResolvedValue({
    corrections: [],
    improvedText: 'The corrected text.',
    score: 80,
    fillerWords: [],
    suggestions: [],
  }),
}));

describe('Interview Question API', () => {
  it('returns a question for HR type', async () => {
    const { POST } = await import('@/app/api/interview/question/route');
    const req = new NextRequest('http://localhost/api/interview/question', {
      method: 'POST',
      body: JSON.stringify({ type: 'hr', difficulty: 'medium' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data).toHaveProperty('question');
    expect(typeof data.question).toBe('string');
    expect(data.question.length).toBeGreaterThan(5);
  });
});

describe('Interview Evaluate API', () => {
  it('evaluates an answer', async () => {
    const { POST } = await import('@/app/api/interview/evaluate/route');
    const req = new NextRequest('http://localhost/api/interview/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        question: 'Tell me about yourself.',
        answer: 'I am a software engineer with 2 years of experience.',
        type: 'hr',
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data).toHaveProperty('score');
    expect(data.score).toBeGreaterThanOrEqual(0);
    expect(data.score).toBeLessThanOrEqual(100);
    expect(data).toHaveProperty('feedback');
  });

  it('returns 400 for missing answer', async () => {
    const { POST } = await import('@/app/api/interview/evaluate/route');
    const req = new NextRequest('http://localhost/api/interview/evaluate', {
      method: 'POST',
      body: JSON.stringify({ question: 'Tell me about yourself.' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
