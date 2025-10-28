export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#667eea,#764ba2)',
      color: 'white',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
        <h2 style={{ fontSize: '32px', marginTop: '20px' }}>Page Not Found</h2>
        <p style={{ marginTop: '20px', opacity: 0.9 }}>
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '30px',
            padding: '12px 24px',
            background: 'white',
            color: '#667eea',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
