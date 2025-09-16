import React, { useState } from 'react';
import ResumeUpload from './ResumeUpload';
import RoleSelection from './RoleSelection';
import InterviewSession from './InterviewSession';
import FeedbackDashboard from './FeedbackDashboard';

function Dashboard({ user, setUser }) {
  const [currentView, setCurrentView] = useState('mode-selection');
  const [interviewData, setInterviewData] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);

  const handleLogout = () => {
    fetch('/logout', {
      credentials: 'include'
    }).then(() => {
      setUser(null);
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'mode-selection':
        return (
          <div className="mode-selection">
            <h2 className="section-title">Choose Interview Mode</h2>
            <div className="mode-buttons">
              <button 
                className="mode-btn"
                onClick={() => setCurrentView('resume-upload')}
              >
                Resume-Based Interview
                <br />
                <small>Upload your resume for personalized questions</small>
              </button>
              <button 
                className="mode-btn"
                onClick={() => setCurrentView('role-selection')}
              >
                Role-Based Interview
                <br />
                <small>Select a specific job role for targeted questions</small>
              </button>
            </div>
          </div>
        );
      
      case 'resume-upload':
        return (
          <ResumeUpload 
            setCurrentView={setCurrentView} 
            setInterviewData={setInterviewData}
          />
        );
      
      case 'role-selection':
        return (
          <RoleSelection 
            setCurrentView={setCurrentView} 
            setInterviewData={setInterviewData}
          />
        );
      
      case 'interview-setup':
      case 'interview-session':
        return (
          <InterviewSession 
            interviewData={interviewData}
            setCurrentView={setCurrentView}
            setFeedbackData={setFeedbackData}
          />
        );
      
      case 'feedback':
        return (
          <FeedbackDashboard 
            feedbackData={feedbackData}
            setCurrentView={setCurrentView}
          />
        );
      
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-text">Welcome, {user.username}!</div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {renderCurrentView()}
    </div>
  );
}

export default Dashboard;