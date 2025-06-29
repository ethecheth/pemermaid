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
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <header className="p-4 border-b flex justify-between">
              <h1 className="font-bold">pemermaid</h1>
              <ThemeToggle />
            </header>
            <main className="flex-1 p-4">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
