'use client';

import React from 'react';
import { Ic } from '@/components/icons';
import { Waveform } from '@/components/waveform';

// Interactive API playground — switch products, simulate "Run"
const PG_TABS = [
  { id: 'stt', label: 'ASR Dropfile', icon: 'Captions' },
  { id: 'stream', label: 'ASR Streaming', icon: 'Stream' },
  { id: 'tts', label: 'Text-to-Speech', icon: 'Speaker' },
];

const SAMPLE_TRANSCRIPTS = {
  th: "สวัสดีครับ ยินดีต้อนรับสู่ Pathumma Audio วันนี้เราจะมาสาธิตการแปลงเสียงเป็นข้อความแบบเรียลไทม์",
  en: "Hello and welcome to Pathumma Audio. Today we'll demonstrate real-time speech to text conversion with our API.",
  ja: "こんにちは、Pathumma Audioへようこそ。本日はリアルタイム音声認識のデモをお見せします。",
};

function Playground() {
  const [tab, setTab] = React.useState('stt');
  const [lang, setLang] = React.useState('th');
  const [model, setModel] = React.useState('pathumma-stt-v2');
  const [ttsText, setTtsText] = React.useState('สวัสดีครับ ยินดีต้อนรับสู่ Pathumma Audio — แพลตฟอร์มเสียง AI ที่ช่วยให้คุณสร้างผลิตภัณฑ์ voice-first ได้ง่ายขึ้น');
  const [voice, setVoice] = React.useState('aria');
  const [codeLang, setCodeLang] = React.useState('python');
  const [running, setRunning] = React.useState(false);
  const [output, setOutput] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);

  // Sim runner
  const run = () => {
    if (running) return;
    setRunning(true);
    setOutput(null);
    setProgress(0);
    let p = 0;
    const id = setInterval(() => {
      p += 6 + Math.random() * 8;
      if (p >= 100) {
        clearInterval(id);
        setProgress(100);
        setTimeout(() => {
          setRunning(false);
          if (tab === 'tts') {
            setOutput({ type: 'audio', duration: '00:11', size: '188 KB', voice: voice });
          } else {
            setOutput({
              type: 'json',
              transcript: SAMPLE_TRANSCRIPTS[lang],
              confidence: 0.982,
              language: lang,
              duration_ms: 11340,
            });
          }
        }, 250);
      } else {
        setProgress(p);
      }
    }, 110);
  };

  // Sim audio playhead
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setPlaying(false); return 0; }
        return p + 1;
      });
    }, 110);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <section className="section-pad" id="playground" data-screen-label="Playground">
      <div className="container">
        <div className="pg-wrap">
          <div className="pg-inner">
            <div className="pg-head">
              <div>
                <span className="eyebrow">Live playground</span>
                <h2>Try the API right here.<br/>No setup required.</h2>
              </div>
              <p>
                ทดสอบ Pathumma Audio API ได้ทันที — ปรับค่า parameters, อัพโหลดไฟล์เสียง, หรือพิมพ์ข้อความเพื่อสังเคราะห์เสียง.
                เปลี่ยนภาษาของ code snippet ได้ทันทีและคัดลอกไปใช้งานในโปรเจกต์ของคุณ.
              </p>
            </div>

            <div className="pg-tabs">
              {PG_TABS.map(t => {
                const Icon = Ic[t.icon];
                return (
                  <button key={t.id} className={`pg-tab ${tab === t.id ? 'active' : ''}`} onClick={() => { setTab(t.id); setOutput(null); }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={14} /> {t.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pg-grid">
              {/* Left: Controls */}
              <div className="pg-panel">
                <div className="pg-panel-head">
                  <span>Request</span>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                    <span style={{ background: 'rgba(105,129,255,0.25)', padding: '2px 7px', borderRadius: 4, color: '#B9C4FF', fontWeight: 700 }}>POST</span>
                    /v1/audio/{tab === 'tts' ? 'speech' : 'transcriptions'}
                  </span>
                </div>

                <div className="pg-panel-body">
                  <div className="pg-controls">
                    {tab !== 'tts' && (
                      <>
                        <div className="pg-field">
                          <label>Audio source</label>
                          <div className="upload-zone">
                            <div className="icon"><Ic.Upload size={22} /></div>
                            <div className="t">Drop audio file or click to upload</div>
                            <div className="s">.wav · .mp3 · .m4a · .flac · up to 500 MB</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div className="pg-field">
                            <label>Language</label>
                            <div className="pg-segments">
                              <button className={`pg-segment ${lang === 'th' ? 'active' : ''}`} onClick={() => setLang('th')}>TH</button>
                              <button className={`pg-segment ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
                              <button className={`pg-segment ${lang === 'ja' ? 'active' : ''}`} onClick={() => setLang('ja')}>JA</button>
                            </div>
                          </div>
                          <div className="pg-field">
                            <label>Model</label>
                            <select className="pg-select" value={model} onChange={e => setModel(e.target.value)}>
                              <option value="pathumma-stt-v2">pathumma-stt-v2 · Best</option>
                              <option value="pathumma-stt-fast">pathumma-stt-fast · 3x faster</option>
                              <option value="pathumma-stt-nano">pathumma-stt-nano · On-device</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 18, fontSize: 13, color: 'rgba(255,255,255,0.78)' }}>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked /> Diarization
                          </label>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked /> Timestamps
                          </label>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input type="checkbox" /> Profanity filter
                          </label>
                        </div>
                      </>
                    )}

                    {tab === 'tts' && (
                      <>
                        <div className="pg-field">
                          <label>Text to synthesize</label>
                          <textarea className="pg-textarea" value={ttsText} onChange={e => setTtsText(e.target.value)} />
                          <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{ttsText.length} / 5,000 chars</span>
                            <span>≈ {Math.ceil(ttsText.length / 16)}s audio</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div className="pg-field">
                            <label>Voice</label>
                            <select className="pg-select" value={voice} onChange={e => setVoice(e.target.value)}>
                              <option value="aria">Aria · TH Female · Warm</option>
                              <option value="sun">Sun · EN Male · Neutral</option>
                              <option value="maya">Maya · TH Female · Calm</option>
                              <option value="rio">Rio · JA Male · Casual</option>
                            </select>
                          </div>
                          <div className="pg-field">
                            <label>Speed</label>
                            <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" style={{ width: '100%', accentColor: '#9FB8F9' }} />
                          </div>
                        </div>
                      </>
                    )}

                    <button
                      className="btn btn-primary btn-lg"
                      onClick={run}
                      disabled={running}
                      style={{ alignSelf: 'flex-start', marginTop: 4, opacity: running ? 0.7 : 1, cursor: running ? 'progress' : 'pointer' }}
                    >
                      {running ? <>Processing… {Math.floor(progress)}%</> : <>Run request <Ic.Arrow size={14} /></>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Code + output */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="pg-output">
                  <div className="code-toolbar">
                    <div className="code-dots">
                      {['python', 'js', 'curl'].map(l => (
                        <button key={l} onClick={() => setCodeLang(l)} style={{
                          padding: '4px 10px', borderRadius: 5, fontSize: 11, fontFamily: 'var(--font-mono)',
                          background: codeLang === l ? 'rgba(255,255,255,0.10)' : 'transparent',
                          color: codeLang === l ? '#fff' : 'rgba(255,255,255,0.55)',
                          cursor: 'pointer',
                          textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600,
                        }}>{l}</button>
                      ))}
                    </div>
                    <button style={{ color: 'rgba(255,255,255,0.55)', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                      <Ic.Copy size={12} /> Copy
                    </button>
                  </div>
                  <CodeSnippet tab={tab} codeLang={codeLang} lang={lang} model={model} voice={voice} />
                </div>

                <div className="pg-output">
                  <div className="code-toolbar">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 500 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: output ? '#7BD88F' : 'rgba(255,255,255,0.3)' }}/>
                      {output ? '200 OK' : running ? 'Pending…' : 'Response'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>{output ? '892ms' : '—'}</span>
                  </div>
                  <div style={{ padding: 20 }}>
                    {!output && !running && (
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                        Click <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Run request</strong> to see the API response here.
                      </div>
                    )}
                    {running && (
                      <div style={{ padding: '10px 0' }}>
                        <Waveform bars={40} height={50} animate={true} />
                        <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                          {tab === 'tts' ? 'Synthesizing audio…' : 'Transcribing audio…'}
                        </div>
                      </div>
                    )}
                    {output && output.type === 'json' && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.7, color: '#E0E2F0' }}>
                        <div>{'{'}</div>
                        <div style={{ paddingLeft: 18 }}>
                          <span className="tok-key">"transcript"</span>: <span className="tok-str">"{output.transcript}"</span>,
                        </div>
                        <div style={{ paddingLeft: 18 }}>
                          <span className="tok-key">"language"</span>: <span className="tok-str">"{output.language}"</span>,
                        </div>
                        <div style={{ paddingLeft: 18 }}>
                          <span className="tok-key">"confidence"</span>: <span className="tok-num">{output.confidence}</span>,
                        </div>
                        <div style={{ paddingLeft: 18 }}>
                          <span className="tok-key">"duration_ms"</span>: <span className="tok-num">{output.duration_ms}</span>
                        </div>
                        <div>{'}'}</div>
                      </div>
                    )}
                    {output && output.type === 'audio' && (
                      <div className="audio-bar">
                        <button className="play-btn" onClick={() => setPlaying(!playing)}>
                          {playing ? <Ic.Pause size={14} /> : <Ic.Play size={14} />}
                        </button>
                        <div className="progress"><i style={{ width: `${progress}%` }}/></div>
                        <span className="time">{output.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeSnippet({ tab, codeLang, lang, model, voice }) {
  const endpoint = tab === 'tts' ? 'speech' : 'transcriptions';
  const snippets = {
    python: {
      stt: `from pathumma import Client

client = Client(api_key="sk_live_...")

with open("audio.wav", "rb") as f:
    result = client.audio.transcriptions.create(
        file=f,
        model="${model}",
        language="${lang}",
        diarize=True,
    )

print(result.transcript)`,
      stream: `import asyncio
from pathumma import Client

async def stream_transcribe():
    client = Client(api_key="sk_live_...")
    async with client.audio.stream() as ws:
        await ws.send_audio(microphone_chunks())
        async for event in ws:
            print(event.text, end="\\r")

asyncio.run(stream_transcribe())`,
      tts: `from pathumma import Client

client = Client(api_key="sk_live_...")

audio = client.audio.speech.create(
    voice="${voice}",
    input="สวัสดีครับ ยินดีต้อนรับสู่ Pathumma",
    format="mp3",
)

audio.save("out.mp3")`,
    },
    js: {
      stt: `import { Pathumma } from '@pathumma/sdk';

const client = new Pathumma({ apiKey: 'sk_live_...' });

const result = await client.audio.transcriptions.create({
  file: fs.createReadStream('audio.wav'),
  model: '${model}',
  language: '${lang}',
  diarize: true,
});

console.log(result.transcript);`,
      stream: `import { Pathumma } from '@pathumma/sdk';

const client = new Pathumma({ apiKey: 'sk_live_...' });
const ws = await client.audio.stream();

ws.on('transcript', (event) => {
  console.log(event.text);
});

mediaRecorder.ondataavailable = (e) => ws.send(e.data);`,
      tts: `import { Pathumma } from '@pathumma/sdk';

const client = new Pathumma({ apiKey: 'sk_live_...' });

const audio = await client.audio.speech.create({
  voice: '${voice}',
  input: 'สวัสดีครับ ยินดีต้อนรับสู่ Pathumma',
  format: 'mp3',
});

await audio.save('out.mp3');`,
    },
    curl: {
      stt: `curl https://api.pathumma.ai/v1/audio/transcriptions \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: multipart/form-data" \\
  -F file="@audio.wav" \\
  -F model="${model}" \\
  -F language="${lang}" \\
  -F diarize=true`,
      stream: `wscat -c wss://api.pathumma.ai/v1/audio/stream \\
  -H "Authorization: Bearer sk_live_..."
> {"model":"${model}","language":"${lang}"}
< {"text":"real-time","is_final":false}`,
      tts: `curl https://api.pathumma.ai/v1/audio/speech \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "voice": "${voice}",
    "input": "สวัสดีครับ ยินดีต้อนรับ",
    "format": "mp3"
  }' --output out.mp3`,
    },
  };
  const code = snippets[codeLang][tab] || '';
  // Naive tokenization for python/js
  const tokenize = (line) => {
    if (codeLang === 'curl') return line;
    const parts = [];
    let rest = line;
    // Comments
    if (codeLang === 'python' && rest.trim().startsWith('#')) return <span className="tok-com">{rest}</span>;
    if (codeLang === 'js' && rest.trim().startsWith('//')) return <span className="tok-com">{rest}</span>;
    // Strings
    return rest.split(/(".*?"|'.*?')/g).map((p, i) => {
      if (p.startsWith('"') || p.startsWith("'")) return <span key={i} className="tok-str">{p}</span>;
      // keywords
      return <span key={i}>{p.split(/(\b(?:import|from|async|await|with|as|for|in|print|const|new|return|let|var)\b)/g).map((w, j) => {
        if (/^(import|from|async|await|with|as|for|in|print|const|new|return|let|var)$/.test(w)) {
          return <span key={j} className="tok-key">{w}</span>;
        }
        return w;
      })}</span>;
    });
  };
  return (
    <pre className="code-block">{code.split('\n').map((line, i) => (
      <div key={i} style={{ display: 'flex' }}>
        <span style={{ width: 24, color: '#3D4055', userSelect: 'none', textAlign: 'right', paddingRight: 12, flexShrink: 0 }}>{i + 1}</span>
        <span>{tokenize(line)}</span>
      </div>
    ))}</pre>
  );
}

export { Playground };
