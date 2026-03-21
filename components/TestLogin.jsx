import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export const TestLogin = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>Wellness Tracker - Test Login</h1>
      <p>If you can see this page, the app is rendering correctly!</p>
      <button 
        onClick={() => navigate('/')}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Go to Dashboard (This will redirect to login)
      </button>
      <button 
        onClick={() => window.location.reload()}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Reload Page
      </button>
    </div>
  );
};
