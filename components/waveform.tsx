'use client';

import React from 'react';

// Animated audio waveform — used in hero, CTA, demo
// Pathumma Audio brand mark — lotus shape made of audio bars + thin diamond outline
function PathummaMark({ size = 30, stroke = true, animate = false }) {
  const id = React.useId();
  const bars = [
    { h: 28 },  // outer
    { h: 56 },
    { h: 82 },
    { h: 116 },
    { h: 116 },
    { h: 82 },
    { h: 56 },
    { h: 28 },
  ];
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setTick(t => t + 1), 280);
    return () => clearInterval(id);
  }, [animate]);
  return (
    <svg viewBox="0 0 100 140" width={size} height={size * 1.4} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`pm-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3B5EE" />
          <stop offset="35%" stopColor="#E68CE3" />
          <stop offset="100%" stopColor="#6981FF" />
        </linearGradient>
      </defs>
      {stroke && (
        <path d="M50 6 L88 70 L50 134 L12 70 Z"
              fill="none" stroke="currentColor" strokeWidth="1.2"
              strokeLinejoin="round" opacity="0.55" />
      )}
      {bars.map((b, i) => {
        const x = 14 + i * 9.5;
        const wobble = animate ? Math.sin((tick + i) * 0.6) * 6 : 0;
        const h = Math.max(20, b.h + wobble);
        return (
          <rect key={i}
            x={x - 2.4} y={70 - h / 2}
            width="4.8" height={h} rx="2.4"
            fill={`url(#pm-${id})`} />
        );
      })}
    </svg>
  );
}

function Waveform({ bars = 48, height = 110, color = "url(#wave-grad)", animate = true, seed = 0, peaks = null, style = {} }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => setTick(t => t + 1), 220);
    return () => clearInterval(interval);
  }, [animate]);

  // Generate bar heights
  const heights = React.useMemo(() => {
    return Array.from({ length: bars }, (_, i) => {
      if (peaks) return peaks[i % peaks.length];
      const phase = (i / bars) * Math.PI * 4 + seed;
      const t = animate ? tick * 0.08 : 0;
      const base = Math.abs(Math.sin(phase + t)) * 0.55;
      const noise = Math.abs(Math.sin(i * 0.7 + t * 0.35)) * 0.30;
      const envelope = Math.sin((i / bars) * Math.PI); // taper edges
      return Math.max(0.06, (base + noise) * envelope + 0.08);
    });
  }, [bars, tick, animate, seed, peaks]);

  const barW = 100 / bars;
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: '100%', height: height, display: 'block', ...style }}>
      <defs>
        <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E68CE3" />
          <stop offset="100%" stopColor="#6981FF" />
        </linearGradient>
      </defs>
      {heights.map((h, i) => {
        const bh = h * height;
        return (
          <rect
            key={i}
            x={i * barW + barW * 0.18}
            y={(height - bh) / 2}
            width={barW * 0.64}
            height={bh}
            rx={barW * 0.32}
            fill={color}
          />
        );
      })}
    </svg>
  );
}

// Static waveform (for code or fixed look)
function StaticWave({ bars = 32, height = 30, color = "currentColor", opacity = 1 }) {
  const heights = React.useMemo(() => {
    return Array.from({ length: bars }, (_, i) => {
      const phase = (i / bars) * Math.PI * 6;
      const base = Math.abs(Math.sin(phase)) * 0.55;
      const noise = Math.abs(Math.sin(i * 1.3)) * 0.30;
      const envelope = Math.sin((i / bars) * Math.PI);
      return Math.max(0.10, (base + noise) * envelope + 0.10);
    });
  }, [bars]);
  const barW = 100 / bars;
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block', opacity }}>
      {heights.map((h, i) => (
        <rect key={i} x={i * barW + barW * 0.20} y={(height - h * height) / 2} width={barW * 0.60} height={h * height} rx={barW * 0.30} fill={color} />
      ))}
    </svg>
  );
}

export { PathummaMark, Waveform, StaticWave };
