import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import AboutTeam from './components/AboutTeam';
import PrivacyPolicy from './components/PrivacyPolicy';
import LoadingAnimation from './components/LoadingAnimation';
import { getApiUrl } from './api';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    fetch(getApiUrl('/api/user-info'), {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Not logged in');
    })
    .then(userData => {
      setUser(userData);
    })
    .catch(error => {
      console.log('User not logged in');
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingAnimation message="Initializing application..." size="large" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/about" element={<AboutTeam />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route 
        path="/" 
        element={
          user ? (
            <Dashboard user={user} setUser={setUser} />
          ) : (
            <LoginScreen setUser={setUser} />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;