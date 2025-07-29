'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatSettingsPage() {
  const router = useRouter();
  
  // Settings state
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  const [hideLocation, setHideLocation] = useState(false);
  const [hideGender, setHideGender] = useState(false);
  const [autoIntroMessage, setAutoIntroMessage] = useState('');
  const [enableAutoIntro, setEnableAutoIntro] = useState(false);
  const [showLikesCount, setShowLikesCount] = useState(true);
  const [hideLikesCount, setHideLikesCount] = useState(false);
  const [enableVIPBadge, setEnableVIPBadge] = useState(false);
  const [enableFollowers, setEnableFollowers] = useState(false);
  
  // User status
  const [isVIP, setIsVIP] = useState(false);

  // Languages list
  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' }
  ];

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAutoTranslate(settings.autoTranslate || false);
      setSelectedLanguage(settings.selectedLanguage || 'ar');
      setHideLocation(settings.hideLocation || false);
      setHideGender(settings.hideGender || false);
      setAutoIntroMessage(settings.autoIntroMessage || '');
      setEnableAutoIntro(settings.enableAutoIntro || false);
      setShowLikesCount(settings.showLikesCount !== false);
      setHideLikesCount(settings.hideLikesCount || false);
      setEnableVIPBadge(settings.enableVIPBadge || false);
      setEnableFollowers(settings.enableFollowers || false);
    }

    // Check VIP status (mock for now)
    const vipStatus = localStorage.getItem('isVIP');
    setIsVIP(vipStatus === 'true');
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      autoTranslate,
      selectedLanguage,
      hideLocation,
      hideGender,
      autoIntroMessage,
      enableAutoIntro,
      showLikesCount,
      hideLikesCount,
      enableVIPBadge,
      enableFollowers
    };
    
    localStorage.setItem('chatSettings', JSON.stringify(settings));
    
    // Show success message
    alert('✅ تم حفظ الإعدادات بنجاح!');
  };

  const goToVIP = () => {
    router.push('/vip');
  };

  const goBack = () => {
    router.back();
  };

  const resetSettings = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      setAutoTranslate(false);
      setSelectedLanguage('ar');
      setHideLocation(false);
      setHideGender(false);
      setAutoIntroMessage('');
      setEnableAutoIntro(false);
      setShowLikesCount(true);
      setHideLikesCount(false);
      setEnableVIPBadge(false);
      setEnableFollowers(false);
      
      localStorage.removeItem('chatSettings');
      alert('✅ تم إعادة تعيين الإعدادات!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-30 backdrop-blur-lg border-b border-white border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button
                onClick={goBack}
                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                aria-label="العودة"
              >
                ←
              </button>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <h1 className="text-xl font-bold">إعدادات الدردشة</h1>
              </div>
            </div>
            
            {isVIP && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-lg">👑</span>
                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">VIP</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Translation Settings */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <span>🌍</span>
              <span>إعدادات الترجمة</span>
            </h2>
            
            <div className="space-y-4">
              {/* Auto Translation Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">تفعيل الترجمة التلقائية</label>
                  <p className="text-gray-300 text-sm">ترجمة الرسائل تلقائيًا إلى لغتك المفضلة</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={autoTranslate}
                    onChange={(e) => setAutoTranslate(e.target.checked)}
                    className="sr-only"
                    disabled={!isVIP}
                  />
                  <div
                    onClick={() => isVIP && setAutoTranslate(!autoTranslate)}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      autoTranslate ? 'bg-green-500' : 'bg-gray-600'
                    } ${!isVIP ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                        autoTranslate ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}
                    />
                  </div>
                  {!isVIP && <span className="text-xs text-yellow-400 ml-2">🔒 VIP</span>}
                </div>
              </div>

              {/* Language Selection */}
              <div className={`${!autoTranslate || !isVIP ? 'opacity-50' : ''}`}>
                <label className="block text-white font-medium mb-2">اختر لغة الترجمة</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  disabled={!autoTranslate || !isVIP}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <span>🔒</span>
              <span>إعدادات الخصوصية</span>
            </h2>
            
            <div className="space-y-6">
              {/* Hide Location */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">إخفاء الموقع</label>
                  <p className="text-gray-300 text-sm">عدم عرض بلدك للآخرين</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={hideLocation}
                    onChange={(e) => setHideLocation(e.target.checked)}
                    className="sr-only"
                    disabled={!isVIP}
                  />
                  <div
                    onClick={() => isVIP && setHideLocation(!hideLocation)}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      hideLocation ? 'bg-green-500' : 'bg-gray-600'
                    } ${!isVIP ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                        hideLocation ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}
                    />
                  </div>
                  {!isVIP && <span className="text-xs text-yellow-400 ml-2">🔒 VIP</span>}
                </div>
              </div>

              {/* Hide Gender */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">إخفاء الجنس</label>
                  <p className="text-gray-300 text-sm">عدم عرض جنسك للآخرين</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={hideGender}
                    onChange={(e) => setHideGender(e.target.checked)}
                    className="sr-only"
                    disabled={!isVIP}
                  />
                  <div
                    onClick={() => isVIP && setHideGender(!hideGender)}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      hideGender ? 'bg-green-500' : 'bg-gray-600'
                    } ${!isVIP ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                        hideGender ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}
                    />
                  </div>
                  {!isVIP && <span className="text-xs text-yellow-400 ml-2">🔒 VIP</span>}
                </div>
              </div>

              {/* Hide Likes Count */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">إخفاء عدد الإعجابات</label>
                  <p className="text-gray-300 text-sm">عدم عرض عدد إعجاباتك للآخرين</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={hideLikesCount}
                    onChange={(e) => setHideLikesCount(e.target.checked)}
                    className="sr-only"
                    disabled={!isVIP}
                  />
                  <div
                    onClick={() => isVIP && setHideLikesCount(!hideLikesCount)}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      hideLikesCount ? 'bg-green-500' : 'bg-gray-600'
                    } ${!isVIP ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                        hideLikesCount ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}
                    />
                  </div>
                  {!isVIP && <span className="text-xs text-yellow-400 ml-2">🔒 VIP</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Auto Introduction Message */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <span>💬</span>
              <span>رسالة التعريف التلقائية</span>
              {!isVIP && <span className="text-xs text-yellow-400">🔒 VIP</span>}
            </h2>
            
            <div className="space-y-4">
              {/* Enable Auto Intro */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">تفعيل الرسالة التلقائية</label>
                  <p className="text-gray-300 text-sm">إرسال رسالة تعريف تلقائيًا عند كل اتصال جديد</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={enableAutoIntro}
                    onChange={(e) => setEnableAutoIntro(e.target.checked)}
                    className="sr-only"
                    disabled={!isVIP}
                  />
                  <div
                    onClick={() => isVIP && setEnableAutoIntro(!enableAutoIntro)}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      enableAutoIntro ? 'bg-green-500' : 'bg-gray-600'
                    } ${!isVIP ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                        enableAutoIntro ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}
                    />
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className={`${!enableAutoIntro || !isVIP ? 'opacity-50' : ''}`}>
                <label className="block text-white font-medium mb-2">نص الرسالة</label>
                <textarea
                  value={autoIntroMessage}
                  onChange={(e) => setAutoIntroMessage(e.target.value)}
                  disabled={!enableAutoIntro || !isVIP}
                  placeholder="مثال: مرحبًا! أنا أحمد من السعودية، أحب السفر والموسيقى..."
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  rows={4}
                  maxLength={200}
                />
                <p className="text-gray-400 text-sm mt-2">{autoIntroMessage.length}/200 حرف</p>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <span>👁️</span>
              <span>إعدادات العرض</span>
            </h2>
            
            <div className="space-y-6">
              {/* Show Likes Count */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">عرض عدد الإعجابات</label>
                  <p className="text-gray-300 text-sm">إظهار عدد الإعجابات التي حصلت عليها</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showLikesCount}
                    onChange={(e) => setShowLikesCount(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setShowLikesCount(!showLikesCount)}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      showLikesCount ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                        showLikesCount ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}
                    />
                  </div>
                </div>
              </div>

              {/* VIP Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">عرض شارة VIP</label>
                  <p className="text-gray-300 text-sm">إظهار شارة VIP إذا كنت عضوًا مميزًا</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={enableVIPBadge && isVIP}
                    onChange={(e) => setEnableVIPBadge(e.target.checked)}
                    className="sr-only"
                    disabled={!isVIP}
                  />
                  <div
                    onClick={() => isVIP && setEnableVIPBadge(!enableVIPBadge)}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      enableVIPBadge && isVIP ? 'bg-green-500' : 'bg-gray-600'
                    } ${!isVIP ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                        enableVIPBadge && isVIP ? 'translate-x-6' : 'translate-x-1'
                      } mt-0.5`}
                    />
                  </div>
                  {!isVIP && <span className="text-xs text-yellow-400 ml-2">🔒 VIP</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Future Features */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <span>🚀</span>
              <span>ميزات قادمة</span>
            </h2>
            
            <div className="space-y-4">
              {/* Followers Feature */}
              <div className="flex items-center justify-between opacity-50">
                <div>
                  <label className="text-white font-medium">نظام المتابعين</label>
                  <p className="text-gray-300 text-sm">الحصول على متابعين والتفاعل معهم (قريبًا)</p>
                </div>
                <div className="relative">
                  <div className="w-12 h-6 rounded-full bg-gray-600 cursor-not-allowed">
                    <div className="w-5 h-5 bg-white rounded-full transition-transform transform translate-x-1 mt-0.5" />
                  </div>
                  <span className="text-xs text-gray-400 ml-2">🔜 قريبًا</span>
                </div>
              </div>

              {/* Content Filtering */}
              <div className="flex items-center justify-between opacity-50">
                <div>
                  <label className="text-white font-medium">فلترة المحتوى التلقائية</label>
                  <p className="text-gray-300 text-sm">تعتيم الفيديوهات المخلة تلقائيًا (قريبًا)</p>
                </div>
                <div className="relative">
                  <div className="w-12 h-6 rounded-full bg-gray-600 cursor-not-allowed">
                    <div className="w-5 h-5 bg-white rounded-full transition-transform transform translate-x-1 mt-0.5" />
                  </div>
                  <span className="text-xs text-gray-400 ml-2">🔜 قريبًا</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={saveSettings}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              💾 حفظ الإعدادات
            </button>
            
            {!isVIP && (
              <button
                onClick={goToVIP}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                👑 ترقية إلى VIP
              </button>
            )}
            
            <button
              onClick={resetSettings}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔄 إعادة تعيين
            </button>
          </div>

          {/* VIP Promotion Banner */}
          {!isVIP && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">🌟 اكتشف ميزات VIP الحصرية!</h3>
              <p className="text-white mb-4">
                احصل على الترجمة التلقائية، إخفاء الهوية، الرسائل التلقائية، والمزيد من الميزات المتقدمة
              </p>
              <button
                onClick={goToVIP}
                className="py-2 px-6 bg-white text-orange-500 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                👑 اشترك الآن في VIP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-8"></div>
    </div>
  );
}

