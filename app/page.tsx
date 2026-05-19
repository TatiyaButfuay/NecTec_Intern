'use client';
import { AppShell } from '@/components/app-shell';
import { Hero } from '@/components/hero';
import { LogoAnim } from '@/components/logo-anim';
import { Features } from '@/components/features';
import { useNav } from '@/lib/use-nav';

export default function HomePage() {
  return <AppShell showCta><Body /></AppShell>;
}
function Body() {
  const { navigate } = useNav();
  return (<>
    <Hero onNavigate={navigate} />
    <LogoAnim />
    <Features />
  </>);
}
