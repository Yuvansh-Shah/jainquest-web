// Firebase client init. This is the public web config for the same
// `jainquest-4297e` project the Flutter app uses, so both clients share data.
// (Web API keys are not secrets; access is governed by Firestore rules.)
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    'AIzaSyBZ6pgZCDLftBHSsY1G4In5WXTHz7Bv2Eg',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    'jainquest-4297e.firebaseapp.com',
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'jainquest-4297e',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    'jainquest-4297e.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '753911767862',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    '1:753911767862:web:8ba20aabba6a0cc060c997',
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-FFCBCSZ2XF',
};

export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);

// Offline IndexedDB cache so reads resolve instantly from local data and
// sync in the background. Without this, every page load (the deployed
// static site does a full reload per route) blocked the UI on Firestore
// network round-trips. The Flutter app gets this for free; the web app
// needs it enabled explicitly. Multi-tab manager avoids the single-tab
// "failed-precondition" error. Falls back to a plain instance if Firestore
// was already initialized (e.g. Fast Refresh / repeated import).
function initDb(): Firestore {
  try {
    return initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    return getFirestore(firebaseApp);
  }
}

export const db: Firestore = initDb();
export const googleProvider = new GoogleAuthProvider();
