import './globals.css'; // تأكد أن المسار صحيح

import React from 'react'; // React is needed for JSX

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl"> {/* Keep Arabic language and RTL */}
      <body>
        {/* Background Image */}
        <div className="bg-img" style={{ backgroundImage: "url('/neuefotoCover1.png')" }} />
        {/* Background Overlay */}
        <div className="bg-overlay" />
        {/* Fixed Logo */}
        <img src="/logo.png" alt="Logo" className="logo-fixed" />
        {/* Fixed Language Selector */}
        <select defaultValue="ar" className="lang-fixed">
          <option value="en">EN</option>
          <option value="ar">AR</option> {/* Added Arabic option */}
          <option value="de">DE</option>
          <option value="es">ES</option>
        </select>
        {children}
      </body>
    </html>
  );
}
