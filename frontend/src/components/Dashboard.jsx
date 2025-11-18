import React, { useState } from 'react';
import ResumeUpload from './ResumeUpload';
import RoleSelection from './RoleSelection';
import InterviewSession from './InterviewSession';
import FeedbackDashboard from './FeedbackDashboard';
import { getApiUrl } from '../api';

function Dashboard({ user, setUser }) {
  const [currentView, setCurrentView] = useState('mode-selection');
  const [interviewData, setInterviewData] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);

  const handleLogout = async () => {
    try {
      const response = await fetch(getApiUrl('/api/logout'), {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'mode-selection':
        return (
          <div className="dashboard-main">
            <div className="page-header">
              <h1 className="page-title">Welcome back, {user?.username || 'User'}!</h1>
              <p className="page-subtitle">Choose how you'd like to prepare for your interview</p>
            </div>

            <div className="mode-selection">
              <div className="mode-card" onClick={() => setCurrentView('resume-upload')}>
                <div className="mode-icon">📄</div>
                <h3>Resume-Based Interview</h3>
                <p>Upload your resume for personalized questions based on your experience</p>
                <button className="btn btn-primary">Get Started</button>
              </div>

              <div className="mode-card" onClick={() => setCurrentView('role-selection')}>
                <div className="mode-icon">🎯</div>
                <h3>Role-Based Interview</h3>
                <p>Select a specific role and difficulty level for targeted practice</p>
                <button className="btn btn-primary">Choose Role</button>
              </div>
            </div>
          </div>
        );

      case 'resume-upload':
        return <ResumeUpload setCurrentView={setCurrentView} setInterviewData={setInterviewData} />;

      case 'role-selection':
        return <RoleSelection setCurrentView={setCurrentView} setInterviewData={setInterviewData} />;

      case 'interview-setup':
        return <InterviewSession interviewData={interviewData} setCurrentView={setCurrentView} setFeedbackData={setFeedbackData} />;

      case 'feedback':
        return <FeedbackDashboard feedbackData={feedbackData} setCurrentView={setCurrentView} />;

      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="app-title">Interview Assistant</h1>
          <button className="logout-button" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default Dashboard;