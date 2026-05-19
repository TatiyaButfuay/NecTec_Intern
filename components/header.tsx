'use client';

import React from 'react';
import { Ic } from '@/components/icons';
import { PathummaMark } from '@/components/waveform';

function Header({ mode, onToggleMode, page, onNavigate }) {
  const [openMenu, setOpenMenu] = React.useState(null); // 'products' | 'solutions' | null

  React.useEffect(() => {
    if (!openMenu) return;
    const handler = (e) => {
      if (!e.target.closest('.nav-item-wrap')) setOpenMenu(null);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [openMenu]);

  const go = (target) => (e) => {
    e.preventDefault();
    setOpenMenu(null);
    onNavigate(target);
  };

  return (
    <header className="header" data-screen-label="Header">
      <div className="container header-inner">
        <a href="#" onClick={go({ page: 'home' })} className="logo">
          <span className="logo-mark-wrap"><PathummaMark size={26} /></span>
          <div className="logo-text">
            <div className="logo-name">Pathumma</div>
            <div className="logo-tag">AUDIO</div>
          </div>
        </a>

        <nav className="nav">
          <div className="nav-item-wrap">
            <a href="#products" onClick={(e) => { e.preventDefault(); setOpenMenu(openMenu === 'products' ? null : 'products'); }} className={`has-arrow ${openMenu === 'products' ? 'open' : ''}`}>Products</a>
            {openMenu === 'products' && (
              <div className="nav-dropdown">
                <a href="#" onClick={go({ page: 'asr-dropfile' })} className="dd-item">
                  <span className="dd-ic tone-a"><Ic.Upload size={16} /></span>
                  <div>
                    <div className="dd-t">ASR Dropfile</div>
                    <div className="dd-s">Batch speech-to-text</div>
                  </div>
                </a>
                <a href="#" onClick={go({ page: 'asr-streaming' })} className="dd-item">
                  <span className="dd-ic tone-b"><Ic.Stream size={16} /></span>
                  <div>
                    <div className="dd-t">ASR Streaming</div>
                    <div className="dd-s">Real-time transcription</div>
                  </div>
                </a>
                <a href="#" onClick={go({ page: 'tts' })} className="dd-item">
                  <span className="dd-ic tone-c"><Ic.Speaker size={16} /></span>
                  <div>
                    <div className="dd-t">Text-to-Speech</div>
                    <div className="dd-s">Natural voice synthesis</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          <div className="nav-item-wrap">
            <a href="#solutions" onClick={(e) => { e.preventDefault(); setOpenMenu(openMenu === 'solutions' ? null : 'solutions'); }} className={`has-arrow ${openMenu === 'solutions' ? 'open' : ''}`}>Solutions</a>
            {openMenu === 'solutions' && (
              <div className="nav-dropdown">
                <a href="#" onClick={go({ page: 'meeting' })} className="dd-item">
                  <span className="dd-ic tone-a"><Ic.Doc size={16} /></span>
                  <div>
                    <div className="dd-t">Meeting transcription</div>
                    <div className="dd-s">Transcripts, speakers & summary</div>
                  </div>
                </a>
                <a href="#" onClick={go({ page: 'voice-agent' })} className="dd-item">
                  <span className="dd-ic tone-b"><Ic.Phone size={16} /></span>
                  <div>
                    <div className="dd-t">Voice agent</div>
                    <div className="dd-s">Real-time conversational AI</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          <a href="#research" onClick={go({ page: 'research' })}>Research</a>
          <a href="#developer" onClick={go({ page: 'developer' })}>Developer</a>
          <a href="#about" onClick={go({ page: 'about' })}>About</a>
        </nav>

        <div className="header-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={onToggleMode}
            aria-label="Toggle theme"
            style={{ padding: '8px', width: 36, justifyContent: 'center' }}>
            {mode === 'dark' ? <Ic.Sun size={15} /> : <Ic.Moon size={15} />}
          </button>
          <a href="#" onClick={go({ page: 'login' })} className="btn btn-ghost btn-sm">Log in</a>
          <a href="#" onClick={go({ page: 'login' })} className="btn btn-primary btn-sm">Get Started <Ic.Arrow size={14} /></a>
        </div>
      </div>
    </header>
  );
}

export { Header };
