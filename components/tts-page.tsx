'use client';

import React from 'react';
import { Ic } from '@/components/icons';

// Text-to-Speech tool page.
// Layout matches the supplied design but in the Pathumma brand palette:
//  - Voice Library (horizontally scrollable cards w/ selectable state)
//  - Script editor (textarea + char counter + estimated duration)
//  - Right-side Settings panel (export format, pitch / rate / volume sliders)
//  - Generate Audio CTA
//  - After generation: an audio player dock with a static waveform
function TtsPage({ onBack, onNavigate }) {
  // Voice catalogue ----------------------------------------------------------
  const voices = [
    { id: 'deep-male',    name: 'Deep Male',    tag: 'TH · Calm',     hue: '#6981FF', glyph: 'D' },
    { id: 'warm-female',  name: 'Warm Female',  tag: 'TH · Female',   hue: '#E68CE3', glyph: 'W' },
    { id: 'clear-female', name: 'Clear Female', tag: 'EN · Neutral',  hue: '#33C2C9', glyph: 'C' },
    { id: 'light-male',   name: 'Light Male',   tag: 'EN · Bright',   hue: '#F6B548', glyph: 'L' },
    { id: 'soft-female',  name: 'Soft Female',  tag: 'TH · Soft',     hue: '#A37BE5', glyph: 'S' },
    { id: 'narrator',     name: 'Narrator',     tag: 'EN · Cinematic', hue: '#27C399', glyph: 'N' },
    { id: 'child',        name: 'Child Voice',  tag: 'TH · Playful',  hue: '#F5705A', glyph: 'C' },
  ];

  // State --------------------------------------------------------------------
  const [voiceId, setVoiceId] = React.useState('warm-female');
  const [script, setScript] = React.useState('');
  const [format, setFormat] = React.useState('WAV');
  const [pitch, setPitch] = React.useState(0);
  const [rate, setRate] = React.useState(1);
  const [volume, setVolume] = React.useState(100);
  const [generating, setGenerating] = React.useState(false);
  const [audio, setAudio] = React.useState(null); // { duration, format, voiceName }
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const voice = voices.find(v => v.id === voiceId) || voices[1];
  const charCount = script.length;
  const MAX = 5000;
  const charsPct = Math.min(1, charCount / MAX);
  // Rough estimate: ~14 characters per second of speech (Thai/EN mixed)
  const estSec = Math.round((charCount / 14) / rate);
  const estDur = `${String(Math.floor(estSec / 60)).padStart(2, '0')}:${String(estSec % 60).padStart(2, '0')}`;

  const railRef = React.useRef(null);
  const scrollRail = (dir) => {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  const generate = () => {
    if (!script.trim() || generating) return;
    setGenerating(true);
    setAudio(null);
    setProgress(0);
    setTimeout(() => {
      setGenerating(false);
      setAudio({
        duration: Math.max(3, estSec),
        format,
        voiceName: voice.name,
        voiceHue: voice.hue,
      });
    }, 1200);
  };

  // Fake playback progression
  React.useEffect(() => {
    if (!playing || !audio) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) { setPlaying(false); return 1; }
        return p + 1 / (audio.duration * 10);
      });
    }, 100);
    return () => clearInterval(id);
  }, [playing, audio]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <main className="tts-page" data-screen-label="Text-to-Speech">
      <div className="tts-bg" />

      <div className="container">
        <button className="asr-back" onClick={onBack}>
          <Ic.Arrow size={14} style={{ transform: 'rotate(180deg)' }} /> Back to home
        </button>

        <header className="tts-head">
          <div>
            <h1 className="tts-title">Text-to-Speech</h1>
            <p className="tts-sub">
              Generate professional-grade voiceovers from text — 42 voices, 12 languages,<br/>
              streaming output ready for production.
            </p>
          </div>
        </header>

        <div className="tts-grid">
          {/* LEFT — voices + script */}
          <div className="tts-left">
            {/* Voice Library */}
            <section className="tts-voice-section">
              <div className="tts-section-head">
                <div>
                  <span className="tts-eyebrow">Voice Library</span>
                  <div className="tts-section-t">Pick a voice <span className="tts-section-count">· {voices.length} ready</span></div>
                </div>
                <div className="tts-rail-nav">
                  <button onClick={() => scrollRail(-1)} aria-label="Scroll left">‹</button>
                  <button onClick={() => scrollRail(1)} aria-label="Scroll right">›</button>
                </div>
              </div>

              <div className="tts-voice-rail" ref={railRef}>
                {voices.map((v) => (
                  <VoiceCard
                    key={v.id}
                    voice={v}
                    active={v.id === voiceId}
                    onSelect={() => setVoiceId(v.id)}
                  />
                ))}
              </div>
            </section>

            {/* Script editor */}
            <section className="tts-script-card">
              <div className="tts-script-head">
                <div className="tts-script-t">Script</div>
                <div className="tts-script-actions">
                  <button className="asr-icon-btn" title="Copy" onClick={() => navigator.clipboard?.writeText(script)}>
                    <Ic.Copy size={16} />
                  </button>
                  <button className="asr-icon-btn" title="Clear" onClick={() => setScript('')}>
                    <Ic.Trash size={16} />
                  </button>
                </div>
              </div>

              <textarea
                className="tts-textarea"
                placeholder={`พิมพ์หรือวางข้อความที่นี่... \n\nลองใช้ <emphasis> และ <break time="500ms"/> เพื่อควบคุมการเน้นและจังหวะหยุด.`}
                maxLength={MAX}
                value={script}
                onChange={(e) => setScript(e.target.value)}
              />

              <div className="tts-script-meta">
                <span className="tts-meta-l">
                  Estimated duration · <strong>{estDur}</strong>
                </span>
                <span className={`tts-meta-r ${charsPct > 0.9 ? 'warn' : ''}`}>
                  <span className="tts-meta-bar">
                    <i style={{ width: `${charsPct * 100}%` }} />
                  </span>
                  {charCount} / {MAX} chars
                </span>
              </div>
            </section>

            {/* Audio player — appears after generation */}
            {audio && (
              <section className="tts-audio-card">
                <div className="tts-audio-head">
                  <div className="tts-audio-meta">
                    <span className="tts-audio-av" style={{ background: audio.voiceHue }}>{voice.glyph}</span>
                    <div>
                      <div className="tts-audio-name">{audio.voiceName}</div>
                      <div className="tts-audio-sub">{audio.format} · {Math.round(audio.duration)}s · ~{(audio.duration * (audio.format === 'WAV' ? 188 : 40)).toFixed(0)} KB</div>
                    </div>
                  </div>
                  <div className="tts-audio-actions">
                    <button className="asr-icon-btn" title="Download"><Ic.Download size={18} /></button>
                    <button className="asr-icon-btn" title="Copy"><Ic.Copy size={18} /></button>
                  </div>
                </div>

                <div className="tts-audio-row">
                  <button className="tts-audio-play" onClick={() => setPlaying(!playing)}>
                    {playing ? <Ic.Pause size={16} /> : <Ic.Play size={16} />}
                  </button>
                  <TtsAudioWave hue={audio.voiceHue} progress={progress} />
                  <span className="tts-audio-time">
                    {fmt(audio.duration * progress)} / {fmt(audio.duration)}
                  </span>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT — settings */}
          <aside className="tts-right">
            <div className="tts-settings-card">
              <div className="tts-settings-head">SETTINGS</div>

              {/* Export quality */}
              <div className="tts-setting">
                <label className="tts-setting-lbl">Export Quality</label>
                <div className="tts-format-grid">
                  {[
                    { id: 'WAV',  sub: '96kHz' },
                    { id: 'MP3',  sub: '320k' },
                    { id: 'FLAC', sub: 'Lossless' },
                    { id: 'OGG',  sub: 'Web' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      className={`tts-format ${format === f.id ? 'active' : ''}`}
                      onClick={() => setFormat(f.id)}>
                      <span className="tts-format-id">{f.id}</span>
                      <span className="tts-format-sub">{f.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Slider label="Pitch" value={pitch} min={-12} max={12} step={0.5}
                onChange={setPitch}
                fmt={(v) => v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}
                unit="st" />
              <Slider label="Playback Rate" value={rate} min={0.5} max={2} step={0.05}
                onChange={setRate}
                fmt={(v) => v.toFixed(2)} unit="×" />
              <Slider label="Master Volume" value={volume} min={0} max={150} step={1}
                onChange={setVolume}
                fmt={(v) => v.toFixed(0)} unit="%" />
            </div>

            <button
              className="tts-cta"
              disabled={!script.trim() || generating}
              onClick={generate}>
              {generating ? (
                <>
                  <span className="tts-cta-spinner" />
                  Generating…
                </>
              ) : audio ? (
                <>
                  <Ic.Sparkle size={16} /> Re-generate Audio
                </>
              ) : (
                <>
                  <Ic.Play size={14} /> Generate Audio
                </>
              )}
            </button>

            {/* Tips card */}
            <div className="tts-tips">
              <div className="tts-tips-t">Tip · SSML supported</div>
              <p>
                ใช้ <code>&lt;emphasis&gt;</code>, <code>&lt;break time=&quot;500ms&quot;/&gt;</code>{' '}
                หรือ <code>&lt;prosody rate=&quot;slow&quot;&gt;</code> เพื่อควบคุมการอ่านได้ละเอียดขึ้น.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// ----- Sub-components -------------------------------------------------------
function VoiceCard({ voice, active, onSelect }) {
  // Mini waveform that animates when active
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick((t) => t + 1), 220);
    return () => clearInterval(id);
  }, [active]);

  const bars = Array.from({ length: 11 }, (_, i) => {
    const phase = (i / 11) * Math.PI * 3 + tick * 0.4;
    return Math.max(0.18, Math.abs(Math.sin(phase)) * 0.9 + 0.1);
  });

  return (
    <button
      className={`tts-voice-card ${active ? 'active' : ''}`}
      onClick={onSelect}
      style={active ? { '--c-hue': voice.hue } : {}}>
      <div className="tts-voice-av" style={{ background: voice.hue }}>
        <Ic.User size={20} />
        {active && (
          <span className="tts-voice-pulse" style={{ borderColor: voice.hue }} />
        )}
      </div>

      <div className="tts-voice-name">{voice.name}</div>
      <div className="tts-voice-tag">{voice.tag}</div>

      <div className="tts-voice-wave">
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h * 100}%`, background: active ? voice.hue : 'var(--c-mute)' }} />
        ))}
      </div>
    </button>
  );
}

function Slider({ label, value, min, max, step, onChange, fmt, unit }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="tts-setting">
      <div className="tts-setting-row">
        <label className="tts-setting-lbl">{label}</label>
        <span className="tts-setting-val">
          {fmt ? fmt(value) : value}<span className="tts-setting-unit">{unit}</span>
        </span>
      </div>
      <div className="tts-slider">
        <div className="tts-slider-track">
          <div className="tts-slider-fill" style={{ width: `${pct}%` }} />
          <div className="tts-slider-knob" style={{ left: `${pct}%` }} />
        </div>
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))} />
      </div>
    </div>
  );
}

function TtsAudioWave({ hue, progress }) {
  // Deterministic bars (no animation), fill up to progress
  const bars = React.useMemo(() => (
    Array.from({ length: 64 }, (_, i) => {
      const p = i / 64;
      const env = Math.sin(p * Math.PI);
      const noise = Math.abs(Math.sin(i * 1.3) + Math.cos(i * 0.5)) * 0.4;
      return Math.max(0.1, env * (0.55 + noise));
    })
  ), []);
  return (
    <div className="tts-audio-wave">
      {bars.map((h, i) => {
        const filled = i / bars.length < progress;
        return (
          <span key={i}
            style={{
              height: `${h * 100}%`,
              background: filled ? hue : 'var(--c-line)',
              opacity: filled ? 1 : 0.6,
            }} />
        );
      })}
    </div>
  );
}

export { TtsPage };
