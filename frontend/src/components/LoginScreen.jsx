import React from 'react';
import { API_BASE_URL } from '../api';

function LoginScreen({ setUser }) {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/google_login`;
  };

  return (
    <div className="login-container">
      <h1 className="app-title">LLM-Powered Cognitive Interview Assistant</h1>
      <p className="app-subtitle">
        Practice and experience HR and technical interviews with AI assistance
      </p>
      <button className="google-login-btn" onClick={handleGoogleLogin}>
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"/>
          <path fill="#FBBC05" d="M4.5 10.49a4.8 4.8 0 0 1 0-3.07V5.35H1.83a8 8 0 0 0 0 7.28l2.67-2.14z"/>
          <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.54A8 8 0 0 0 1.83 5.35L4.5 7.42a4.77 4.77 0 0 1 4.48-3.84z"/>
        </svg>
        Continue with Google
      </button>
    </div>
  );
}

export default LoginScreen;