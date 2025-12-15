"""
Face Detection Module using OpenCV
Provides video streaming with real-time face detection
"""
import cv2
import threading
import time

class FaceDetector:
    def __init__(self):
        # Load Haar Cascade classifier for face detection
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        self.camera = None
        self.lock = threading.Lock()
        self.last_frame = None
        self.face_detected = False
        
    def initialize_camera(self):
        """Initialize the camera if not already initialized"""
        if self.camera is None or not self.camera.isOpened():
            self.camera = cv2.VideoCapture(0)
            if not self.camera.isOpened():
                raise RuntimeError("Could not open camera")
            # Set camera properties for better performance
            self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            self.camera.set(cv2.CAP_PROP_FPS, 30)
    
    def detect_faces(self, frame):
        """
        Detect faces in a frame and draw rectangles
        Returns: processed frame and face detection status
        """
        # Convert to grayscale for detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )
        
        face_detected = len(faces) > 0
        
        # Draw rectangles and labels
        for (x, y, w, h) in faces:
            # Green rectangle for detected face
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 3)
            cv2.putText(frame, 'Face Detected', (x, y - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # If no face detected, show warning
        if not face_detected:
            h, w = frame.shape[:2]
            cv2.putText(frame, 'NO FACE DETECTED', (w//2 - 150, h//2),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
            # Red border
            cv2.rectangle(frame, (5, 5), (w-5, h-5), (0, 0, 255), 5)
        
        return frame, face_detected
    
    def get_frame(self):
        """
        Get a single frame with face detection
        Returns: JPEG encoded frame bytes
        """
        try:
            self.initialize_camera()
            
            with self.lock:
                ret, frame = self.camera.read()
                
                if not ret:
                    return None, False
                
                # Flip frame horizontally for mirror effect
                frame = cv2.flip(frame, 1)
                
                # Detect faces and draw rectangles
                frame, face_detected = self.detect_faces(frame)
                
                # Encode frame as JPEG
                ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                
                if not ret:
                    return None, False
                
                self.last_frame = buffer.tobytes()
                self.face_detected = face_detected
                
                return self.last_frame, self.face_detected
                
        except Exception as e:
            print(f"Error getting frame: {e}")
            return None, False
    
    def generate_frames(self):
        """
        Generator function for video streaming
        Yields JPEG frames in multipart format
        """
        while True:
            frame_data, face_detected = self.get_frame()
            
            if frame_data is None:
                time.sleep(0.1)
                continue
            
            # Yield frame in multipart format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')
            
            # Control frame rate (~20 FPS)
            time.sleep(0.05)
    
    def release(self):
        """Release camera resources"""
        if self.camera is not None:
            self.camera.release()
            self.camera = None

# Global detector instance
detector = FaceDetector()
