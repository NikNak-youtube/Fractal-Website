'use client';

export default function Error({ error, reset }) {
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
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Something went wrong!</h2>
        <p style={{ marginBottom: '20px', opacity: 0.9 }}>{error.message}</p>
        <button
          onClick={() => reset()}
          style={{
            padding: '12px 24px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
