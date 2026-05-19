'use client';

import React from 'react';
import { Ic } from '@/components/icons';

// ASR Dropfile — interactive Speech-to-Text tool page
// Matches the supplied designs: upload pane + settings panel + transcription
// result panel, an audio-player dock when a file is selected, and a modal
// for registering speakers when "Speaker" diarisation is enabled.

function AsrDropfile({ onBack, onNavigate }) {
  // --- State ---------------------------------------------------------------
  const [file, setFile] = React.useState(null); // { name, size, status }
  const [dragOver, setDragOver] = React.useState(false);
  const [settings, setSettings] = React.useState({
    timeStamp: true,
    speaker: false,
    karaoke: true,
    autoScroll: true,
  });
  const [transcribing, setTranscribing] = React.useState(false);
  const [transcribed, setTranscribed] = React.useState(false);
  const [showSpeakerModal, setShowSpeakerModal] = React.useState(false);
  const [speakers, setSpeakers] = React.useState([
    { id: 1, name: 'Speaker 1', color: '#5B8DEF', state: 'ready' },
    { id: 2, name: '', color: '#27C399', state: 'idle' },
    { id: 3, name: 'Speaker 3', color: '#F5705A', state: 'recording' },
  ]);
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0.0);
  const [volume, setVolume] = React.useState(0.7);
  const [speed, setSpeed] = React.useState(1);
  const fileInputRef = React.useRef(null);

  const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const onPickFile = (f) => {
    if (!f) return;
    setFile({ name: f.name, size: formatSize(f.size), status: 'READY' });
    setTranscribed(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onPickFile(f);
  };

  const setS = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const startTranscribe = () => {
    if (!file || transcribing) return;
    setTranscribing(true);
    setTranscribed(false);
    setTimeout(() => {
      setTranscribing(false);
      setTranscribed(true);
    }, 1400);
  };

  // Fake transcript that matches the supplied mock
  const transcript = [
    { spk: 1, color: '#5B8DEF', start: '00:00', end: '00:10', text: 'เดี๋ยวเราส่งรายละเอียดมาดูก่อนแล้วกันค่ะ เนาะในส่วนตรงนี้มันต้องดูรายละเอียดด้วยนะคะ ว่ารายละเอียดเป็นอย่างนี้ค่ะ' },
    { spk: 2, color: '#F5705A', start: '00:10', end: '00:40', text: 'อันนี้อันแรกเลยน่าจะลืมใส่ปกหนะมีน้ำเนาะเดี๋ยวใส่น้ำปกมาด้วยนะคะโอเคนะคะอันนี้ก็ไม่น่ามีอะไร' },
    { spk: 1, color: '#5B8DEF', start: '00:50', end: '01:20', text: 'การจำลองคิวเล่ อาจารย์ขอย่อลงหน่อยจะได้เห็นภาพรวมพัฒนาเกม อันนี้ก็น่าจะคล้ายกันนะคะ อย่างเช่น ฝึกทักษะพวกนี้ สื่อบันเทิง' },
    { spk: 3, color: '#27C399', start: '01:35', end: '01:40', text: 'จริงๆ คือแค่พัฒนาเกมจำลองอันนี้ อันนี้ชัดเจนแล้วนะ แต่ที่นี้สิ่งที่ยังขาดคือมันเป็นเกมบนอะไรคะ' },
    { spk: 1, color: '#5B8DEF', start: '01:50', end: '02:20', text: 'เกมเล่นมือ PC ค่ะ ต้องระบุ คอมพิวเตอร์ เออ คอมพิวเตอร์ ออนไลน์ ออฟไลน์ ออฟไลน์ค่ะ แค่นั้นแหละ ที่ต้องระบุลงไป โอเคโหม ค่ะ' },
  ];

  // Currently-playing line for karaoke highlight
  const totalLines = transcript.length;
  const activeLine = transcribed && playing ? Math.min(totalLines - 1, Math.floor(progress * totalLines)) : -1;

  return (
    <main className="asr-page" data-screen-label="ASR Dropfile">
      <div className="asr-bg" />

      <div className="container">
        <button className="asr-back" onClick={onBack}>
          <Ic.Arrow size={14} style={{ transform: 'rotate(180deg)' }} /> Back to home
        </button>

        <header className="asr-head">
          <h1 className="asr-title">Speech-to-Text</h1>
          <p className="asr-sub">
            Experience high-precision transcription with our production-grade engine.<br/>
            Upload your files and let our AI handle the rest with professional accuracy.
          </p>
        </header>

        <div className="asr-grid">
          {/* LEFT — Result panel ------------------------------------------- */}
          <div className="asr-result">
            <div className="asr-result-head">Transcription Result</div>

            <div className="asr-result-body">
              {!transcribed && !transcribing && (
                <div className="asr-result-empty" />
              )}
              {transcribing && (
                <div className="asr-result-loading">
                  <div className="asr-spinner" />
                  <span>Transcribing audio…</span>
                </div>
              )}
              {transcribed && (
                <div className="asr-lines">
                  {transcript.map((l, i) => (
                    <div key={i} className={`asr-line ${settings.karaoke && i === activeLine ? 'active' : ''}`}>
                      <div className="asr-line-spk">
                        <span className="asr-avatar" style={{ background: l.color }}>
                          <Ic.User size={18} />
                        </span>
                        <span className="asr-spk-name" style={{ color: l.color }}>Speaker{l.spk}</span>
                      </div>
                      <div className="asr-line-bar" style={{ background: l.color }}>
                        {settings.timeStamp && (
                          <>
                            <span className="asr-time asr-time-top">{l.start}</span>
                            <span className="asr-time asr-time-bot">{l.end}</span>
                          </>
                        )}
                      </div>
                      <div className="asr-line-text">{l.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="asr-result-foot">
              <button className="asr-icon-btn" title="Copy" disabled={!transcribed}>
                <Ic.Copy size={18} />
              </button>
              <button className="asr-icon-btn" title="Download" disabled={!transcribed}>
                <Ic.Download size={18} />
              </button>
              <button className="asr-icon-btn" title="Clear" disabled={!transcribed} onClick={() => setTranscribed(false)}>
                <Ic.Trash size={18} />
              </button>
            </div>
          </div>

          {/* RIGHT — Controls ---------------------------------------------- */}
          <div className="asr-right">
            {/* Upload card */}
            <div className="asr-card">
              <div className="asr-card-head">UPLOAD FILE</div>

              <label
                className={`asr-drop ${dragOver ? 'over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.flac"
                  style={{ display: 'none' }}
                  onChange={(e) => onPickFile(e.target.files?.[0])} />
                <span className="asr-drop-ic"><Ic.CloudUp size={20} /></span>
                <span className="asr-drop-t">Click to upload or drag and drop</span>
                <span className="asr-drop-s">MP3, WAV, FLAC (max. 100MB)</span>
              </label>

              {file && (
                <div className="asr-file">
                  <div className="asr-file-meta">Selected File</div>
                  <div className="asr-file-row">
                    <div>
                      <div className="asr-file-name">{file.name}</div>
                      <div className="asr-file-size">{file.size} · {file.status}</div>
                    </div>
                    <button className="asr-file-x" onClick={() => { setFile(null); setTranscribed(false); }} aria-label="Remove">
                      <Ic.X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings card */}
            <div className="asr-card">
              <div className="asr-card-head">SETTINGS</div>

              <SetRow label="Time Stamp" on={settings.timeStamp} onChange={(v) => setS('timeStamp', v)} />
              <SetRow label="Speaker" on={settings.speaker} onChange={(v) => setS('speaker', v)} />

              {settings.speaker && (
                <button className="asr-set-link" onClick={() => setShowSpeakerModal(true)}>
                  <span>Register Speaker</span>
                  <Ic.Arrow size={14} />
                </button>
              )}

              <SetRow label="Karaoke Highlight" on={settings.karaoke} onChange={(v) => setS('karaoke', v)} />
              <SetRow label="Auto-Scroll" on={settings.autoScroll} onChange={(v) => setS('autoScroll', v)} />

              <div className="asr-model">
                <div className="asr-model-lbl">Model</div>
                <div className="asr-model-val">Neural-Ultra v2.4</div>
              </div>
            </div>

            <button
              className="asr-go"
              disabled={!file || transcribing}
              onClick={startTranscribe}>
              <Ic.Bolt size={16} />
              {transcribing ? 'Transcribing…' : 'Transcribe File'}
            </button>
          </div>
        </div>
      </div>

      {/* Audio dock — only after a file is selected -------------------------*/}
      {file && (
        <AudioDock
          file={file}
          playing={playing}
          setPlaying={setPlaying}
          progress={progress}
          setProgress={setProgress}
          volume={volume}
          setVolume={setVolume}
          speed={speed}
          setSpeed={setSpeed}
        />
      )}

      {/* Register-speakers modal -------------------------------------------*/}
      {showSpeakerModal && (
        <SpeakerModal
          speakers={speakers}
          setSpeakers={setSpeakers}
          onClose={() => setShowSpeakerModal(false)}
        />
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------
// Settings row — label + iOS-style toggle
function SetRow({ label, on, onChange }) {
  return (
    <button className="asr-set-row" onClick={() => onChange(!on)}>
      <span>{label}</span>
      <span className={`asr-tog ${on ? 'on' : ''}`}>
        <span className="asr-tog-knob" />
      </span>
    </button>
  );
}

// Audio dock pinned to the bottom of the viewport
function AudioDock({ file, playing, setPlaying, progress, setProgress, volume, setVolume, speed, setSpeed }) {
  // Fake "playing" advance
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => (p >= 1 ? 0 : p + 0.004 * speed));
    }, 60);
    return () => clearInterval(id);
  }, [playing, speed, setProgress]);

  const fmt = (frac) => {
    const total = 45 * 60 + 12; // 45:12
    const sec = Math.floor(total * frac);
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const onScrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setProgress(Math.max(0, Math.min(1, x)));
  };

  const cycleSpeed = () => {
    const opts = [0.5, 1, 1.25, 1.5, 2];
    const i = opts.indexOf(speed);
    setSpeed(opts[(i + 1) % opts.length]);
  };

  return (
    <div className="asr-dock-wrap">
      <div className="asr-dock">
        <div className="asr-dock-l">
          <span className="asr-dock-mic"><Ic.Music size={18} /></span>
          <div>
            <div className="asr-dock-name">{file.name}</div>
            <div className="asr-dock-dur">45:12</div>
          </div>
        </div>

        <div className="asr-dock-c">
          <div className="asr-dock-ctrls">
            <button className="asr-dock-btn"><Ic.Prev size={20} /></button>
            <button className="asr-dock-play" onClick={() => setPlaying(!playing)}>
              {playing ? <Ic.Pause size={18} /> : <Ic.Play size={18} />}
            </button>
            <button className="asr-dock-btn"><Ic.Next size={20} /></button>
          </div>
          <div className="asr-dock-scrub">
            <span className="asr-dock-t">{fmt(progress)}</span>
            <div className="asr-dock-bar" onClick={onScrub}>
              <div className="asr-dock-fill" style={{ width: `${progress * 100}%` }} />
              <div className="asr-dock-handle" style={{ left: `${progress * 100}%` }} />
            </div>
            <span className="asr-dock-t">45:12</span>
          </div>
        </div>

        <div className="asr-dock-r">
          <button className="asr-dock-btn"><Ic.Vol size={18} /></button>
          <div className="asr-dock-vol">
            <input
              type="range" min="0" max="1" step="0.01"
              value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
          </div>
          <button className="asr-dock-speed" onClick={cycleSpeed}>{speed}×</button>
        </div>
      </div>
    </div>
  );
}

// Register-speakers modal
function SpeakerModal({ speakers, setSpeakers, onClose }) {
  const palette = ['#5B8DEF', '#27C399', '#F5705A', '#9B6BE5', '#F6B548', '#33C2C9'];
  const newSpeaker = () => ({
    id: Date.now() + Math.random(),
    name: '',
    color: palette[speakers.length % palette.length],
    state: 'idle',
  });
  const setCount = (n) => {
    if (n < 1) return;
    if (n > 12) return;
    if (n > speakers.length) {
      const add = Array.from({ length: n - speakers.length }, () => newSpeaker());
      setSpeakers([...speakers, ...add]);
    } else {
      setSpeakers(speakers.slice(0, n));
    }
  };
  const setName = (id, name) => setSpeakers(speakers.map(s => s.id === id ? { ...s, name } : s));
  const setState = (id, state) => setSpeakers(speakers.map(s => s.id === id ? { ...s, state } : s));
  const remove = (id) => setSpeakers(speakers.filter(s => s.id !== id));

  return (
    <div className="asr-modal-overlay" onClick={onClose}>
      <div className="asr-modal" onClick={(e) => e.stopPropagation()}>
        <button className="asr-modal-x" onClick={onClose}><Ic.X size={18} /></button>

        <h3 className="asr-modal-t">Register Speakers</h3>

        <div className="asr-modal-counter">
          <div>
            <div className="asr-modal-counter-t">Number of Speakers</div>
            <div className="asr-modal-counter-s">IDENTIFY INDIVIDUAL VOICES IN THE AUDIO</div>
          </div>
          <div className="asr-stepper">
            <button onClick={() => setCount(speakers.length - 1)} aria-label="Decrease">−</button>
            <span className="asr-stepper-v">{speakers.length}</span>
            <button onClick={() => setCount(speakers.length + 1)} aria-label="Increase">+</button>
          </div>
        </div>

        <div className="asr-spk-list">
          {speakers.map((s, i) => (
            <SpeakerRow
              key={s.id}
              spk={s}
              i={i}
              onName={(n) => setName(s.id, n)}
              onRecord={() => setState(s.id, s.state === 'recording' ? 'idle' : 'recording')}
              onRemove={() => remove(s.id)}
            />
          ))}
        </div>

        <div className="asr-script">
          นโยบายกระตุ้นเศรษฐกิจฉบับใหม่ที่รัฐบาลเพิ่งประกาศออกมาเมื่อวานนี้ มีวัตถุประสงค์สำคัญ เพื่อช่วยเหลือผู้ประกอบการรายย่อยซึ่งเป็นกลุ่มคนที่ได้รับผลกระทบโดยตรงจากวิกฤตการณ์ในช่วงหลายปีที่ผ่านมา
        </div>

        <button className="asr-modal-save" onClick={onClose}>
          Save Speaker Profiles <Ic.Arrow size={15} />
        </button>
      </div>
    </div>
  );
}

function SpeakerRow({ spk, i, onName, onRecord, onRemove }) {
  const [editing, setEditing] = React.useState(false);
  return (
    <div className={`asr-spk-row ${spk.state === 'recording' ? 'recording' : ''}`}>
      <span className="asr-spk-av" style={{ background: spk.color }}>
        {spk.state === 'recording' ? <Ic.Mic size={18} /> : <Ic.User size={18} />}
      </span>

      <div className="asr-spk-name-wrap">
        {spk.state === 'recording' ? (
          <>
            <div className="asr-spk-name-lg">{spk.name || `Speaker ${i + 1}`}</div>
            <div className="asr-spk-name-sub">RECORDING…</div>
          </>
        ) : spk.name && !editing ? (
          <div className="asr-spk-name-lg-row">
            <span className="asr-spk-name-lg">{spk.name}</span>
            <button className="asr-spk-edit" onClick={() => setEditing(true)} aria-label="Edit">
              <Ic.Pencil size={13} />
            </button>
          </div>
        ) : (
          <input
            className="asr-spk-input"
            placeholder="Enter name…"
            value={spk.name}
            autoFocus={editing}
            onChange={(e) => onName(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)} />
        )}
      </div>

      {spk.state !== 'recording' && (
        <button className="asr-spk-rec" onClick={onRecord}>
          <Ic.Download size={13} /> Record
        </button>
      )}
      {spk.state === 'recording' && (
        <button className="asr-spk-stop" onClick={onRecord}>
          <span className="asr-spk-stop-dot" /> Stop
        </button>
      )}
      {spk.state !== 'recording' && (
        <button className="asr-spk-choose">
          <Ic.Upload size={13} /> Choose file
        </button>
      )}
      <button className="asr-spk-del" onClick={onRemove} aria-label="Remove">
        <Ic.Trash size={16} />
      </button>
    </div>
  );
}

export { AsrDropfile };
