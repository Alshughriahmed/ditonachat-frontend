'use client';

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function ChatPage() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState('🟡 Connecting…');

  useEffect(() => {
    socketRef.current = io('https://kkh7ikcl85ln.manus.space', {
      path: '/ws',
      transports: ['websocket'],
      reconnection: true,
    });

    (window as any).socket = socketRef.current;

    socketRef.current.on('connect', () => {
      setStatus(`🟢 Connected (id=${socketRef.current?.id})`);
    });

    socketRef.current.on('disconnect', reason => {
      setStatus('🔴 Disconnected');
    });

    socketRef.current.on('connect_error', err => {
      setStatus('❌ Connect error');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      });
  }, []);

  const sendTest = () => {
    socketRef.current?.emit('send-message', 'Hello from button!');
  };

  return (
    <div style={{ background: '#111', color: '#fff', height: '100vh', padding: '2rem', position: 'relative' }}>
      <h1>🎥 دردشة فيديو</h1>
      <video ref={localVideoRef} autoPlay muted playsInline style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '220px',
        height: '160px',
        borderRadius: '10px',
        border: '3px solid #00ff88',
        backgroundColor: '#000',
      }} />
      <p style={{ marginTop: '1rem' }}>{status}</p>
      <button onClick={sendTest} style={{
        marginTop: '2rem',
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#00cc88',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        🚀 Send Test Message
      </button>
    </div>
  );
}

