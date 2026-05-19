'use client';

import React from 'react';
import { Ic } from '@/components/icons';

function Pricing() {
  const [billing, setBilling] = React.useState('monthly');
  const tiers = [
    {
      name: 'Free',
      desc: 'สำหรับนักพัฒนาที่อยากลองก่อน — ไม่ต้องใช้บัตร',
      price: { monthly: '0', yearly: '0' },
      note: '฿0 forever · 60 min/month',
      features: [
        '60 นาทีของ Speech-to-Text ฟรี',
        '10,000 chars Text-to-Speech',
        '3 voices เริ่มต้น',
        'Community support',
      ],
      cta: 'Start free',
      ghost: true,
    },
    {
      name: 'Pro',
      desc: 'สำหรับทีมที่กำลังเติบโต ใช้งานจริงใน production',
      price: { monthly: '690', yearly: '550' },
      note: billing === 'yearly' ? 'ต่อเดือน · ชำระเป็นรายปี' : 'ต่อเดือน',
      features: [
        '50 ชั่วโมง STT/เดือน · ฿4.5/ชม เพิ่มเติม',
        '500,000 chars TTS · ฿0.05/char เพิ่มเติม',
        '42 voices + voice cloning',
        'Streaming API · WebSocket',
        'Priority email support',
      ],
      cta: 'Start free trial',
      featured: true,
      popular: true,
    },
    {
      name: 'Enterprise',
      desc: 'สำหรับองค์กรที่ต้องการความปลอดภัยและ SLA',
      price: { monthly: 'Custom', yearly: 'Custom' },
      note: 'Volume pricing · Annual contract',
      features: [
        'Unlimited usage · Volume discounts',
        'On-premise และ private cloud',
        'Custom voice training',
        'SOC 2 · HIPAA · GDPR',
        'Dedicated solutions engineer',
        '99.95% SLA',
      ],
      cta: 'Contact sales',
      ghost: true,
    },
  ];

  return (
    <section className="section-pad" id="pricing" data-screen-label="Pricing">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Pricing</span>
          <h2 className="section-title">ราคาที่<span className="grad-text"> โปร่งใส</span>. จ่ายเฉพาะที่ใช้.</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            ไม่มี hidden fees — เริ่มฟรี อัพเกรดเมื่อพร้อม. ทุกแพลนรวม API access, dashboard, และ logs.
          </p>

          <div style={{ display: 'inline-flex', padding: 4, background: 'var(--c-bg-soft)', borderRadius: 999, marginTop: 28, border: '1px solid var(--c-line)' }}>
            <button onClick={() => setBilling('monthly')} style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600,
              background: billing === 'monthly' ? 'var(--c-card)' : 'transparent',
              color: billing === 'monthly' ? 'var(--c-ink)' : 'var(--c-mute)',
              boxShadow: billing === 'monthly' ? 'var(--shadow-sm)' : 'none',
            }}>Monthly</button>
            <button onClick={() => setBilling('yearly')} style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600,
              background: billing === 'yearly' ? 'var(--c-card)' : 'transparent',
              color: billing === 'yearly' ? 'var(--c-ink)' : 'var(--c-mute)',
              boxShadow: billing === 'yearly' ? 'var(--shadow-sm)' : 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>Yearly <span className="chip chip-pink" style={{ padding: '2px 7px', fontSize: 10 }}>−20%</span></button>
          </div>
        </div>

        <div className="pricing-grid">
          {tiers.map((t, i) => (
            <div key={i} className={`price-card ${t.featured ? 'featured' : ''}`}>
              {t.popular && <span className="price-popular">Most popular</span>}
              <div className="tier-name">{t.name}</div>
              <div className="tier-desc">{t.desc}</div>
              <div className="price">
                {t.price[billing] === 'Custom' || t.price[billing] === '0' ? (
                  <>
                    {t.price[billing] === '0' ? '฿0' : 'Custom'}
                  </>
                ) : (
                  <>฿{t.price[billing]}<span className="unit">/mo</span></>
                )}
              </div>
              <div className="price-note">{t.note}</div>

              <div className="feature-list">
                {t.features.map((f, k) => (
                  <div key={k} className="feature-li">
                    <Ic.CheckCirc size={18} style={{ color: t.featured ? '#B9C4FF' : 'var(--c-primary-2)' }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <a href="#" className={t.featured ? 'btn btn-primary' : 'btn btn-ghost'} style={{ width: '100%', justifyContent: 'center' }}>
                {t.cta} <Ic.Arrow size={14} />
              </a>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--c-mute)' }}>
          ทุกราคาแสดงในสกุล THB · รวม VAT · ไม่มีค่า setup fee
        </div>
      </div>
    </section>
  );
}

export { Pricing };
