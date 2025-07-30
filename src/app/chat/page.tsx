'use client';

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function ChatPage() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState('🟡 Connecting…');

  useEffect(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'https://kkh7ikcl85ln.manus.space';
    const WS_PATH = process.env.NEXT_PUBLIC_WS_PATH || '/ws';

    socketRef.current = io(WS_URL, {
      path: WS_PATH,
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      setStatus(`🟢 Connected (id=${socketRef.current?.id})`);
    });

    socketRef.current.on('disconnect', () => {
      setStatus('🔴 Disconnected');
    });

    socketRef.current.on('connect_error', () => {
      setStatus('❌ Connect error');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    // تأكد من وجود getUserMedia قبل الاستدعاء
    if (!navigator.mediaDevices?.getUserMedia) {
      console.warn('getUserMedia غير مدعوم في هذا السياق');
      setStatus('⚠️ بث الفيديو غير مدعوم هنا');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('خطأ في الحصول على الميديا:', err);
        setStatus('❌ خطأ في الوصول إلى الكاميرا/الميكروفون');
      });
  }, []);

  const sendTest = () => {
    socketRef.current?.emit('send-message', 'Hello from button!');
  };

  return (
    <div style={{ background: '#111', color: '#fff', height: '100vh', padding: '2rem' }}>
      <h1>🎥 دردشة فيديو</h1>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '220px',
          height: '160px',
          borderRadius: '10px',
          border: '3px solid #00ff88',
          backgroundColor: '#000',
        }}
      />
      <p style={{ marginTop: '1rem' }}>{status}</p>
      <button
        onClick={sendTest}
        style={{
          marginTop: '2rem',
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#00cc88',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        🚀 Send Test Message
      </button>
    </div>
  );
}
