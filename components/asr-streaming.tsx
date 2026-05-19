'use client';

import React from 'react';
import { Ic } from '@/components/icons';

// ASR Streaming — real-time microphone → text transcription page.
// Layout: result panel (transcript) on the left, input device + settings on
// the right, and a floating mic + Start/Stop dock at the bottom.

function AsrStreaming({ onBack, onNavigate }) {
  const [state, setState] = React.useState('idle'); // 'idle' | 'streaming' | 'stopped'
  const [device, setDevice] = React.useState('Studio Mic (USB)');
  const [transcript, setTranscript] = React.useState('');
  const [interim, setInterim] = React.useState('');

  // Fake words to stream in
  const sample = (
    'สวัสดีค่ะ ยินดีต้อนรับสู่ Pathumma streaming API ระบบนี้สามารถ ' +
    'ถอดเสียงพูดของคุณเป็นข้อความได้แบบ real-time พร้อมความแม่นยำสูง ' +
    'ลองพูดอะไรซักอย่างดูเลย ระบบจะแสดงข้อความที่ถอดมาให้คุณ ทันทีที่คุณพูด'
  );
  const words = sample.split(/(\s+)/);

  // When streaming, push tokens into the transcript
  React.useEffect(() => {
    if (state !== 'streaming') return;
    let i = transcript.split(/(\s+)/).length;
    const id = setInterval(() => {
      if (i >= words.length) { i = 0; setTranscript(''); }
      const tok = words[i];
      i++;
      if (Math.random() < 0.5 && /\S/.test(tok)) {
        setInterim(tok);
        setTimeout(() => {
          setTranscript((t) => t + tok);
          setInterim('');
        }, 180);
      } else {
        setTranscript((t) => t + tok);
        setInterim('');
      }
    }, 240);
    return () => clearInterval(id);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    setTranscript('');
    setInterim('');
    setState('streaming');
  };
  const stop = () => {
    setInterim('');
    setState('stopped');
  };
  const reset = () => {
    setTranscript('');
    setInterim('');
    setState('idle');
  };

  const placeholder =
    state === 'idle' ? 'Ready to transcribe…' :
    state === 'streaming' && !transcript ? 'Transcribing…' :
    null;

  return (
    <main className="str-page" data-screen-label="ASR Streaming">
      <div className="str-bg" />

      <div className="container">
        <button className="asr-back" onClick={onBack}>
          <Ic.Arrow size={14} style={{ transform: 'rotate(180deg)' }} /> Back to home
        </button>

        <header className="str-head">
          <div className={`str-pill ${state === 'streaming' ? 'live' : ''}`}>
            <span className="str-pill-dot" />
            {state === 'streaming' ? 'LIVE STREAMING ACTIVE' :
             state === 'stopped' ? 'STREAM ENDED' :
             'LIVE STREAMING'}
          </div>
          <h1 className="str-title">
            <span className={`str-title-grad ${state !== 'idle' ? 'on' : ''}`}>Streaming</span> Speech-to-Text
          </h1>
          <p className="str-sub">
            Real-time transcription powered by our neural engine. High fidelity, low latency,<br/>
            and professional precision.
          </p>
        </header>

        <div className="str-grid">
          {/* LEFT — result panel */}
          <div className="str-result">
            <div className="str-result-body">
              {placeholder && (
                <div className="str-placeholder">{placeholder}</div>
              )}
              {!placeholder && (transcript || interim) && (
                <div className="str-text">
                  <span>{transcript}</span>
                  {interim && (
                    <span className="str-interim">{interim}</span>
                  )}
                  {state === 'streaming' && <span className="str-caret" />}
                </div>
              )}
            </div>

            {(state === 'stopped' || (state === 'streaming' && transcript)) && (
              <div className="str-result-foot">
                <button className="asr-icon-btn" title="Copy"><Ic.Copy size={18} /></button>
                <button className="asr-icon-btn" title="Download"><Ic.Download size={18} /></button>
                <button className="asr-icon-btn" title="Clear" onClick={reset}><Ic.Trash size={18} /></button>
              </div>
            )}
          </div>

          {/* RIGHT — settings */}
          <div className="str-right">
            <div className="asr-card">
              <div className="asr-card-head">INPUT DEVICE</div>
              <div className="str-device">
                <span className="str-device-ic"><Ic.Mic size={14} /></span>
                <select
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  disabled={state === 'streaming'}>
                  <option>Studio Mic (USB)</option>
                  <option>Default System Microphone</option>
                  <option>AirPods Pro</option>
                  <option>External Headset</option>
                </select>
                <span className="str-device-arrow">▾</span>
              </div>
            </div>

            <div className="asr-card">
              <div className="asr-card-head">SETTINGS</div>
              <div className="asr-model" style={{ marginTop: 0 }}>
                <div className="asr-model-lbl">Model</div>
                <div className="asr-model-val">Pathumma-Streaming v2.4</div>
              </div>
            </div>

            {/* Stream control — replaces the floating dock */}
            <div className="str-control">
              {state === 'streaming' ? (
                <>
                  <button className="str-mic active" onClick={stop} aria-label="Mic active">
                    <Ic.Mic size={22} />
                    <span className="str-mic-pulse" />
                  </button>
                  <div className="str-control-meta">
                    <div className="str-control-t">Listening…</div>
                    <div className="str-control-s">tap to stop</div>
                  </div>
                  <button className="str-action stop" onClick={stop}>
                    <span className="str-action-stop-ic" /> Stop
                  </button>
                </>
              ) : state === 'stopped' ? (
                <>
                  <button className="str-mic stopped" onClick={start} aria-label="Restart">
                    <Ic.Mic size={22} />
                  </button>
                  <div className="str-control-meta">
                    <div className="str-control-t">Stream ended</div>
                    <div className="str-control-s">ready to restart</div>
                  </div>
                  <button className="str-action start" onClick={start}>
                    <Ic.Play size={14} /> Start
                  </button>
                </>
              ) : (
                <>
                  <button className="str-mic idle" onClick={start} aria-label="Start">
                    <Ic.Mic size={22} />
                  </button>
                  <div className="str-control-meta">
                    <div className="str-control-t">Ready</div>
                    <div className="str-control-s">click to begin</div>
                  </div>
                  <button className="str-action start" onClick={start}>
                    <Ic.Play size={14} /> Start
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export { AsrStreaming };
