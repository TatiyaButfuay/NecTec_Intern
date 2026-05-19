'use client';

import React from 'react';
import { Ic } from '@/components/icons';
import { StaticWave } from '@/components/waveform';

// Solution detail pages — Meeting Transcription & Voice Agent
// Each follows the same template: hero, how it works, code, capabilities, CTA

const SOLUTIONS_DATA = {
  meeting: {
    title: 'Meeting transcription',
    sub: 'ASR Dropfile + Diarization + Summary',
    desc: 'แปลงบันทึกประชุมเป็น transcript ที่มีโครงสร้าง — ระบุผู้พูด, สร้าง summary, ดึง action items อัตโนมัติ. รองรับการประชุมภาษาไทย-อังกฤษแบบผสม.',
    ic: 'Doc',
    accent: 'a',
    metrics: [
      { v: '99.2%', l: 'Word accuracy' },
      { v: '8 spkr', l: 'Speakers detected' },
      { v: '3 min', l: '1 hr → output' },
      { v: '23', l: 'Output formats' },
    ],
    pipeline: [
      { ic: 'Upload', t: 'Upload audio', s: 'WAV · MP3 · MP4 · 500MB' },
      { ic: 'Captions', t: 'Transcribe', s: 'ASR Dropfile · pathumma-stt-v2' },
      { ic: 'Headphone', t: 'Diarize', s: 'Speaker labels A–Z' },
      { ic: 'Sparkle', t: 'Summarize', s: 'Topics + action items' },
    ],
    capabilities: [
      { t: 'Speaker diarization', d: 'แยกผู้พูดได้สูงสุด 26 คน ในไฟล์เดียว พร้อมป้ายชื่ออัตโนมัติ' },
      { t: 'Action items', d: 'ดึงรายการสิ่งที่ต้องทำ พร้อมระบุผู้รับผิดชอบและ deadline' },
      { t: 'Multi-language', d: 'รองรับการประชุม TH-EN ผสมในไฟล์เดียวกัน — auto code-switching' },
      { t: 'Export anywhere', d: 'Export ไป Notion, Slack, Linear, ClickUp, หรือ webhook ของคุณ' },
    ],
    codeKind: 'meeting',
  },
  'voice-agent': {
    title: 'Voice agent',
    sub: 'ASR Streaming + TTS + Function calling',
    desc: 'สร้าง AI voice agent ที่ฟัง-คิด-ตอบได้ในเวลาน้อยกว่า 500ms ตั้งแต่ผู้ใช้พูดจบ. ต่อกับ LLM ใดก็ได้ผ่าน WebSocket เดียว.',
    ic: 'Phone',
    accent: 'b',
    metrics: [
      { v: '<120ms', l: 'ASR latency' },
      { v: '<280ms', l: 'TTS time-to-first-byte' },
      { v: '∞', l: 'Concurrent calls' },
      { v: '42', l: 'Voices ready' },
    ],
    pipeline: [
      { ic: 'Mic', t: 'Listen', s: 'ASR Streaming · barge-in' },
      { ic: 'Sparkle', t: 'Think', s: 'Your LLM · function calls' },
      { ic: 'Speaker', t: 'Speak', s: 'TTS streaming · 42 voices' },
      { ic: 'Bolt', t: 'Act', s: 'Webhooks · tools · CRM' },
    ],
    capabilities: [
      { t: 'Real-time streaming', d: 'WebSocket แบบ duplex — ทั้งฟังและพูดพร้อมกันได้ รองรับการ interrupt' },
      { t: 'Function calling', d: 'Built-in tool use — จองคิว ตรวจสอบสถานะ ส่ง email ผ่าน HTTP/webhook' },
      { t: 'Voice cloning', d: 'Clone เสียงแบรนด์ของคุณจาก audio 30 วินาที — consistent ทุก call' },
      { t: 'Telephony ready', d: 'ต่อตรงกับ Twilio, Vonage, SIP trunk, หรือ WebRTC' },
    ],
    codeKind: 'voice-agent',
  },
};

