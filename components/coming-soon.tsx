'use client';

import React from 'react';
import { Ic } from '@/components/icons';
import { PathummaMark } from '@/components/waveform';

// Placeholder page for sections that aren't built out yet
// (Research, Developer, About). Keeps the nav navigable without
// pretending we have real content there.
function ComingSoon({ slug, onBack }) {
  const data = {
    research: {
      eyebrow: 'Research',
      title: 'Where Pathumma is going next.',
      sub: 'หน้านี้กำลังจัดทำ — เร็ว ๆ นี้คุณจะได้อ่าน papers, benchmarks และโมเดลใหม่ที่เราเปิดให้ทดลอง.',
      bullets: [
        'Whitepapers ภาษาไทย / English',
        'Benchmarks vs. Whisper, Conformer, Sonos',
        'Open-weights สำหรับนักวิจัย',
      ],
    },
    developer: {
      eyebrow: 'Developer',
      title: 'Docs, SDKs, & playgrounds.',
      sub: 'พื้นที่สำหรับนักพัฒนายังอยู่ระหว่างการสร้าง — ขอเวลาอีกสักครู่.',
      bullets: [
        'OpenAPI 3.1 spec + SDK generator',
        'Recipes & live API playground',
        'GitHub examples ใน 8+ ภาษา',
      ],
    },
    about: {
      eyebrow: 'About',
      title: 'The team behind Pathumma.',
      sub: 'หน้าทีม / company ของเรากำลังจะมา — coming soon.',
      bullets: [
        'ทีม research & engineering',
        'พันธมิตรและ enterprise customers',
        'Careers — เรากำลังหาคน.',
      ],
    },
  };

  const d = data[slug] || data.research;

  return (
    <section className="section-pad coming-soon" data-screen-label={`ComingSoon-${slug}`}>
      <div className="cs-bg" />
      <div className="container">
        <button className="cs-back" onClick={onBack}>
          <Ic.Arrow size={14} style={{ transform: 'rotate(180deg)' }} /> Back to home
        </button>

        <div className="cs-grid">
          <div>
            <span className="eyebrow">— {d.eyebrow}</span>
            <h1 className="cs-title">{d.title.split('.')[0]}.<br/><span className="grad-text">Coming soon.</span></h1>
            <p className="cs-sub">{d.sub}</p>

            <ul className="cs-list">
              {d.bullets.map((b, i) => (
                <li key={i}>
                  <span className="cs-bullet" />
                  {b}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
              <button className="btn btn-primary btn-lg" onClick={onBack}>
                Back to home <Ic.Arrow size={14} />
              </button>
              <a href="#" className="btn btn-ghost btn-lg">Get notified <Ic.Sparkle size={12} /></a>
            </div>
          </div>

          {/* Right side: animated mark in a card — re-uses the brand asset */}
          <div className="cs-stage">
            <div className="cs-stage-card">
              <div className="cs-stage-chip">Under construction</div>
              <PathummaMark size={120} animate={true} />
              <div className="cs-stage-meta">
                <span className="cs-dot" />
                <span>building · {d.eyebrow.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { ComingSoon };
