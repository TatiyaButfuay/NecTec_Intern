'use client';
import { AppShell } from '@/components/app-shell';
import { ComingSoon } from '@/components/coming-soon';
import { useNav } from '@/lib/use-nav';
export default function Page() { return <AppShell><Body /></AppShell>; }
function Body() {
  const { navigate } = useNav();
  return <ComingSoon slug="research" onBack={() => navigate({ page: 'home' })} />;
}