function SolutionPage({ slug, onBack, onNavigate }) {
  const d = SOLUTIONS_DATA[slug];
  if (!d) return null;
  const Icon = Ic[d.ic];
  const otherSlug = slug === 'meeting' ? 'voice-agent' : 'meeting';
  const other = SOLUTIONS_DATA[otherSlug];

  React.useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  return (
    <main data-screen-label={`Solution: ${d.title}`}>
      {/* Page hero */}
      <section className="sp-hero">
        <div className="hero-bg" />
        <div className="hero-grid-bg" />
        <div className="container sp-hero-inner">
          <div className="sp-breadcrumb">
            <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Home</a>
            <span>›</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Solutions</a>
            <span>›</span>
            <span style={{ color: 'var(--c-ink)' }}>{d.title}</span>
          </div>
          <div className="sp-hero-grid">
            <div>
              <div className="chip" style={{ marginBottom: 16 }}>
                <Icon size={12} /> Solution
              </div>
              <h1 className="sp-title">
                {d.title}.<br />
                <span className="grad-text">Production-ready.</span>
              </h1>
              <div className="sp-sub-label">{d.sub}</div>
              <p className="sp-desc">{d.desc}</p>
              <div className="hero-actions" style={{ marginTop: 26 }}>
                <a href="#" className="btn btn-primary btn-lg">Start free trial <Ic.Arrow size={15} /></a>
                <a href="#" className="btn btn-ghost btn-lg"><Ic.Doc size={15} /> View guide</a>
              </div>
            </div>
            <div>
              {slug === 'meeting' ? <MeetingHeroVisual /> : <VoiceAgentHeroVisual />}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics strip */}
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

      {/* Pipeline / How it works */}
      <section className="section-pad">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>How it works</span>
            <h2 className="section-title">4 ขั้นตอนจาก<br/><span className="grad-text">input ถึง output.</span></h2>
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
              <h2 className="section-title">ทุกอย่างที่<br/><span className="grad-text">ทีม production ต้องการ.</span></h2>
            </div>
            <p className="section-sub">
              {slug === 'meeting' ?
                'จาก raw audio ไปจนถึง structured output ที่ทีมคุณใช้ต่อได้ทันที — ไม่ต้องประกอบ pipeline เอง.' :
                'ครบทุก building block สำหรับ voice agent — เริ่ม deploy ได้ใน 1 วัน, scale ได้ไม่จำกัด.'}
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

      {/* Demo / Code */}
      <section className="section-pad">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Code</span>
            <h2 className="section-title">{slug === 'meeting' ? 'Process a meeting in 8 lines.' : 'Build an agent in 12 lines.'}</h2>
          </div>
          <div className="sp-code-wrap">
            <SolutionCode kind={d.codeKind} />
          </div>
        </div>
      </section>

      {/* Switch to other solution */}
      <section className="section-pad-sm">
        <div className="container">
          <div className="sp-other">
            <div>
              <div className="sp-other-label">Other solution</div>
              <h3 className="sp-other-t">{other.title}</h3>
              <p className="sp-other-d">{other.desc}</p>
            </div>
            <button onClick={() => onNavigate({ page: otherSlug })} className="btn btn-ghost btn-lg">
              Explore {other.title} <Ic.Arrow size={15} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function MeetingHeroVisual() {
  const items = [
    { who: 'Aria',  c: '#E68CE3', t: 'OK so let\'s recap — Q3 launch is set for August 15.', at: '00:00:12' },
    { who: 'Sun',   c: '#6981FF', t: 'Engineering will freeze code on August 10th.',           at: '00:00:24' },
    { who: 'Maya',  c: '#F329A2', t: 'I\'ll draft the press release by Friday this week.',     at: '00:00:31' },
    { who: 'Aria',  c: '#E68CE3', t: 'Great. Marketing assets need final approval by Aug 7.',  at: '00:00:42' },
  ];
  return (
    <div className="sp-visual-card">
      <div className="audio-card-head" style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--c-mute)', letterSpacing: '0.10em' }}>
          q3-launch-sync.wav · 47:18
        </span>
        <span className="chip chip-pink" style={{ fontSize: 10 }}>4 speakers</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, maxHeight: 290, overflow: 'hidden' }}>
        {items.map((s, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, padding: '10px 12px',
            background: 'var(--c-bg-soft)', borderRadius: 12,
            opacity: 1 - i * 0.06,
          }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: s.c, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.who[0]}</span>
            <div style={{ flex: 1, lineHeight: 1.4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 2 }}>
                <span style={{ fontWeight: 700, color: 'var(--c-ink)' }}>{s.who}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--c-mute)' }}>{s.at}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-ink)' }}>{s.t}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 14, padding: '12px 14px',
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--c-grad-a) 12%, transparent), color-mix(in srgb, var(--c-grad-b) 12%, transparent))',
        borderRadius: 12, border: '1px solid color-mix(in srgb, var(--c-grad-b) 22%, transparent)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <Ic.Sparkle size={14} style={{ color: 'var(--c-primary-2)', marginTop: 2, flexShrink: 0 }}/>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--c-primary-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Auto summary</div>
          <div style={{ fontSize: 12.5, color: 'var(--c-ink)', lineHeight: 1.55 }}>
            Q3 launch confirmed for Aug 15 · Eng freeze Aug 10 · PR draft due Friday · Marketing approval Aug 7
          </div>
        </div>
      </div>
    </div>
  );
}

