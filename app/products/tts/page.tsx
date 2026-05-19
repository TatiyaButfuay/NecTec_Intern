'use client';
import { AppShell } from '@/components/app-shell';
import { TtsPage } from '@/components/tts-page';
import { useNav } from '@/lib/use-nav';
export default function Page() { return <AppShell><Body /></AppShell>; }
function Body() {
  const { navigate } = useNav();
  return <TtsPage onBack={() => navigate({ page: 'home', anchor: 'products' })} onNavigate={navigate} />;
}
