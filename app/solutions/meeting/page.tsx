'use client';
import { AppShell } from '@/components/app-shell';
import { MeetingTranscription } from '@/components/meeting-transcription';
import { useNav } from '@/lib/use-nav';
export default function Page() { return <AppShell><Body /></AppShell>; }
function Body() {
  const { navigate } = useNav();
  return <MeetingTranscription onBack={() => navigate({ page: 'home', anchor: 'solutions' })} onNavigate={navigate} />;
}
