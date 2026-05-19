'use client';

import React from 'react';
import { Ic } from '@/components/icons';
import { Waveform } from '@/components/waveform';

// Product detail pages — ASR Dropfile, ASR Streaming, TTS
const PRODUCTS_DATA = {
  'asr-dropfile': {
    title: 'ASR Dropfile',
    sub: 'Batch Speech-to-Text · pathumma-stt-v2',
    desc: 'อัพโหลดไฟล์เสียงหรือวิดีโอ ถอดเป็น text ที่แม่นยำสูง — รองรับ batch processing ขนาดใหญ่, speaker diarization, และ word-level timestamps. ปรับแต่งคำศัพท์เฉพาะทางได้.',
    ic: 'Upload',
    accent: 'a',
    metrics: [
      { v: '99.2%', l: 'Word accuracy' },
      { v: '500 MB', l: 'Max file size' },
      { v: '3 min', l: '1 hr → output' },
      { v: '120+', l: 'Formats' },
    ],
    pipeline: [
      { ic: 'Upload', t: 'Upload', s: 'Direct, URL, หรือ S3 bucket' },
      { ic: 'Bolt', t: 'Queue', s: 'Auto-balanced workers' },
      { ic: 'Captions', t: 'Transcribe', s: 'pathumma-stt-v2' },
      { ic: 'Doc', t: 'Deliver', s: 'JSON · SRT · VTT · TXT' },
    ],
    capabilities: [
      { t: 'High accuracy', d: '99.2% word accuracy บนภาษาไทย — สูงกว่าโมเดล open-source 8 จุด' },
      { t: 'Speaker diarization', d: 'แยกผู้พูดได้สูงสุด 26 คน พร้อม embedding ที่ระบุตัวตนข้ามไฟล์' },
      { t: 'Custom vocabulary', d: 'อัพโหลดคำศัพท์เฉพาะ บูสต์ค่า bias ได้ — เหมาะกับ medical, legal, financial' },
      { t: 'Multi-format export', d: 'JSON, SRT, VTT, TXT, TSV — พร้อม word-level timestamps' },
    ],
    visual: 'asr-dropfile',
  },
  'asr-streaming': {
    title: 'ASR Streaming',
    sub: 'Real-time Speech-to-Text · WebSocket',
    desc: 'ถอดเสียงแบบสด ผ่าน WebSocket ที่ latency น้อยกว่า 120ms — เหมาะสำหรับ live captions, voice agents, dictation. รองรับ interim และ final transcripts.',
    ic: 'Stream',
    accent: 'b',
    metrics: [
      { v: '87ms', l: 'Median latency' },
      { v: '∞', l: 'Stream duration' },
      { v: '16kHz', l: 'Audio rate' },
      { v: '100+', l: 'Languages' },
    ],
    pipeline: [
      { ic: 'Mic', t: 'Connect', s: 'WebSocket · WSS handshake' },
      { ic: 'Stream', t: 'Stream', s: 'PCM / Opus chunks' },
      { ic: 'Bolt', t: 'Transcribe', s: 'Interim → final tokens' },
      { ic: 'Captions', t: 'Render', s: 'Live captions / actions' },
    ],
    capabilities: [
      { t: 'Ultra-low latency', d: 'Median 87ms TTFB · p99 < 180ms — เหมาะกับ live captions และ voice agents' },
      { t: 'Interim results', d: 'รับ partial transcript ขณะกำลังพูด — UX แบบ real-time จริงๆ' },
      { t: 'VAD + endpointing', d: 'ตรวจจับการหยุดพูดอัตโนมัติ — รู้ว่าผู้ใช้พูดจบแล้ว' },
      { t: 'WebSocket native', d: 'API มาตรฐาน WebSocket — ใช้ได้กับทุก client lib, ทุก language' },
    ],
    visual: 'asr-streaming',
  },
  'tts': {
    title: 'Text-to-Speech',
    sub: 'Natural voice synthesis · 42 voices',
    desc: 'สังเคราะห์เสียงพูดที่เป็นธรรมชาติจากข้อความ — รองรับ voice cloning, การควบคุมอารมณ์, และ streaming output สำหรับ application ที่ต้องการ response time ต่ำ.',
    ic: 'Speaker',
    accent: 'c',
    metrics: [
      { v: '42', l: 'Voices ready' },
      { v: '<280ms', l: 'Time-to-first-byte' },
      { v: '30 sec', l: 'Voice clone audio' },
      { v: '5,000', l: 'Chars per request' },
    ],
    pipeline: [
      { ic: 'Doc', t: 'Input text', s: 'Plain · SSML · Markdown' },
      { ic: 'Sparkle', t: 'Style', s: 'Voice + emotion + speed' },
      { ic: 'Speaker', t: 'Synthesize', s: 'Stream MP3 / WAV / Opus' },
      { ic: 'Bolt', t: 'Deliver', s: 'CDN-cached · pre-warmed' },
    ],
    capabilities: [
      { t: 'Natural prosody', d: 'เสียงพูดที่เป็นธรรมชาติพร้อมการเน้นเสียงและจังหวะที่เหมาะสม — รองรับการลงท้ายเสียงไทย' },
      { t: 'Voice cloning', d: 'Clone เสียงจาก audio 30 วินาที — ใช้ในผลิตภัณฑ์ของคุณได้ทันที (consent required)' },
      { t: 'Emotion control', d: 'ปรับ tone — neutral, calm, excited, empathetic — ผ่าน SSML tags' },
      { t: 'Streaming output', d: 'รับ audio chunks แรกใน 280ms — เริ่มเล่นได้ทันทีก่อน synthesis เสร็จ' },
    ],
    visual: 'tts',
  },
};

