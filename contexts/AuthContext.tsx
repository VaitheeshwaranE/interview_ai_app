'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';

import {
  auth,
  googleProvider,
  githubProvider,
} from '@/lib/firebase';

import { useRouter } from 'next/navigation';

/* =========================================================
   USER PROFILE TYPE
========================================================= */

interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;

  avatar?: string;

  targetRole?: string;
  targetCompany?: string;

  xp: number;
  level: number;
  coins: number;
  streak: number;
  jobReadyScore: number;

  profile?: {
    grammarScore: number;
    vocabularyScore: number;
    confidenceScore: number;
    fluencyScore: number;
    currentJourneyStage: string;
    wordsLearned: number;
    totalInterviews: number;
  };
}

/* =========================================================
   AUTH CONTEXT TYPE
========================================================= */

interface AuthContextType {
  user: FirebaseUser | null;

  userProfile: UserProfile | null;

  loading: boolean;

  signInWithGoogle: () => Promise<void>;

  signInWithGithub: () => Promise<void>;

  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<void>;

  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;

  signOut: () => Promise<void>;

  resetPassword: (
    email: string
  ) => Promise<void>;

  /*
   * Refresh user profile from PostgreSQL
   *
   * This is important for:
   * XP
   * Level
   * Coins
   * Streak
   * Job Ready Score
   */
  refreshProfile: () => Promise<void>;
}

/* =========================================================
   CREATE CONTEXT
========================================================= */

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/* =========================================================
   AUTH PROVIDER
========================================================= */

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<FirebaseUser | null>(null);

  const [userProfile, setUserProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const router = useRouter();

  /* =======================================================
     FETCH USER PROFILE
  ======================================================= */

  const fetchUserProfile = useCallback(
    async (firebaseUser: FirebaseUser) => {
      try {
        /*
         * Get Firebase authentication token
         */
        const token =
          await firebaseUser.getIdToken();

        /*
         * Fetch latest profile from PostgreSQL
         */
        const res = await fetch(
          '/api/user/profile',
          {
            method: 'GET',

            headers: {
              Authorization: `Bearer ${token}`,
            },

            /*
             * Prevent browser from using
             * stale cached profile data.
             */
            cache: 'no-store',
          }
        );

        /* =================================================
           USER PROFILE EXISTS
        ================================================= */

        if (res.ok) {
          const data = await res.json();

          /*
           * IMPORTANT:
           *
           * This replaces the old userProfile
           * with the latest PostgreSQL data.
           *
           * Example:
           *
           * Before:
           * xp = 5000
           *
           * Database:
           * xp = 5020
           *
           * After this:
           * userProfile.xp = 5020
           */
          setUserProfile(data.user);

          return;
        }

        /* =================================================
           USER PROFILE DOES NOT EXIST
        ================================================= */

        if (res.status === 404) {
          const createRes = await fetch(
            '/api/auth/register',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                email:
                  firebaseUser.email,

                name:
                  firebaseUser.displayName ||
                  'User',

                avatar:
                  firebaseUser.photoURL,
              }),
            }
          );

          if (createRes.ok) {
            const data =
              await createRes.json();

            setUserProfile(data.user);
          }
        }
      } catch (error) {
        console.error(
          'Error fetching user profile:',
          error
        );
      }
    },
    []
  );

  /* =======================================================
     REFRESH PROFILE
  ======================================================= */

  const refreshProfile = useCallback(
    async () => {
      /*
       * If Firebase user exists,
       * fetch the latest PostgreSQL profile.
       */
      if (!user) {
        return;
      }

      await fetchUserProfile(user);
    },
    [user, fetchUserProfile]
  );

  /* =======================================================
     AUTH STATE LISTENER
  ======================================================= */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          setUser(firebaseUser);

          if (firebaseUser) {
            await fetchUserProfile(
              firebaseUser
            );
          } else {
            setUserProfile(null);
          }

          setLoading(false);
        }
      );

    return () => {
      unsubscribe();
    };
  }, [fetchUserProfile]);

  /* =======================================================
     GOOGLE SIGN IN
  ======================================================= */

  const signInWithGoogle =
    async (): Promise<void> => {
      try {
        await signInWithPopup(
          auth,
          googleProvider
        );

        router.push('/dashboard');
      } catch (error) {
        console.error(
          'Google sign in error:',
          error
        );

        throw error;
      }
    };

  /* =======================================================
     GITHUB SIGN IN
  ======================================================= */

  const signInWithGithub =
    async (): Promise<void> => {
      try {
        await signInWithPopup(
          auth,
          githubProvider
        );

        router.push('/dashboard');
      } catch (error) {
        console.error(
          'Github sign in error:',
          error
        );

        throw error;
      }
    };

  /* =======================================================
     EMAIL SIGN IN
  ======================================================= */

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      router.push('/dashboard');
    } catch (error) {
      console.error(
        'Email sign in error:',
        error
      );

      throw error;
    }
  };

  /* =======================================================
     EMAIL SIGN UP
  ======================================================= */

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
  ): Promise<void> => {
    try {
      const {
        user: newUser,
      } =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      /*
       * Set Firebase display name
       */
      await updateProfile(
        newUser,
        {
          displayName: name,
        }
      );

      router.push('/dashboard');
    } catch (error) {
      console.error(
        'Sign up error:',
        error
      );

      throw error;
    }
  };

  /* =======================================================
     SIGN OUT
  ======================================================= */

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);

      setUser(null);

      setUserProfile(null);

      router.push('/');
    } catch (error) {
      console.error(
        'Sign out error:',
        error
      );

      throw error;
    }
  };

  /* =======================================================
     RESET PASSWORD
  ======================================================= */

  const resetPassword = async (
    email: string
  ): Promise<void> => {
    await sendPasswordResetEmail(
      auth,
      email
    );
  };

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <AuthContext.Provider
      value={{
        user,

        userProfile,

        loading,

        signInWithGoogle,

        signInWithGithub,

        signInWithEmail,

        signUpWithEmail,

        signOut,

        resetPassword,

        /*
         * Expose refreshProfile
         *
         * Components can now do:
         *
         * const { refreshProfile } = useAuth();
         *
         * await refreshProfile();
         */
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================================================
   USE AUTH HOOK
========================================================= */

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}