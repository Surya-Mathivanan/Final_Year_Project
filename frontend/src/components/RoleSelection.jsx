import React, { useState } from 'react';

function RoleSelection({ setCurrentView, setInterviewData }) {
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const roles = [
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'fullstack-developer', label: 'Full Stack Developer' },
    { value: 'data-scientist', label: 'Data Scientist' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer' },
    { value: 'devops-engineer', label: 'DevOps Engineer' },
    { value: 'mobile-developer', label: 'Mobile Developer' },
    { value: 'qa-engineer', label: 'QA Engineer' },
    { value: 'data-analyst', label: 'Data Analyst' }
  ];

  const handleStartInterview = () => {
    if (!role || !difficulty) {
      alert('Please select both role and difficulty level');
      return;
    }

    setInterviewData({
      mode: 'role',
      role: role,
      difficulty: difficulty,
      keywords: []
    });

    setCurrentView('interview-setup');
  };

  return (
    <div className="form-container">
      <h2 className="section-title">Select Interview Role</h2>
      
      <div className="form-group">
        <label className="form-label">Job Role</label>
        <select 
          className="form-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select a role...</option>
          {roles.map(roleOption => (
            <option key={roleOption.value} value={roleOption.value}>
              {roleOption.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label">Difficulty Level</label>
        <select 
          className="form-select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">Select difficulty...</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      
      <button 
        className="btn-primary" 
        onClick={handleStartInterview}
        disabled={!role || !difficulty}
      >
        Start Interview
      </button>
      
      <button 
        className="btn-secondary" 
        onClick={() => setCurrentView('mode-selection')}
      >
        Back to Mode Selection
      </button>
    </div>
  );
}

export default RoleSelection;