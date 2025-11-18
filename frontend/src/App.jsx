import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import LoadingAnimation from './components/LoadingAnimation';
import { getApiUrl } from './api';

function App() {
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
    <div className="App">
      {user ? (
        <Dashboard user={user} setUser={setUser} />
      ) : (
        <LoginScreen setUser={setUser} />
      )}
    </div>
  );
}

export default App;