function VoiceAgentHeroVisual() {
  return (
    <div className="sp-visual-card">
      <div className="audio-card-head" style={{ marginBottom: 14 }}>
        <span className="live-dot">CALL · LIVE</span>
        <span style={{ fontSize: 11, color: 'var(--c-mute)', fontFamily: 'var(--font-mono)' }}>00:01:24</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--c-bg-soft)', color: 'var(--c-mute)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Ic.Mic size={13} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--c-mute)', marginBottom: 3, fontWeight: 600 }}>CALLER · 87ms</div>
            <div style={{ padding: '8px 12px', background: 'var(--c-bg-soft)', borderRadius: 10, borderTopLeftRadius: 4, fontSize: 13, color: 'var(--c-ink)' }}>
              อยากจองโต๊ะคืนวันศุกร์นี้ค่ะ 4 ที่ ประมาณ 7 โมง
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, paddingLeft: 38, alignItems: 'center', fontSize: 10.5, color: 'var(--c-mute)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 4px #22C55E' }}/>
            Thinking
          </span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>→ check_availability(date: 2026-05-23, party: 4)</span>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--c-grad-a), var(--c-grad-b))', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Ic.Sparkle size={13} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--c-primary-2)', marginBottom: 3, fontWeight: 700 }}>AGENT · Aria · TH Female</div>
            <div style={{
              padding: '8px 12px',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--c-grad-a) 12%, transparent), color-mix(in srgb, var(--c-grad-b) 12%, transparent))',
              border: '1px solid color-mix(in srgb, var(--c-grad-b) 22%, transparent)',
              borderRadius: 10, borderTopLeftRadius: 4, fontSize: 13, color: 'var(--c-ink)',
            }}>
              "ได้ค่ะ ศุกร์ที่ 23 พฤษภาคม 19:00 สำหรับ 4 ท่าน ต้องการที่นั่งริมหน้าต่างไหมคะ?"
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--c-bg-soft)', color: 'var(--c-mute)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Ic.Mic size={13} />
          </span>
          <div style={{ flex: 1, minHeight: 38 }}>
            <div style={{ fontSize: 10, color: 'var(--c-mute)', marginBottom: 3, fontWeight: 600 }}>CALLER · listening…</div>
            <div style={{ padding: '8px 12px', background: 'var(--c-bg-soft)', borderRadius: 10, borderTopLeftRadius: 4, opacity: 0.5 }}>
              <StaticWave bars={20} height={14} color="var(--c-primary-2)" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--c-bg-soft)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--c-mute)' }}>
        <span>↑↓ duplex stream · turn 3/∞</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>e2e: 412ms</span>
      </div>
    </div>
  );
}

function SolutionCode({ kind }) {
  const code = kind === 'meeting' ? `from pathumma import Client

client = Client(api_key="sk_live_...")

# 1. Transcribe with diarization
with open("meeting.wav", "rb") as f:
    result = client.audio.transcriptions.create(
        file=f,
        model="pathumma-stt-v2",
        diarize=True,
        summary=True,           # ← auto summary + action items
    )

print(result.summary)           # → "Q3 launch on Aug 15..."
print(result.action_items)      # → [{owner: "Maya", task: "...", due: "Fri"}]
print(result.speakers)          # → ["Aria", "Sun", "Maya", "Leo"]` :
  `from pathumma import VoiceAgent

agent = VoiceAgent(
    api_key="sk_live_...",
    voice="aria",
    language="th",
    llm="gpt-4o-mini",          # ← bring your own model
)

@agent.tool
def book_table(date: str, party: int):
    """Book a table at the restaurant."""
    return reservations.create(date, party)

# Hook to WebRTC / Twilio / phone
@agent.on_audio
async def handle(audio_stream):
    async for response in agent.respond(audio_stream):
        yield response.audio    # ← stream back instantly`;

  return (
    <div className="pg-output">
      <div className="code-toolbar">
        <div className="code-dots">
          <span style={{ background: '#FF5F56' }}></span>
          <span style={{ background: '#FFBD2E' }}></span>
          <span style={{ background: '#27C93F' }}></span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          {kind === 'meeting' ? 'process_meeting.py' : 'voice_agent.py'}
        </span>
        <button style={{ color: 'rgba(255,255,255,0.55)', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
          <Ic.Copy size={12} /> Copy
        </button>
      </div>
      <pre className="code-block" style={{ padding: 28 }}>
        {code.split('\n').map((line, i) => {
          // Simple highlighting
          const parts = line.split(/(#.*$|"[^"]*"|'[^']*'|\b(?:from|import|with|as|return|async|def|print|yield)\b)/);
          return (
            <div key={i} style={{ display: 'flex' }}>
              <span style={{ width: 28, color: '#3D4055', userSelect: 'none', textAlign: 'right', paddingRight: 16, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1 }}>
                {parts.map((p, j) => {
                  if (!p) return null;
                  if (p.startsWith('#')) return <span key={j} className="tok-com">{p}</span>;
                  if (p.startsWith('"') || p.startsWith("'")) return <span key={j} className="tok-str">{p}</span>;
                  if (/^(from|import|with|as|return|async|def|print|yield)$/.test(p)) return <span key={j} className="tok-key">{p}</span>;
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

export { SolutionPage };
