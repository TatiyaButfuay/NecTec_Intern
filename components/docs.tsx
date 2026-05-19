'use client';

import React from 'react';
import { Ic } from '@/components/icons';

function DocsPreview() {
  const [active, setActive] = React.useState('transcribe');
  const endpoints = {
    transcribe: { method: 'POST', url: '/v1/audio/transcriptions', title: 'Create transcription' },
    stream: { method: 'WS', url: '/v1/audio/stream', title: 'Streaming transcription' },
    speech: { method: 'POST', url: '/v1/audio/speech', title: 'Generate speech' },
    voices: { method: 'GET', url: '/v1/audio/voices', title: 'List voices' },
  };
  const e = endpoints[active];
  return (
    <section className="section-pad" id="docs" data-screen-label="Docs">
      <div className="container">
        <div className="docs-wrap">
          <div>
            <span className="eyebrow">Developer first</span>
            <h2 className="section-title">เอกสารที่<br/><span className="grad-text">เริ่มใช้งานได้ใน 5 นาที.</span></h2>
            <p className="section-sub" style={{ marginBottom: 32 }}>
              REST + WebSocket API ที่ออกแบบให้เข้าใจง่าย พร้อม SDKs สำหรับ Python, JavaScript, Go, Java, และอีก 8 ภาษา.
            </p>

            <div className="docs-features">
              <div className="docs-feature">
                <div className="ic"><Ic.Code size={18} /></div>
                <div>
                  <h4>OpenAPI 3.1 spec</h4>
                  <p>Generate client SDKs ในภาษาที่คุณใช้ ภายในไม่กี่วินาที.</p>
                </div>
              </div>
              <div className="docs-feature">
                <div className="ic"><Ic.Bolt size={18} /></div>
                <div>
                  <h4>Interactive examples</h4>
                  <p>ทดสอบ endpoint จากหน้า docs ได้ทันที — ไม่ต้องสลับไปสลับมา.</p>
                </div>
              </div>
              <div className="docs-feature">
                <div className="ic"><Ic.Book size={18} /></div>
                <div>
                  <h4>Recipes & guides</h4>
                  <p>ตัวอย่าง production-ready 30+ แบบ ตั้งแต่ live captions ไปจนถึง voice cloning.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
              <a href="#" className="btn btn-soft">Read full docs <Ic.Arrow size={14} /></a>
              <a href="#" className="btn btn-ghost"><Ic.Github size={15} /> View on GitHub</a>
            </div>
          </div>

          <div className="docs-shot">
            <div className="docs-bar">
              <div className="docs-bar-dots"><span/><span/><span/></div>
              <div className="docs-bar-url"><Ic.Search size={11} /><span style={{ marginLeft: 8 }}>docs.pathumma.ai/api-reference</span></div>
            </div>
            <div className="docs-body">
              <div className="docs-side">
                <div className="sec">Getting started</div>
                <div className="item">Introduction</div>
                <div className="item">Authentication</div>
                <div className="item">Quickstart</div>

                <div className="sec">API reference</div>
                <div className={`item ${active === 'transcribe' ? 'active' : ''}`} onClick={() => setActive('transcribe')}>Transcriptions</div>
                <div className={`item ${active === 'stream' ? 'active' : ''}`} onClick={() => setActive('stream')}>Streaming</div>
                <div className={`item ${active === 'speech' ? 'active' : ''}`} onClick={() => setActive('speech')}>Speech</div>
                <div className={`item ${active === 'voices' ? 'active' : ''}`} onClick={() => setActive('voices')}>Voices</div>

                <div className="sec">Guides</div>
                <div className="item">Live captions</div>
                <div className="item">Voice cloning</div>
              </div>
              <div className="docs-main">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`endpoint-tag ${e.method === 'POST' ? 'post' : ''}`}>{e.method}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--c-ink)' }}>{e.url}</span>
                </div>
                <h3 className="docs-h3">{e.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--c-mute)', lineHeight: 1.6 }}>
                  {active === 'speech'
                    ? 'Generates audio from input text. Returns a stream that you can play immediately or save.'
                    : active === 'voices'
                    ? 'Returns the list of available voices, including their language and style metadata.'
                    : 'Transcribes audio into the input language. Supports diarization and word-level timestamps.'}
                </p>

                <table className="docs-mini-table">
                  <thead><tr><th>Parameter</th><th>Type</th><th></th><th>Description</th></tr></thead>
                  <tbody>
                    {active === 'speech' ? (
                      <>
                        <tr><td><code>input</code></td><td>string</td><td><span className="req-pill">REQ</span></td><td>Text to synthesize (max 5,000)</td></tr>
                        <tr><td><code>voice</code></td><td>string</td><td><span className="req-pill">REQ</span></td><td>Voice ID — e.g. aria, sun, maya</td></tr>
                        <tr><td><code>format</code></td><td>string</td><td></td><td>mp3 · wav · flac · opus</td></tr>
                        <tr><td><code>speed</code></td><td>number</td><td></td><td>0.5–2.0 · default 1.0</td></tr>
                      </>
                    ) : (
                      <>
                        <tr><td><code>file</code></td><td>file</td><td><span className="req-pill">REQ</span></td><td>Audio file to transcribe</td></tr>
                        <tr><td><code>model</code></td><td>string</td><td><span className="req-pill">REQ</span></td><td>pathumma-stt-v2 · fast · nano</td></tr>
                        <tr><td><code>language</code></td><td>string</td><td></td><td>ISO 639-1 code or 'auto'</td></tr>
                        <tr><td><code>diarize</code></td><td>boolean</td><td></td><td>Detect & label speakers</td></tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { DocsPreview };
