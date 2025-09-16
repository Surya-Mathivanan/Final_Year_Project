import React from 'react';
import './LoadingAnimation.css';

function LoadingAnimation({ message = "Loading...", size = "medium" }) {
  return (
    <div className={`loading-animation ${size}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <div className="loading-message">{message}</div>
    </div>
  );
}

export default LoadingAnimation;