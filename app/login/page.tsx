'use client';
import { AppShell } from '@/components/app-shell';
import { LoginPage } from '@/components/login';
import { useNav } from '@/lib/use-nav';
export default function Page() { return <AppShell><Body /></AppShell>; }
function Body() {
  const { navigate } = useNav();
  return <LoginPage onBack={() => navigate({ page: 'home' })} onNavigate={navigate} />;
}
