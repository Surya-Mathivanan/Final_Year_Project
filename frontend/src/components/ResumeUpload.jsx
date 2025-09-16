import React, { useState } from 'react';

function ResumeUpload({ setCurrentView, setInterviewData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [difficulty, setDifficulty] = useState('');
  const [uploading, setUploading] = useState(false);
  const [keywords, setKeywords] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !difficulty) {
      alert('Please select a file and difficulty level');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setKeywords(result.keywords);
        
        // Set interview data and proceed to interview
        setInterviewData({
          mode: 'resume',
          difficulty: difficulty,
          keywords: result.keywords,
          filename: result.filename
        });
        
        setCurrentView('interview-setup');
      } else {
        const error = await response.json();
        alert(error.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="section-title">Upload Your Resume</h2>
      
      <div className="form-group">
        <label className="form-label">Upload PDF Resume</label>
        <div 
          className="file-upload"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('resume-upload').click()}
        >
          <input
            type="file"
            id="resume-upload"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div className="file-upload-text">
            {selectedFile ? (
              <span>✓ {selectedFile.name}</span>
            ) : (
              <span>Click to upload your PDF resume or drag and drop</span>
            )}
          </div>
        </div>
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

      {keywords.length > 0 && (
        <div className="form-group">
          <label className="form-label">Extracted Keywords</label>
          <div className="keywords-display">
            {keywords.map((keyword, index) => (
              <span key={index} className="keyword-tag">{keyword}</span>
            ))}
          </div>
        </div>
      )}

      <button 
        className="btn-primary" 
        onClick={handleUpload}
        disabled={!selectedFile || !difficulty || uploading}
      >
        {uploading ? 'Processing...' : 'Process Resume & Start Interview'}
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

export default ResumeUpload;