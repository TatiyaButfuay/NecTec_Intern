'use client';

import React from 'react';
import { Ic } from '@/components/icons';

// Voice Agent — interactive demo page.
//
// Hamburger button opens a Voice picker (choose the agent's voice).
// Mic button: when muted, opens a browser-like permission popover that
// lets the user pick a microphone and Allow / Allow once / Deny before
// the mic actually turns on.

const AGENT_VOICES = [
  { id: 'aria',   name: 'Aria',    tag: 'TH · Warm female',     color: '#E68CE3', sample: '"สวัสดีค่ะ ฉันชื่ออาเรีย ยินดีที่ได้พบนะคะ"' },
  { id: 'sun',    name: 'Sun',     tag: 'EN · Neutral male',    color: '#6981FF', sample: '"Hi, I\'m Sun. Nice to meet you."' },
  { id: 'maya',   name: 'Maya',    tag: 'TH · Calm female',     color: '#F329A2', sample: '"สวัสดีค่ะ มายาคุยกับคุณค่ะ"' },
  { id: 'rio',    name: 'Rio',     tag: 'EN · Bright male',     color: '#33C2C9', sample: '"Hi, I\'m Rio — let\'s get started."' },
  { id: 'echo',   name: 'Echo',    tag: 'TH · Cinematic',       color: '#A37BE5', sample: '"สวัสดีครับ ผมเอคโค่ ยินดีที่ได้พบครับ"' },
];

const MIC_SOURCES = [
  { id: 'usb',     name: 'Studio Mic (USB)' },
  { id: 'system',  name: 'Default System Microphone' },
  { id: 'airpods', name: 'AirPods Pro' },
  { id: 'headset', name: 'External Headset' },
];

