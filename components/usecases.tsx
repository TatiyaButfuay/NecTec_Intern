'use client';

import React from 'react';
import { Ic } from '@/components/icons';
import { StaticWave } from '@/components/waveform';

function Solutions({ onNavigate }) {
  const cases = [
    {
      slug: 'meeting',
      ic: 'Doc',
      t: 'Meeting transcription',
      sub: 'ASR Dropfile + Diarization',
      d: 'อัพโหลดบันทึกประชุม รับ transcript พร้อมระบุผู้พูดและ summary อัตโนมัติ — รองรับไฟล์ภาษาไทย / อังกฤษ / ผสม.',
      bullets: ['Speaker diarization', 'Auto summary', 'Action items extraction', 'Searchable timeline'],
    },
    {
      slug: 'voice-agent',
      ic: 'Phone',
      t: 'Voice agent',
      sub: 'ASR Streaming + TTS',
      d: 'สร้าง AI voice agent ที่ฟัง-คิด-ตอบได้แบบ real-time — ต่อกับ LLM ของคุณผ่าน WebSocket เดียว.',
      bullets: ['<120ms streaming', 'Barge-in support', 'Emotion-aware TTS', 'Function calling ready'],
    },
  ];
  return (
    <section className="section-pad" id="solutions" data-screen-label="Solutions">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Solutions</span>
          <h2 className="section-title">Pre-built สำหรับ<br/><span className="grad-text">use case ที่พบบ่อย.</span></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            สอง solution หลักที่ประกอบจาก building blocks ของเรา — เริ่มต้นได้เร็วกว่าและ deploy ได้เลย.
          </p>
        </div>

        <div className="sol-grid">
          {cases.map((c, i) => {
            const Icon = Ic[c.ic];
            return (
              <div key={i} className="sol-card">
                <div className="sol-head">
                  <div className="sol-ic"><Icon size={22} /></div>
                  <div>
                    <div className="sol-sub">{c.sub}</div>
                    <h3 className="sol-title">{c.t}</h3>
                  </div>
                </div>
                <p className="sol-desc">{c.d}</p>
                <div className="sol-bullets">
                  {c.bullets.map((b, k) => (
                    <div key={k} className="sol-bullet">
                      <Ic.CheckCirc size={15} style={{ color: 'var(--c-primary-2)' }} /> {b}
                    </div>
                  ))}
                </div>
                <div className="sol-cta">
                  <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate({ page: c.slug }); }} className="btn btn-soft btn-sm">Explore {c.t} <Ic.Arrow size={13} /></a>
                </div>
                <div className="sol-visual">
                  {i === 0 ? <MeetingVisual /> : <AgentVisual />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MeetingVisual() {
  const speakers = [
    { who: 'Aria', color: '#E68CE3', t: 'Let\'s align on the Q3 launch plan.', at: '00:12' },
    { who: 'Sun',  color: '#6981FF', t: 'Engineering is ready — needs marketing copy.', at: '00:24' },
    { who: 'Maya', color: '#F329A2', t: 'I\'ll draft the press release by Friday.', at: '00:31' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {speakers.map((s, i) => (
        <div key={i} style={{
          display: 'flex', gap: 10, alignItems: 'flex-start',
          padding: '8px 10px', borderRadius: 10,
          background: 'var(--c-bg)',
          border: '1px solid var(--c-line)',
        }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: s.color, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{s.who[0]}</span>
          <div style={{ flex: 1, lineHeight: 1.35 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--c-mute)', marginBottom: 1 }}>
              <span style={{ fontWeight: 600, color: 'var(--c-ink)' }}>{s.who}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{s.at}</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--c-ink)' }}>{s.t}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentVisual() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        display: 'flex', gap: 10, alignItems: 'center',
        padding: '10px 12px', borderRadius: 10,
        background: 'var(--c-bg)',
        border: '1px solid var(--c-line)',
      }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--c-grad-a), var(--c-grad-b))', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Ic.Mic size={13} />
        </span>
        <div style={{ flex: 1, fontSize: 11.5 }}>"จองโต๊ะ 4 ที่ คืนวันศุกร์ ตอน 7 โมง"</div>
        <div style={{ width: 40 }}>
          <StaticWave bars={12} height={18} color="var(--c-primary-2)" opacity={0.6} />
        </div>
      </div>
      <div style={{
        padding: '8px 12px', fontSize: 10, color: 'var(--c-mute)',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 4px #22C55E' }}/>
          Agent thinking · 87ms
        </span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>tool: book_table</span>
      </div>
      <div style={{
        display: 'flex', gap: 10, alignItems: 'center',
        padding: '10px 12px', borderRadius: 10,
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--c-grad-a) 12%, transparent), color-mix(in srgb, var(--c-grad-b) 12%, transparent))',
        border: '1px solid color-mix(in srgb, var(--c-grad-b) 25%, transparent)',
      }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', color: 'var(--c-primary-2)', display: 'grid', placeItems: 'center', flexShrink: 0, border: '1px solid var(--c-line)' }}>
          <Ic.Speaker size={13} />
        </span>
        <div style={{ flex: 1, fontSize: 11.5, color: 'var(--c-ink)' }}>"จองให้แล้วค่ะ — ศุกร์ 7 โมงเย็น สำหรับ 4 ท่าน ✓"</div>
      </div>
    </div>
  );
}

export { Solutions };
