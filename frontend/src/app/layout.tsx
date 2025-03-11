import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import './globals.css'; // Make sure this is imported

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'A Next.js app with Tailwind CSS and Navbar',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body
        suppressHydrationWarning
        className='min-h-screen flex flex-col bg-gray-100'
      >
        <Navbar />
        <main className='p-6 flex-grow'>{children}</main>
      </body>
    </html>
  );
}
