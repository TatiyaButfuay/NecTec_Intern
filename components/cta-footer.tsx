'use client';

import React from 'react';
import { Ic } from '@/components/icons';
import { PathummaMark, Waveform } from '@/components/waveform';

function CTA({ onNavigate }) {
  return (
    <section className="section-pad-sm" data-screen-label="CTA">
      <div className="container">
        <div className="cta-wrap">
          <div className="cta-wave">
            <div style={{ width: 220 }}>
              <Waveform bars={36} height={70} />
            </div>
          </div>
          <h2>เริ่มต้นการใช้งานได้แล้วตอนนี้</h2>
          <p>เชื่อมต่อ Pathumma Audio API ภายในไม่กี่บรรทัด — รองรับภาษาไทยที่แม่นที่สุด พร้อม credit ฟรี 60 นาที.</p>
          <div className="cta-actions">
            <a href="#playground" className="btn btn-primary btn-lg">Get started free <Ic.Arrow size={15} /></a>
            <a href="#research" className="btn btn-ghost btn-lg" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate({ page: 'research' }); }}><Ic.Doc size={15} /> Read the Docs</a>
          </div>
          <div style={{ marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.55)', display: 'inline-flex', gap: 18, justifyContent: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Ic.Check size={13} /> ไม่ต้องใช้บัตรเครดิต</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Ic.Check size={13} /> </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Ic.Check size={13} /> ตั้งค่าใน 2 นาที</span>
          </div>
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer className="footer" data-screen-label="Footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#" className="logo">
              <span className="logo-mark-wrap"><PathummaMark size={26} /></span>
              <div className="logo-text">
                <div className="logo-name">Pathumma</div>
                <div className="logo-tag">AUDIO</div>
              </div>
            </a>
            <p className="footer-tag">The voice AI platform for builders. High-fidelity audio processing — STT, TTS, streaming.

            </p>
            <div className="footer-social" style={{ marginTop: 18 }}>
              <a href="#" aria-label="GitHub"><Ic.Github size={16} /></a>
              <a href="#" aria-label="Twitter"><Ic.Twitter size={14} /></a>
              <a href="#" aria-label="LinkedIn"><Ic.Linkedin size={14} /></a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Products</h5>
            <a href="#">Speech-to-Text</a>
            <a href="#">Streaming STT</a>
            <a href="#">Text-to-Speech</a>
            <a href="#"></a>
            <a href="#"></a>
          </div>
          <div className="footer-col">
            <h5>Developers</h5>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Quickstart</a>
            <a href="#">SDKs</a>
            <a href="#">Status</a>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <a href="#">About</a>
            <a href="#">Research</a>
            <a href="#">Customers</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
            <a href="#">DPA</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer-affil">
          <span className="footer-affil-lbl">Developed by</span>
          <a href="https://www.nectec.or.th/" target="_blank" rel="noopener" aria-label="NECTEC">
            <img src={(typeof window !== 'undefined' && window.__resources && window.__resources.logoNectec) || '/assets/logo-nectec.png'} alt="NECTEC — a member of NSTDA" />
          </a>
          <span className="footer-affil-sep" />
          <a href="https://www.nstda.or.th/" target="_blank" rel="noopener" aria-label="NSTDA">
            <img src={(typeof window !== 'undefined' && window.__resources && window.__resources.logoNstda) || '/assets/logo-nstda.png'} alt="NSTDA — สวทช." />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PathummaAudio · High-fidelity speech AI</span>
          <span style={{ display: 'inline-flex', gap: 18, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
              All systems operational
            </span>
            <span>EN · TH</span>
          </span>
        </div>
      </div>
    </footer>);

}

export { CTA, Footer };
