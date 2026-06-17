'use client';

// App-wide state, mirroring the Flutter Riverpod notifiers (userProfile,
// progress, lessonRunner). Owns one StorageService per signed-in user.
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { StorageService } from '@/lib/domain/storage';
import type { ProgressState, UserProfile, AttemptLog } from '@/lib/domain/models';

type Status = 'loading' | 'unauthed' | 'ready';

interface AppState {
  status: Status;
  authUser: User | null;
  user: UserProfile | null;
  progress: ProgressState | null;
  storage: StorageService | null;
  refresh: () => void;
  addXp: (xp: number) => Promise<void>;
  loseHeart: () => Promise<void>;
  refillHeart: (amount?: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  syncHearts: () => Promise<void>;
  completeLesson: (
    lessonId: string,
    args: { score: number; xpEarned: number; nextLessonId?: string | null },
  ) => Promise<void>;
  earnBadge: (badgeId: string) => Promise<void>;
  logAttempt: (attempt: AttemptLog) => Promise<void>;
  saveProfile: (u: UserProfile) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const storageRef = useRef<StorageService | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        storageRef.current = null;
        setAuthUser(null);
        setUser(null);
        setProgress(null);
        setStatus('unauthed');
        return;
      }
      setAuthUser(fbUser);
      setStatus('loading');
      const svc = new StorageService(db, fbUser.uid);
      await svc.init();
      storageRef.current = svc;
      setUser(svc.getUserProfile());
      setProgress(svc.getProgressState());
      setStatus('ready');
    });
    return () => unsub();
  }, []);

  // Periodic + on-focus heart regen sync (kept light: 60s, not 15s).
  useEffect(() => {
    if (status !== 'ready') return;
    let cancelled = false;
    const tick = async () => {
      const svc = storageRef.current;
      if (!svc || cancelled) return;
      const updated = await svc.syncHearts();
      if (!cancelled) setUser(updated);
    };
    const id = window.setInterval(tick, 60_000);
    const onVis = () => {
      if (document.visibilityState === 'visible') void tick();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [status]);

  const refresh = () => {
    const svc = storageRef.current;
    if (!svc) return;
    setUser(svc.getUserProfile());
    setProgress(svc.getProgressState());
  };

  const value: AppState = {
    status,
    authUser,
    user,
    progress,
    storage: storageRef.current,
    refresh,
    addXp: async (xp) => setUser(await must().addXp(xp)),
    loseHeart: async () => setUser(await must().loseHeart()),
    refillHeart: async (amount = 1) =>
      setUser(await must().refillHeart(amount)),
    updateStreak: async () => setUser(await must().updateStreak()),
    syncHearts: async () => setUser(await must().syncHearts()),
    completeLesson: async (lessonId, args) =>
      setProgress(await must().completeLesson(lessonId, args)),
    earnBadge: async (badgeId) =>
      setProgress(await must().earnBadge(badgeId)),
    logAttempt: async (attempt) => must().logAttempt(attempt),
    saveProfile: async (u) => {
      await must().saveUserProfile(u);
      setUser(must().getUserProfile());
    },
    signOut: async () => {
      await fbSignOut(auth);
    },
  };

  function must(): StorageService {
    const svc = storageRef.current;
    if (!svc) throw new Error('StorageService not ready');
    return svc;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
