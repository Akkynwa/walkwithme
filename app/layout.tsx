// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import './globals.css';
import PresenceDock from './layout-components/PresenceDock';
import FloatingSupportButton from '@/components/FloatingSupportButton';
import { AppShell } from './layout-components/AppShell';

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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" 
        />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-primary font-sans transition-colors duration-300 antialiased min-h-screen flex flex-col">
        {/* Step 1: ThemeProvider wraps absolutely everything */}
        <ThemeProvider>
          <AppSettingsProvider>
            <Providers>
              {/* Added pb-20 for mobile clearance and lg:pb-0 for desktop layout */}
              <div className="flex-grow flex flex-col pb-20 lg:pb-0">
                <AppShell>{children}</AppShell>
              </div>
              
              {/* Step 2: Ensure all components that might look up theme/auth are INSIDE all Providers */}
              <PresenceDock />
              <FloatingSupportButton />
            </Providers>
          </AppSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}