# PathummaAudio — Next.js 14

แพลตฟอร์ม Speech AI ของ NECTEC — port จาก HTML prototype มาเป็น Next.js 14 (App Router) + TypeScript พร้อมรัน

ทุกหน้าออกแบบเสร็จแล้ว: Home / Login / Research, Developer, About / ASR Dropfile / ASR Streaming / TTS / Voice Agent / Meeting Transcription · UI handler ทั้งหมดเป็น **mock** (simulated `setTimeout`) เพื่อให้ test UI ได้ก่อน — เมื่อ backend พร้อม เปลี่ยน `fetch()` เข้าไปก็ใช้งานได้จริง

---

## 1. ตั้งค่าสภาพแวดล้อม

**สิ่งที่ต้องมี**
- **Node.js 18.17+** หรือใหม่กว่า — แนะนำ 20 LTS · ตรวจสอบด้วย `node -v`
- **npm 9+** (มากับ Node) หรือ **pnpm** / **yarn** ก็ได้
- **Git** (ถ้าจะ push ขึ้น repo)
- **Editor**: VS Code — แนะนำ extension *ESLint*, *Prettier*, *Tailwind CSS IntelliSense* (เผื่ออนาคต)

**ติดตั้ง Node ครั้งแรก**
- macOS / Linux: ใช้ [nvm](https://github.com/nvm-sh/nvm) — `nvm install 20 && nvm use 20`
- Windows: โหลด installer จาก <https://nodejs.org/> (LTS)

---

## 2. รันโปรเจกต์

```bash
# 1. แตก zip / cd เข้าโฟลเดอร์
cd pathumma-audio   # หรือชื่อโฟลเดอร์ที่แตกออกมา

# 2. ติดตั้ง dependencies (ครั้งแรก / หลัง git pull)
npm install

# 3. คัดลอก env template
cp .env.example .env.local
# แล้วแก้ค่าใน .env.local ตามที่ต้องการ

# 4. รัน dev server (hot reload)
npm run dev
# → เปิด http://localhost:3000

# Build production
npm run build
npm run start    # → http://localhost:3000

# Type-check / Lint
npm run type-check
npm run lint
```

---

## 3. โครงสร้างโปรเจกต์

```
.
├── app/                          ← Next.js App Router routes
│   ├── layout.tsx                ← Root layout + fonts + globals.css
│   ├── page.tsx                  ← / (Home)
│   ├── globals.css               ← ⭐ Design system tokens + styles
│   ├── styles-*.css              ← Imported เข้า globals
│   ├── login/page.tsx
│   ├── research/, developer/, about/
│   ├── products/
│   │   ├── asr-dropfile/page.tsx
│   │   ├── asr-streaming/page.tsx
│   │   └── tts/page.tsx
│   └── solutions/
│       ├── meeting/page.tsx
│       └── voice-agent/page.tsx
├── components/
│   ├── app-shell.tsx             ← Header + Footer wrapper + theme state
│   ├── header.tsx, hero.tsx, …   ← 1:1 ports จาก prototype
│   └── icons.tsx, waveform.tsx   ← Shared building blocks
├── lib/
│   └── use-nav.ts                ← Hook สำหรับ navigate({page,anchor})
├── public/
│   ├── favicon.svg
│   └── assets/                   ← NECTEC + NSTDA logos
├── package.json
├── tsconfig.json
└── next.config.mjs
```

---

## 4. URL Routes

| Page | Route |
|---|---|
| Home | `/` |
| Login | `/login` |
| Coming Soon | `/research`, `/developer`, `/about` |
| ASR Dropfile (STT) | `/products/asr-dropfile` |
| ASR Streaming | `/products/asr-streaming` |
| Text-to-Speech | `/products/tts` |
| Meeting Transcription | `/solutions/meeting` |
| Voice Agent | `/solutions/voice-agent` |

---

## 5. การต่อ Backend จริง

ตอนนี้ทุก demo handler เป็น **simulated** เพื่อให้ UX flow ทำงานครบโดยไม่ต้องมี server ตัวอย่างการเปลี่ยนเป็น API จริง:

### Speech-to-Text (ASR Dropfile)
แก้ `components/asr-dropfile.tsx` ในฟังก์ชัน `startTranscribe`:

```tsx
const startTranscribe = async () => {
  if (!actualFile || transcribing) return;
  setTranscribing(true);
  const form = new FormData();
  form.append('file', actualFile);
  form.append('language', 'th');
  form.append('diarize', String(settings.speaker));

  const r = await fetch(`${process.env.NEXT_PUBLIC_PATHUMMA_API_URL}/v1/transcribe`, {
    method: 'POST',
    body: form,
  });
  const data = await r.json();
  setTranscribed(true);
  setTranscribing(false);
  setTranscript(data.lines);     // [{spk, color, start, end, text}, …]
};
```

### Streaming STT (ASR Streaming)
WebSocket — ใส่ใน `components/asr-streaming.tsx` แทนการ fake token stream:

```tsx
const ws = new WebSocket(`${process.env.NEXT_PUBLIC_PATHUMMA_WS_URL}/v1/stream`);
ws.onmessage = (e) => {
  const ev = JSON.parse(e.data);
  if (ev.is_final) {
    setTranscript((t) => t + ev.text);
  } else {
    setInterim(ev.text);
  }
};
// ส่ง audio chunks จาก MediaRecorder ผ่าน ws.send(chunk)
```

### TTS / Voice Agent / Meeting
ทำคล้ายกัน — เรียก endpoint แทน `setTimeout` simulation

### Next.js API routes (optional proxy)
ถ้าอยากซ่อน API key ฝั่ง server สร้าง `app/api/transcribe/route.ts`:

```ts
export async function POST(req: Request) {
  const form = await req.formData();
  const r = await fetch(`${process.env.PATHUMMA_API_URL}/v1/transcribe`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.PATHUMMA_API_KEY}` },
    body: form,
  });
  return r;
}
```

แล้วเรียกจาก frontend ด้วย `/api/transcribe` แทน — API key อยู่ฝั่ง server เท่านั้น

---

## 6. Deploy

**Vercel** (แนะนำ — เจ้าของ Next.js):
1. Push ขึ้น GitHub
2. ไป <https://vercel.com/new> → Import repo
3. ตั้งค่า env vars ใน Settings → Environment Variables
4. Deploy

**ทางเลือกอื่น**: Cloudflare Pages, Netlify, Docker self-host, AWS Amplify

---

## 7. สิ่งที่ควรทำต่อ (Production checklist)

- [ ] ต่อ Pathumma model API กับ handler ทุกตัว
- [ ] เปลี่ยน `<img>` ของ NECTEC/NSTDA logos เป็น `next/image` (เพื่อ optimize)
- [ ] เพิ่ม error boundaries ในหน้ายาว (Voice Agent, Meeting)
- [ ] เพิ่ม loading states + skeletons
- [ ] ปรับ `strict: true` ใน `tsconfig.json` แล้วเก็บ type errors ทีละหน้า
- [ ] เพิ่ม unit tests (Vitest + Testing Library)
- [ ] ตั้ง CSP headers ใน `next.config.mjs` ก่อน production
- [ ] Analytics (Vercel Analytics, Plausible)

---

## 8. Troubleshooting

**`Module not found: Can't resolve '@/components/...'`**
→ ตรวจสอบ `tsconfig.json` ว่ามี `"paths": { "@/*": ["./*"] }`

**ฟอนต์ไทยขึ้นไม่ครบ**
→ ดู `app/layout.tsx` — ต้องโหลด `IBM+Plex+Sans+Thai` จาก Google Fonts

**Dark mode ไม่ persist**
→ `components/app-shell.tsx` เก็บ mode ที่ `localStorage` ภายใต้ key `mode`

**Console warning จาก React strict mode**
→ ไม่กระทบ production — เกิดจาก double-render ใน dev เท่านั้น

---

**Built from PathummaAudio design prototype**
