import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'InterviewVerse AI — Master Your Career Communication',
    template: '%s | InterviewVerse AI',
  },
  description:
    'The world\'s most engaging AI-powered communication learning platform for college students and young professionals. Master interviews, boost confidence, land your dream job.',
  keywords: [
    'interview preparation',
    'AI interview coach',
    'communication skills',
    'placement preparation',
    'mock interview',
    'vocabulary builder',
    'speech improvement',
    'career development',
    'IBM watsonx',
  ],
  authors: [{ name: 'InterviewVerse AI Team' }],
  creator: 'InterviewVerse AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://interviewverse.ai',
    title: 'InterviewVerse AI — Master Your Career Communication',
    description: 'AI-powered communication learning platform combining Duolingo engagement with ChatGPT intelligence.',
    siteName: 'InterviewVerse AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InterviewVerse AI',
    description: 'Master interviews with AI-powered coaching.',
    creator: '@interviewverse',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#050816',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(10px)',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
