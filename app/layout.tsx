import Header from '@/components/Header';
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
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang='en'>
      <body className={`${bmdoHyeon.variable} antialiased`}>
        <SessionProvider session={session}>
          <Header />
          <main className='root pt-20 z-0 relative px-4'>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
