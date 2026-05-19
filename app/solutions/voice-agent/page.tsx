'use client';
import { AppShell } from '@/components/app-shell';
import { VoiceAgent } from '@/components/voice-agent';
import { useNav } from '@/lib/use-nav';
export default function Page() { return <AppShell><Body /></AppShell>; }
function Body() {
  const { navigate } = useNav();
  return <VoiceAgent onBack={() => navigate({ page: 'home', anchor: 'solutions' })} onNavigate={navigate} />;
}
