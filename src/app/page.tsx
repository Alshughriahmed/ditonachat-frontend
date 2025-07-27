'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [gender, setGender] = useState('');
  const [ageOk, setAgeOk]   = useState(false);
  const router = useRouter();

  const ready = gender !== '' && ageOk;

  return (
    <main className="center-container">
      <div className="center-box">
        <h1>Welcome to DitonaChat</h1>
        <p className="tagline">Where Flirting Meets Fun</p>
        <p className="cta">Chat &amp; Flirt with Real People 18+</p>

        {/* اختيار الجنس */}
        <select
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="" disabled>I’m a…</option>
          <option value="male">👨 Male</option>
          <option value="female">👩 Female</option>
          <option value="nb">🌈 Non‑binary</option>
        </select>

        {/* تأكيد العمر */}
        <div className="age">
          <input
            type="checkbox"
            checked={ageOk}
            onChange={e => setAgeOk(e.target.checked)}
          />
          <label>I confirm I’m 18 or older</label>
        </div>

        {/* زر البدء */}
        <button
          disabled={!ready}
          className={`start-btn ${ready ? '' : 'disabled'}`}
          onClick={() => ready && router.push('/chat')}
        >
          START VIDEO CHAT
        </button>

        {/* روابط الشروط */}
        <div className="policy-links">
          <a href="/terms">Terms of Use</a> | <a href="/privacy">Privacy Policy</a>
        </div>
      </div>

      {/* اللوغو الكبير تحت الصندوق */}
      <img src="/logo.png" alt="" className="big-logo" />
    </main>
  );
}