function VoiceAgent({ onBack, onNavigate }) {
  // 'muted' means the mic permission hasn't been granted yet.
  // 'listening' means the agent's mic is hot.
  const [state, setState] = React.useState('muted');
  const [volume, setVolume] = React.useState(70);
  const [showVoiceMenu, setShowVoiceMenu] = React.useState(false);
  const [showPermission, setShowPermission] = React.useState(false);
  const [permLevel, setPermLevel] = React.useState(null); // 'session' | 'once' | null
  const [voiceId, setVoiceId] = React.useState('aria');
  const [micId, setMicId] = React.useState('usb');

  const voice = AGENT_VOICES.find(v => v.id === voiceId) || AGENT_VOICES[0];
  const mic = MIC_SOURCES.find(m => m.id === micId) || MIC_SOURCES[0];

  // Conversation log (demo)
  const [log] = React.useState([
    { who: 'agent', text: 'สวัสดีค่ะ ฉันคือ Pathumma Voice Agent — มีอะไรให้ช่วยมั้ยคะ?' },
    { who: 'you',   text: 'อยากให้ช่วยจองโต๊ะร้านอาหาร 4 คน วันเสาร์เย็นค่ะ' },
    { who: 'agent', text: 'ได้เลยค่ะ ขอชื่อร้านและเวลาที่ต้องการนะคะ' },
  ]);

  // Fake amplitude — drives the rings + orb breathing.
  const [amp, setAmp] = React.useState(0.1);
  const ampRef = React.useRef(0.1);
  React.useEffect(() => {
    if (state === 'muted') {
      const id = setInterval(() => {
        ampRef.current += (0 - ampRef.current) * 0.2;
        setAmp(Math.max(0, ampRef.current));
      }, 60);
      return () => clearInterval(id);
    }
    let next = 0;
    let nextChange = 0;
    const id = setInterval(() => {
      if (Date.now() > nextChange) {
        const isLoud = Math.random() < 0.55;
        next = isLoud ? 0.55 + Math.random() * 0.45 : 0.05 + Math.random() * 0.25;
        nextChange = Date.now() + 220 + Math.random() * 500;
      }
      ampRef.current += (next - ampRef.current) * 0.20;
      const jitter = (Math.random() - 0.5) * 0.06;
      setAmp(Math.max(0, Math.min(1, ampRef.current + jitter)));
    }, 60);
    return () => clearInterval(id);
  }, [state]);

  // Mic-input level meter for the permission dialog (only when shown).
  const [meter, setMeter] = React.useState(0);
  React.useEffect(() => {
    if (!showPermission) return;
    const id = setInterval(() => {
      // smooth jitter — looks like a real input level meter
      setMeter((m) => {
        const target = 0.2 + Math.random() * 0.6;
        return m + (target - m) * 0.25;
      });
    }, 80);
    return () => clearInterval(id);
  }, [showPermission]);

  // Continuous emit cycle for the 3 background rings
  const [pulsePhase, setPulsePhase] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setPulsePhase((p) => (p + 1) % 1000), 32);
    return () => clearInterval(id);
  }, []);

  // Dots animation
  const [dotPhase, setDotPhase] = React.useState(0);
  React.useEffect(() => {
    if (state === 'muted') return;
    const id = setInterval(() => setDotPhase((p) => (p + 1) % 5), 220);
    return () => clearInterval(id);
  }, [state]);

  const onMicClick = () => {
    if (state === 'muted') {
      if (permLevel === 'session') {
        setState('listening');     // already remembered — skip prompt
      } else {
        setShowPermission(true);   // ask for permission
      }
    } else {
      setState('muted');
    }
  };

  const grantPermission = (level) => {
    setPermLevel(level);
    setShowPermission(false);
    setState('listening');
  };
  const denyPermission = () => {
    setShowPermission(false);
  };

  const rings = [0, 1, 2].map((i) => {
    const cyclePeriod = 60;
    const phase = ((pulsePhase + i * (cyclePeriod / 3)) % cyclePeriod) / cyclePeriod;
    const scale = 1.0 + phase * (0.35 + amp * 0.55);
    const opacity = (1 - phase) * (0.10 + amp * 0.55);
    return { scale, opacity, key: i };
  });

  const orbScale = 0.92 + amp * 0.14;
  const orbGlow = 0.25 + amp * 0.55;

  return (
    <main className="va-page" data-screen-label="Voice Agent">
      <div className="va-bg" />

      <div className="container">
        <header className="va-head">
          <button className="asr-back" onClick={onBack} style={{ marginBottom: 14 }}>
            <Ic.Arrow size={14} style={{ transform: 'rotate(180deg)' }} /> Back to home
          </button>
          <h1 className="va-title">Voice Agent</h1>
          <p className="va-sub">
            พูดคุยกับ Pathumma Voice Agent — รวม Streaming STT, LLM และ TTS ใน loop เดียว.
            ปัจจุบันใช้เสียง <strong>{voice.name}</strong> · <span style={{ color: voice.color, fontWeight: 600 }}>{voice.tag}</span>
          </p>
        </header>

        <div className="va-stage">
          <div className="va-orb-area">
            <div className="va-rings">
              {rings.map((r) => (
                <span
                  key={r.key}
                  className="va-ring"
                  style={{
                    transform: `translate(-50%, -50%) scale(${r.scale})`,
                    opacity: r.opacity,
                  }}
                />
              ))}
              <span
                className="va-ring va-ring-amp"
                style={{
                  transform: `translate(-50%, -50%) scale(${1 + amp * 0.55})`,
                  opacity: 0.16 + amp * 0.35,
                }}
              />
            </div>

            <div
              className={`va-orb ${state}`}
              style={{
                transform: `scale(${orbScale})`,
                boxShadow: `
                  0 28px 60px rgba(190, 125, 245, ${orbGlow}),
                  inset -22px -22px 50px rgba(123, 65, 196, 0.50),
                  inset 18px 18px 46px rgba(255, 255, 255, 0.40)`,
              }}>
              <span className="va-orb-hi" />
              <span className="va-orb-shadow" />
            </div>

            {/* Side circular buttons + popovers */}
            <div className="va-side-l">
              <button
                className={`va-side-btn ${showVoiceMenu ? 'active' : ''}`}
                onClick={() => { setShowVoiceMenu((v) => !v); setShowPermission(false); }}
                aria-label="Voice picker">
                <span className="va-burger"><span /><span /><span /></span>
              </button>

              {showVoiceMenu && (
                <VoicePicker
                  voices={AGENT_VOICES}
                  selected={voiceId}
                  onSelect={(id) => { setVoiceId(id); setShowVoiceMenu(false); }}
                  onClose={() => setShowVoiceMenu(false)}
                />
              )}
            </div>

            <div className="va-side-r">
              <button
                className={`va-side-btn ${state === 'muted' ? 'muted' : 'active'}`}
                onClick={onMicClick}
                aria-label="Toggle microphone">
                {state === 'muted' ? <Ic.MicOff size={20} /> : <Ic.Mic size={20} />}
              </button>

              {showPermission && (
                <PermissionPopover
                  mics={MIC_SOURCES}
                  selected={micId}
                  setSelected={setMicId}
                  meter={meter}
                  onAllow={() => grantPermission('session')}
                  onAllowOnce={() => grantPermission('once')}
                  onDeny={denyPermission}
                />
              )}
            </div>
          </div>

          <div className="va-status">
            <div className="va-dots">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={`va-dot ${i === dotPhase && state !== 'muted' ? 'active' : ''}`} />
              ))}
            </div>
            <div className={`va-status-pill ${state}`}>
              {state === 'muted' ? 'MIC OFF · TAP TO ENABLE' :
               state === 'speaking' ? 'AGENT SPEAKING' :
               'LISTENING…'}
            </div>
          </div>
        </div>

        <div className="va-bottom">
          <div className="va-chat">
            {log.map((m, i) => (
              <div key={i} className="va-msg">
                <span className={`va-msg-who ${m.who}`}>
                  {m.who === 'agent' ? 'Agent' : 'You'}
                </span>
                <span className="va-msg-text">{m.text}</span>
              </div>
            ))}
          </div>

          <div className="va-volume">
            <span className="va-volume-ic"><Ic.Vol size={14} /></span>
            <div className="va-volume-track" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const y = 1 - (e.clientY - rect.top) / rect.height;
              setVolume(Math.round(Math.max(0, Math.min(1, y)) * 100));
            }}>
              <div className="va-volume-fill" style={{ height: `${volume}%` }} />
              <div className="va-volume-knob" style={{ bottom: `${volume}%` }} />
            </div>
            <span className="va-volume-val">{volume}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

