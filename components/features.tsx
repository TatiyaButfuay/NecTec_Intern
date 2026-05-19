'use client';

import React from 'react';
import { Waveform, StaticWave } from '@/components/waveform';

function LogosStrip() {
  const logos = [
  { name: 'Acoustica', glyph: '◐' },
  { name: 'Vocaly', glyph: '◢' },
  { name: 'Echonix', glyph: '✦' },
  { name: 'Linguara', glyph: '◈' },
  { name: 'Sonix Labs', glyph: '◯' },
  { name: 'Trans·AI', glyph: '◬' }];

  return (
    <div className="container logos">
      <div className="logos-label">
</div>
      <div className="logos-row">
        {logos.map((l) => <div key={l.name} className="logo-item">
            <span style={{ marginRight: 8, fontSize: 22, color: 'var(--c-primary-2)' }}>{l.glyph}</span>
            {l.name}
          </div>
        )}
      </div>
    </div>);

}

function Features() {
  return (
    <section className="section-pad" id="products" data-screen-label="Products">
      <div className="container">
        <div className="features-head">
          <div>
            <span className="eyebrow">Products</span>
            <h2 className="section-title">Three core APIs.<br /><span className="grad-text">Built for production.</span></h2>
          </div>
          <p className="section-sub">
            ASR Dropfile, ASR Streaming, และ Text-to-Speech — โมดูลที่ใช้ร่วมกันได้ หรือเลือกใช้แยกตามต้องการ ผ่าน API เดียว.
          </p>
        </div>

        <div className="features-grid">
          {/* Hero card - ASR Dropfile */}
          <div className="feature-card feat-hero">
            <div className="feature-visual" style={{ background: 'transparent' }}>
              <SttVisual />
            </div>
            <div className="chip" style={{ marginBottom: 12 }}>Most popular</div>
            <h3 className="feat-title">ASR Dropfile</h3>
            <p className="feat-desc">
              อัพโหลดไฟล์เสียงหรือวิดีโอ — ถอดเป็นข้อความที่แม่นยำสูง พร้อมระบุผู้พูด, timestamps ระดับคำ, และคำศัพท์เฉพาะทาง.
            </p>
            <div className="feat-meta">
              <span className="tag">Batch processing</span>
              <span className="tag">Speaker diarization</span>
              <span className="tag">Word-level timing</span>
              <span className="tag">120+ formats</span>
            </div>
          </div>

          {/* Streaming */}
          <div className="feature-card">
            <div className="feature-visual">
              <StreamingVisual />
            </div>
            <h3 className="feat-title">ASR Streaming</h3>
            <p className="feat-desc">
              ถอดเป็นข้อความแบบเรียลไทม์ — สำหรับ live captions และ voice agents ผ่าน WebSocket.
            </p>
            <div className="feat-meta">
              <span className="tag">
</span>
              <span className="tag">
</span>
            </div>
          </div>

          {/* TTS */}
          <div className="feature-card">
            <div className="feature-visual">
              <TtsVisual />
            </div>
            <h3 className="feat-title">Text-to-Speech</h3>
            <p className="feat-desc">
              สังเคราะห์เสียงที่เป็นธรรมชาติ พร้อม voice cloning และควบคุมอารมณ์.
            </p>
            <div className="feat-meta">
              <span className="tag">42 voices</span>
              <span className="tag">Voice clone</span>
            </div>
          </div>
        </div>
      </div>
    </section>);
}

function SttVisual() {
  const lines = [
  { w: '70%', t: 'Hello, welcome to Pathumma.' },
  { w: '52%', t: 'We help teams build voice-first apps.' },
  { w: '64%', t: 'Today let me show you how it works...' }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '85%', padding: 18 }}>
      {lines.map((l, i) =>
      <div key={i} style={{
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.55)',
        borderRadius: 12,
        fontSize: 12,
        color: 'var(--c-ink)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255,255,255,0.5)',
        opacity: 0.85,
        transform: `translateX(${i % 2 === 0 ? 0 : 14}px)`
      }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: 'var(--c-mute)', marginBottom: 4 }}>
            <span>Speaker {i % 2 + 1}</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>00:{(12 + i * 4).toString().padStart(2, '0')}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--c-ink)' }}>{l.t}</div>
        </div>
      )}
    </div>);

}

function StreamingVisual() {
  return (
    <div style={{ width: '100%', padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--c-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-pink)', boxShadow: '0 0 6px var(--c-pink)' }} />
          Live
        </span>
        <span>87ms</span>
      </div>
      <Waveform bars={36} height={70} />
      <div style={{
        padding: '8px 10px',
        background: 'var(--c-bg)',
        border: '1px solid var(--c-line)',
        borderRadius: 8,
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--c-ink)'
      }}>
        → "real-time transcript<span style={{ display: 'inline-block', width: 2, height: 11, background: 'var(--c-primary)', marginLeft: 2, verticalAlign: -1, animation: 'blink 1s infinite' }} />"
      </div>
    </div>);

}

function TtsVisual() {
  const voices = [
  { name: 'Aria', tag: 'TH · Female', color: '#E68CE3' },
  { name: 'Sun', tag: 'EN · Male', color: '#6981FF' },
  { name: 'Maya', tag: 'TH · Calm', color: '#F329A2' }];

  return (
    <div style={{ width: '100%', padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {voices.map((v, i) =>
      <div key={i} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--c-bg)',
        border: '1px solid var(--c-line)',
        borderRadius: 10,
        padding: '8px 10px'
      }}>
          <span style={{ width: 26, height: 26, borderRadius: '50%', background: v.color, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{v.name[0]}</span>
          <div style={{ flex: 1, lineHeight: 1.2 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{v.name}</div>
            <div style={{ fontSize: 10, color: 'var(--c-mute)' }}>{v.tag}</div>
          </div>
          <div style={{ width: 70, opacity: 0.6 }}>
            <StaticWave bars={18} height={22} color="var(--c-primary-2)" />
          </div>
        </div>
      )}
    </div>);

}

export { Features, LogosStrip };
