# Live Recording and Real-Time Transcription Implementation

## Document Overview
This document provides a comprehensive technical explanation of the **live voice recording** and **real-time speech-to-text transcription** feature implemented in the Interview Session page of the LLM-Powered Cognitive Interview Assistant application.

---

## Table of Contents
1. [Feature Overview](#feature-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Design](#architecture--design)
4. [Implementation Details](#implementation-details)
5. [Code Walkthrough](#code-walkthrough)
6. [User Experience Flow](#user-experience-flow)
7. [Browser Compatibility](#browser-compatibility)
8. [Error Handling](#error-handling)
9. [Future Enhancements](#future-enhancements)

---

## Feature Overview

### Purpose
The live recording feature enables candidates to provide interview answers using voice input instead of typing. The system captures spoken words and converts them to text in real-time, displaying the transcription directly in the answer textarea.

### Key Capabilities
- **Real-time transcription**: Speech is converted to text as the user speaks
- **Continuous recording**: Automatically restarts when the browser's speech recognition session ends
- **Seamless integration**: Transcribed text appears in the same textarea used for typed answers
- **Append functionality**: New recordings append to existing text rather than replacing it
- **Visual feedback**: Recording status is clearly indicated with UI changes

---

## Technology Stack

### Frontend Technologies
- **React.js**: Component-based UI framework
- **Web Speech API**: Browser-native speech recognition
  - `SpeechRecognition` (Standard)
  - `webkitSpeechRecognition` (Chrome/Edge/Safari)

### Browser APIs Used
```javascript
window.SpeechRecognition || window.webkitSpeechRecognition
```

### No Backend Processing
The speech-to-text conversion happens entirely in the browser using the Web Speech API. No audio data is sent to the backend for transcription.

---

## Architecture & Design

### Component Structure
```
InterviewSession.jsx
├── State Management
│   ├── isRecording (boolean)
│   ├── speechSupported (boolean)
│   ├── currentAnswer (string)
│   └── answers (array)
├── Refs
│   ├── recognitionRef (SpeechRecognition instance)
│   ├── baseAnswerRef (previous text)
│   ├── isRecordingRef (recording state)
│   └── latestAnswerRef (current answer)
└── UI Components
    ├── Answer Textarea
    ├── Voice Controls (Record/Stop button)
    └── Visual Recording Indicator
```

### Data Flow Diagram
```
User clicks "Start Recording"
    ↓
Initialize SpeechRecognition
    ↓
Capture audio from microphone
    ↓
Browser converts speech to text (Web Speech API)
    ↓
onresult event fires with transcript
    ↓
Combine base text + new transcript
    ↓
Update textarea in real-time
    ↓
User clicks "Stop Recording"
    ↓
Save final transcript to state
```

---

## Implementation Details

### 1. Feature Detection and Initialization

#### Browser Support Check
```javascript
useEffect(() => {
  // Check for speech recognition support
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    setSpeechSupported(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configuration
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    
    // Event handlers setup...
  }
}, []);
```

**Key Configuration:**
- `continuous: true` - Keeps listening even after pauses
- `interimResults: true` - Shows partial results as user speaks

### 2. State Management Strategy

#### Multiple State Variables
```javascript
const [isRecording, setIsRecording] = useState(false);           // UI state
const [speechSupported, setSpeechSupported] = useState(false);   // Feature availability
const [currentAnswer, setCurrentAnswer] = useState('');          // Current text

const recognitionRef = useRef(null);           // SpeechRecognition instance
const baseAnswerRef = useRef('');              // Previously saved text
const isRecordingRef = useRef(false);          // Persistent recording state
const latestAnswerRef = useRef(currentAnswer); // Latest answer for restart
```

**Why Multiple Refs?**
- `recognitionRef`: Persists across re-renders
- `baseAnswerRef`: Stores text before recording starts
- `isRecordingRef`: Tracks recording state in async callbacks
- `latestAnswerRef`: Ensures latest text is available in `onend` handler

#### Synchronization Pattern
```javascript
useEffect(() => {
  latestAnswerRef.current = currentAnswer;
}, [currentAnswer]);
```
This ensures the ref always has the latest answer value for use in callbacks.

### 3. Real-Time Transcription Logic

#### Result Processing
```javascript
recognitionRef.current.onresult = (event) => {
  // Accumulate all results from this recording session
  let fullTranscriptSinceStart = '';
  for (let i = 0; i < event.results.length; i++) {
    fullTranscriptSinceStart += event.results[i][0].transcript;
  }

  // Combine previous text + new transcript
  const newTotalAccount = baseAnswerRef.current + 
    (baseAnswerRef.current && fullTranscriptSinceStart ? ' ' : '') + 
    fullTranscriptSinceStart;
  
  setCurrentAnswer(newTotalAccount);
};
```

**How It Works:**
1. `event.results` contains all speech segments recognized so far
2. Loop through all results to build complete transcript
3. Combine with `baseAnswerRef` (text before recording started)
4. Add space between old and new text if both exist
5. Update state to display in textarea

### 4. Continuous Recording Implementation

#### Auto-Restart on Session End
```javascript
recognitionRef.current.onend = () => {
  if (isRecordingRef.current) {
    // User still wants to record, restart the session
    baseAnswerRef.current = latestAnswerRef.current;
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Failed to restart speech recognition", e);
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  } else {
    setIsRecording(false);
  }
};
```

**Why Auto-Restart?**
- Browser speech recognition has time limits (typically 60 seconds)
- Auto-restart provides seamless continuous recording
- `baseAnswerRef` is updated to preserve all previous text

### 5. Recording Control Functions

#### Start Recording
```javascript
const startRecording = () => {
  if (recognitionRef.current && speechSupported) {
    baseAnswerRef.current = currentAnswer;  // Save current text
    isRecordingRef.current = true;          // Set recording flag
    setIsRecording(true);                   // Update UI
    try {
      recognitionRef.current.start();       // Start listening
    } catch (e) {
      console.error("Error starting speech recognition:", e);
    }
  }
};
```

#### Stop Recording
```javascript
const stopRecording = () => {
  if (recognitionRef.current && isRecording) {
    isRecordingRef.current = false;  // Signal intent to stop
    setIsRecording(false);           // Update UI
    recognitionRef.current.stop();   // Stop listening
  }
};
```

### 6. Error Handling

```javascript
recognitionRef.current.onerror = (event) => {
  console.warn("Speech recognition error", event.error);
  
  if (event.error === 'not-allowed') {
    // Microphone permission denied
    setIsRecording(false);
    isRecordingRef.current = false;
  }
};
```

**Common Error Types:**
- `not-allowed`: Microphone permission denied
- `no-speech`: No speech detected
- `network`: Network error (for cloud-based recognition)
- `aborted`: Recognition aborted

---

## Code Walkthrough

### Complete Feature Implementation

#### File: `frontend/src/components/InterviewSession.jsx`

**1. Import Dependencies**
```javascript
import React, { useState, useEffect, useRef } from 'react';
```

**2. State Initialization (Lines 13-18)**
```javascript
const [isRecording, setIsRecording] = useState(false);
const [speechSupported, setSpeechSupported] = useState(false);
const recognitionRef = useRef(null);
const baseAnswerRef = useRef('');
const isRecordingRef = useRef(false);
const latestAnswerRef = useRef(currentAnswer);
```

**3. Synchronization Effect (Lines 20-22)**
```javascript
useEffect(() => {
  latestAnswerRef.current = currentAnswer;
}, [currentAnswer]);
```

**4. Speech Recognition Setup (Lines 24-71)**
- Feature detection
- Instance creation
- Event handler configuration
- Error handling setup

**5. Recording Controls (Lines 179-198)**
- `startRecording()` function
- `stopRecording()` function

**6. UI Components (Lines 257-291)**
```javascript
<textarea
  className="answer-textarea"
  value={currentAnswer}
  onChange={(e) => setCurrentAnswer(e.target.value)}
  placeholder="Share your thoughts here..."
/>

{speechSupported && (
  <div className="voice-controls">
    <button
      className={`record-button ${isRecording ? 'recording' : ''}`}
      onClick={isRecording ? stopRecording : startRecording}
    >
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  </div>
)}
```

---

## User Experience Flow

### Step-by-Step User Journey

#### 1. **Initial State**
- User sees the interview question
- Empty textarea for answer
- "Start Recording" button visible (if browser supports it)

#### 2. **Permission Request**
- User clicks "Start Recording"
- Browser prompts for microphone permission (first time only)
- User grants permission

#### 3. **Active Recording**
- Button changes to "Stop Recording" with visual indicator
- User speaks their answer
- Text appears in real-time in the textarea
- User can see their words being transcribed live

#### 4. **Continuous Recording**
- If browser session ends (after ~60 seconds), recording automatically restarts
- No interruption in user experience
- All previous text is preserved

#### 5. **Stop Recording**
- User clicks "Stop Recording"
- Final transcript is saved in textarea
- User can edit the transcribed text if needed

#### 6. **Submit Answer**
- User clicks "Next Question" or "Complete Interview"
- Transcribed answer is submitted to backend
- Same flow as typed answers

### Visual Feedback

**Recording Button States:**
```css
/* Normal state */
.record-button {
  /* Default styling */
}

/* Recording state */
.record-button.recording {
  /* Visual indicator (e.g., red color, pulsing animation) */
}
```

---

## Browser Compatibility

### Supported Browsers

| Browser | Support | API Used |
|---------|---------|----------|
| Chrome | ✅ Full | `webkitSpeechRecognition` |
| Edge | ✅ Full | `webkitSpeechRecognition` |
| Safari | ✅ Full | `webkitSpeechRecognition` |
| Firefox | ❌ No | Not supported |
| Opera | ✅ Full | `webkitSpeechRecognition` |

### Feature Detection
```javascript
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  // Feature is available
  setSpeechSupported(true);
} else {
  // Feature not available - hide recording button
  setSpeechSupported(false);
}
```

### Graceful Degradation
- If speech recognition is not supported, the recording button is hidden
- Users can still type their answers
- No functionality is lost for unsupported browsers

---

## Error Handling

### Permission Errors

**Scenario:** User denies microphone permission

**Handling:**
```javascript
if (event.error === 'not-allowed') {
  setIsRecording(false);
  isRecordingRef.current = false;
  // Could show user-friendly message
}
```

**User Experience:**
- Recording stops immediately
- Button returns to "Start Recording" state
- User can try again and grant permission

### Network Errors

**Scenario:** Internet connection lost during recognition

**Handling:**
```javascript
recognitionRef.current.onerror = (event) => {
  console.warn("Speech recognition error", event.error);
  // Log error for debugging
};
```

### Restart Failures

**Scenario:** Auto-restart fails

**Handling:**
```javascript
try {
  recognitionRef.current.start();
} catch (e) {
  console.error("Failed to restart speech recognition", e);
  setIsRecording(false);
  isRecordingRef.current = false;
}
```

**User Experience:**
- Recording stops gracefully
- Existing transcript is preserved
- User can manually restart if needed

---

## Technical Challenges & Solutions

### Challenge 1: Session Timeout
**Problem:** Browser speech recognition stops after ~60 seconds

**Solution:** Auto-restart mechanism
```javascript
recognitionRef.current.onend = () => {
  if (isRecordingRef.current) {
    baseAnswerRef.current = latestAnswerRef.current;
    recognitionRef.current.start();
  }
};
```

### Challenge 2: Text Preservation
**Problem:** New recording sessions would overwrite previous text

**Solution:** Base answer reference
```javascript
const startRecording = () => {
  baseAnswerRef.current = currentAnswer;  // Save existing text
  // New transcript will be appended to this base
};
```

### Challenge 3: State Synchronization
**Problem:** React state not available in async callbacks

**Solution:** Ref synchronization
```javascript
useEffect(() => {
  latestAnswerRef.current = currentAnswer;
}, [currentAnswer]);
```

### Challenge 4: Interim Results
**Problem:** Partial results being lost

**Solution:** Accumulate all results
```javascript
let fullTranscriptSinceStart = '';
for (let i = 0; i < event.results.length; i++) {
  fullTranscriptSinceStart += event.results[i][0].transcript;
}
```

---

## Integration with Interview Flow

### Answer Submission
The transcribed text is treated exactly like typed text:

```javascript
const handleAnswerSubmit = async () => {
  if (!currentAnswer.trim()) {
    alert('Please provide an answer before continuing');
    return;
  }

  await fetch(getApiUrl('/api/submit-answer'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      session_id: sessionId,
      question_index: currentQuestionIndex,
      answer: currentAnswer  // Same field for typed or transcribed
    })
  });
};
```

### Navigation Between Questions
When navigating to previous questions, the transcribed answer is preserved:

```javascript
const goToPreviousQuestion = () => {
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setCurrentAnswer(answers[currentQuestionIndex - 1] || '');
  }
};
```

---

## Future Enhancements

### Potential Improvements

1. **Language Selection**
   ```javascript
   recognitionRef.current.lang = 'en-US'; // or user-selected language
   ```

2. **Confidence Scores**
   ```javascript
   const confidence = event.results[i][0].confidence;
   // Display low-confidence words differently
   ```

3. **Punctuation Commands**
   - Voice commands for "period", "comma", "new line"
   - Post-processing to add punctuation

4. **Audio Recording**
   - Save actual audio alongside transcript
   - Allow playback for verification

5. **Offline Support**
   - Implement local speech recognition models
   - Fallback when internet is unavailable

6. **Speaker Diarization**
   - Detect multiple speakers (for panel interviews)
   - Label different speakers in transcript

7. **Custom Vocabulary**
   - Add technical terms specific to job role
   - Improve accuracy for domain-specific language

---

## Performance Considerations

### Memory Usage
- Speech recognition runs in browser
- Minimal memory footprint
- No audio buffering required

### Network Usage
- Web Speech API may use cloud services (browser-dependent)
- Minimal data transfer (only recognition results, not audio)

### CPU Usage
- Browser handles speech processing
- No significant CPU impact on React app

---

## Security & Privacy

### Data Handling
- **No server-side audio processing**: All speech recognition happens in the browser
- **No audio storage**: Audio is not saved, only the transcript
- **User consent**: Browser prompts for microphone permission
- **HTTPS required**: Web Speech API requires secure context

### Privacy Considerations
- Microphone access is session-based
- Permission can be revoked at any time
- No persistent audio recording

---

## Testing Recommendations

### Manual Testing Checklist
- [ ] Test in Chrome, Edge, Safari
- [ ] Verify microphone permission prompt
- [ ] Test with different accents
- [ ] Test continuous recording (>60 seconds)
- [ ] Test stop/start multiple times
- [ ] Test with existing text in textarea
- [ ] Test navigation between questions
- [ ] Test final submission with transcribed text

### Edge Cases
- [ ] Microphone permission denied
- [ ] No microphone available
- [ ] Network disconnection during recording
- [ ] Very long answers (>5 minutes)
- [ ] Rapid stop/start cycles
- [ ] Browser tab switching during recording

---

## Conclusion

The live recording and real-time transcription feature provides a modern, accessible way for candidates to answer interview questions. By leveraging the Web Speech API, the implementation is:

- **Efficient**: No backend processing required
- **User-friendly**: Real-time feedback and seamless integration
- **Robust**: Handles errors gracefully with auto-restart
- **Accessible**: Helps users who prefer speaking over typing

This feature enhances the overall interview experience while maintaining the simplicity and reliability of the application.

---

## References

### Documentation
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechRecognition Interface](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [React Hooks Reference](https://react.dev/reference/react)

### Related Files
- `frontend/src/components/InterviewSession.jsx` - Main implementation
- `frontend/src/components/LoadingAnimation.jsx` - Loading states
- `frontend/src/api.js` - API configuration

---

**Document Version:** 1.0  
**Last Updated:** January 28, 2026  
**Author:** Development Team  
**Project:** LLM-Powered Cognitive Interview Assistant
