'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [gender, setGender] = useState('');
  const [ageOk, setAgeOk] = useState(false);
  const router = useRouter();

  const ready = gender !== '' && ageOk;

  return (
    <main className="center-container">
      <div className="center-box">
        <h1>Welcome to DitonaChat</h1>
        <p className="tagline">Where Flirting Meets Fun</p>
        <p className="cta">Chat & Flirt with Real People 18+</p>
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="" disabled>I'm a...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="b">Non-binary</option>
        </select>
        <div className="age">
          <input type="checkbox" checked={ageOk} onChange={e => setAgeOk(e.target.checked)} />
          <label>I confirm I'm 18 or older</label>
        </div>
        <button disabled={!ready} className={`start-btn ${ready ? '' : 'disabled'}`} onClick={() => ready && router.push('/chat')}>
          Start Chatting
        </button>
      </div>
    </main>
  );
}
