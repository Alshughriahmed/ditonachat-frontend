import './globals.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* خلفية + تراك */}
        <div
          className="bg-img"
          style={{ backgroundImage: "url('/neuefotoCover1.png')" }}
        />
        <div className="bg-overlay" />

        {/* الشعار أعلى اليسار */}
        <img src="/logo.png" alt="Logo" className="logo-fixed" />

        {/* زر اللغة أعلى اليمين */}
        <select defaultValue="en" className="lang-fixed">
          <option value="en">EN</option>
          <option value="de">DE</option>
          <option value="es">ES</option>
        </select>

        {children}
      </body>
    </html>
  );
}
