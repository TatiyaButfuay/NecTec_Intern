'use client';
import { AppShell } from '@/components/app-shell';
import { AsrStreaming } from '@/components/asr-streaming';
import { useNav } from '@/lib/use-nav';
export default function Page() { return <AppShell><Body /></AppShell>; }
function Body() {
  const { navigate } = useNav();
  return <AsrStreaming onBack={() => navigate({ page: 'home', anchor: 'products' })} onNavigate={navigate} />;
}
