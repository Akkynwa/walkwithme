'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import { LayoutShellContext } from './layout-shell-context';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldRenderShell = useMemo(() => {
    if (!pathname) return false;

    const publicRoutes = ['/', '/about', '/privacy', '/terms', '/support', '/downloads', '/DonatePage'];
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

    return !isPublicRoute && !pathname.startsWith('/auth');
  }, [pathname]);

  return (
    <>
      {shouldRenderShell ? (
        <LayoutShellContext.Provider value={{ renderInLayout: true }}>
          <Sidebar />
          <Header />
        </LayoutShellContext.Provider>
      ) : null}

      <LayoutShellContext.Provider value={{ renderInLayout: false }}>
        {children}
      </LayoutShellContext.Provider>
    </>
  );
}
