import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#080c14',
};

export const metadata: Metadata = {
  title: 'DevTrack | Developer Productivity & Engineering Dashboard',
  description:
    'Real-time engineering metrics, project progress, sprint tasks, focus deep-work stopwatch, and developer telemetry in one unified workspace.',
  keywords: [
    'Developer Productivity',
    'Engineering Dashboard',
    'Sprint Management',
    'Focus Timer',
    'Git Analytics',
    'Software Architecture',
  ],
  authors: [{ name: 'DevTrack Team' }],
};

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
