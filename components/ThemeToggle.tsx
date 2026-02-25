'use client';

import { MoonStar, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-border bg-card/80 p-2 text-fg shadow-soft transition hover:scale-105"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <Sun size={18} /> : <MoonStar size={18} />}
    </button>
  );
}
