import Header from '@/components/Header';
import { RecipeProvider } from '@/context/RecipeSessionContext';
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { auth } from '@/lib/auth';
import './globals.css';

const bmdoHyeon = localFont({
  src: './fonts/BMDOHYEON.ttf',
  variable: '--font-bmdohyeon',
  weight: '400',
  style: 'normal',
});

export const metadata: Metadata = {
  title: '흑백 레시피',
  description: '레시피 북',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('root');
  const session = await auth();
  return (
    <html lang='en'>
      <body className={`${bmdoHyeon.variable} antialiased h-screen`}>
        <SessionProvider session={session}>
          <header>
            <Header />
          </header>
          <RecipeProvider>
            <main className='root pt-20 z-0 relative p-4 h-full'>
              {children}
            </main>
          </RecipeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
