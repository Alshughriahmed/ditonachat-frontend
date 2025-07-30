'use client';
 HEAD

 f8a4ca5 (Implement updated chat page and sync other frontend changes)
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
 HEAD
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

  const [gender, setGender] = useState('male'); // 'male' or 'female'
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const router = useRouter();

  const handleStartChat = () => {
    if (ageConfirmed) {
      localStorage.setItem('userPreferences', JSON.stringify({ gender }));
      router.push('/match');
    } else {
      alert('الرجاء تأكيد أن عمرك 18 عامًا أو أكثر.');
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center -m-4"
        style={{ 
          backgroundImage: "url('/neuefotoCover1.png')", 
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 w-full max-w-sm bg-gray-900 bg-opacity-70 backdrop-blur-lg rounded-2xl p-6 sm:p-8 text-white border border-gray-700 shadow-2xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              DitonaChat
            </h1>
          </div>
          <p className="text-gray-300 mt-2">دردشة فيديو عشوائية مع أشخاص حقيقيين</p>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
             <button
                onClick={() => setGender('male')}
                className={`w-full py-2.5 rounded-lg text-md font-semibold transition-all duration-300 ${gender === 'male' ? 'bg-pink-600 text-white ring-2 ring-pink-400' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                👨 ذكر
              </button>
              <button
                onClick={() => setGender('female')}
                className={`w-full py-2.5 rounded-lg text-md font-semibold transition-all duration-300 ${gender === 'female' ? 'bg-pink-600 text-white ring-2 ring-pink-400' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                👩 أنثى
              </button>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse justify-center pt-2">
            <input
              type="checkbox"
              id="ageConfirm"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="w-5 h-5 accent-pink-500 bg-gray-700 border-gray-600 rounded cursor-pointer"
            />
            <label htmlFor="ageConfirm" className="text-sm text-gray-300 cursor-pointer">
              أؤكد أنني أبلغ من العمر 18 عامًا أو أكثر
            </label>
          </div>
          <button
            onClick={handleStartChat}
            disabled={!ageConfirmed}
            className={`w-full py-3 mt-2 rounded-xl font-bold text-lg transition-all duration-300 transform ${
              ageConfirmed 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 shadow-lg hover:shadow-pink-500/50' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            🎥 ابدأ الدردشة الآن
          </button>
        </div>
        <div className="text-center mt-6 text-xs text-gray-500">
          <a href="/terms" className="hover:text-white transition">شروط الاستخدام</a>
          <span className="mx-2">|</span>
          <a href="/privacy" className="hover:text-white transition">سياسة الخصوصية</a>
        </div>
      </div>
    </div>
 f8a4ca5 (Implement updated chat page and sync other frontend changes)
  );
}
