'use client';

import React from 'react';
import { Ic } from '@/components/icons';

// Meeting Transcription tool — full workflow.
//
//   1. EMPTY        — Drop a meeting recording (audio/video) here.
//   2. PROCESSING   — Animated steps: upload → diarize → transcribe → summarize.
//   3. RESULT       — Left: AI summary + decisions + action items.
//                     Right: speaker-separated transcript with search & toggles.
//                     Bottom: audio scrubber + play controls.

function MeetingTranscription({ onBack, onNavigate }) {
  // --- Workflow state ------------------------------------------------------
  const [stage, setStage] = React.useState('empty'); // 'empty' | 'processing' | 'result'
  const [file, setFile] = React.useState(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [step, setStep] = React.useState(0); // processing sub-step 0..3
  const fileInputRef = React.useRef(null);

  // --- Result settings -----------------------------------------------------
  const [docName, setDocName] = React.useState('แยกเสียงผู้พูด');
  const [editing, setEditing] = React.useState(false);
  const [showTime, setShowTime] = React.useState(true);
  const [showSpeaker, setShowSpeaker] = React.useState(true);
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [query, setQuery] = React.useState('');

  // --- Player state ---------------------------------------------------------
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [speed, setSpeed] = React.useState(1);
  const totalSec = 8 * 60 + 12; // 08:12 demo

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) { setPlaying(false); return 1; }
        return p + (1 / totalSec) * speed * 0.5;
      });
    }, 500);
    return () => clearInterval(id);
  }, [playing, speed]);

  // Click a timestamp anywhere → seek the player.
  const seekTo = (str) => {
    const [m, s] = str.split(':').map(Number);
    const sec = (m || 0) * 60 + (s || 0);
    setProgress(Math.max(0, Math.min(1, sec / totalSec)));
    setPlaying(true);
  };

  // ---------------- File / upload handlers ---------------------------------
  const accept = (f) => {
    if (!f) return;
    setFile({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
    });
    runPipeline();
  };

  const runPipeline = () => {
    setStage('processing');
    setStep(0);
    let n = 0;
    const tick = () => {
      n++;
      if (n > 3) {
        setStage('result');
        return;
      }
      setStep(n);
      setTimeout(tick, 1000);
    };
    setTimeout(tick, 800);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    accept(e.dataTransfer.files?.[0]);
  };

  const resetAll = () => {
    setStage('empty');
    setFile(null);
    setStep(0);
    setPlaying(false);
    setProgress(0);
    setQuery('');
  };

  // --- Demo content --------------------------------------------------------
  const SPEAKERS = {
    SPEAKER_00: { color: '#5668F2', label: 'ประธาน', initials: 'A' },
    SPEAKER_01: { color: '#27C399', label: 'ผู้แทน', initials: 'B' },
    SPEAKER_02: { color: '#F329A2', label: 'เลขา',   initials: 'C' },
  };

  const decisions = [
    { text: 'เห็นชอบให้จัดทำและติดตั้งป้ายเตือนอันตรายในพื้นที่เสี่ยง', t: '01:57' },
    { text: 'เห็นชอบให้มีการอบรมให้ความรู้ความหมายของป้ายเตือนแก่พนักงาน', t: '03:23' },
    { text: 'เห็นชอบให้คณะกรรมการความปลอดภัยลงพื้นที่ตรวจสอบและเสนอแนวทางการแก้ไข', t: '05:05' },
    { text: 'มอบฝ่ายจัดซื้อให้ดำเนินการจัดซื้อชุดตรวจ COVID-19 ให้แล้วเสร็จ', t: '06:15' },
  ];
  const todos = [
    { text: 'ฝ่ายเลขาและทุกคนในที่ประชุม จัดทำกิจกรรมป้ายเตือนอันตราย', t: '01:37' },
    { text: 'เจ้าหน้าที่ความปลอดภัย จัดทำป้ายเตือนในกิจกรรมความเสี่ยงสูง', t: '02:14' },
    { text: 'สร้างวัฒนธรรมการเรียนรู้ป้ายเตือนความปลอดภัยแก่พนักงาน', t: '02:32' },
    { text: 'ติดตั้งป้ายเตือนในพื้นที่กระบวนการผลิต', t: '02:51' },
    { text: 'ลงพื้นที่ตรวจสอบพื้นที่เสี่ยง', t: '05:05' },
  ];

  const turns = [
    { sp: 'SPEAKER_00', start: '00:49', end: '00:59', text: 'เชิญทุกคนนั่งหน้าครับ ครบทุกคนแล้วนะครับ ขอเปิดการประชุมเลยนะครับ' },
    { sp: 'SPEAKER_02', start: '00:59', end: '01:19', text: 'ค่ะ สำหรับการประชุมครั้งนี้นะคะ มีวาระการประชุมทั้งหมด 6 วาระค่ะ วาระที่ 1 เรื่องแจ้งให้ทราบ การจัดทำป้ายเตือนอันตรายในพื้นที่เสี่ยง วาระที่ 2 ค่ะ เรื่องรายงานการประชุม วาระที่ 3 ก็คือเรื่องสืบเนื่อง การจัดสรรงบประมาณในการสั่งทำป้ายเตือนอันตราย' },
    { sp: 'SPEAKER_02', start: '01:19', end: '01:36', text: 'สอง การจัดอบรมเรื่องป้ายเตือนอันตรายแก่ลูกจ้าง วาระที่สี่ เลื่อนเสนอเพื่อทราบ ข่าวหนึ่ง รายงานผลการจัดทำป้ายเตือนอันตราย วาระที่ห้า เลื่อนเสนอเพื่อพิจารณา และวาระที่หกค่ะ วาระอื่นค่ะ' },
    { sp: 'SPEAKER_00', start: '01:37', end: '01:57', text: 'ครับในส่วนของเรื่องการจัดทำป้ายเตือนอันตรายในพื้นที่เสี่ยงนะครับ ได้มอบหมายให้ฝ่ายเลขาและทุกคนในที่ประชุมในการจัดทำกิจกรรมในครั้งนี้ เพื่อให้เกิดความปลอดภัยของลูกจ้าง จึงขอพิจารณาจัดทำและติดตั้งป้ายเตือนอันตรายในพื้นที่เสี่ยง' },
    { sp: 'SPEAKER_01', start: '01:57', end: '02:14', text: 'เห็นชอบครับ ขอให้มอบหมายให้ฝ่ายเลขาดำเนินการสำรวจพื้นที่และจัดทำรายการป้ายที่จำเป็นภายในสัปดาห์หน้า' },
    { sp: 'SPEAKER_02', start: '02:14', end: '02:32', text: 'ค่ะ ทางฝ่ายเลขาจะดำเนินการสำรวจและจัดทำรายงานเสนอที่ประชุมครั้งต่อไปนะคะ' },
  ];

  const currentIdx = stage === 'result' ? Math.min(turns.length - 1, Math.floor(progress * turns.length)) : -1;

  // Speaker distribution stats (durations) — derived from `turns`
  const speakerStats = React.useMemo(() => {
    const toSec = (s) => {
      const [m, ss] = s.split(':').map(Number);
      return m * 60 + ss;
    };
    const totals = {};
    turns.forEach(t => {
      const d = toSec(t.end) - toSec(t.start);
      totals[t.sp] = (totals[t.sp] || 0) + d;
    });
    const grand = Object.values(totals).reduce((a, b) => a + b, 0);
    return Object.entries(totals).map(([sp, sec]) => ({
      sp, sec, pct: Math.round(sec / grand * 100),
    }));
  }, []);

  const filteredTurns = turns
    .map((t, i) => ({ ...t, i }))
    .filter(t => {
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return t.text.toLowerCase().includes(q) || t.sp.toLowerCase().includes(q);
    });

  // ---------------- Render ------------------------------------------------
  return (
    <main className="mt-page" data-screen-label="Meeting Transcription">
      <div className="mt-bg" />

      <div className="container mt-container">
        <button className="asr-back" onClick={onBack} style={{ marginBottom: 18 }}>
          <Ic.Arrow size={14} style={{ transform: 'rotate(180deg)' }} /> Back to home
        </button>

        {stage === 'empty' && (
          <EmptyState
            dragOver={dragOver}
            setDragOver={setDragOver}
            onDrop={onDrop}
            onPick={() => fileInputRef.current?.click()}
            fileInputRef={fileInputRef}
            accept={accept}
            onPreviewSample={() => {
              setFile({ name: 'safety-meeting-q1.wav', size: '24.6 MB' });
              setStage('result');
            }}
          />
        )}

        {stage === 'processing' && (
          <ProcessingState file={file} step={step} />
        )}

        {stage === 'result' && (
          <>
            {/* Top toolbar — same as before */}
            <div className="mt-topbar">
              <div className="mt-topbar-l">
                <span className="mt-folder"><Ic.FolderOpen size={20} /></span>
                {editing ? (
                  <input
                    className="mt-name-input"
                    value={docName}
                    autoFocus
                    onChange={(e) => setDocName(e.target.value)}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditing(false)} />
                ) : (
                  <div className="mt-name-wrap">
                    <span className="mt-name">{docName}</span>
                    <button className="mt-name-edit" onClick={() => setEditing(true)} aria-label="Rename">
                      <Ic.Pencil size={14} />
                    </button>
                  </div>
                )}
                <span className="mt-badge">{speakerStats.length} speakers</span>
                <span className="mt-date"><Ic.Calendar size={14} /> 2026/01/22 03:49:39</span>
                <span className="mt-file-chip" title={file?.name}>
                  <Ic.Music size={12} /> {file?.name || 'meeting.wav'}
                  <span className="mt-file-size">· {file?.size || '24.6 MB'}</span>
                </span>
              </div>

              <div className="mt-topbar-r">
                <button className="mt-iconbtn" onClick={resetAll} title="New transcription">
                  <Ic.Upload size={16} />
                </button>
                <button className="mt-download">
                  <Ic.Download size={14} /> Download
                </button>
              </div>
            </div>

            {/* Speaker stats strip */}
            <div className="mt-stats">
              {speakerStats.map(s => {
                const def = SPEAKERS[s.sp] || { color: '#888' };
                const m = Math.floor(s.sec / 60);
                const sec = String(s.sec % 60).padStart(2, '0');
                return (
                  <div key={s.sp} className="mt-stat">
                    <div className="mt-stat-head">
                      <span className="mt-stat-av" style={{ background: def.color }}>{def.initials || 'S'}</span>
                      <div>
                        <div className="mt-stat-name">{s.sp}</div>
                        <div className="mt-stat-sub">{def.label} · {m}m {sec}s</div>
                      </div>
                      <span className="mt-stat-pct">{s.pct}%</span>
                    </div>
                    <div className="mt-stat-bar">
                      <div style={{ width: `${s.pct}%`, background: def.color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-grid">
              {/* Summary */}
              <div className="mt-summary">
                <div className="mt-summary-head">
                  <div>
                    <span className="mt-summary-eyebrow"><Ic.Sparkle size={11} /> AI SUMMARY</span>
                    <div className="mt-summary-t">บทสรุปสำหรับการประชุม</div>
                  </div>
                  <button className="mt-resummarize">
                    <Ic.Refresh size={13} /> Re-summarize
                  </button>
                </div>

                <p className="mt-summary-overview">
                  การประชุมครั้งนี้ครอบคลุม <strong>6 วาระ</strong> หลัก
                  มุ่งเน้นเรื่องความปลอดภัยในสถานที่ทำงาน — การจัดทำป้ายเตือน,
                  การอบรมพนักงาน, และการตรวจสอบพื้นที่เสี่ยง.
                </p>

                <SummarySection
                  ic={<Ic.Doc size={14} />}
                  title="ข้อสรุปและการตัดสินใจ"
                  items={decisions}
                  onSeek={seekTo}
                />
                <SummarySection
                  ic={<Ic.Check size={14} />}
                  title="รายการสิ่งที่ต้องทำ"
                  items={todos}
                  accent="pink"
                  onSeek={seekTo}
                />
              </div>

              {/* Transcript */}
              <div className="mt-transcript">
                <div className="mt-toggles">
                  <ToggleRow label="Timestamp" on={showTime} onChange={setShowTime} />
                  <ToggleRow label="Speaker"   on={showSpeaker} onChange={setShowSpeaker} />
                  <ToggleRow label="Auto-scroll" on={autoScroll} onChange={setAutoScroll} />
                </div>

                <div className="mt-search">
                  <Ic.Search size={15} />
                  <input
                    type="text"
                    placeholder="Search with keyword or speaker name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)} />
                  {query && (
                    <button onClick={() => setQuery('')} aria-label="Clear">
                      <Ic.X size={13} />
                    </button>
                  )}
                </div>

                <div className="mt-turns">
                  {filteredTurns.length === 0 && (
                    <div className="mt-empty">No turns match "{query}"</div>
                  )}
                  {filteredTurns.map(t => {
                    const sp = SPEAKERS[t.sp] || { color: '#6981FF', initials: 'S', label: '' };
                    const isActive = t.i === currentIdx && playing;
                    return (
                      <div
                        key={t.i}
                        className={`mt-turn ${isActive ? 'active' : ''}`}
                        onClick={() => seekTo(t.start)}
                        title={`Seek to ${t.start}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); seekTo(t.start); } }}>
                        {showSpeaker && (
                          <div className="mt-turn-spk">
                            <span className="mt-turn-av" style={{ background: `radial-gradient(circle at 35% 35%, ${sp.color}, ${sp.color}AA 70%, ${sp.color}66)` }} />
                            <span className="mt-turn-spk-name">{t.sp.replace('SPEAKER_0', 'Speaker ').replace('SPEAKER_', 'Speaker ')}</span>
                          </div>
                        )}
                        <div className="mt-turn-rule" style={{ background: isActive ? sp.color : undefined }} />
                        <div className="mt-turn-body">
                          {showTime && (
                            <button
                              className="mt-turn-time top"
                              onClick={(e) => { e.stopPropagation(); seekTo(t.start); }}
                              title={`Seek to ${t.start}`}>
                              {t.start.replace(':', '.')}
                            </button>
                          )}
                          <p className="mt-turn-text">
                            {query.trim() ? <Highlight text={t.text} q={query.trim()} /> : t.text}
                          </p>
                          {showTime && (
                            <button
                              className="mt-turn-time bot"
                              onClick={(e) => { e.stopPropagation(); seekTo(t.end); }}
                              title={`Seek to ${t.end}`}>
                              {t.end.replace(':', '.')}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Player dock */}
            <div className="mt-player">
              <div className="mt-player-bar" onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setProgress(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
              }}>
                <div className="mt-player-fill" style={{ width: `${progress * 100}%` }} />
                <div className="mt-player-handle" style={{ left: `${progress * 100}%` }} />
              </div>
              <div className="mt-player-row">
                <div className="mt-player-l">
                  <span className="mt-vol"><Ic.Vol size={16} /></span>
                  <div className="mt-vol-track"><div className="mt-vol-fill" /></div>
                </div>
                <div className="mt-player-c">
                  <button className="mt-pl-btn"><Ic.Prev size={20} /></button>
                  <button className="mt-pl-play" onClick={() => setPlaying(!playing)}>
                    {playing ? <Ic.Pause size={18} /> : <Ic.Play size={18} />}
                  </button>
                  <button className="mt-pl-btn"><Ic.Next size={20} /></button>
                  <span className="mt-time-readout">
                    {String(Math.floor((progress*totalSec)/60)).padStart(2,'0')}:{String(Math.floor((progress*totalSec)%60)).padStart(2,'0')} / 08:12
                  </span>
                </div>
                <div className="mt-player-r">
                  <button className="mt-speed" onClick={() => {
                    const opts = [0.5, 1, 1.25, 1.5, 2];
                    setSpeed(opts[(opts.indexOf(speed) + 1) % opts.length]);
                  }}>
                    <Ic.Speedometer size={13} /> {speed}×
                  </button>
                  <button className="mt-pl-btn"><Ic.Expand size={16} /></button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating action buttons — only in result mode */}
      {stage === 'result' && (
        <div className="mt-floating">
          <button className="mt-float mt-float-a11y" aria-label="Accessibility">AA</button>
          <button className="mt-float mt-float-ai" aria-label="AI Assistant">
            <Ic.Sparkle size={20} />
          </button>
        </div>
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------
function EmptyState({ dragOver, setDragOver, onDrop, onPick, fileInputRef, accept, onPreviewSample }) {
  return (
    <div className="mt-empty-state">
      <div className="mt-empty-head">
        <h1 className="mt-empty-title">Meeting Transcription</h1>
        <p className="mt-empty-sub">
          อัปโหลดไฟล์เสียงประชุม — ระบบจะ <strong>แยกเสียงผู้พูดแต่ละคน</strong> พร้อม
          timestamps แล้วสรุปประเด็นสำคัญและรายการ to-do ให้คุณอัตโนมัติ.
        </p>
      </div>

      <label
        className={`mt-drop ${dragOver ? 'over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={onPick}>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*,.mp3,.wav,.flac,.m4a,.mp4,.webm"
          style={{ display: 'none' }}
          onChange={(e) => accept(e.target.files?.[0])} />
        <div className="mt-drop-cloud">
          <Ic.CloudUp size={32} />
        </div>
        <div className="mt-drop-t">Drag &amp; drop a meeting recording here</div>
        <div className="mt-drop-s">or <span>click to choose</span> — MP3, WAV, FLAC, M4A, MP4, WebM · up to 500 MB</div>
        <div className="mt-drop-cta">
          <Ic.Upload size={14} /> Upload file
        </div>
      </label>

      {/* Or paste a URL */}
      <div className="mt-or">or</div>
      <div className="mt-url">
        <Ic.Globe size={15} />
        <input type="text" placeholder="Paste a YouTube, Google Meet, or Zoom recording URL…" />
        <button>Transcribe URL <Ic.Arrow size={13} /></button>
      </div>

      {/* Pipeline preview */}
      <div className="mt-pipeline">
        {[
          { ic: 'Upload',   t: 'Upload',     s: 'Drop your audio file' },
          { ic: 'Mic',      t: 'Diarize',    s: 'ระบุผู้พูดแต่ละคนอัตโนมัติ' },
          { ic: 'Captions', t: 'Transcribe', s: 'แปลงเป็นข้อความพร้อม timestamps' },
          { ic: 'Sparkle',  t: 'Summarize',  s: 'AI สรุปประเด็นและ to-do' },
        ].map((s, i) => {
          const I = Ic[s.ic];
          return (
            <div key={i} className="mt-pipe-step">
              <div className="mt-pipe-num">{i + 1}</div>
              <div className="mt-pipe-ic"><I size={18} /></div>
              <div className="mt-pipe-t">{s.t}</div>
              <div className="mt-pipe-s">{s.s}</div>
            </div>
          );
        })}
      </div>

      {/* Sample preview link */}
      <button className="mt-sample" onClick={onPreviewSample}>
        <Ic.Sparkle size={13} />
        ดูตัวอย่างหน้าสรุป — ข้ามขั้นการอัปโหลด <Ic.Arrow size={13} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
function ProcessingState({ file, step }) {
  // step: 0 uploading, 1 diarizing, 2 transcribing, 3 summarizing
  const steps = [
    { t: 'Uploading audio…', s: 'Sending your file to Pathumma.' },
    { t: 'Identifying speakers…', s: 'Diarization — detecting who is speaking when.' },
    { t: 'Transcribing speech…', s: 'Generating text with word-level timestamps.' },
    { t: 'Summarizing…', s: 'Extracting decisions and action items.' },
  ];
  return (
    <div className="mt-processing">
      <div className="mt-proc-aura" />
      <div className="mt-proc-orb">
        <div className="mt-proc-bars">
          {[0,1,2,3,4,5,6,7].map(i => (
            <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>

      <div className="mt-proc-meta">
        <div className="mt-proc-eyebrow">Processing</div>
        <h2 className="mt-proc-t">{steps[step].t}</h2>
        <p className="mt-proc-s">{steps[step].s}</p>
        {file && (
          <div className="mt-proc-file">
            <Ic.Music size={13} /> {file.name} · {file.size}
          </div>
        )}
      </div>

      <div className="mt-proc-steps">
        {steps.map((s, i) => (
          <div key={i} className={`mt-proc-step ${i < step ? 'done' : i === step ? 'now' : 'idle'}`}>
            <span className="mt-proc-step-dot">
              {i < step ? <Ic.Check size={12} /> : <span>{i+1}</span>}
            </span>
            <span>{s.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function SummarySection({ ic, title, items, accent, onSeek }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className={`mt-sec ${accent || ''}`}>
      <button className="mt-sec-head" onClick={() => setOpen(!open)}>
        <span className="mt-sec-ic">{ic}</span>
        <span className="mt-sec-t">{title}</span>
        <span className="mt-sec-count">{items.length}</span>
        <span className={`mt-sec-arrow ${open ? 'open' : ''}`}>⌃</span>
      </button>
      {open && (
        <ul className="mt-sec-list">
          {items.map((it, i) => (
            <li key={i}>
              <span className="mt-bullet" />
              <span>
                {it.text}{' '}
                <button
                  className="mt-ts"
                  onClick={(e) => { e.stopPropagation(); onSeek && onSeek(it.t); }}
                  title={`Seek to ${it.t}`}>
                  [{it.t}]
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ToggleRow({ label, on, onChange }) {
  return (
    <button className="mt-toggle" onClick={() => onChange(!on)}>
      <span>{label}</span>
      <span className={`asr-tog ${on ? 'on' : ''}`}>
        <span className="asr-tog-knob" />
      </span>
    </button>
  );
}

function Highlight({ text, q }) {
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase()
      ? <mark key={i}>{p}</mark>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}

export { MeetingTranscription };