// --------------------------------------------------------------------------
// Voice picker dropdown — appears next to the hamburger button.
function VoicePicker({ voices, selected, onSelect, onClose }) {
  React.useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('.va-popover')) onClose();
    };
    setTimeout(() => document.addEventListener('click', close), 0);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <div className="va-popover va-voice-popover">
      <div className="va-popover-head">
        <Ic.Speaker size={14} /> Agent voice
      </div>
      <div className="va-voice-list">
        {voices.map((v) => (
          <button
            key={v.id}
            className={`va-voice-item ${selected === v.id ? 'active' : ''}`}
            onClick={() => onSelect(v.id)}>
            <span className="va-voice-av" style={{ background: v.color }}>
              {v.name[0]}
            </span>
            <div className="va-voice-meta">
              <div className="va-voice-name">{v.name}</div>
              <div className="va-voice-tag">{v.tag}</div>
              <div className="va-voice-sample">{v.sample}</div>
            </div>
            {selected === v.id && (
              <span className="va-voice-check"><Ic.Check size={12} /></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Browser-style microphone permission dialog.
function PermissionPopover({ mics, selected, setSelected, meter, onAllow, onAllowOnce, onDeny }) {
  return (
    <div className="va-popover va-permission">
      <div className="va-perm-head">
        <strong>pathumma.audio</strong> wants to
        <button className="va-perm-x" onClick={onDeny} aria-label="Dismiss">
          <Ic.X size={14} />
        </button>
      </div>

      <div className="va-perm-body">
        <div className="va-perm-row">
          <Ic.Mic size={14} />
          <span>Use available microphones ({mics.length})</span>
        </div>

        <div className="va-perm-mic">
          <div className="va-perm-meter">
            <Ic.Mic size={14} />
            <div className="va-perm-meter-bar">
              <div className="va-perm-meter-fill" style={{ width: `${meter * 100}%` }} />
            </div>
          </div>

          <div className="va-perm-select">
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              {mics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <span className="va-perm-select-arrow">▾</span>
          </div>
        </div>
      </div>

      <div className="va-perm-actions">
        <button className="va-perm-btn primary" onClick={onAllow}>Allow while visiting the site</button>
        <button className="va-perm-btn primary" onClick={onAllowOnce}>Allow this time</button>
        <button className="va-perm-btn deny" onClick={onDeny}>Never allow</button>
      </div>
    </div>
  );
}

export { VoiceAgent };
