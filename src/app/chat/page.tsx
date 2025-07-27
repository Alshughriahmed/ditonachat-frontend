'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState('🚀 Loading...');

  useEffect(() => {
    setStatus('🟢 Chat component loaded');

    // Example only: Just get camera feed
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    });
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative', background: '#111', color: '#fff' }}>
      <h1 style={{ textAlign: 'center', padding: '10px' }}>تشغيل في وضع صورة داخل صورة</h1>
      <video ref={localVideoRef} autoPlay muted playsInline style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: '200px',
        height: '150px',
        borderRadius: '10px',
        backgroundColor: '#000',
        border: '2px solid #fff',
      }} />
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <img src="/logo.png" alt="Logo" style={{ width: '60px' }} />
      </div>
      <p style={{ position: 'absolute', bottom: 10, left: 10 }}>{status}</p>
    </div>
  );
}

