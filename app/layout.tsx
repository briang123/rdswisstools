import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AIChatSheet } from '@/components/ai-chat-sheet';

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'Race Director Tools - 5K, 10K, Half Marathon, Marathon, Ultramarathon',
  description:
    'Take race results found online and turn it into a cleanly formatted, sanitized, and actionable spreadsheet.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AIChatSheet />
        </ThemeProvider>
      </body>
    </html>
  );
}
