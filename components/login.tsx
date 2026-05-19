'use client';

import React from 'react';
import { Ic } from '@/components/icons';
import { PathummaMark, Waveform } from '@/components/waveform';

// Login page — split layout.
// Left: brand panel with the animated mark (re-uses PathummaMark + Waveform).
// Right: tabbed sign-in form — "User" tab offers Google + email magic-link;
// "Admin" tab is classic username + password.
function LoginPage({ onBack, onNavigate }) {
  const [tab, setTab] = React.useState('user'); // 'user' | 'admin'
  const [email, setEmail] = React.useState('');
  const [user, setUser] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [emailSent, setEmailSent] = React.useState(false);

  const submitEmail = (e) => {
    e.preventDefault();
    if (!email) return;
    setEmailSent(true);
  };

  const submitAdmin = (e) => {
    e.preventDefault();
    // demo only — no real auth
    alert('Admin login is wired to your IdP. (demo)');
  };

  return (
    <section className="login-page" data-screen-label="Login">
      <div className="login-bg" />

      <div className="login-wrap">
        {/* LEFT — brand panel */}
        <aside className="login-brand">
          <button className="login-back" onClick={onBack}>
            <Ic.Arrow size={14} style={{ transform: 'rotate(180deg)' }} /> Back to site
          </button>

          <div className="login-mark">
            <div className="login-mark-glow" />
            <PathummaMark size={92} animate={true} />
          </div>

          <h2 className="login-brand-t">
            Welcome back to<br/><span className="grad-text">PathummaAudio.</span>
          </h2>
          <p className="login-brand-d">
            ระบบ Speech AI ที่ครบที่สุดสำหรับนักพัฒนาและองค์กรไทย — ASR, Streaming และ TTS ใน API เดียว.
          </p>

          <div className="login-features">
            <div className="login-feat">
              <span className="login-feat-ic"><Ic.Bolt size={14} /></span>
              <span>Real-time · 87ms latency</span>
            </div>
            <div className="login-feat">
              <span className="login-feat-ic"><Ic.Globe size={14} /></span>
              <span>100+ languages</span>
            </div>
            <div className="login-feat">
              <span className="login-feat-ic"><Ic.Shield size={14} /></span>
              <span>SOC 2 · GDPR · PDPA</span>
            </div>
          </div>

          <div className="login-quote">
            <div className="login-quote-t">
              "We replaced 3 vendors with one API. Latency dropped 4×."
            </div>
            <div className="login-quote-a">
              <span className="login-quote-av">JM</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Jirayu M.</div>
                <div style={{ fontSize: 11, color: 'var(--c-mute)' }}>Head of AI · Bangkok Bank</div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT — form */}
        <div className="login-form-wrap">
          <div className="login-card">
            <div className="login-card-head">
              <h3 className="login-card-t">Sign in</h3>
              <p className="login-card-d">เลือกวิธีลงชื่อเข้าใช้ — User สำหรับผู้ใช้ทั่วไป, Admin สำหรับทีมภายใน.</p>
            </div>

            {/* Tab switcher */}
            <div className="login-tabs">
              <button
                className={`login-tab ${tab === 'user' ? 'active' : ''}`}
                onClick={() => { setTab('user'); setEmailSent(false); }}>
                <Ic.User size={14} /> User
              </button>
              <button
                className={`login-tab ${tab === 'admin' ? 'active' : ''}`}
                onClick={() => setTab('admin')}>
                <Ic.Shield size={14} /> Admin
              </button>
              <span className="login-tab-pill" data-pos={tab} />
            </div>

            {/* USER tab — Google + email */}
            {tab === 'user' && !emailSent && (
              <div className="login-tab-body">
                <button className="login-google" type="button">
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>

                <div className="login-divider">
                  <span>or with email</span>
                </div>

                <form onSubmit={submitEmail} className="login-form">
                  <label className="login-field">
                    <span className="login-field-lbl">Email</span>
                    <div className="login-input">
                      <Ic.Mail size={15} />
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </label>

                  <button type="submit" className="btn btn-primary btn-lg login-submit">
                    Send magic link <Ic.Arrow size={14} />
                  </button>
                </form>

                <p className="login-foot">
                  ไม่มีบัญชี? <a href="#" onClick={(e) => e.preventDefault()}>Create one</a> — เป็น dev ฟรี $5 credit.
                </p>
              </div>
            )}

            {/* USER tab — magic link sent confirmation */}
            {tab === 'user' && emailSent && (
              <div className="login-sent">
                <div className="login-sent-ic">
                  <Ic.Mail size={28} />
                </div>
                <h4 className="login-sent-t">Check your inbox</h4>
                <p className="login-sent-d">
                  เราส่งลิงก์เข้าสู่ระบบไปที่<br/>
                  <strong>{email}</strong>
                </p>
                <p className="login-sent-hint">ลิงก์มีอายุ 15 นาที. หาในกล่อง Spam ถ้าไม่เห็น.</p>
                <button className="btn btn-ghost" onClick={() => setEmailSent(false)}>
                  Use a different email
                </button>
              </div>
            )}

            {/* ADMIN tab — username + password */}
            {tab === 'admin' && (
              <div className="login-tab-body">
                <div className="login-admin-banner">
                  <Ic.Shield size={14} />
                  <span>สำหรับผู้ดูแลระบบเท่านั้น · MFA required</span>
                </div>

                <form onSubmit={submitAdmin} className="login-form">
                  <label className="login-field">
                    <span className="login-field-lbl">Username</span>
                    <div className="login-input">
                      <Ic.User size={15} />
                      <input
                        type="text"
                        placeholder="admin"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required
                        autoComplete="username"
                      />
                    </div>
                  </label>

                  <label className="login-field">
                    <div className="login-field-row">
                      <span className="login-field-lbl">Password</span>
                      <a href="#" onClick={(e) => e.preventDefault()} className="login-field-link">Forgot?</a>
                    </div>
                    <div className="login-input">
                      <Ic.Lock size={15} />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        placeholder="••••••••••"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="login-input-toggle"
                        onClick={() => setShowPwd(!showPwd)}
                        aria-label={showPwd ? 'Hide password' : 'Show password'}>
                        {showPwd ? <Ic.EyeOff size={15} /> : <Ic.Eye size={15} />}
                      </button>
                    </div>
                  </label>

                  <label className="login-remember">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span>Remember this device for 30 days</span>
                  </label>

                  <button type="submit" className="btn btn-primary btn-lg login-submit">
                    Sign in to admin <Ic.Arrow size={14} />
                  </button>
                </form>

                <p className="login-foot">
                  ไม่ใช่ผู้ดูแล? <a href="#" onClick={(e) => { e.preventDefault(); setTab('user'); }}>กลับไปหน้า User login</a>
                </p>
              </div>
            )}
          </div>

          <p className="login-legal">
            By continuing you agree to our <a href="#" onClick={(e) => e.preventDefault()}>Terms</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  );
}

// Multi-color Google "G" logo (official colors).
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

export { LoginPage };
