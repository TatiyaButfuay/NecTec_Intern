'use client';

import React from 'react';
import { Ic } from '@/components/icons';

// Modular microservice — the architecture story
function Modular() {
  const blocks = [
    { id: 'asr-d', t: 'ASR Dropfile', sub: 'Batch transcription', ic: 'Upload', tone: 'a' },
    { id: 'asr-s', t: 'ASR Streaming', sub: 'Real-time transcription', ic: 'Stream', tone: 'b' },
    { id: 'tts',   t: 'TTS',           sub: 'Speech synthesis',     ic: 'Speaker', tone: 'c' },
    { id: 'dia',   t: 'Diarization',   sub: 'Speaker separation',   ic: 'Headphone', tone: 'a' },
    { id: 'lang',  t: 'Language ID',   sub: 'Auto-detect locale',   ic: 'Globe', tone: 'b' },
    { id: 'voice', t: 'Voice Clone',   sub: 'Custom voice training',ic: 'Sparkle', tone: 'c' },
  ];
  return (
    <section className="section-pad" id="research" data-screen-label="Modular">
      <div className="container">
        <div className="mod-head">
          <div>
            <span className="eyebrow">Architecture</span>
            <h2 className="section-title">Modular<br/><span className="grad-text">microservice.</span></h2>
          </div>
          <p className="section-sub">
            ทุก capability เป็น service อิสระ — เลือกเฉพาะที่ใช้, scale แยกกัน, deploy on-prem หรือใน private cloud ของคุณ. ใช้งาน 1 API หรือทั้งหมดก็ได้.
          </p>
        </div>

        <div className="mod-diagram">
          <div className="mod-orbit">
            <div className="mod-core">
              <div className="mod-core-inner">
                <div style={{ fontSize: 10, color: 'var(--c-mute)', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }}>API Gateway</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Pathumma</div>
                <div style={{ fontSize: 11, color: 'var(--c-primary-2)', marginTop: 2 }}>api.pathumma.ai</div>
              </div>
              <div className="mod-core-ring"></div>
              <div className="mod-core-ring r2"></div>
            </div>

            <div className="mod-blocks">
              {blocks.map((b, i) => {
                const Icon = Ic[b.ic];
                return (
                  <div key={b.id} className={`mod-block tone-${b.tone}`} style={{ '--i': i, '--total': blocks.length }}>
                    <div className="mod-block-ic"><Icon size={18} /></div>
                    <div>
                      <div className="mod-block-t">{b.t}</div>
                      <div className="mod-block-s">{b.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mod-traits">
            <div className="mod-trait">
              <Ic.Bolt size={18} />
              <div>
                <h4>Independent scaling</h4>
                <p>Scale STT, TTS, และ diarization แยกกันตาม workload จริง — ประหยัด resource สูงสุด.</p>
              </div>
            </div>
            <div className="mod-trait">
              <Ic.Shield size={18} />
              <div>
                <h4>Deploy anywhere</h4>
                <p>Cloud-hosted, hybrid, on-premise, หรือ air-gapped — ใช้ Docker / Kubernetes ที่คุ้นเคย.</p>
              </div>
            </div>
            <div className="mod-trait">
              <Ic.Code size={18} />
              <div>
                <h4>One API, many services</h4>
                <p>หนึ่ง API key, หนึ่ง SDK — compose services ผ่าน endpoints มาตรฐาน REST + WebSocket.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Modular };
