import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import LiveChat from '@/components/site/live-chat';

import SmoothScrollProvider from '@/components/providers/smooth-scroll';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AETHER — Pakistan Private Property Advisory',
    description:
        'Exclusive access to Pakistan\'s most prestigious luxury estates, private plots, farmhouses, and villas.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SmoothScrollProvider>
                    <AuthProvider>
                        <Navbar />
                        {children}
                        <Footer />
                        <LiveChat />
                    </AuthProvider>
                </SmoothScrollProvider>
            </body>
        </html>
    );
}
