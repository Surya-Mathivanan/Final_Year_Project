import React from 'react';

function FeedbackDashboard({ feedbackData, setCurrentView }) {
  if (!feedbackData) {
    return (
      <div className="feedback-container">
        <div className="section-title">No feedback data available</div>
        <button className="btn-secondary" onClick={() => setCurrentView('mode-selection')}>
          Start New Interview
        </button>
      </div>
    );
  }

  const {
    overall_score = 0,
    category_scores = {},
    strengths = [],
    improvements = [],
    detailed_feedback = ''
  } = feedbackData;

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Your Interview Performance</h2>
      
      <div className="score-overview">
        <div className="score-card">
          <div className="score-label">Overall Performance</div>
          <div className="score-value">{overall_score}%</div>
        </div>
        
        <div className="score-card">
          <div className="score-label">Behavioral Skills</div>
          <div className="score-value">{category_scores.hr_performance || 0}%</div>
        </div>
        
        <div className="score-card">
          <div className="score-label">Technical Expertise</div>
          <div className="score-value">{category_scores.technical_performance || 0}%</div>
        </div>
        
        <div className="score-card">
          <div className="score-label">Culture Alignment</div>
          <div className="score-value">{category_scores.cultural_fit || 0}%</div>
        </div>
      </div>

      <div className="feedback-section">
        <h3 className="feedback-section-title">
          <span>🌟</span>
          What You Excelled At
        </h3>
        <ul className="feedback-list">
          {strengths.length > 0 ? (
            strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))
          ) : (
            <li>No specific strengths identified in this session</li>
          )}
        </ul>
      </div>

      <div className="feedback-section">
        <h3 className="feedback-section-title">
          <span>🎯</span>
          Growth Opportunities
        </h3>
        <ul className="feedback-list">
          {improvements.length > 0 ? (
            improvements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))
          ) : (
            <li>Keep up the excellent work!</li>
          )}
        </ul>
      </div>

      <div className="feedback-section">
        <h3 className="feedback-section-title">
          <span>📝</span>
          Detailed Analysis
        </h3>
        <p>{detailed_feedback || 'Great job completing the interview! Keep practicing to improve your skills.'}</p>
      </div>

      <div className="feedback-actions">
        <button 
          className="btn-primary" 
          onClick={() => setCurrentView('mode-selection')}
        >
          Take Another Interview
        </button>
        
        <button 
          className="btn-secondary" 
          onClick={() => window.print()}
        >
          Save Results
        </button>
      </div>
    </div>
  );
}

export default FeedbackDashboard;