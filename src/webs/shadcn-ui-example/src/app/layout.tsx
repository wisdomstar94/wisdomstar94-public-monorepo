import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { cn } from '@/lib/utils';
import './globals.css';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sidebarState = cookieStore.get('sidebar_state');

  return (
    <html lang="ko">
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          // 'font-sans',
          sidebarState?.value,
          // fontSans.variable
          GeistSans.className
        )}
      >
        {children}
      </body>
    </html>
  );
}