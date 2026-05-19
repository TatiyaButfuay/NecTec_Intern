'use client';
import React from 'react';
import { useNav } from '@/lib/use-nav';
import { Header } from '@/components/header';
import { CTA, Footer } from '@/components/cta-footer';
import { CookieBanner } from '@/components/cookie-banner';

export function AppShell({
  children,
  showCta = false,
}: {
  children: React.ReactNode;
  showCta?: boolean;
}) {
  const { navigate, page } = useNav();
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  React.useEffect(() => {
    const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('mode')) as 'light' | 'dark' | null;
    if (saved) setMode(saved);
  }, []);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    if (typeof localStorage !== 'undefined') localStorage.setItem('mode', mode);
  }, [mode]);
  return (
    <>
      <Header
        mode={mode}
        onToggleMode={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
        page={page}
        onNavigate={navigate}
      />
      {children}
      {showCta && <CTA onNavigate={navigate} />}
      <Footer onNavigate={navigate} />
      <CookieBanner />
    </>
  );
}
