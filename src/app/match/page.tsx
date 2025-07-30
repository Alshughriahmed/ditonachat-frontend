'use client';

import React, { useState, useRef, useEffect } from 'react';
// استيراد مكتبة Socket.IO
import { io, Socket } from 'socket.io-client';

// تعريف نوع لرسائل الدردشة لتحسين جودة الكود
type Message = {
  author: 'أنت' | 'غريب';
  text: string;
};

const MatchPage = () => {
  // Refs للوصول المباشر لعناصر الفيديو
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Ref للاحتفاظ باتصال السوكيت
  const socketRef = useRef<Socket | null>(null);

  // متغيرات الحالة لإدارة واجهة المستخدم
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isRemoteAudioMuted, setIsRemoteAudioMuted] = useState(false);
  
  // متغير حالة جديد لتتبع حالة الاتصال
  const [connectionStatus, setConnectionStatus] = useState('جاري الاتصال...');

  // متغيرات حالة للدردشة
  const [messages, setMessages] = useState<Message[]>([]); // نبدأ بمصفوفة رسائل فارغة
  const [chatInput, setChatInput] = useState('');

  // useEffect للوصول إلى كاميرا المستخدم
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("خطأ في الوصول إلى الكاميرا.", err);
        setConnectionStatus('خطأ في الكاميرا. الرجاء السماح بالوصول.');
      }
    };
    getMedia();
  }, []);

  // --- كود جديد: useEffect لاتصال Socket.IO ---
  useEffect(() => {
    // رابط الخادم الخلفي المنشور على Render.com
    const SOCKET_SERVER_URL = 'https://ditonachat-backend.onrender.com';

    // تهيئة اتصال السوكيت
    const socket = io(SOCKET_SERVER_URL);
    socketRef.current = socket;

    // --- الاستماع لأحداث الاتصال ---

    socket.on('connect', () => {
      console.log('تم الاتصال بالخادم بنجاح بالمعرف:', socket.id);
      setConnectionStatus('متصل! جاري البحث عن شريك...');
    });

    socket.on('connect_error', (err) => {
      console.error('خطأ في الاتصال:', err);
      setConnectionStatus('خطأ في الاتصال. لا يمكن الوصول للخادم.');
    });

    socket.on('disconnect', () => {
      console.log('تم قطع الاتصال بالخادم.');
      setConnectionStatus('تم قطع الاتصال.');
    });

    // --- تنظيف الاتصال عند مغادرة الصفحة ---
    return () => {
      socket.disconnect();
    };
  }, []); // المصفوفة الفارغة تضمن أن هذا الكود يعمل مرة واحدة فقط

  // --- سيتم إضافة جميع الدوال هنا لاحقًا ---

  return (
    // ... باقي كود الـ JSX لم يتغير ...
    <main className="relative w-full h-screen bg-black overflow-hidden">
      {/* ... */}
    </main>
  );
};

export default MatchPage;
