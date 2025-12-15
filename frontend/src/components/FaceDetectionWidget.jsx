import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../api';

const FaceDetectionWidget = () => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = React.useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => {
      clearTimeout(timer);
      // Stop video stream when component unmounts
      if (imgRef.current) {
        imgRef.current.src = '';
      }
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      width: '280px',
      zIndex: 1000,
      background: 'rgba(20, 20, 30, 0.98)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        background: 'linear-gradient(135deg, rgba(100,50,200,0.3), rgba(50,100,200,0.3))',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        userSelect: 'none'
      }}>
        <span style={{ 
          fontSize: '13px', 
          fontWeight: 'bold', 
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>👤</span>
          Face Detection Monitor
        </span>
      </div>

      {/* Video Stream */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '210px', 
        background: '#000',
        overflow: 'hidden'
      }}>
        {isLoading && !hasError && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '13px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '8px', fontSize: '24px' }}>📷</div>
              Initializing camera...
            </div>
          </div>
        )}
        
        {!hasError && (
          <img
            ref={imgRef}
            src={getApiUrl('/api/video-feed')}
            alt="Face Detection Stream"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: isLoading ? 'none' : 'block'
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        )}

        {hasError && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '12px',
            textAlign: 'center',
            padding: '20px'
          }}>
            <div>
              <div style={{ marginBottom: '8px', fontSize: '24px' }}>⚠️</div>
              <div style={{ marginBottom: '8px' }}>Camera not available</div>
              <div style={{ fontSize: '10px', color: '#666' }}>
                Please check camera permissions
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div style={{
        padding: '8px 14px',
        background: 'rgba(0,0,0,0.3)',
        fontSize: '11px',
        color: '#888',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        {hasError ? 'Camera unavailable' : 'Live face detection'}
      </div>
    </div>
  );
};

export default FaceDetectionWidget;
