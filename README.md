# 🧠 InterviewVerse AI

> **The World's Most Engaging AI-Powered Communication Learning Platform**  
> Combining Duolingo engagement · ChatGPT intelligence · Realistic mock interviews

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![IBM watsonx.ai](https://img.shields.io/badge/IBM-watsonx.ai-blue?logo=ibm)](https://www.ibm.com/products/watsonx-ai)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase)](https://firebase.google.com)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication Flow](#authentication-flow)
8. [IBM watsonx.ai Integration](#ibm-watsonxai-integration)
9. [Setup & Installation](#setup--installation)
10. [Environment Variables](#environment-variables)
11. [Deployment](#deployment)
12. [Security](#security)

---

## 🎯 Overview

InterviewVerse AI is a production-ready, full-stack web application that transforms interview preparation into an engaging, gamified learning experience. Built for college students and young professionals targeting placement season.

**Key differentiators:**
- 🤖 **Real AI conversations** powered by IBM watsonx.ai (Llama-3-70B)
- 🎮 **Gamification engine** — XP, levels, streaks, achievements, leaderboards
- 📊 **Deep analytics** — Radar charts, heat maps, skill breakdowns
- 🗣️ **Voice interviews** — Speech-to-text via IBM Watson STT
- 📝 **Resume AI** — Auto-extract skills and generate targeted questions
- 🌟 **7-stage learning journey** — From Foundation to Dream Company Interview

---

## ✨ Features

### 1. 🗺️ AI Communication Journey
7-stage progressive learning path:
```
Foundation → Daily English → Professional English → 
Interview Communication → Group Discussion → 
Presentation Skills → Dream Company Interview
```

### 2. 🤖 AI Avatar Interviewer
5 unique AI personas with distinct personalities:
- **Sarah Chen** — HR Manager (empathetic, culture-focused)
- **Mike Johnson** — Google Recruiter (data-driven, STAR method)
- **Priya Sharma** — Startup Founder (fast-paced, initiative-focused)
- **Alex Kumar** — Technical Lead (system design, architecture)
- **Emma Wilson** — Friendly Mentor (supportive, confidence building)

### 3. 🎙️ Real-Time Speech Correction
- Grammar error detection
- Filler word tracking ("um", "uh", "like")
- Speaking speed analysis
- Confidence scoring
- Instant corrections displayed inline

### 4. 📊 Interview Heat Map
Post-interview analytics:
- Radar chart (Grammar, Vocabulary, Confidence, Fluency, Pronunciation, Speed)
- Timeline view of performance
- Score trends over time
- Weak area identification

### 5. 🎯 Daily AI Challenge
Personalized daily tasks:
- Self-introduction (60 seconds)
- Convince-the-AI exercises
- Technical explanations to non-tech HR
- Debate challenges
- Roleplay scenarios

### 6. 📖 AI Story Builder
Interactive career roleplay:
- First Day at Google
- Salary Negotiation
- Handling a Difficult Client
- Presentation Day
- Meeting Your Manager

### 7. 🗺️ Career Roadmaps
6 specialized paths:
- Software Engineer (8 weeks)
- Data Scientist (10 weeks)
- UI/UX Designer (6 weeks)
- Cybersecurity (12 weeks)
- Cloud Engineer (10 weeks)
- Business Analyst (7 weeks)

### 8. 📚 Vocabulary Builder
- Professional English word bank
- IBM watsonx.ai generated definitions
- Spaced repetition algorithm
- Quiz mode, flashcard mode, card mode
- Interview usage examples

### 9. 📈 Job Readiness Score (0-100)
Composite score based on:
- Communication (25%)
- Confidence (20%)
- Pronunciation (10%)
- HR Readiness (20%)
- Technical Skills (15%)
- Resume Quality (10%)

### 10. 📄 Resume AI Analyzer
- PDF upload & text paste support
- Skills extraction
- Project analysis
- Auto-generated interview questions (Behavioral, Technical, Project-based)
- Improvement suggestions

### 11. 💬 AI Mentor (Alex)
Persistent chatbot powered by IBM watsonx.ai:
- Career advice
- Grammar correction
- Company preparation
- Resume feedback
- Motivation & study planning
- Conversation history preservation

### 12. 🏆 Gamification Engine
- XP & Levels (progressive threshold formula)
- Coins economy
- Daily streak tracking
- Achievement system (8+ achievements)
- Badges
- Leaderboards (weekly/monthly/all-time)

### 13. 👥 Social Features
- Friend system
- Challenge system (vocabulary battles, mock races)
- Study groups
- College leaderboard

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14 | React framework with App Router |
| **TypeScript** | 5 | Type safety |
| **TailwindCSS** | 3.4 | Utility-first styling |
| **Framer Motion** | 11 | Animations |
| **Recharts** | 2.12 | Data visualization |
| **Lucide React** | 0.400 | Icons |
| **React Hook Form** | 7.52 | Form handling |
| **Zod** | 3.23 | Schema validation |
| **SWR** | 2.2 | Data fetching & caching |
| **Zustand** | 4.5 | State management |
| **React Hot Toast** | 2.4 | Notifications |

### Backend (Next.js API Routes)
| Technology | Purpose |
|-----------|---------|
| **Next.js API Routes** | Serverless API endpoints |
| **Prisma ORM** | Type-safe database client |
| **PostgreSQL** | Primary database |
| **Firebase Admin SDK** | Server-side auth verification |

### Authentication
| Technology | Purpose |
|-----------|---------|
| **Firebase Auth** | OAuth (Google, GitHub) + Email/Password |
| **Firebase Admin SDK** | Token verification in API routes |

### AI & ML
| Technology | Purpose |
|-----------|---------|
| **IBM watsonx.ai** | Llama-3-70B for all AI text generation |
| **IBM Watson STT** | Speech-to-Text transcription |
| **IBM Watson TTS** | Text-to-Speech (AI interviewer voice) |
| **IBM Watson NLU** | Natural Language Understanding |

### Storage & Deployment
| Technology | Purpose |
|-----------|---------|
| **Supabase** | File storage (resumes, audio) |
| **Vercel** | Frontend deployment |
| **PostgreSQL (Supabase)** | Production database |

---

## 📁 Project Structure

```
interviewverse-ai/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── register/route.ts       # User registration
│   │   ├── user/
│   │   │   └── profile/route.ts        # Get/Update user profile
│   │   ├── interview/
│   │   │   ├── question/route.ts       # Generate interview questions
│   │   │   ├── evaluate/route.ts       # Evaluate answers with AI
│   │   │   └── complete/route.ts       # Save completed session
│   │   ├── mentor/
│   │   │   └── chat/route.ts           # AI Mentor chat
│   │   ├── speech/
│   │   │   └── transcribe/route.ts     # STT transcription
│   │   ├── vocabulary/
│   │   │   └── generate/route.ts       # Generate word data
│   │   ├── challenge/
│   │   │   └── evaluate/route.ts       # Evaluate daily challenges
│   │   └── resume/
│   │       └── analyze/route.ts        # AI resume analysis
│   ├── auth/
│   │   ├── login/page.tsx              # Login page
│   │   └── register/page.tsx           # Registration page
│   ├── dashboard/
│   │   ├── layout.tsx                  # Dashboard layout + sidebar
│   │   ├── page.tsx                    # Main dashboard
│   │   ├── journey/page.tsx            # AI Communication Journey
│   │   ├── interview/page.tsx          # Mock Interview
│   │   ├── challenge/page.tsx          # Daily Challenge
│   │   ├── vocabulary/page.tsx         # Vocabulary Builder
│   │   ├── analytics/page.tsx          # Communication Analytics
│   │   ├── mentor/page.tsx             # AI Mentor Chat
│   │   ├── roadmaps/page.tsx           # Career Roadmaps
│   │   ├── stories/page.tsx            # AI Story Builder
│   │   ├── resume/page.tsx             # Resume AI Analyzer
│   │   ├── social/page.tsx             # Social Features
│   │   ├── leaderboard/page.tsx        # Leaderboard
│   │   └── settings/page.tsx           # User Settings
│   ├── globals.css                     # Global styles + Glassmorphism
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Landing page
├── contexts/
│   └── AuthContext.tsx                 # Firebase auth context
├── lib/
│   ├── prisma.ts                       # Prisma client singleton
│   ├── firebase.ts                     # Firebase client config
│   ├── firebase-admin.ts               # Firebase Admin SDK
│   ├── watsonx.ts                      # IBM watsonx.ai integration
│   └── utils.ts                        # Utility functions + constants
├── prisma/
│   └── schema.prisma                   # Complete database schema
├── middleware.ts                       # Next.js middleware
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🗄️ Database Schema

### Core Models
```prisma
User          # Core user + XP/coins/streak/level
UserProfile   # Skill scores, learning stats
InterviewSession  # Mock interview sessions
InterviewQuestion # Individual Q&A pairs
SpeechAnalysis    # Voice analysis data
DailyChallenge    # Daily challenge completions
VocabularyWord    # Global word bank
UserVocabulary    # User's word progress (spaced rep)
CareerRoadmap     # Career learning paths
RoadmapProgress   # User's roadmap progress
Analytics         # Daily metrics
MentorChat        # Conversation history
Achievement       # Achievement definitions
UserAchievement   # Earned achievements
Badge             # Badge definitions
UserBadge         # Earned badges
Friendship        # Friend connections
LeaderboardEntry  # Leaderboard data
SpeechPractice    # Pronunciation practice
Story             # Interactive stories
StoryScene        # Story scene data
StoryProgress     # User story progress
Notification      # User notifications
ResumeAnalysis    # AI resume analysis results
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| GET | `/api/user/profile` | Get current user profile |
| PATCH | `/api/user/profile` | Update user profile |

### Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/question` | Generate AI interview question |
| POST | `/api/interview/evaluate` | Evaluate answer with AI |
| POST | `/api/interview/complete` | Save completed session + update XP |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mentor/chat` | AI Mentor conversation |
| POST | `/api/speech/transcribe` | Convert audio to text (IBM Watson STT) |
| POST | `/api/vocabulary/generate` | Generate word data with AI |
| POST | `/api/challenge/evaluate` | Evaluate daily challenge response |
| POST | `/api/resume/analyze` | AI resume analysis |

---

## 🔐 Authentication Flow

```
1. User clicks "Sign In with Google" / Email
2. Firebase Auth handles OAuth / Email-Password flow
3. Firebase returns ID token to client
4. Client calls /api/auth/register with ID token
5. Server verifies token via Firebase Admin SDK
6. Server creates/finds User record in PostgreSQL
7. AuthContext stores user state globally
8. Protected routes check auth in LoadingGuard component
9. All API calls include Authorization: Bearer <token> header
10. API routes verify token before any DB operations
```

---

## 🤖 IBM watsonx.ai Integration

### Model Used
- **Model**: `meta-llama/llama-3-70b-instruct`
- **Service**: IBM watsonx.ai
- **Region**: us-south

### Functions in `lib/watsonx.ts`

```typescript
generateText()              // Core text generation
generateInterviewQuestion() // Context-aware questions
evaluateInterviewAnswer()   // Scoring + detailed feedback
correctSpeech()             // Grammar/filler detection
generateDailyChallenge()    // Personalized challenges
mentorChat()                // Conversational AI mentor
generateVocabularyWord()    // Word data generation
analyzeResume()             // Resume parsing + Q generation
calculateJobReadinessAdvice() // Scoring + recommendations
```

### Prompt Engineering
All prompts use structured JSON output format for reliable parsing:
```
<|system|>
{system_context}
<|user|>
{user_prompt}
<|assistant|>
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- PostgreSQL database
- Firebase project
- IBM Cloud account with watsonx.ai access

### 1. Clone & Install
```bash
git clone https://github.com/your-org/interviewverse-ai
cd interviewverse-ai
npm install
```

### 2. Configure Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### 3. Setup Database
```bash
npm run prisma:generate
npm run prisma:push
# Or for production migrations:
npm run prisma:migrate
```

### 4. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🔧 Environment Variables

```env
# IBM watsonx.ai
WATSONX_API_KEY=your_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase (Admin)
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_PRIVATE_KEY="..."
FIREBASE_ADMIN_CLIENT_EMAIL=...

# Database
DATABASE_URL=postgresql://user:pass@host:5432/interviewverse

# App
NEXTAUTH_SECRET=your_32_char_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Storage)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Vercel Configuration:**
1. Connect GitHub repository
2. Add all environment variables in Vercel dashboard
3. Set `DATABASE_URL` to your production PostgreSQL
4. Run `prisma migrate deploy` as build command

### Docker (Alternative)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔒 Security

### Implemented Measures
- ✅ **Firebase Auth** — Industry-grade authentication
- ✅ **Token verification** in all API routes via Firebase Admin
- ✅ **Input validation** with Zod schemas
- ✅ **Environment variables** — No secrets in code
- ✅ **HTTPS only** — Enforced by Vercel/Firebase
- ✅ **Content Security Policy** headers via Next.js
- ✅ **SQL injection prevention** via Prisma's parameterized queries
- ✅ **Rate limiting** — Add `next-rate-limit` for production
- ✅ **CORS** — Controlled via Next.js config

### Recommendations for Production
```typescript
// Add to next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
];
```

---

## 📊 Performance

- **Next.js App Router** — Partial pre-rendering, streaming
- **SWR** — Client-side caching and revalidation
- **Prisma** — Connection pooling with PgBouncer
- **Image optimization** — Next.js `<Image>` component
- **Code splitting** — Automatic route-based splitting
- **Font optimization** — `next/font` with preloading

---

## 🧪 Testing

```bash
npm test             # Run all tests
npm run test:watch   # Watch mode
```

Test coverage targets:
- API routes: Unit tests with mocked DB/AI
- Components: React Testing Library
- Utils: Pure function unit tests

---

## 📅 Roadmap

### v1.1
- [ ] IBM Watson Text-to-Speech for AI interviewer voices
- [ ] Pronunciation accuracy scoring via Watson STT
- [ ] Video mode with webcam
- [ ] Eye contact detection (Computer Vision)

### v1.2
- [ ] Company-specific question banks (Google, Amazon, Microsoft)
- [ ] Group Discussion simulator (multi-user AI)
- [ ] Mobile app (React Native)
- [ ] Offline mode with service workers

### v2.0
- [ ] AI-generated personalized curriculum
- [ ] Real interview simulation with video recording
- [ ] Employer portal for campus hiring
- [ ] Integration with LinkedIn/Naukri

---

## 👨‍💻 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📜 License

MIT License — see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- **IBM watsonx.ai** — Powering all AI features
- **Firebase** — Authentication infrastructure
- **Vercel** — Deployment platform
- **Prisma** — Database ORM
- **Framer Motion** — Animation library

---

<div align="center">

**Built with ❤️ for students who dream big**

[Live Demo](https://interviewverse.ai) · [Report Bug](https://github.com/org/interviewverse-ai/issues) · [Request Feature](https://github.com/org/interviewverse-ai/issues)

</div>
