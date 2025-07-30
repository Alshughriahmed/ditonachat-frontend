'use client';

import React, { useState } from 'react';  // Test update 2025-07-30
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [gender, setGender] = useState('male'); // 'male' or 'female' or 'nb'
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const router = useRouter();

  // هذا الكود هو للتعامل مع بدء الدردشة، بناءً على الوصف الجديد
  const handleStartChat = () => {
    if (ageConfirmed) {
      // هنا يمكنك حفظ التفضيلات أو القيام بأي منطق قبل التوجيه
      localStorage.setItem('userPreferences', JSON.stringify({ gender }));
      router.push('/chat'); // تم التغيير من /match إلى /chat بناءً على الكود الذي أرسلته لصفحة الدردشة
    } else {
      // استخدام رسالة مخصصة بدلاً من alert()
      alert('الرجاء تأكيد أن عمرك 18 عامًا أو أكثر.'); // يفضل استبدالها بـ modal UI
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center -m-4"
        style={{
          backgroundImage: "url('/neuefotoCover1.png')",
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 w-full max-w-sm bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
              DitonaChat
            </h1>
          </div>
          <p className="text-gray-300 mt-2">دردشة فيديو عشوائية مع أشخاص حقيقيين 18+</p>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGender('male')}
              className={`w-full py-2.5 rounded-lg text-md font-semibold transition ${
                gender === 'male' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              👨 ذكر
            </button>
            <button
              onClick={() => setGender('female')}
              className={`w-full py-2.5 rounded-lg text-md font-semibold transition ${
                gender === 'female' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              👩 أنثى
            </button>
            {/* يمكنك إضافة خيار "الجميع" أو "Non-binary" هنا إذا كنت تريده */}
            {/*
            <button
              onClick={() => setGender('nb')}
              className={`w-full py-2.5 rounded-lg text-md font-semibold transition ${
                gender === 'nb' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🌈 غير ثنائي
            </button>
            */}
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse justify-center">
            <input
              type="checkbox"
              id="ageConfirm"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="w-5 h-5 accent-pink-500 bg-gray-700 border-gray-600 rounded"
            />
            <label htmlFor="ageConfirm" className="text-sm text-gray-300 cursor-pointer">
              أؤكد أنني أبلغ من العمر 18 عامًا أو أكثر
            </label>
          </div>
          <button
            onClick={handleStartChat}
            disabled={!ageConfirmed}
            className={`w-full py-3 mt-2 rounded-xl font-bold text-lg transition ${
              ageConfirmed
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transform text-white'
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
  );
}
