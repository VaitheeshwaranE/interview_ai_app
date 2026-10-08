// IBM watsonx.ai Integration for InterviewVerse AI
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';

const PROJECT_ID = process.env.WATSONX_PROJECT_ID;

const MODEL_ID = 'meta-llama/llama-3-70b-instruct';

function getWatsonxAI() {
  return WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl: process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com',
  });
}
interface WatsonxTextParams {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  systemPrompt?: string;
}

interface WatsonxResponse {
  text: string;
  tokensUsed?: number;
}

export async function generateText(params: WatsonxTextParams): Promise<WatsonxResponse> {
  const {
    prompt,
    maxTokens = 1024,
    temperature = 0.7,
    topP = 0.9,
    systemPrompt,
  } = params;

  const fullPrompt = systemPrompt
    ? `<|system|>\n${systemPrompt}\n<|user|>\n${prompt}\n<|assistant|>\n`
    : `<|user|>\n${prompt}\n<|assistant|>\n`;

  const watsonxAI = getWatsonxAI();

  if (!PROJECT_ID) {
    throw new Error('WATSONX_PROJECT_ID is not configured');
  }

  const response = await watsonxAI.generateText({
    input: fullPrompt,
    modelId: MODEL_ID,
    projectId: PROJECT_ID,
    parameters: {
      decoding_method: 'greedy',
      max_new_tokens: maxTokens,
      temperature,
      top_p: topP,
      repetition_penalty: 1.1,
      stop_sequences: ['<|user|>', '<|system|>'],
    },
  });

  const result = response.result;
  const text = result.results?.[0]?.generated_text?.trim() || '';

  return {
    text,
    tokensUsed: result.results?.[0]?.generated_token_count,
  };
}
  
// =============================================
// INTERVIEW AI FUNCTIONS
// =============================================

export async function generateInterviewQuestion(params: {
  type: string;
  role?: string;
  company?: string;
  previousQuestions?: string[];
  difficulty?: string;
}): Promise<string> {
  const { type, role = 'Software Engineer', company, previousQuestions = [], difficulty = 'medium' } = params;

  const prevQContext = previousQuestions.length > 0
    ? `\nPrevious questions asked:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\nDo NOT repeat these.`
    : '';

  const { text } = await generateText({
    systemPrompt: `You are an expert ${type} interviewer${company ? ` at ${company}` : ''}. Ask professional, insightful interview questions.`,
    prompt: `Generate ONE ${difficulty} ${type} interview question for a ${role} candidate.${prevQContext}

Return ONLY the question, no explanations, no numbering, no preamble.`,
    maxTokens: 150,
    temperature: 0.8,
  });

  return text;
}

