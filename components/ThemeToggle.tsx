'use client';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="px-2 py-1 border rounded text-xs h-7 min-w-[44px]"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
