'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [gender, setGender] = useState('all');
  const [country, setCountry] = useState('all');
  const [interests, setInterests] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();

  // Countries list
  const countries = [
    { code: 'all', name: '🌍 جميع الدول', flag: '🌍' },
    { code: 'sa', name: '🇸🇦 السعودية', flag: '🇸🇦' },
    { code: 'ae', name: '🇦🇪 الإمارات', flag: '🇦🇪' },
    { code: 'eg', name: '🇪🇬 مصر', flag: '🇪🇬' },
    { code: 'jo', name: '🇯🇴 الأردن', flag: '🇯🇴' },
    { code: 'lb', name: '🇱🇧 لبنان', flag: '🇱🇧' },
    { code: 'sy', name: '🇸🇾 سوريا', flag: '🇸🇾' },
    { code: 'iq', name: '🇮🇶 العراق', flag: '🇮🇶' },
    { code: 'kw', name: '🇰🇼 الكويت', flag: '🇰🇼' },
    { code: 'qa', name: '🇶🇦 قطر', flag: '🇶🇦' },
    { code: 'bh', name: '🇧🇭 البحرين', flag: '🇧🇭' },
    { code: 'om', name: '🇴🇲 عُمان', flag: '🇴🇲' },
    { code: 'ye', name: '🇾🇪 اليمن', flag: '🇾🇪' },
    { code: 'ma', name: '🇲🇦 المغرب', flag: '🇲🇦' },
    { code: 'dz', name: '🇩🇿 الجزائر', flag: '🇩🇿' },
    { code: 'tn', name: '🇹🇳 تونس', flag: '🇹🇳' },
    { code: 'ly', name: '🇱🇾 ليبيا', flag: '🇱🇾' },
    { code: 'sd', name: '🇸🇩 السودان', flag: '🇸🇩' },
    { code: 'us', name: '🇺🇸 الولايات المتحدة', flag: '🇺🇸' },
    { code: 'gb', name: '🇬🇧 المملكة المتحدة', flag: '🇬🇧' },
    { code: 'fr', name: '🇫🇷 فرنسا', flag: '🇫🇷' },
    { code: 'de', name: '🇩🇪 ألمانيا', flag: '🇩🇪' },
    { code: 'it', name: '🇮🇹 إيطاليا', flag: '🇮🇹' },
    { code: 'es', name: '🇪🇸 إسبانيا', flag: '🇪🇸' },
    { code: 'tr', name: '🇹🇷 تركيا', flag: '🇹🇷' },
    { code: 'ir', name: '🇮🇷 إيران', flag: '🇮🇷' },
    { code: 'pk', name: '🇵🇰 باكستان', flag: '🇵🇰' },
    { code: 'in', name: '🇮🇳 الهند', flag: '🇮🇳' },
    { code: 'bd', name: '🇧🇩 بنغلاديش', flag: '🇧🇩' },
    { code: 'id', name: '🇮🇩 إندونيسيا', flag: '🇮🇩' },
    { code: 'my', name: '🇲🇾 ماليزيا', flag: '🇲🇾' },
    { code: 'br', name: '🇧🇷 البرازيل', flag: '🇧🇷' },
    { code: 'mx', name: '🇲🇽 المكسيك', flag: '🇲🇽' },
    { code: 'ca', name: '🇨🇦 كندا', flag: '🇨🇦' },
    { code: 'au', name: '🇦🇺 أستراليا', flag: '🇦🇺' },
    { code: 'jp', name: '🇯🇵 اليابان', flag: '🇯🇵' },
    { code: 'kr', name: '🇰🇷 كوريا الجنوبية', flag: '🇰🇷' },
    { code: 'cn', name: '🇨🇳 الصين', flag: '🇨🇳' },
    { code: 'ru', name: '🇷🇺 روسيا', flag: '🇷🇺' }
  ];

  const isReady = ageConfirmed && gender && country;

  // Initialize camera when component mounts
  useEffect(() => {
    initializeCamera();
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false // No audio for preview
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        setShowVideo(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setShowVideo(false);
    }
  };

  const startVideoChat = () => {
    if (isReady) {
      // Store user preferences in localStorage
      localStorage.setItem('userPreferences', JSON.stringify({
        gender,
        country,
        interests: interests.trim()
      }));
      
      router.push('/match');
    }
  };

  const goToVIP = () => {
    router.push('/vip');
  };

  const goToSettings = () => {
    router.push('/chat-settings');
  };

  const goToChat = () => {
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="p-4 text-center">
        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            DitonaChat
          </h1>
        </div>
        <p className="text-gray-300 mt-2">دردشة فيديو عشوائية مع أشخاص حقيقيين</p>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Side - Controls */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* Age Confirmation */}
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id="ageConfirm"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="w-5 h-5 text-pink-500 bg-transparent border-2 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                  />
                  <label htmlFor="ageConfirm" className="text-white cursor-pointer">
                    أؤكد أنني أبلغ من العمر 18 عامًا أو أكثر
                  </label>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <label className="block text-white font-medium mb-3">من تريد التحدث معه؟</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all">🌐 الجميع</option>
                  <option value="male">👨 ذكر</option>
                  <option value="female">👩 أنثى</option>
                  <option value="lgbtq" disabled>🏳️‍🌈 مثليي الجنس 🔒 (VIP)</option>
                </select>
              </div>

              {/* Country Selection */}
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <label className="block text-white font-medium mb-3">اختر البلد</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interests */}
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <label className="block text-white font-medium mb-3">اهتماماتي (اختياري)</label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="مثل: الرياضة، الموسيقى، السفر..."
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  maxLength={100}
                />
                <p className="text-gray-400 text-sm mt-2">{interests.length}/100 حرف</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={startVideoChat}
                  disabled={!isReady}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isReady
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  🎥 ابدأ الدردشة الآن
                </button>

                <button
                  onClick={goToVIP}
                  className="w-full py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  👑 اشترك في VIP
                </button>
              </div>
            </div>

            {/* Right Side - Video Preview */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h3 className="text-white font-medium mb-4 text-center">معاينة الفيديو الخاص بك</h3>
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  {showVideo ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📷</div>
                        <p>اسمح بالوصول للكاميرا</p>
                        <button
                          onClick={initializeCamera}
                          className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          تفعيل الكاميرا
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features Preview */}
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h3 className="text-white font-medium mb-4">✨ ميزات DitonaChat</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-green-400">✅</span>
                    <span>دردشة فيديو عالية الجودة</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-green-400">✅</span>
                    <span>مطابقة عشوائية فورية</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-green-400">✅</span>
                    <span>فلاتر متقدمة للبحث</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-yellow-400">👑</span>
                    <span>ميزات VIP حصرية</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-blue-400">🔒</span>
                    <span>حماية وخصوصية كاملة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-lg border-t border-white border-opacity-20">
        <div className="flex justify-around items-center py-3 px-4">
          <button
            onClick={goToSettings}
            className="flex flex-col items-center space-y-1 text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-xl">⚙️</span>
            <span className="text-xs">إعدادات</span>
          </button>
          
          <button
            onClick={startVideoChat}
            disabled={!isReady}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              isReady ? 'text-pink-400 hover:text-pink-300' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">▶️</span>
            <span className="text-xs">ابدأ</span>
          </button>
          
          <button
            onClick={goToVIP}
            className="flex flex-col items-center space-y-1 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <span className="text-xl">👑</span>
            <span className="text-xs">VIP</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 text-gray-300 hover:text-white transition-colors">
            <span className="text-xl">🎭</span>
            <span className="text-xs">مجهولية</span>
          </button>
          
          <button
            onClick={goToChat}
            className="flex flex-col items-center space-y-1 text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-xl">💬</span>
            <span className="text-xs">دردشة</span>
          </button>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-24"></div>

      {/* Logo at Bottom */}
      <div className="text-center py-6 mb-20">
        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            DitonaChat
          </h2>
        </div>
        <p className="text-gray-300 text-sm">حيث يلتقي التواصل بالمتعة</p>
      </div>

      {/* Terms and Privacy */}
      <div className="text-center py-4 text-gray-400 text-sm mb-20">
        <a href="/terms" className="hover:text-white transition-colors">شروط الاستخدام</a>
        <span className="mx-2">|</span>
        <a href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</a>
      </div>
    </div>
  );
}

