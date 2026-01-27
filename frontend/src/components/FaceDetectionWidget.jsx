import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../api';

const FaceDetectionWidget = () => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [faceDetected, setFaceDetected] = useState(true);
  const [toasts, setToasts] = useState([]);
  const imgRef = React.useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    
    // Poll face detection status every 2 seconds
    const statusInterval = setInterval(async () => {
      try {
        const response = await fetch(getApiUrl('/api/face-status'), {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          const detected = data.face_detected;
          setFaceDetected(detected);
          
          // Add toasts if face not detected
          if (!detected) {
            const timestamp = Date.now();
            
            // First toast: "Look at the camera"
            const toast1 = {
              id: `${timestamp}-1`,
              message: '📹 Look at the camera',
              icon: '📹'
            };
            
            // Second toast: "Don't move away from the camera"
            const toast2 = {
              id: `${timestamp}-2`,
              message: '🚫 Don\'t move away from the camera',
              icon: '🚫'
            };
            
            setToasts(prev => [...prev, toast1, toast2]);
            
            // Auto-remove toasts after 4 seconds
            setTimeout(() => {
              setToasts(prev => prev.filter(t => t.id !== toast1.id && t.id !== toast2.id));
            }, 4000);
          }
        }
      } catch (error) {
        console.error('Error checking face status:', error);
      }
    }, 2000); // Check every 2 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(statusInterval);
      // Stop video stream when component unmounts
      if (imgRef.current) {
        imgRef.current.src = '';
      }
    };
  }, []);

  return (
    <>
      {/* Toast Notifications - Bottom Left Corner */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '10px',
        maxWidth: '320px'
      }}>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              background: 'rgba(30, 30, 40, 0.95)',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              backdropFilter: 'blur(10px)',
              animation: 'slideInLeft 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '260px'
            }}
          >
            <span style={{
              fontSize: '18px',
              flexShrink: 0
            }}>
              {toast.icon}
            </span>
            <span style={{
              color: '#fff',
              fontSize: '13px',
              fontWeight: '500',
              flex: 1
            }}>
              {toast.message}
            </span>
            <div style={{
              width: '3px',
              height: '100%',
              background: 'linear-gradient(to bottom, rgba(220, 38, 38, 0.8), rgba(185, 28, 28, 0.8))',
              borderRadius: '2px',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0
            }} />
          </div>
        ))}
      </div>

      {/* Face Detection Widget - Bottom Right (Smaller Size) */}
      <div style={{
        position: 'fixed',
        // bottom: '0px',
        top: '100px',
        right: '20px',
        width: '220px',
        zIndex: 1000,
        background: 'rgba(20, 20, 30, 0.98)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '8px 12px',
          background: 'linear-gradient(135deg, rgba(100,50,200,0.3), rgba(50,100,200,0.3))',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          userSelect: 'none'
        }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 'bold', 
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '14px' }}>👤</span>
            Face Detection
          </span>
        </div>

        {/* Video Stream */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '165px', 
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
              fontSize: '11px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px', fontSize: '20px' }}>📷</div>
                Initializing...
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
              fontSize: '10px',
              textAlign: 'center',
              padding: '15px'
            }}>
              <div>
                <div style={{ marginBottom: '6px', fontSize: '20px' }}>⚠️</div>
                <div style={{ marginBottom: '6px' }}>Camera unavailable</div>
                <div style={{ fontSize: '9px', color: '#666' }}>
                  Check permissions
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div style={{
          padding: '6px 12px',
          background: 'rgba(0,0,0,0.3)',
          fontSize: '9px',
          color: '#888',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          {hasError ? 'Camera unavailable' : 'Live monitoring'}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default FaceDetectionWidget;

