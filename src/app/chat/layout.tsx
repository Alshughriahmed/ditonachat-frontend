'use client';
import React from 'react';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#000', height: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
