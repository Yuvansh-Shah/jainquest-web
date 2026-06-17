'use client';

import { AVATAR_EMOJIS } from '@/lib/avatars';

export function AvatarPicker({
  value,
  fallback,
  onSelect,
}: {
  value: string | null;
  fallback: string;
  onSelect: (emoji: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={!value}
        className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-extrabold transition ${
          !value
            ? 'border-primary bg-primary/15 text-primary'
            : 'border-border text-muted hover:border-primary'
        }`}
      >
        {fallback}
      </button>
      {AVATAR_EMOJIS.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onSelect(e)}
          aria-pressed={value === e}
          className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition ${
            value === e
              ? 'border-primary bg-primary/15'
              : 'border-border hover:border-primary'
          }`}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
