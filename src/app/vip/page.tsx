'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VIPPage() {
  const router = useRouter();
  
  // State management
  const [isVIP, setIsVIP] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [showPayment, setShowPayment] = useState(false);

  // VIP Plans
  const plans = [
    {
      id: 'weekly',
      name: 'أسبوعي',
      price: '9.99',
      currency: '$',
      duration: '7 أيام',
      popular: false,
      savings: null
    },
    {
      id: 'monthly',
      name: 'شهري',
      price: '19.99',
      currency: '$',
      duration: '30 يوم',
      popular: true,
      savings: '50%'
    },
    {
      id: 'yearly',
      name: 'سنوي',
      price: '99.99',
      currency: '$',
      duration: '365 يوم',
      popular: false,
      savings: '75%'
    }
  ];

  // VIP Features
  const vipFeatures = [
    {
      icon: '🔙',
      title: 'العودة للمستخدم السابق',
      description: 'إمكانية الرجوع للشخص الذي تحدثت معه سابقًا',
      category: 'navigation'
    },
    {
      icon: '🌍',
      title: 'الترجمة التلقائية',
      description: 'ترجمة الرسائل تلقائيًا إلى لغتك المفضلة',
      category: 'communication'
    },
    {
      icon: '🎭',
      title: 'إخفاء الهوية',
      description: 'إخفاء الجنس والموقع وعدد الإعجابات',
      category: 'privacy'
    },
    {
      icon: '💬',
      title: 'رسائل تعريف تلقائية',
      description: 'إرسال رسالة تعريف مخصصة عند كل اتصال جديد',
      category: 'communication'
    },
    {
      icon: '🏳️‍🌈',
      title: 'فلاتر متقدمة',
      description: 'البحث حسب التوجه الجنسي والاهتمامات المحددة',
      category: 'matching'
    },
    {
      icon: '👑',
      title: 'شارة VIP',
      description: 'عرض شارة VIP المميزة في ملفك الشخصي',
      category: 'status'
    },
    {
      icon: '🚫',
      title: 'بلا إعلانات',
      description: 'تجربة خالية من الإعلانات المزعجة',
      category: 'experience'
    },
    {
      icon: '⚡',
      title: 'أولوية في المطابقة',
      description: 'الحصول على أولوية في العثور على شركاء جدد',
      category: 'matching'
    },
    {
      icon: '📊',
      title: 'إحصائيات متقدمة',
      description: 'عرض إحصائيات مفصلة عن نشاطك ومحادثاتك',
      category: 'analytics'
    },
    {
      icon: '🔒',
      title: 'حماية متقدمة',
      description: 'أدوات حماية إضافية ومراقبة محسنة',
      category: 'security'
    }
  ];

  // Check VIP status on component mount
  useEffect(() => {
    const vipStatus = localStorage.getItem('isVIP');
    setIsVIP(vipStatus === 'true');
  }, []);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    setShowPayment(true);
  };

  const handlePayment = () => {
    // Mock payment process
    setTimeout(() => {
      localStorage.setItem('isVIP', 'true');
      localStorage.setItem('vipPlan', selectedPlan);
      localStorage.setItem('vipStartDate', new Date().toISOString());
      
      setIsVIP(true);
      setShowPayment(false);
      
      alert('🎉 تهانينا! تم تفعيل اشتراك VIP بنجاح!');
    }, 2000);
  };

  const goBack = () => {
    router.back();
  };

  const goToSettings = () => {
    router.push('/chat-settings');
  };

  const goToMatch = () => {
    router.push('/match');
  };

  if (isVIP) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 text-white">
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
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">👑</span>
                  </div>
                  <h1 className="text-xl font-bold">عضو VIP مميز</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-lg">👑</span>
                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">VIP</span>
              </div>
            </div>
          </div>
        </header>

        {/* VIP Dashboard */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👑</div>
              <h2 className="text-3xl font-bold mb-2">مرحبًا بك في نادي VIP!</h2>
              <p className="text-xl text-yellow-100">استمتع بجميع الميزات الحصرية والمتقدمة</p>
            </div>

            {/* Active Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {vipFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-yellow-100 text-sm">{feature.description}</p>
                  <div className="mt-3">
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">✅ مفعل</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={goToMatch}
                className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="text-2xl mb-2">🎥</div>
                <div className="font-bold">ابدأ المحادثة</div>
                <div className="text-sm text-purple-100">مع أولوية VIP</div>
              </button>
              
              <button
                onClick={goToSettings}
                className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-bold">إعدادات VIP</div>
                <div className="text-sm text-blue-100">تخصيص الميزات</div>
              </button>
              
              <button className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-bold">الإحصائيات</div>
                <div className="text-sm text-green-100">تقارير مفصلة</div>
              </button>
            </div>

            {/* Subscription Info */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold mb-4">معلومات الاشتراك</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">نشط</div>
                  <div className="text-sm text-yellow-100">حالة الاشتراك</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">شهري</div>
                  <div className="text-sm text-yellow-100">نوع الخطة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">29 يوم</div>
                  <div className="text-sm text-yellow-100">متبقي</div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button className="py-2 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors font-bold">
                  تجديد الاشتراك
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">👑</span>
                </div>
                <h1 className="text-xl font-bold">اشتراك VIP</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">تأكيد الدفع</h3>
            <div className="mb-4">
              <p className="text-gray-300">الخطة المختارة: <span className="text-yellow-400 font-bold">{plans.find(p => p.id === selectedPlan)?.name}</span></p>
              <p className="text-gray-300">السعر: <span className="text-green-400 font-bold">${plans.find(p => p.id === selectedPlan)?.price}</span></p>
            </div>
            
            <div className="flex space-x-4 rtl:space-x-reverse">
              <button
                onClick={handlePayment}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors font-bold"
              >
                💳 تأكيد الدفع
              </button>
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-3 px-6 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">👑</div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              ارتقِ إلى مستوى VIP
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              احصل على تجربة دردشة فيديو متميزة مع ميزات حصرية ومتقدمة
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                  selectedPlan === plan.id
                    ? 'border-yellow-400 bg-opacity-20 transform scale-105'
                    : 'border-white border-opacity-20 hover:bg-opacity-15'
                } ${plan.popular ? 'ring-2 ring-yellow-400' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                      الأكثر شعبية
                    </span>
                  </div>
                )}
                
                {plan.savings && (
                  <div className="absolute -top-3 -right-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      وفر {plan.savings}
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-1">
                    <span className="text-yellow-400">{plan.currency}{plan.price}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{plan.duration}</p>
                  
                  <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                    selectedPlan === plan.id
                      ? 'bg-yellow-400 border-yellow-400'
                      : 'border-gray-400'
                  }`}>
                    {selectedPlan === plan.id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-black text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          <div className="text-center mb-12">
            <button
              onClick={handleSubscribe}
              className="py-4 px-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 اشترك الآن في VIP
            </button>
            <p className="text-gray-400 text-sm mt-2">يمكنك الإلغاء في أي وقت</p>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">ميزات VIP الحصرية</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vipFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 mb-12">
            <h3 className="text-2xl font-bold text-center mb-6">مقارنة الميزات</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="py-3 px-4 text-right">الميزة</th>
                    <th className="py-3 px-4">مجاني</th>
                    <th className="py-3 px-4 text-yellow-400">VIP 👑</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 text-right">دردشة فيديو أساسية</td>
                    <td className="py-3 px-4">✅</td>
                    <td className="py-3 px-4">✅</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 text-right">العودة للمستخدم السابق</td>
                    <td className="py-3 px-4">❌</td>
                    <td className="py-3 px-4 text-yellow-400">✅</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 text-right">الترجمة التلقائية</td>
                    <td className="py-3 px-4">❌</td>
                    <td className="py-3 px-4 text-yellow-400">✅</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 text-right">إخفاء الهوية</td>
                    <td className="py-3 px-4">❌</td>
                    <td className="py-3 px-4 text-yellow-400">✅</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 text-right">بلا إعلانات</td>
                    <td className="py-3 px-4">❌</td>
                    <td className="py-3 px-4 text-yellow-400">✅</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-right">أولوية في المطابقة</td>
                    <td className="py-3 px-4">❌</td>
                    <td className="py-3 px-4 text-yellow-400">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">ماذا يقول أعضاء VIP؟</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">أ</span>
                  </div>
                  <div>
                    <div className="font-bold">أحمد</div>
                    <div className="text-yellow-400 text-sm">👑 عضو VIP</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  "الترجمة التلقائية غيرت تجربتي تمامًا! أصبحت أتحدث مع أشخاص من جميع أنحاء العالم بسهولة."
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">س</span>
                  </div>
                  <div>
                    <div className="font-bold">سارة</div>
                    <div className="text-yellow-400 text-sm">👑 عضو VIP</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  "ميزة العودة للمستخدم السابق رائعة! لم أعد أفقد الأشخاص المثيرين للاهتمام."
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">م</span>
                  </div>
                  <div>
                    <div className="font-bold">محمد</div>
                    <div className="text-yellow-400 text-sm">👑 عضو VIP</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  "أولوية المطابقة توفر علي الكثير من الوقت. أجد شركاء محادثة بسرعة أكبر!"
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
            <h3 className="text-2xl font-bold text-center mb-6">الأسئلة الشائعة</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">❓ هل يمكنني إلغاء الاشتراك في أي وقت؟</h4>
                <p className="text-gray-300 text-sm">نعم، يمكنك إلغاء اشتراكك في أي وقت من إعدادات الحساب.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">❓ هل ستفقد ميزات VIP فورًا بعد الإلغاء؟</h4>
                <p className="text-gray-300 text-sm">لا، ستستمر في الاستفادة من ميزات VIP حتى انتهاء فترة الاشتراك المدفوعة.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">❓ هل يمكنني تغيير خطة الاشتراك؟</h4>
                <p className="text-gray-300 text-sm">نعم، يمكنك الترقية أو التخفيض في أي وقت، وسيتم تعديل الفاتورة تلقائيًا.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-8"></div>
    </div>
  );
}

