import React from 'react';
import { API_BASE_URL } from '../api';

function LoginScreen({ setUser }) {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        {/* Left Panel - Login Form */}
        <div className="login-panel">
          <div className="login-content">
            <div className="brand-section">
              {/* <div className="brand-logo">
                <div className="logo-icon">
                  <div className="logo-line"></div>
                  <div className="logo-line"></div>
                  <div className="logo-line"></div>
                </div>
                <span className="brand-text">InterviewAI</span>
              </div> */}
            </div>

            <div className="welcome-section">
              <h1 className="welcome-title">
                LLM-Powered Cognitive Interview Assistant
              </h1>
            </div>

            <div className="value-prop">
              <div className="check-icon">✓</div>
              <span>It's free - no credit card needed</span>
            </div>

            <div className="login-options">
              <button className="google-login-btn" onClick={handleGoogleLogin}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="divider">
                <div className="divider-line"></div>
              </div>
            </div>

            <div className="privacy-section">
              <div className="privacy-check">✓</div>
              <span className="privacy-text">
                We respect your privacy and won't share your information with
                anyone. For details, see our{" "}
                <a href="#" className="privacy-link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="privacy-link">
                  Privacy Policy
                </a>
                .
              </span>
            </div>

            <div className="compliance-badges">
              <div className="badge">GDPR Compliant</div>
              <div className="badge">CPRA Compliant</div>
              <div className="badge">AICPA SOC2</div>
              <div className="badge">ISO 27001</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Image/Visual */}
        <div className="visual-panel">
          <div className="visual-content">
            <div className="trust-overlay">
              <div className="trust-header">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Trusted by Leading Companies</span>
              </div>
              <div className="trust-quote">
                "Trusted by fortune 50 companies and over 10 million candidates
                in 84 countries"
              </div>
            </div>

            <div className="partner-logos">
              <div className="logo-item">Meta</div>
              <div className="logo-item">Google</div>
              <div className="logo-item">Microsoft</div>
              <div className="logo-item">Amazon</div>
              <div className="logo-item">Tesla</div>
              <div className="logo-item">Adobe</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;

