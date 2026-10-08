import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  let threshold = 100;
  while (xp >= threshold) {
    xp -= threshold;
    level++;
    threshold = Math.floor(100 * Math.pow(1.5, level - 1));
  }
  return level;
}

export function getXPProgress(totalXP: number): { level: number; currentXP: number; nextLevelXP: number; percentage: number } {
  let level = 1;
  let remainingXP = totalXP;
  let threshold = 100;

  while (remainingXP >= threshold) {
    remainingXP -= threshold;
    level++;
    threshold = Math.floor(100 * Math.pow(1.5, level - 1));
  }

  return {
    level,
    currentXP: remainingXP,
    nextLevelXP: threshold,
    percentage: Math.round((remainingXP / threshold) * 100),
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/30';
  if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
  if (score >= 40) return 'bg-orange-500/20 border-orange-500/30';
  return 'bg-red-500/20 border-red-500/30';
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'legendary': return 'text-yellow-400 border-yellow-400/50';
    case 'epic': return 'text-purple-400 border-purple-400/50';
    case 'rare': return 'text-blue-400 border-blue-400/50';
    default: return 'text-gray-400 border-gray-400/50';
  }
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const JOURNEY_STAGES = [
  { id: 'foundation', title: 'Foundation', icon: '🏗️', xpRequired: 0, color: '#6366f1' },
  { id: 'daily-english', title: 'Daily English', icon: '📝', xpRequired: 200, color: '#8b5cf6' },
  { id: 'professional-english', title: 'Professional English', icon: '💼', xpRequired: 500, color: '#06b6d4' },
  { id: 'interview-communication', title: 'Interview Communication', icon: '🎯', xpRequired: 1000, color: '#10b981' },
  { id: 'group-discussion', title: 'Group Discussion', icon: '👥', xpRequired: 2000, color: '#f59e0b' },
  { id: 'presentation-skills', title: 'Presentation Skills', icon: '📊', xpRequired: 3500, color: '#ef4444' },
  { id: 'dream-company', title: 'Dream Company Interview', icon: '🌟', xpRequired: 5000, color: '#ec4899' },
];

export const AVATAR_INTERVIEWERS = [
  {
    id: 'hr-manager',
    name: 'Sarah Chen',
    role: 'HR Manager',
    company: 'Fortune 500',
    personality: 'Professional, empathetic, focuses on culture fit',
    style: 'Behavioral questions, culture assessment',
    avatar: '👩‍💼',
    color: 'from-pink-500 to-rose-600',
    difficulty: 'easy',
  },
  {
    id: 'google-recruiter',
    name: 'Mike Johnson',
    role: 'Google Recruiter',
    company: 'Google',
    personality: 'Direct, data-driven, high standards',
    style: 'STAR method, structured thinking',
    avatar: '👨‍💻',
    color: 'from-blue-500 to-indigo-600',
    difficulty: 'hard',
  },
  {
    id: 'startup-founder',
    name: 'Priya Sharma',
    role: 'Startup Founder',
    company: 'Series A Startup',
    personality: 'Passionate, fast-paced, entrepreneurial mindset',
    style: 'Problem-solving, initiative, hustle culture',
    avatar: '🚀',
    color: 'from-orange-500 to-red-600',
    difficulty: 'medium',
  },
  {
    id: 'tech-lead',
    name: 'Alex Kumar',
    role: 'Technical Lead',
    company: 'FAANG',
    personality: 'Analytical, deep technical knowledge, detail-oriented',
    style: 'System design, coding, architecture questions',
    avatar: '⚙️',
    color: 'from-cyan-500 to-blue-600',
    difficulty: 'hard',
  },
  {
    id: 'friendly-mentor',
    name: 'Emma Wilson',
    role: 'Friendly Mentor',
    company: 'Career Coach',
    personality: 'Supportive, encouraging, constructive feedback',
    style: 'Confidence building, mock practice',
    avatar: '🌟',
    color: 'from-emerald-500 to-teal-600',
    difficulty: 'easy',
  },
];

export const CAREER_ROADMAPS = [
  { slug: 'software-engineer', title: 'Software Engineer', icon: '💻', color: 'from-blue-500 to-indigo-600', weeks: 8 },
  { slug: 'data-scientist', title: 'Data Scientist', icon: '📊', color: 'from-purple-500 to-violet-600', weeks: 10 },
  { slug: 'ui-ux-designer', title: 'UI/UX Designer', icon: '🎨', color: 'from-pink-500 to-rose-600', weeks: 6 },
  { slug: 'cybersecurity', title: 'Cybersecurity', icon: '🔒', color: 'from-red-500 to-orange-600', weeks: 12 },
  { slug: 'cloud-engineer', title: 'Cloud Engineer', icon: '☁️', color: 'from-cyan-500 to-blue-600', weeks: 10 },
  { slug: 'business-analyst', title: 'Business Analyst', icon: '📈', color: 'from-emerald-500 to-teal-600', weeks: 7 },
];

export const ACHIEVEMENT_LIST = [
  { slug: 'first-interview', title: 'First Steps', description: 'Complete your first mock interview', icon: '🎯', rarity: 'common', xpReward: 50 },
  { slug: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', rarity: 'rare', xpReward: 200 },
  { slug: 'streak-30', title: 'Monthly Legend', description: 'Maintain a 30-day streak', icon: '⚡', rarity: 'epic', xpReward: 1000 },
  { slug: 'vocab-100', title: 'Word Wizard', description: 'Learn 100 vocabulary words', icon: '📚', rarity: 'rare', xpReward: 300 },
  { slug: 'perfect-score', title: 'Perfectionist', description: 'Score 100% in any interview', icon: '💯', rarity: 'epic', xpReward: 500 },
  { slug: 'interview-10', title: 'Interview Pro', description: 'Complete 10 mock interviews', icon: '🏆', rarity: 'rare', xpReward: 400 },
  { slug: 'job-ready-80', title: 'Job Ready', description: 'Achieve 80+ Job Readiness Score', icon: '✨', rarity: 'legendary', xpReward: 1500 },
  { slug: 'social-butterfly', title: 'Social Butterfly', description: 'Add 5 friends', icon: '🦋', rarity: 'common', xpReward: 100 },
];
