import React from 'react';
import { createRoot } from 'react-dom/client';

const RelativeOverlay: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'rgba(30, 34, 40, 0.6)',
      borderRadius: 16,
      boxShadow: '0 4px 24px 0 #0008',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      fontWeight: 600,
      border: '2px solid #00bfff44',
    }}>
      Overlay Relative<br/>
      (Ejemplo visual)
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<RelativeOverlay />);
} 