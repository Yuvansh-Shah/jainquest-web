'use client';

import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useApp } from '@/state/app-context';
import { useT } from '@/state/language';
import { MagicCard } from '@/components/magic-card';

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  content: string;
  createdAt: Date | null;
  likesCount: number;
  repliesCount: number;
  likedBy: string[];
}

function handleFor(name: string, uid: string): string {
  const t = name.trim();
  // (Mirrors the regex bug fix from the mobile review.)
  return t ? `@${t.toLowerCase().replace(/\s+/g, '')}` : `@user${uid.slice(0, 4)}`;
}

export default function ForumPage() {
  const { user } = useApp();
  const t = useT();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [openReplies, setOpenReplies] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc')),
      (snap) => {
        setPosts(
          snap.docs.map((d) => {
            const x = d.data();
            const ts = x.createdAt;
            return {
              id: d.id,
              authorId: x.authorId ?? '',
              authorName: x.authorName ?? 'Learner',
              authorHandle: x.authorHandle ?? '',
              content: x.content ?? '',
              createdAt: ts instanceof Timestamp ? ts.toDate() : null,
              likesCount: x.likesCount ?? 0,
              repliesCount: x.repliesCount ?? 0,
              likedBy: Array.isArray(x.likedBy) ? x.likedBy : [],
            };
          }),
        );
      },
    );
    return () => unsub();
  }, []);

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    const text = content.trim();
    const uid = auth.currentUser?.uid;
    if (!text || !uid || busy) return;
    setBusy(true);
    try {
      const name = (user?.displayName ?? 'Learner').trim();
      await addDoc(collection(db, 'forum_posts'), {
        authorId: uid,
        authorName: name,
        authorHandle: handleFor(name, uid),
        category: 'general',
        communityId: 'general',
        content: text,
        tags: [],
        createdAt: serverTimestamp(),
        likesCount: 0,
        repliesCount: 0,
        likedBy: [],
      });
      setContent('');
    } finally {
      setBusy(false);
    }
  }

  async function toggleLike(post: Post) {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const ref = doc(db, 'forum_posts', post.id);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const data = snap.data();
      const likedBy: string[] = Array.isArray(data.likedBy)
        ? data.likedBy
        : [];
      const liked = likedBy.includes(uid);
      tx.update(ref, {
        likedBy: liked
          ? likedBy.filter((x) => x !== uid)
          : [...likedBy, uid],
        likesCount: (data.likesCount ?? 0) + (liked ? -1 : 1),
      });
    });
  }

  async function deletePost(post: Post) {
    const me = auth.currentUser?.uid;
    if (!me || me !== post.authorId) return;
    if (!window.confirm(t('forum.deleteConfirm'))) return;
    await deleteDoc(doc(db, 'forum_posts', post.id));
  }

  const uid = auth.currentUser?.uid ?? '';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">{t('forum.title')}</h1>

      <form onSubmit={createPost} className="card p-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder={t('forum.placeholder')}
          className="w-full resize-none rounded-xl border border-border bg-surface-2 px-4 py-3 outline-none focus:border-primary"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={busy || !content.trim()}
            className="rounded-full bg-primary px-6 py-2.5 font-bold text-white hover:bg-primary-strong disabled:opacity-50"
          >
            {t('forum.post')}
          </button>
        </div>
      </form>

      {posts.length === 0 && (
        <p className="text-muted">{t('forum.empty')}</p>
      )}

      <div className="space-y-3">
        {posts.map((p) => {
          const liked = p.likedBy.includes(uid);
          return (
            <MagicCard
              key={p.id}
              className="card p-5"
              enableStars={false}
              enableMagnetism={false}
              clickEffect={false}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-bold">
                  {p.authorName[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="text-sm">
                  <p className="font-bold">{p.authorName}</p>
                  <p className="text-xs text-muted">
                    {p.authorHandle}
                    {p.createdAt
                      ? ` · ${p.createdAt.toLocaleDateString()}`
                      : ''}
                  </p>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line leading-relaxed">
                {p.content}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm font-bold text-muted">
                <button
                  type="button"
                  onClick={() => toggleLike(p)}
                  className={liked ? 'text-primary' : 'hover:text-foreground'}
                >
                  {liked ? t('forum.liked') : t('forum.like')} ·{' '}
                  {p.likesCount}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOpenReplies(openReplies === p.id ? null : p.id)
                  }
                  className="hover:text-foreground"
                >
                  {t('forum.replies')} · {p.repliesCount}
                </button>
                {p.authorId === uid && (
                  <button
                    type="button"
                    onClick={() => deletePost(p)}
                    aria-label={t('forum.delete')}
                    className="ml-auto text-danger hover:underline"
                  >
                    {t('forum.delete')}
                  </button>
                )}
              </div>
              {openReplies === p.id && <Replies postId={p.id} />}
            </MagicCard>
          );
        })}
      </div>
    </div>
  );
}

function Replies({ postId }: { postId: string }) {
  const { user } = useApp();
  const t = useT();
  const [replies, setReplies] = useState<
    { id: string; authorId: string; authorName: string; content: string }[]
  >([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'forum_posts', postId, 'replies'),
        orderBy('createdAt', 'asc'),
      ),
      (snap) => {
        setReplies(
          snap.docs.map((d) => ({
            id: d.id,
            authorId: d.data().authorId ?? '',
            authorName: d.data().authorName ?? 'Learner',
            content: d.data().content ?? '',
          })),
        );
      },
    );
    return () => unsub();
  }, [postId]);

  async function addReply(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    const uid = auth.currentUser?.uid;
    if (!body || !uid || busy) return;
    setBusy(true);
    try {
      const name = (user?.displayName ?? 'Learner').trim();
      await runTransaction(db, async (tx) => {
        const postRef = doc(db, 'forum_posts', postId);
        const postSnap = await tx.get(postRef);
        const replyRef = doc(collection(db, 'forum_posts', postId, 'replies'));
        tx.set(replyRef, {
          authorId: uid,
          authorName: name,
          authorHandle: handleFor(name, uid),
          content: body,
          parentId: null,
          createdAt: serverTimestamp(),
        });
        tx.update(postRef, {
          repliesCount: (postSnap.data()?.repliesCount ?? 0) + 1,
        });
      });
      setText('');
    } finally {
      setBusy(false);
    }
  }

  async function deleteReply(replyId: string) {
    const me = auth.currentUser?.uid;
    if (!me) return;
    await runTransaction(db, async (tx) => {
      const postRef = doc(db, 'forum_posts', postId);
      const postSnap = await tx.get(postRef);
      const replyRef = doc(db, 'forum_posts', postId, 'replies', replyId);
      tx.delete(replyRef);
      tx.update(postRef, {
        repliesCount: Math.max(0, (postSnap.data()?.repliesCount ?? 1) - 1),
      });
    });
  }

  const me = auth.currentUser?.uid ?? '';

  return (
    <div className="mt-4 border-t border-border pt-4">
      <div className="space-y-2">
        {replies.map((r) => (
          <div
            key={r.id}
            className="flex items-start gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm"
          >
            <span className="min-w-0 flex-1">
              <span className="font-bold">{r.authorName}: </span>
              <span>{r.content}</span>
            </span>
            {r.authorId === me && (
              <button
                type="button"
                onClick={() => deleteReply(r.id)}
                aria-label={t('forum.delete')}
                className="shrink-0 text-xs font-bold text-danger hover:underline"
              >
                {t('forum.delete')}
              </button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={addReply} className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('forum.replyPh')}
          className="flex-1 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy || !text.trim()}
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          {t('forum.sendReply')}
        </button>
      </form>
    </div>
  );
}
