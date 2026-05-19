'use client';

import React from 'react';
import { Ic } from '@/components/icons';
import { Waveform } from '@/components/waveform';

function Hero({ onNavigate }) {
  // Live transcript demo
  const fullText = "Welcome to PathummaAudio. Convert speech to text in real-time with state-of-the-art accuracy across 100+ languages.";
  const [chars, setChars] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setChars((c) => {
        if (c >= fullText.length) return 0;
        return c + 1;
      });
    }, 55);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero" data-screen-label="Hero">
      <div className="hero-bg" />
      <div className="hero-grid-bg" />

      <div className="container hero-inner">
        <div>
          <div className="chip" style={{ marginBottom: 22 }}>
            <Ic.Sparkle size={12} />
            New · Pathumma v2 — Now supporting streaming TTS
          </div>
          <h1>
            Audio AI that<br />
            actually <span className="grad-text">understands</span>.
          </h1>
          <p className="hero-sub">
            แพลตฟอร์ม AI ที่ครบที่สุดสำหรับ Speech-to-Text และ Text-to-Speech.
            ประมวลผลเสียงคุณภาพสูงพร้อม API ที่ใช้งานง่าย — สำหรับนักพัฒนาและครีเอเตอร์ทั่วโลก.
          </p>

          <div className="hero-actions">
            <a href="#playground" className="btn btn-primary btn-lg">Try it free <Ic.Arrow size={15} /></a>
            <a href="#research" className="btn btn-ghost btn-lg" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate({ page: 'research' }); }}><Ic.Doc size={15} /> Read the Docs</a>
          </div>

          <div className="hero-stats">
            <div>
              <div className="num"><span style={{ color: 'var(--c-primary-2)' }}></span></div>
              <div className="lbl">
</div>
            </div>
            <div>
              <div className="num"><span style={{ color: 'var(--c-primary-2)' }}>
</span></div>
              <div className="lbl">
</div>
            </div>
            <div>
              <div className="num"><span style={{ fontSize: 16, color: 'var(--c-mute)', fontWeight: 500, marginLeft: 4 }}></span></div>
              <div className="lbl"></div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div className="audio-card">
            <div className="audio-card-head">
              <span className="live-dot">LIVE</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--c-mute)' }}></span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--c-mute)' }}></span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--c-mute)' }}></span>
              </div>
            </div>

            <div className="audio-meta">
              <span className="label">Audio Stream</span>
              <span className="lang"><span className="flag" /> TH · Auto-detected</span>
            </div>

            <div className="wave-frame" style={{ marginTop: 12 }}>
              <Waveform bars={56} height={120} />
              <div className="wave-time">
                <span>00:00</span>
                <span>● recording</span>
                <span>00:14</span>
              </div>
            </div>

            <div className="audio-transcript">
              <span>{fullText.slice(0, chars)}</span>
              <span className="caret" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <span style={{ fontSize: 11, color: 'var(--c-mute)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Ic.Bolt size={12} />

              </span>
              <span style={{ fontSize: 11, color: 'var(--c-primary-2)', fontWeight: 600 }}>pathumma</span>
            </div>
          </div>

          <div className="float-tag" style={{ top: -16, right: -10 }}>
            <span className="ic"><Ic.Globe size={14} /></span>
            <div>
              <div style={{ fontWeight: 700 }}>
</div>
              <div style={{ color: 'var(--c-mute)', fontSize: 11 }}>Thai · English · ··· · 中文</div>
            </div>
          </div>

          <div className="float-tag" style={{ bottom: 38, left: -22 }}>
            <span className="ic flat"><Ic.Shield size={14} /></span>
            <div>
              <div style={{ fontWeight: 700 }}>
</div>
              <div style={{ color: 'var(--c-mute)', fontSize: 11 }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>);}window.Hero = Hero;

export { Hero };
