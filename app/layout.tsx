import './globals.css';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import ThemeToggle from '../components/ThemeToggle';

export const metadata = {
  title: 'pemermaid',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-green-50 dark:bg-gray-900 text-green-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <header className="px-2 py-1 bg-green-100 text-green-900 shadow flex items-center justify-between h-12 min-h-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧜‍♂️</span>
                <h1 className="font-bold text-base">pemermaid</h1>
              </div>
              <ThemeToggle />
            </header>
            <main className="flex-1 p-4">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
