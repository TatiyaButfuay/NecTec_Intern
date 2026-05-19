'use client';

import React from 'react';
import { Ic } from '@/components/icons';

// Brand animation section — the Pathumma mark as a living audio organism.
// Replaces the old Solutions / Modular / Docs preview sections.
function LogoAnim() {
  // Drive everything off one shared clock so bars/rings/orbits stay in sync.
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    let start;
    const loop = (now) => {
      if (start == null) start = now;
      setT((now - start) / 1000); // seconds
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 8-bar diamond logo, but bars now breathe like a real meter.
  // Each bar has its own base height + amplitude + phase so the silhouette
  // morphs between the rigid logo and a free-form waveform.
  const bars = React.useMemo(() => ([
    { base: 28,  amp: 14, phase: 0.0 },
    { base: 56,  amp: 22, phase: 0.6 },
    { base: 82,  amp: 30, phase: 1.1 },
    { base: 116, amp: 14, phase: 1.6 },
    { base: 116, amp: 14, phase: 2.1 },
    { base: 82,  amp: 30, phase: 2.6 },
    { base: 56,  amp: 22, phase: 3.1 },
    { base: 28,  amp: 14, phase: 3.6 },
  ]), []);

  // Orbiting capability tokens.
  const orbiters = [
    { label: 'ASR Dropfile',  angle: -90, radius: 230, speed: 0.08, color: 'var(--c-grad-a)' },
    { label: 'ASR Streaming', angle: -25, radius: 260, speed: 0.06, color: 'var(--c-pink)' },
    { label: 'Text-to-Speech', angle: 60, radius: 235, speed: 0.07, color: 'var(--c-grad-b)' },
    { label: 'Voice Clone',  angle: 135, radius: 270, speed: 0.05, color: 'var(--c-primary-2)' },
    { label: 'Language ID',  angle: -150, radius: 245, speed: 0.09, color: 'var(--c-grad-a)' },
  ];

  // 3 concentric rings with slowly counter-rotating dashes.
  const rings = [
    { r: 200, dash: '6 14', speed:  6, opacity: 0.55 },
    { r: 260, dash: '4 18', speed: -4, opacity: 0.40 },
    { r: 330, dash: '2 22', speed:  3, opacity: 0.25 },
  ];

  return (
    <section className="section-pad logo-anim-section" data-screen-label="Brand">
      <div className="logo-anim-bg" />
      <div className="container">
        <div className="logo-anim-head">
          <span className="eyebrow">— Audio, in motion</span>
          <h2 className="section-title">
            The mark is the<br /><span className="grad-text">waveform.</span>
          </h2>
          <p className="section-sub" style={{ margin: '20px auto 0', textAlign: 'center' }}>
            แปดบาร์ในสัญลักษณ์ของ Pathumma คือคลื่นเสียงจริง — ที่หายใจ, สั่นไหว และเปล่งเสียงไปพร้อมโมเดลของเรา.
          </p>
        </div>

        <div className="logo-anim-stage">
          {/* Glow halo */}
          <div className="la-halo" />
          <div className="la-halo la-halo-2" />

          {/* Rotating dotted rings */}
          <svg className="la-rings" viewBox="-400 -400 800 800">
            {rings.map((ring, i) => (
              <g key={i} style={{
                transformOrigin: '0 0',
                transform: `rotate(${(t * ring.speed) % 360}deg)`,
              }}>
                <circle
                  cx="0" cy="0" r={ring.r}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray={ring.dash}
                  opacity={ring.opacity}
                />
              </g>
            ))}

            {/* Tick markers around the inner ring — like a meter scale */}
            {Array.from({ length: 48 }).map((_, i) => {
              const a = (i / 48) * Math.PI * 2;
              const r1 = 200, r2 = 200 + (i % 4 === 0 ? 14 : 6);
              const o = 0.10 + Math.abs(Math.sin(t * 1.2 + i * 0.4)) * 0.35;
              return (
                <line key={i}
                  x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
                  x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
                  opacity={o} />
              );
            })}

            {/* The diamond outline of the logo, scaled up to fill the stage */}
            <path d="M0 -150 L95 0 L0 150 L-95 0 Z"
                  fill="none"
                  stroke="url(#la-stroke)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  opacity="0.55" />

            <defs>
              <linearGradient id="la-stroke" x1="0" y1="-1" x2="0" y2="1">
                <stop offset="0%"  stopColor="#F3B5EE" />
                <stop offset="35%" stopColor="#E68CE3" />
                <stop offset="100%" stopColor="#6981FF" />
              </linearGradient>
              <linearGradient id="la-bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#F3B5EE" />
                <stop offset="35%" stopColor="#E68CE3" />
                <stop offset="100%" stopColor="#6981FF" />
              </linearGradient>
              <filter id="la-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* The animated 8-bar mark itself, big in the centre */}
            <g filter="url(#la-glow)" transform="scale(1.9)">
              {bars.map((b, i) => {
                // each bar oscillates around its base height
                const h = b.base + Math.sin(t * 1.8 + b.phase) * b.amp;
                const x = -38 + i * 9.5;
                return (
                  <rect key={i}
                    x={x - 2.4}
                    y={-h / 2}
                    width="4.8"
                    height={h}
                    rx="2.4"
                    fill="url(#la-bar)" />
                );
              })}
            </g>

            {/* Emitted sound pulses — three expanding rings that fade out */}
            {[0, 1, 2].map((i) => {
              const period = 3.2;
              const phase = (t / period + i / 3) % 1;
              const r = 130 + phase * 220;
              const op = (1 - phase) * 0.45;
              return (
                <circle key={i}
                  cx="0" cy="0" r={r}
                  fill="none"
                  stroke="url(#la-stroke)"
                  strokeWidth={1.5 - phase}
                  opacity={op} />
              );
            })}
          </svg>

          {/* Floating capability orbiters, positioned in DOM (not SVG) so the
              text uses real fonts. Position is computed from the shared clock. */}
          {orbiters.map((o, i) => {
            const a = (o.angle + t * o.speed * 60) * Math.PI / 180;
            const x = Math.cos(a) * o.radius;
            const y = Math.sin(a) * o.radius * 0.55; // squash to ellipse
            const z = Math.sin(a); // depth cue
            const scale = 0.85 + (z + 1) * 0.07;
            const op = 0.55 + (z + 1) * 0.2;
            return (
              <div key={i} className="la-orbiter"
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${scale})`,
                  opacity: op,
                  zIndex: z > 0 ? 5 : 1,
                }}>
                <span className="la-dot" style={{ background: o.color, boxShadow: `0 0 12px ${o.color}` }} />
                <span>{o.label}</span>
              </div>
            );
          })}
        </div>

        {/* Three callouts that explain what the animation represents */}
        <div className="logo-anim-grid">
          <div className="la-card">
            <div className="la-card-ic"><Ic.Bolt size={18} /></div>
            <div className="la-card-t">Real-time at the core</div>
            <p className="la-card-d">บาร์แต่ละแท่งคือสตรีมเสียงสด — 87ms ตั้งแต่ input ถึงข้อความ.</p>
          </div>
          <div className="la-card">
            <div className="la-card-ic"><Ic.Globe size={18} /></div>
            <div className="la-card-t">One mark, every voice</div>
            <p className="la-card-d">โมเดลเดียวเข้าใจ 100+ ภาษา — เปลี่ยน input ไม่ต้องเปลี่ยน endpoint.</p>
          </div>
          <div className="la-card">
            <div className="la-card-ic"><Ic.Shield size={18} /></div>
            <div className="la-card-t">Modular by design</div>
            <p className="la-card-d">STT, Streaming, TTS, Voice Clone — เลือกใช้แยก, scale แยก, deploy ที่ไหนก็ได้.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export { LogoAnim };