export async function evaluateInterviewAnswer(params: {
  question: string;
  answer: string;
  type: string;
  role?: string;
}): Promise<{
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  betterAnswer: string;
}> {
  const { question, answer, type, role = 'Software Engineer' } = params;

  const { text } = await generateText({
    systemPrompt: `You are an expert ${type} interviewer evaluating a ${role} candidate. Be constructive and specific.`,
    prompt: `Evaluate this interview answer:

Question: ${question}

Answer: ${answer}

Provide evaluation in this EXACT JSON format:
{
  "score": <0-100>,
  "feedback": "<2-3 sentence overall feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "betterAnswer": "<ideal answer in 2-3 sentences>"
}

Return ONLY valid JSON.`,
    maxTokens: 500,
    temperature: 0.3,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}

  return {
    score: 65,
    feedback: 'Good attempt. Keep practicing to improve your answers.',
    strengths: ['Clear communication'],
    improvements: ['Add more specific examples', 'Use the STAR method'],
    betterAnswer: 'Focus on specific examples and quantifiable results.',
  };
}

// =============================================
// SPEECH CORRECTION AI
// =============================================

export async function correctSpeech(transcript: string): Promise<{
  corrections: Array<{
    original: string;
    corrected: string;
    type: 'grammar' | 'vocabulary' | 'filler' | 'pronunciation';
    explanation: string;
  }>;
  improvedText: string;
  score: number;
  fillerWords: string[];
  suggestions: string[];
}> {
  const { text } = await generateText({
    systemPrompt: 'You are an expert English communication coach specializing in interview preparation. Identify and correct all grammar, vocabulary, and speaking issues.',
    prompt: `Analyze this spoken text for errors:
"${transcript}"

Return ONLY this JSON:
{
  "corrections": [
    {
      "original": "<wrong phrase>",
      "corrected": "<correct phrase>",
      "type": "grammar|vocabulary|filler|pronunciation",
      "explanation": "<brief why>"
    }
  ],
  "improvedText": "<full corrected version>",
  "score": <0-100 communication quality>,
  "fillerWords": ["<filler1>", "<filler2>"],
  "suggestions": ["<tip1>", "<tip2>"]
}`,
    maxTokens: 600,
    temperature: 0.2,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}

  return {
    corrections: [],
    improvedText: transcript,
    score: 70,
    fillerWords: [],
    suggestions: ['Practice speaking slowly and clearly'],
  };
}

// =============================================
// DAILY CHALLENGE GENERATOR
// =============================================

export async function generateDailyChallenge(params: {
  userId: string;
  weakAreas?: string[];
  level?: number;
  previousChallenges?: string[];
}): Promise<{
  type: string;
  topic: string;
  prompt: string;
  difficulty: string;
  tips: string[];
}> {
  const { weakAreas = [], level = 1, previousChallenges = [] } = params;

  const { text } = await generateText({
    systemPrompt: 'You are an expert interview coach creating personalized daily challenges for interview preparation.',
    prompt: `Create a daily interview challenge.
User level: ${level}
Weak areas: ${weakAreas.join(', ') || 'general'}
Previous challenge topics: ${previousChallenges.join(', ') || 'none'}

Return ONLY this JSON:
{
  "type": "introduction|convince|explain|debate|describe|story",
  "topic": "<specific topic>",
  "prompt": "<clear 2-3 sentence challenge prompt>",
  "difficulty": "easy|medium|hard",
  "tips": ["<tip1>", "<tip2>", "<tip3>"]
}`,
    maxTokens: 300,
    temperature: 0.8,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}

  return {
    type: 'introduction',
    topic: 'Self Introduction',
    prompt: 'Introduce yourself in 60 seconds as if you\'re in a real interview. Highlight your key skills and why you want this role.',
    difficulty: 'easy',
    tips: ['Keep it under 60 seconds', 'Mention your top 3 skills', 'End with your career goal'],
  };
}

// =============================================
// AI MENTOR CHAT
// =============================================

export async function mentorChat(params: {
  message: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  userContext?: {
    name?: string;
    targetRole?: string;
    targetCompany?: string;
    weakAreas?: string[];
    jobReadyScore?: number;
  };
}): Promise<string> {
  const { message, conversationHistory, userContext } = params;

  const contextStr = userContext
    ? `Student: ${userContext.name || 'Student'} | Target: ${userContext.targetRole || 'Software Engineer'} | Company: ${userContext.targetCompany || 'TBD'} | Job Ready Score: ${userContext.jobReadyScore || 50}/100`
    : '';

  const historyStr = conversationHistory.slice(-8).map(
    (m) => `<|${m.role === 'user' ? 'user' : 'assistant'}|>\n${m.content}`
  ).join('\n');

  const { text } = await generateText({
    systemPrompt: `You are Alex, a warm, expert AI career mentor at InterviewVerse. You help college students prepare for placements and interviews. You are encouraging, specific, and practical.

${contextStr}

Your capabilities: career advice, interview prep, grammar correction, resume feedback, company research, motivation, study planning. Keep responses concise (3-5 sentences max unless asked for more). Be conversational and supportive.`,
    prompt: `${historyStr}
<|user|>
${message}
<|assistant|>`,
    maxTokens: 400,
    temperature: 0.7,
  });

  return text || "I'm here to help! Could you rephrase that so I can give you the best advice?";
}

// =============================================
// VOCABULARY GENERATOR
// =============================================

export async function generateVocabularyWord(word: string): Promise<{
  meaning: string;
  pronunciation: string;
  partOfSpeech: string;
  synonyms: string[];
  antonyms: string[];
  exampleSentence: string;
  interviewUsage: string;
  difficulty: string;
  category: string;
}> {
  const { text } = await generateText({
    systemPrompt: 'You are an expert in professional English vocabulary for job interviews and placements.',
    prompt: `Provide complete vocabulary information for the word: "${word}"

Return ONLY this JSON:
{
  "meaning": "<clear definition>",
  "pronunciation": "<phonetic: /wərd/>",
  "partOfSpeech": "noun|verb|adjective|adverb",
  "synonyms": ["<syn1>", "<syn2>", "<syn3>"],
  "antonyms": ["<ant1>", "<ant2>"],
  "exampleSentence": "<professional example sentence>",
  "interviewUsage": "<how to use in an interview context>",
  "difficulty": "easy|medium|hard|advanced",
  "category": "professional|technical|behavioral|general"
}`,
    maxTokens: 300,
    temperature: 0.3,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}

  return {
    meaning: 'Definition not available',
    pronunciation: `/${word}/`,
    partOfSpeech: 'noun',
    synonyms: [],
    antonyms: [],
    exampleSentence: `The candidate used "${word}" effectively.`,
    interviewUsage: `Use "${word}" to demonstrate professional communication.`,
    difficulty: 'medium',
    category: 'professional',
  };
}

// =============================================
// RESUME ANALYZER
// =============================================

export async function analyzeResume(resumeText: string): Promise<{
  skills: string[];
  projects: Array<{ name: string; description: string; technologies: string[] }>;
  experience: Array<{ company: string; role: string; duration: string; highlights: string[] }>;
  achievements: string[];
  education: Array<{ institution: string; degree: string; year: string }>;
  overallScore: number;
  suggestions: string[];
  generatedQuestions: {
    behavioral: string[];
    technical: string[];
    projectBased: string[];
  };
}> {
  const { text } = await generateText({
    systemPrompt: 'You are an expert HR professional and career coach. Analyze resumes and generate targeted interview preparation materials.',
    prompt: `Analyze this resume and extract key information:

${resumeText.substring(0, 3000)}

Return ONLY this JSON:
{
  "skills": ["<skill1>", "<skill2>"],
  "projects": [{"name": "<name>", "description": "<desc>", "technologies": ["<tech1>"]}],
  "experience": [{"company": "<co>", "role": "<role>", "duration": "<dur>", "highlights": ["<h1>"]}],
  "achievements": ["<achievement1>"],
  "education": [{"institution": "<inst>", "degree": "<deg>", "year": "<year>"}],
  "overallScore": <0-100>,
  "suggestions": ["<improvement1>", "<improvement2>"],
  "generatedQuestions": {
    "behavioral": ["<q1>", "<q2>", "<q3>"],
    "technical": ["<q1>", "<q2>", "<q3>"],
    "projectBased": ["<q1>", "<q2>", "<q3>"]
  }
}`,
    maxTokens: 1500,
    temperature: 0.3,
  });

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}

  return {
    skills: [],
    projects: [],
    experience: [],
    achievements: [],
    education: [],
    overallScore: 60,
    suggestions: ['Add quantifiable achievements', 'Include relevant keywords'],
    generatedQuestions: {
      behavioral: ['Tell me about yourself.'],
      technical: ['Describe your technical skills.'],
      projectBased: ['Walk me through your most challenging project.'],
    },
  };
}

// =============================================
// JOB READINESS SCORE
// =============================================

export async function calculateJobReadinessAdvice(profile: {
  grammarScore: number;
  vocabularyScore: number;
  confidenceScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  hrReadinessScore: number;
  technicalScore: number;
  resumeScore: number;
  totalInterviews: number;
  streak: number;
}): Promise<{
  overallScore: number;
  breakdown: Record<string, number>;
  topStrengths: string[];
  urgentImprovements: string[];
  weeklyGoal: string;
}> {
  const scores = {
    communication: Math.round((profile.grammarScore + profile.vocabularyScore + profile.fluencyScore) / 3),
    confidence: profile.confidenceScore,
    pronunciation: profile.pronunciationScore,
    hrReadiness: profile.hrReadinessScore,
    technical: profile.technicalScore,
    resume: profile.resumeScore,
  };

  const weights = { communication: 0.25, confidence: 0.2, pronunciation: 0.1, hrReadiness: 0.2, technical: 0.15, resume: 0.1 };
  const overallScore = Math.round(
    Object.entries(scores).reduce((sum, [key, val]) => sum + val * (weights[key as keyof typeof weights] || 0.1), 0)
  );

  const strengths = Object.entries(scores).filter(([, v]) => v >= 75).map(([k]) => k);
  const weaknesses = Object.entries(scores).filter(([, v]) => v < 60).map(([k]) => k);

  return {
    overallScore,
    breakdown: scores,
    topStrengths: strengths.slice(0, 3),
    urgentImprovements: weaknesses.slice(0, 3),
    weeklyGoal: weaknesses.length > 0
      ? `Focus on improving your ${weaknesses[0]} this week with daily 15-min practice`
      : 'Maintain your excellent scores and attempt company-specific interviews',
  };
}
