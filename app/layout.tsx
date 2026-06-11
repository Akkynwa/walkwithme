import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { AppSettingsProvider } from './context/AppSettingsContext';
import './globals.css';
import PresenceDock from './layout-components/PresenceDock';
import Footer from './layout-components/Footer'; // Adjust this path if your Footer is located elsewhere
import BackButton from '@/components/BackButton';
import FloatingSupportButton from '@/components/FloatingSupportButton';


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4d6054',
};

export const metadata: Metadata = {
  title: 'WalkWithMe - A Digital Sanctuary for Your Spiritual Journey',
  description: 'Find stillness in a loud world. Track your daily verses, reflect in your journal, and walk alongside a community on the same spiritual path.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'WalkWithMe - A Digital Sanctuary for Your Spiritual Journey',
    description: 'Daily Bible reading, journaling, prayer tracking, and spiritual growth in a serene, minimalist interface.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
<head>
  <link 
    rel="stylesheet" 
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional" 
  />
</head>
      <body className="bg-surface text-on-surface font-body-md transition-colors antialiased min-h-screen flex flex-col">
        {/* Wrap your system inside the AppSettingsProvider */}
        <AppSettingsProvider>
          <Providers>
            <header className="border-b p-4">
        </header>
            <div className="flex-grow flex flex-col">
              {children}
            </div>
                    <FloatingSupportButton />
          <BackButton />
            <Footer />
          </Providers>
          <PresenceDock />
        </AppSettingsProvider>
      </body>
    </html>
  );
}