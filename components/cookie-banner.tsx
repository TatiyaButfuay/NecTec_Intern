'use client';

import React from 'react';
import { Ic } from '@/components/icons';

// Cookie consent banner — shows on first visit, persists to localStorage
const COOKIE_KEY = 'pathumma.cookies.v1';

function CookieBanner() {
  const [visible, setVisible] = React.useState(false);
  const [mode, setMode] = React.useState('compact'); // 'compact' | 'manage'
  const [prefs, setPrefs] = React.useState({
    essential: true, // locked on
    analytics: true,
    marketing: false,
  });

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_KEY);
      if (!saved) {
        // delay a tick to feel natural after page paint
        const id = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(id);
      }
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const save = (decision) => {
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...decision, ts: Date.now() })); } catch (e) {}
    setVisible(false);
  };

  const acceptAll = () => save({ essential: true, analytics: true, marketing: true });
  const rejectAll = () => save({ essential: true, analytics: false, marketing: false });
  const saveCustom = () => save(prefs);

  if (!visible) return null;

  return (
    <div className="cookie-overlay" role="dialog" aria-labelledby="cookie-title">
      <div className={`cookie-card ${mode === 'manage' ? 'cookie-card-wide' : ''}`}>
        {mode === 'compact' ? (
          <>
            <div className="cookie-head">
              <div className="cookie-icon">
                <Ic.Sparkle size={16} />
              </div>
              <div>
                <div id="cookie-title" className="cookie-title">เราใช้คุกกี้เพื่อให้บริการดียิ่งขึ้น</div>
                <div className="cookie-sub">We use cookies to improve your experience</div>
              </div>
            </div>
            <p className="cookie-body">
              Pathumma Audio ใช้คุกกี้สำหรับ <strong>การทำงานพื้นฐาน</strong>, <strong>วิเคราะห์การใช้งาน</strong>, และ <strong>การตลาด</strong> —
              เพื่อพัฒนาคุณภาพ API และเรียนรู้ว่าผู้ใช้สนใจ feature ไหนที่สุด.
              {' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="cookie-link">Privacy Policy</a> · <a href="#" onClick={(e) => e.preventDefault()} className="cookie-link">Cookie Policy</a>
            </p>
            <div className="cookie-actions">
              <button className="btn btn-ghost btn-sm" onClick={rejectAll}>Reject all</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setMode('manage')}>Manage</button>
              <button className="btn btn-primary btn-sm" onClick={acceptAll}>Accept all <Ic.Arrow size={13} /></button>
            </div>
          </>
        ) : (
          <>
            <div className="cookie-head">
              <div className="cookie-icon">
                <Ic.Shield size={16} />
              </div>
              <div>
                <div className="cookie-title">จัดการคุกกี้ของคุณ</div>
                <div className="cookie-sub">Choose which cookies you allow</div>
              </div>
              <button className="cookie-close" onClick={() => setMode('compact')} aria-label="Back">←</button>
            </div>

            <div className="cookie-prefs">
              <CookieToggle
                title="Essential"
                desc="จำเป็นสำหรับการเข้าสู่ระบบ, การตั้งค่าธีม และการทำงานพื้นฐานของเว็บไซต์ — ไม่สามารถปิดได้"
                value={true}
                locked
              />
              <CookieToggle
                title="Analytics"
                desc="ช่วยให้เราเข้าใจว่าผู้ใช้ใช้ Pathumma อย่างไร — anonymous, รวมเป็นสถิติเท่านั้น (PostHog, Plausible)"
                value={prefs.analytics}
                onChange={(v) => setPrefs(p => ({ ...p, analytics: v }))}
              />
              <CookieToggle
                title="Marketing"
                desc="ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้องบนเว็บไซต์อื่น และวัดประสิทธิภาพแคมเปญ (Google Ads, Meta Pixel)"
                value={prefs.marketing}
                onChange={(v) => setPrefs(p => ({ ...p, marketing: v }))}
              />
            </div>

            <div className="cookie-actions">
              <button className="btn btn-ghost btn-sm" onClick={rejectAll}>Reject non-essential</button>
              <button className="btn btn-primary btn-sm" onClick={saveCustom}>Save preferences <Ic.Check size={13} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CookieToggle({ title, desc, value, locked, onChange }) {
  return (
    <div className={`cookie-pref ${locked ? 'locked' : ''}`}>
      <div className="cookie-pref-text">
        <div className="cookie-pref-title">
          {title}
          {locked && <span className="cookie-pref-lock">Always on</span>}
        </div>
        <p className="cookie-pref-desc">{desc}</p>
      </div>
      <button
        className={`cookie-switch ${value ? 'on' : ''} ${locked ? 'locked' : ''}`}
        onClick={() => !locked && onChange(!value)}
        disabled={locked}
        aria-pressed={value}
      >
        <span className="cookie-switch-knob" />
      </button>
    </div>
  );
}

export { CookieBanner };
