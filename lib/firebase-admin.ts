// Firebase Admin SDK
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n').trim(),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
}),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;
