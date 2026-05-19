'use client';
import { useRouter, usePathname } from 'next/navigation';

export type NavTarget = { page: string; anchor?: string };

const PAGE_TO_PATH: Record<string, string> = {
  home: '/',
  login: '/login',
  research: '/research',
  developer: '/developer',
  about: '/about',
  'asr-dropfile': '/products/asr-dropfile',
  'asr-streaming': '/products/asr-streaming',
  tts: '/products/tts',
  meeting: '/solutions/meeting',
  'voice-agent': '/solutions/voice-agent',
};

const PATH_TO_PAGE: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_TO_PATH).map(([k, v]) => [v, k])
);

export function useNav() {
  const router = useRouter();
  const pathname = usePathname();
  const page = PATH_TO_PAGE[pathname] || 'home';

  const navigate = ({ page: target, anchor }: NavTarget) => {
    const path = PAGE_TO_PATH[target] ?? '/';
    const url = anchor ? `${path}#${anchor}` : path;
    router.push(url);
  };
  return { navigate, page };
}
