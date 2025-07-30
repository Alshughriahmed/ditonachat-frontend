// لا تضع هنا <html> أو <body> لأنّهما معرّفان في الـ Root Layout  
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: '#000',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
