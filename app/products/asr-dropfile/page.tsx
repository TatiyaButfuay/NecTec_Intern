'use client';
import { AppShell } from '@/components/app-shell';
import { AsrDropfile } from '@/components/asr-dropfile';
import { useNav } from '@/lib/use-nav';
export default function Page() { return <AppShell><Body /></AppShell>; }
function Body() {
  const { navigate } = useNav();
  return <AsrDropfile onBack={() => navigate({ page: 'home', anchor: 'products' })} onNavigate={navigate} />;
}