const PRODUCT_ORDER = ['asr-dropfile', 'asr-streaming', 'tts'];

function ProductPage({ slug, onBack, onNavigate }) {
  const d = PRODUCTS_DATA[slug];
  if (!d) return null;
  const Icon = Ic[d.ic];

  React.useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  // Find other products for cross-link
  const otherSlugs = PRODUCT_ORDER.filter(s => s !== slug);

  return (
    <main data-screen-label={`Product: ${d.title}`}>
      <section className="sp-hero">
        <div className="hero-bg" />
        <div className="hero-grid-bg" />
        <div className="container sp-hero-inner">
          <div className="sp-breadcrumb">
            <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Home</a>
            <span>›</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Products</a>
            <span>›</span>
            <span style={{ color: 'var(--c-ink)' }}>{d.title}</span>
          </div>
          <div className="sp-hero-grid">
            <div>
              <div className="chip" style={{ marginBottom: 16 }}>
                <Icon size={12} /> Product
              </div>
              <h1 className="sp-title">
                {d.title}.<br />
                <span className="grad-text">{slug === 'tts' ? 'Voices that sound human.' : slug === 'asr-streaming' ? 'Listen in real-time.' : 'Files in. Text out.'}</span>
              </h1>
              <div className="sp-sub-label">{d.sub}</div>
              <p className="sp-desc">{d.desc}</p>
              <div className="hero-actions" style={{ marginTop: 26 }}>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ page: 'home', anchor: 'playground' }); }} className="btn btn-primary btn-lg">
                  Try in playground <Ic.Arrow size={15} />
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ page: 'home', anchor: 'docs' }); }} className="btn btn-ghost btn-lg">
                  <Ic.Doc size={15} /> View API docs
                </a>
              </div>
            </div>
            <div>
              {d.visual === 'asr-dropfile' && <DropfileVisual />}
              {d.visual === 'asr-streaming' && <StreamingProductVisual />}
              {d.visual === 'tts' && <TTSVisual />}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="sp-metrics">
        <div className="container">
          <div className="sp-metrics-row">
            {d.metrics.map((m, i) => (
              <div key={i} className="sp-metric">
                <div className="sp-metric-v">{m.v}</div>
                <div className="sp-metric-l">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="section-pad">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>How it works</span>
            <h2 className="section-title">From <span className="grad-text">request to result</span><br/>in 4 steps.</h2>
          </div>
          <div className="sp-pipeline">
            {d.pipeline.map((p, i) => {
              const PIcon = Ic[p.ic];
              return (
                <React.Fragment key={i}>
                  <div className="sp-step">
                    <div className="sp-step-num">{i + 1}</div>
                    <div className="sp-step-ic"><PIcon size={20} /></div>
                    <div className="sp-step-t">{p.t}</div>
                    <div className="sp-step-s">{p.s}</div>
                  </div>
                  {i < d.pipeline.length - 1 && (
                    <div className="sp-arrow">
                      <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
                        <path d="M0 7 H22 M16 1 L22 7 L16 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section-pad" style={{ background: 'var(--c-bg-soft)' }}>
        <div className="container">
          <div className="sp-cap-head">
            <div>
              <span className="eyebrow">Capabilities</span>
              <h2 className="section-title">Built for<br/><span className="grad-text">real production workloads.</span></h2>
            </div>
            <p className="section-sub">
              ทุก feature ถูก validate บน workload จริงของลูกค้า — รองรับการ scale และเงื่อนไข edge case ที่ทีม production พบบ่อย.
            </p>
          </div>
          <div className="sp-cap-grid">
            {d.capabilities.map((c, i) => (
              <div key={i} className="sp-cap-card">
                <div className="sp-cap-ic">{i + 1}</div>
                <h4>{c.t}</h4>
                <p>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code */}
      <section className="section-pad">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Quickstart</span>
            <h2 className="section-title">Get going in <span className="grad-text">~5 lines.</span></h2>
          </div>
          <div className="sp-code-wrap">
            <ProductCode slug={slug} />
          </div>
        </div>
      </section>

      {/* Cross-promote other products */}
      <section className="section-pad-sm">
        <div className="container">
          <div className="sp-others-grid">
            {otherSlugs.map(s => {
              const o = PRODUCTS_DATA[s];
              const OIcon = Ic[o.ic];
              return (
                <button key={s} onClick={() => onNavigate({ page: s })} className="sp-other-card">
                  <div className="sp-other-card-head">
                    <span className={`dd-ic tone-${o.accent}`}><OIcon size={18} /></span>
                    <div className="sp-other-label">Product</div>
                  </div>
                  <h3 className="sp-other-t">{o.title}</h3>
                  <p className="sp-other-d">{o.desc.split('—')[0].trim()}.</p>
                  <span className="sp-other-cta">Explore <Ic.Arrow size={13} /></span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function DropfileVisual() {
  return (
    <div className="sp-visual-card">
      <div style={{
        border: '1.5px dashed color-mix(in srgb, var(--c-outline) 60%, transparent)',
        borderRadius: 16,
        padding: '32px 20px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, color-mix(in srgb, var(--c-grad-a) 6%, transparent), color-mix(in srgb, var(--c-grad-b) 6%, transparent))',
      }}>
        <div style={{
          width: 56, height: 56, margin: '0 auto 12px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, var(--c-grad-a), var(--c-grad-b))',
          display: 'grid', placeItems: 'center', color: '#fff',
        }}>
          <Ic.Upload size={26} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Drop audio file here</div>
        <div style={{ fontSize: 12, color: 'var(--c-mute)', marginTop: 4 }}>.wav · .mp3 · .m4a · .flac · 120+ formats</div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { name: 'q3-sync.wav', size: '42.1 MB', dur: '47:18', prog: 100, status: 'done' },
          { name: 'standup-aug12.m4a', size: '8.4 MB', dur: '12:03', prog: 72, status: 'processing' },
          { name: 'customer-call.mp3', size: '15.2 MB', dur: '21:47', prog: 24, status: 'transcribing' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: 'var(--c-bg-soft)', borderRadius: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--c-bg)', display: 'grid', placeItems: 'center', flexShrink: 0, border: '1px solid var(--c-line)' }}>
              <Ic.Doc size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                <span style={{ color: 'var(--c-mute)', fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>{f.dur}</span>
              </div>
              <div style={{ marginTop: 5, height: 4, background: 'var(--c-line)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  width: `${f.prog}%`, height: '100%',
                  background: f.status === 'done' ? '#22C55E' : 'linear-gradient(90deg, var(--c-grad-a), var(--c-grad-b))',
                }}/>
              </div>
              <div style={{ marginTop: 4, fontSize: 10.5, color: 'var(--c-mute)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{f.status === 'done' ? '✓ Done' : f.status} · {f.prog}%</span>
                <span>{f.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreamingProductVisual() {
  const phrases = [
    "Hello, can you hear me?",
    "Hello, can you hear me clearly?",
    "Hello, can you hear me clearly now?",
  ];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % phrases.length), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="sp-visual-card">
      <div className="audio-card-head" style={{ marginBottom: 14 }}>
        <span className="live-dot">WS · CONNECTED</span>
        <span style={{ fontSize: 11, color: 'var(--c-mute)', fontFamily: 'var(--font-mono)' }}>87ms · p99 178ms</span>
      </div>
      <div className="wave-frame">
        <Waveform bars={48} height={90} />
      </div>
      <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--c-bg-soft)', borderRadius: 12, minHeight: 80 }}>
        <div style={{ fontSize: 10, color: 'var(--c-mute)', textTransform: 'uppercase', letterSpacing: '0.10em', fontWeight: 600, marginBottom: 8 }}>
          INTERIM · is_final: false
        </div>
        <div style={{ fontSize: 14, color: 'var(--c-ink)' }}>
          {phrases[idx]}<span style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--c-primary)', marginLeft: 2, verticalAlign: -2, animation: 'blink 1s infinite' }}/>
        </div>
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)', borderRadius: 10, fontSize: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#0F8A3F', textTransform: 'uppercase', letterSpacing: '0.08em' }}>FINAL </span>
        <span style={{ color: 'var(--c-ink)' }}>"Welcome to Pathumma streaming API."</span>
      </div>
    </div>
  );
}

function TTSVisual() {
  const voices = [
    { name: 'Aria',   tag: 'TH · Female · Warm',  active: true,  color: '#E68CE3' },
    { name: 'Sun',    tag: 'EN · Male · Neutral', active: false, color: '#6981FF' },
    { name: 'Maya',   tag: 'TH · Female · Calm',  active: false, color: '#F329A2' },
    { name: 'Rio',    tag: 'JA · Male · Casual',  active: false, color: '#A37BE5' },
  ];
  return (
    <div className="sp-visual-card">
      <div style={{ fontSize: 11, color: 'var(--c-mute)', textTransform: 'uppercase', letterSpacing: '0.10em', fontWeight: 600, marginBottom: 10 }}>
        Input text
      </div>
      <div style={{
        padding: '14px 16px', background: 'var(--c-bg-soft)', borderRadius: 12,
        fontSize: 13.5, lineHeight: 1.55, color: 'var(--c-ink)', marginBottom: 16,
      }}>
        สวัสดีค่ะ ยินดีต้อนรับสู่ Pathumma Audio — แพลตฟอร์ม voice AI สำหรับนักพัฒนา.
      </div>

      <div style={{ fontSize: 11, color: 'var(--c-mute)', textTransform: 'uppercase', letterSpacing: '0.10em', fontWeight: 600, marginBottom: 10 }}>
        Voice
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {voices.map((v, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px',
            background: v.active ? 'linear-gradient(135deg, color-mix(in srgb, var(--c-grad-a) 10%, transparent), color-mix(in srgb, var(--c-grad-b) 10%, transparent))' : 'var(--c-bg)',
            border: v.active ? '1px solid color-mix(in srgb, var(--c-grad-b) 30%, transparent)' : '1px solid var(--c-line)',
            borderRadius: 10,
          }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: v.color, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{v.name[0]}</span>
            <div style={{ flex: 1, lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{v.name}</div>
              <div style={{ fontSize: 10.5, color: 'var(--c-mute)' }}>{v.tag}</div>
            </div>
            {v.active && <Ic.CheckCirc size={16} style={{ color: 'var(--c-primary-2)' }} />}
          </div>
        ))}
      </div>

      <div className="audio-bar" style={{ background: 'rgba(105,129,255,0.08)', border: '1px solid rgba(105,129,255,0.18)' }}>
        <button className="play-btn"><Ic.Play size={14} /></button>
        <div className="progress"><i style={{ width: '38%' }}/></div>
        <span className="time" style={{ color: 'var(--c-ink-2)' }}>00:04 / 00:11</span>
      </div>
    </div>
  );
}

function ProductCode({ slug }) {
  const code = {
    'asr-dropfile': `from pathumma import Client

client = Client(api_key="sk_live_...")

with open("audio.wav", "rb") as f:
    result = client.audio.transcriptions.create(
        file=f,
        model="pathumma-stt-v2",
        language="th",
        diarize=True,
        timestamps="word",
    )

print(result.transcript)`,
    'asr-streaming': `from pathumma import Client

client = Client(api_key="sk_live_...")

async with client.audio.stream(language="th") as ws:
    async for chunk in microphone():
        await ws.send_audio(chunk)
    async for event in ws:
        if event.is_final:
            print("FINAL:", event.text)
        else:
            print("INTERIM:", event.text, end="\\r")`,
    'tts': `from pathumma import Client

client = Client(api_key="sk_live_...")

audio = client.audio.speech.create(
    voice="aria",
    input="สวัสดีค่ะ ยินดีต้อนรับสู่ Pathumma Audio",
    format="mp3",
    speed=1.0,
)

audio.save("welcome.mp3")`,
  }[slug];

  return (
    <div className="pg-output">
      <div className="code-toolbar">
        <div className="code-dots">
          <span style={{ background: '#FF5F56' }}></span>
          <span style={{ background: '#FFBD2E' }}></span>
          <span style={{ background: '#27C93F' }}></span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          {slug === 'tts' ? 'speech.py' : slug === 'asr-streaming' ? 'stream.py' : 'transcribe.py'}
        </span>
        <button style={{ color: 'rgba(255,255,255,0.55)', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
          <Ic.Copy size={12} /> Copy
        </button>
      </div>
      <pre className="code-block" style={{ padding: 28 }}>
        {code.split('\n').map((line, i) => {
          const parts = line.split(/(#.*$|"[^"]*"|'[^']*'|\b(?:from|import|with|as|return|async|def|print|yield|for|in|if|else|await)\b)/);
          return (
            <div key={i} style={{ display: 'flex' }}>
              <span style={{ width: 28, color: '#3D4055', userSelect: 'none', textAlign: 'right', paddingRight: 16, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1 }}>
                {parts.map((p, j) => {
                  if (!p) return null;
                  if (p.startsWith('#')) return <span key={j} className="tok-com">{p}</span>;
                  if (p.startsWith('"') || p.startsWith("'")) return <span key={j} className="tok-str">{p}</span>;
                  if (/^(from|import|with|as|return|async|def|print|yield|for|in|if|else|await)$/.test(p)) return <span key={j} className="tok-key">{p}</span>;
                  return p;
                })}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

export { ProductPage, PRODUCTS_DATA };
