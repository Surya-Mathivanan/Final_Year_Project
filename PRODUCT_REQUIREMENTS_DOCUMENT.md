# Product Requirements Document (PRD)
## LLM-Powered Cognitive Interview Assistant

**Version:** 1.0  
**Date:** January 28, 2026  
**Team:** Team CogniView  
**Document Type:** Technical Product Requirements

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Core Features & Modules](#core-features--modules)
4. [Technical Architecture](#technical-architecture)
5. [Module-wise Implementation Details](#module-wise-implementation-details)
6. [Data Flow & Logic](#data-flow--logic)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [User Interface Components](#user-interface-components)
10. [Technology Stack](#technology-stack)
11. [Security & Authentication](#security--authentication)
12. [Performance Considerations](#performance-considerations)

---

## 1. Executive Summary

The **LLM-Powered Cognitive Interview Assistant** is an intelligent, full-stack web application designed to revolutionize interview preparation for students, freshers, and job seekers. The system leverages Google's Gemini AI to provide personalized, context-aware interview practice with real-time AI-powered feedback.

### Problem Statement
- Limited access to personalized interview practice
- Generic, one-size-fits-all interview questions
- Lack of instant, constructive feedback
- Mismatch between resume skills and interview questions

### Solution
An AI-driven platform that analyzes resumes, generates tailored interview questions, evaluates responses, and provides comprehensive feedback to help candidates improve their interview performance.

---

## 2. Product Overview

### 2.1 Key Capabilities
- **Resume Analysis**: AI-powered extraction of skills, projects, and experience
- **Dual Interview Modes**: Resume-based and Role-based interviews
- **Difficulty Scaling**: Beginner, Intermediate, and Advanced levels
- **AI Evaluation**: Comprehensive response analysis with detailed feedback
- **Speech-to-Text**: Voice input for answering questions
- **Performance Tracking**: Category-wise scoring and improvement suggestions
- **Modern UI/UX**: Responsive design with light/dark theme support

### 2.2 Target Users
- College students preparing for campus placements
- Fresh graduates seeking their first job
- Job seekers looking to improve interview skills
- Career switchers preparing for new roles

---

## 3. Core Features & Modules

### 3.1 Authentication Module
**Purpose**: Secure user authentication and session management

**Features**:
- Google OAuth 2.0 integration
- Session-based authentication
- User profile management
- Automatic user creation on first login

**Implementation**: Flask-Login + Google OAuth

### 3.2 Resume Analysis Module
**Purpose**: Extract and analyze resume content using hybrid AI approach

**Features**:
- PDF text extraction
- Pattern-based skill detection
- LLM-powered intelligent extraction
- Technical skills categorization
- Soft skills identification
- Project summary generation
- Experience level detection

**Implementation**: pdfplumber + Regex + Google Gemini AI

### 3.3 Question Generation Module
**Purpose**: Generate contextual, difficulty-appropriate interview questions

**Features**:
- Resume-based question generation
- Role-based question generation
- Three question categories:
  - Technical questions (based on skills)
  - HR/Behavioral questions (STAR method)
  - Project-based questions (deep-dive)
- Difficulty scaling (Beginner/Intermediate/Advanced)
- Dynamic question count (5-15 questions)

**Implementation**: Google Gemini AI with structured prompts

### 3.4 Interview Session Module
**Purpose**: Interactive interview experience with multiple input methods

**Features**:
- Question-by-question navigation
- Text input for answers
- Speech-to-Text voice input (Web Speech API)
- Progress tracking
- Answer auto-save
- Skip question functionality
- Previous/Next navigation
- Real-time answer submission

**Implementation**: React frontend + Flask backend API

### 3.5 Evaluation & Feedback Module
**Purpose**: AI-powered response evaluation and feedback generation

**Features**:
- Overall performance scoring (0-100)
- Category-wise scoring:
  - Technical Performance
  - HR/Behavioral Performance
  - Cultural Fit
- Strengths identification
- Improvement suggestions
- Detailed analysis paragraph
- Visual performance charts

**Implementation**: Google Gemini AI + Custom scoring logic

### 3.6 User Interface Module
**Purpose**: Modern, responsive, and accessible user interface

**Features**:
- Login screen with Google OAuth
- Dashboard for mode selection
- Resume upload interface
- Role selection interface
- Interactive interview session
- Feedback dashboard with visualizations
- Light/Dark theme toggle
- About/Team page
- Privacy Policy page
- Responsive design (mobile/tablet/desktop)

**Implementation**: React + Custom CSS

---

## 4. Technical Architecture

### 4.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
│                  (React + Vite)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Login   │  │  Resume  │  │Interview │  │ Feedback │  │
│  │  Screen  │  │  Upload  │  │ Session  │  │Dashboard │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (HTTP/JSON)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                            │
│                  (Flask + Python)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication    │  Interview Routes               │  │
│  │  - Google OAuth    │  - Upload Resume                │  │
│  │  - Session Mgmt    │  - Generate Questions           │  │
│  │                    │  - Submit Answers               │  │
│  │                    │  - Get Feedback                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬─────────────────────────┬──────────────────────┘
             │                         │
             ▼                         ▼
┌───────────────────────┐   ┌──────────────────────────────┐
│   DATABASE LAYER      │   │    AI SERVICES LAYER         │
│   (SQLAlchemy ORM)    │   │   (Google Gemini AI)         │
│                       │   │                              │
│  ┌─────────────────┐ │   │  ┌────────────────────────┐ │
│  │ User Model      │ │   │  │ Resume Analyzer        │ │
│  │ - Profile Data  │ │   │  │ - Skill Extraction     │ │
│  │ - OAuth Info    │ │   │  │ - Content Analysis     │ │
│  └─────────────────┘ │   │  └────────────────────────┘ │
│                       │   │                              │
│  ┌─────────────────┐ │   │  ┌────────────────────────┐ │
│  │Interview Session│ │   │  │ Question Generator     │ │
│  │ - Questions     │ │   │  │ - Context-Aware        │ │
│  │ - Answers       │ │   │  │ - Difficulty Scaling   │ │
│  │ - Feedback      │ │   │  └────────────────────────┘ │
│  └─────────────────┘ │   │                              │
│                       │   │  ┌────────────────────────┐ │
│ SQLite/PostgreSQL    │   │  │ Response Evaluator     │ │
│                       │   │  │ - Scoring              │ │
│                       │   │  │ - Feedback Generation  │ │
│                       │   │  └────────────────────────┘ │
└───────────────────────┘   └──────────────────────────────┘
```

### 4.2 Technology Stack

**Frontend**:
- React 19.1.1 (UI framework)
- Vite (Build tool & dev server)
- React Router DOM (Client-side routing)
- Custom CSS (Styling with gradients & animations)
- Web Speech API (Voice input)

**Backend**:
- Python 3.11+
- Flask (Web framework)
- Flask-SQLAlchemy (ORM)
- Flask-Login (Session management)
- Flask-CORS (Cross-origin support)

**AI & ML**:
- Google Gemini AI (2.0 Flash / 1.5 Pro)
- Pydantic (Data validation & structured outputs)

**Database**:
- SQLite (Development)
- PostgreSQL (Production-ready)

**Authentication**:
- Google OAuth 2.0
- oauthlib (OAuth client)

**File Processing**:
- pdfplumber (PDF text extraction)
- Werkzeug (Secure file handling)

---

## 5. Module-wise Implementation Details

### 5.1 Resume Analyzer Module (`resume_analyzer.py`)

**Purpose**: Hybrid approach to extract structured data from PDF resumes

**Implementation Logic**:

1. **PDF Text Extraction**
   - Uses `pdfplumber` library for robust text extraction
   - Handles multi-page resumes
   - Cleans extracted text (removes artifacts, normalizes whitespace)

2. **Pattern-Based Extraction (Regex)**
   - Maintains comprehensive dictionaries of:
     - Technical skills (500+ entries): Python, JavaScript, React, SQL, etc.
     - Soft skills (100+ entries): Leadership, Communication, Teamwork, etc.
   - Uses case-insensitive regex matching
   - Fast baseline extraction

3. **LLM-Based Extraction (Gemini AI)**
   - Sends resume text to Gemini with structured prompt
   - Uses Pydantic models for type-safe responses:
     - `TechnicalSkill`: name, category, proficiency
     - `SoftSkill`: skill, context
     - `Project`: title, description, technologies, role, achievements
     - `ResumeAnalysis`: aggregated results
   - Extracts nuanced information (project descriptions, implied skills)

4. **Data Fusion**
   - Merges regex and LLM results
   - Prioritizes LLM for complex fields (project summaries)
   - Uses regex for high-precision keyword tagging
   - Deduplicates skills

5. **Experience Level Detection**
   - Analyzes years of experience, project complexity
   - Classifies as: entry, intermediate, senior

**Key Classes**:
```python
class ResumeAnalyzer:
    TECHNICAL_SKILLS = {...}  # 500+ skills dictionary
    SOFT_SKILLS = {...}       # 100+ skills dictionary
    
    def extract_text_from_pdf(pdf_path) -> str
    def extract_technical_skills(text) -> List[Dict]
    def extract_soft_skills(text) -> List[Dict]
    def llm_extract_resume_details(text) -> ResumeAnalysis
    def analyze_resume(pdf_path) -> Dict
```

**Output Format**:
```json
{
  "technical_skills": [
    {"name": "Python", "category": "Programming Language", "proficiency": "advanced"},
    {"name": "React", "category": "Frontend Framework", "proficiency": "intermediate"}
  ],
  "soft_skills": [
    {"skill": "Leadership", "context": "Led team of 5 developers"}
  ],
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Built full-stack web app",
      "technologies": ["React", "Node.js", "MongoDB"],
      "role": "Full Stack Developer",
      "key_achievements": ["Increased sales by 30%"]
    }
  ],
  "summary": "Experienced full-stack developer with 3 years...",
  "experience_level": "intermediate",
  "keywords": ["python", "react", "nodejs", "mongodb"]
}
```

### 5.2 Question Generator Module (`question_generator.py`)

**Purpose**: Generate contextual interview questions using AI

**Implementation Logic**:

1. **Resume-Based Question Generation**
   - Takes inputs: technical_skills, soft_skills, projects, difficulty
   - Generates three types of questions:
     - **Technical Questions** (40%): Based on specific skills
     - **HR/Behavioral Questions** (30%): STAR method, soft skills
     - **Project Questions** (30%): Deep-dive into projects
   - Adjusts complexity based on difficulty level

2. **Role-Based Question Generation**
   - Takes inputs: role (e.g., "Software Engineer"), difficulty
   - Generates industry-standard questions for the role
   - Covers technical, behavioral, and situational scenarios

3. **Prompt Engineering Strategy**
   - System role: "Expert Technical Interviewer"
   - Structured prompts with clear instructions
   - Specifies question format, difficulty, and focus areas
   - Requests JSON output for easy parsing

**Key Methods**:
```python
class QuestionGenerator:
    def generate_resume_based_questions(
        technical_skills, soft_skills, projects, difficulty
    ) -> List[str]
    
    def _generate_technical_questions(skills, difficulty) -> List[str]
    def _generate_hr_questions(soft_skills, difficulty) -> List[str]
    def _generate_project_questions(projects, difficulty) -> List[str]
    
    def generate_role_based_questions(role, difficulty) -> List[str]
```

**Difficulty Scaling**:
- **Beginner**: Entry-level, basic concepts, simple scenarios
- **Intermediate**: Mid-level, practical application, problem-solving
- **Advanced**: Senior-level, system design, complex scenarios

**Sample Prompts**:
```
Technical Questions Prompt:
"Generate 5 technical interview questions for a candidate with skills: 
[Python, React, SQL]. Difficulty: Intermediate. Focus on practical 
application and real-world scenarios. Format as JSON array."

HR Questions Prompt:
"Generate 3 behavioral interview questions using the STAR method. 
Focus on soft skills: [Leadership, Communication]. Difficulty: Intermediate."

Project Questions Prompt:
"Generate 3 project-based questions about: 'E-commerce Platform built 
with React and Node.js'. Ask about technical challenges, design decisions, 
and learnings. Difficulty: Intermediate."
```

### 5.3 Interview Session Management (`app.py`)

**Purpose**: Orchestrate interview flow and manage session state

**Implementation Logic**:

1. **Session Creation**
   - Creates `InterviewSession` record in database
   - Stores mode, difficulty, role, resume data
   - Initializes empty questions/answers arrays
   - Sets status to 'active'

2. **Question Storage**
   - Stores generated questions as JSON array in database
   - Each question is a string
   - Maintains question order

3. **Answer Submission**
   - Receives: session_id, question_index, answer_text
   - Updates answers array in database
   - Validates session ownership
   - Returns success confirmation

4. **Interview Completion**
   - Validates all questions answered
   - Triggers AI evaluation
   - Stores feedback in session
   - Updates status to 'completed'
   - Returns comprehensive feedback

**Key Routes**:
```python
@app.route('/api/upload-resume', methods=['POST'])
def upload_resume():
    # 1. Save uploaded PDF file
    # 2. Call resume_analyzer.analyze_resume()
    # 3. Return analysis results

@app.route('/api/generate-questions', methods=['POST'])
def generate_questions():
    # 1. Create InterviewSession record
    # 2. Call question_generator based on mode
    # 3. Store questions in session
    # 4. Return session_id and questions

@app.route('/api/submit-answer', methods=['POST'])
def submit_answer():
    # 1. Fetch session from database
    # 2. Update answers array at question_index
    # 3. Save to database
    # 4. Return success

@app.route('/api/complete-interview', methods=['POST'])
def complete_interview():
    # 1. Fetch session with all Q&A
    # 2. Call generate_interview_feedback()
    # 3. Store feedback in session
    # 4. Update status to 'completed'
    # 5. Return feedback
```

### 5.4 Evaluation & Feedback Module (`app.py` - `generate_interview_feedback`)

**Purpose**: AI-powered evaluation of interview responses

**Implementation Logic**:

1. **Transcript Compilation**
   - Aggregates all questions and corresponding answers
   - Formats as structured conversation

2. **AI Evaluation Prompt**
   - System role: "Senior Career Coach & HR Specialist"
   - Provides full interview transcript
   - Requests structured feedback with:
     - Overall score (0-100)
     - Category scores:
       - Technical Performance (0-100)
       - HR/Behavioral Performance (0-100)
       - Cultural Fit (0-100)
     - Strengths (list)
     - Improvements (list)
     - Detailed analysis (paragraph)

3. **Scoring Criteria**
   - **Technical Performance**: Accuracy, depth of knowledge, problem-solving
   - **HR Performance**: Communication clarity, STAR method usage, professionalism
   - **Cultural Fit**: Collaboration, adaptability, growth mindset

4. **Feedback Generation**
   - Gemini analyzes each answer in context
   - Identifies specific strengths and weaknesses
   - Provides actionable improvement suggestions
   - Generates comprehensive summary

**Evaluation Prompt Structure**:
```
You are a Senior Career Coach and HR Specialist. Evaluate this interview:

INTERVIEW TRANSCRIPT:
Q1: [Question]
A1: [Answer]
Q2: [Question]
A2: [Answer]
...

Provide feedback in JSON format:
{
  "overall_score": 0-100,
  "category_scores": {
    "technical_performance": 0-100,
    "hr_performance": 0-100,
    "cultural_fit": 0-100
  },
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...],
  "detailed_feedback": "Comprehensive analysis paragraph..."
}

Scoring Guidelines:
- Technical: Accuracy, depth, problem-solving approach
- HR: Communication, STAR method, professionalism
- Cultural Fit: Collaboration, adaptability, growth mindset
```

### 5.5 Frontend Components

#### 5.5.1 LoginScreen.jsx
**Purpose**: User authentication interface

**Features**:
- Google OAuth login button
- Feature showcase (right panel)
- Terms & Privacy links
- Creator attribution
- Gradient background design

**Logic**:
- Redirects to `/auth/google` on button click
- Google handles authentication
- Callback redirects to dashboard on success

#### 5.5.2 Dashboard.jsx
**Purpose**: Interview mode selection

**Features**:
- Two mode cards: Resume-Based and Role-Based
- Visual icons and descriptions
- Hover effects
- Navigation to respective interfaces

**Logic**:
- Displays mode options
- Sets mode in state on selection
- Navigates to ResumeUpload or RoleSelection

#### 5.5.3 ResumeUpload.jsx
**Purpose**: Resume upload and analysis interface

**Features**:
- Drag-and-drop file upload
- File validation (PDF only, 16MB max)
- Upload progress indicator
- AI analysis preview
- Skill and project display
- Difficulty selection

**Logic**:
```javascript
1. User selects/drops PDF file
2. Validate file type and size
3. Create FormData and upload to /api/upload-resume
4. Display loading animation
5. Receive analysis results
6. Display extracted skills and projects
7. User selects difficulty level
8. Navigate to question generation
```

#### 5.5.4 RoleSelection.jsx
**Purpose**: Role-based interview configuration

**Features**:
- Predefined role cards (Software Engineer, Data Scientist, etc.)
- Difficulty level selection
- Visual role icons

**Logic**:
```javascript
1. Display available roles
2. User selects role
3. User selects difficulty
4. Navigate to question generation with role and difficulty
```

#### 5.5.5 InterviewSession.jsx
**Purpose**: Interactive interview experience

**Features**:
- Question display with progress bar
- Text input for answers
- Speech-to-Text voice input (microphone button)
- Navigation: Previous, Next, Skip
- Real-time answer saving
- Submit interview button

**Logic**:
```javascript
1. On mount: Call /api/generate-questions
2. Display first question
3. User types or speaks answer
4. On "Next": Submit answer via /api/submit-answer, move to next
5. On "Previous": Navigate to previous question
6. On "Skip": Submit empty answer, move to next
7. On "Submit Interview": Call /api/complete-interview
8. Navigate to FeedbackDashboard with results
```

**Speech-to-Text Implementation**:
```javascript
const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setCurrentAnswer(transcript);
};

recognition.start(); // On microphone button click
```

#### 5.5.6 FeedbackDashboard.jsx
**Purpose**: Display comprehensive interview feedback

**Features**:
- Overall score with large pie chart
- Category scores with individual pie charts
- Strengths section
- Improvements section
- Detailed analysis
- Action buttons (New Interview, Save Results)

**Logic**:
```javascript
1. Receive feedbackData from parent
2. Render PieChart components with scores
3. Display strengths and improvements as lists
4. Show detailed feedback paragraph
5. Provide navigation to start new interview
```

**Custom PieChart Component**:
```javascript
function PieChart({ percentage, size, color }) {
  // SVG circle with dynamic stroke-dashoffset
  // Animates from 0 to percentage
  // Displays percentage in center
}
```

#### 5.5.7 ThemeToggle.jsx
**Purpose**: Light/Dark theme switcher

**Features**:
- Toggle button (☀️/🌙 icon)
- Persists theme preference

**Logic**:
```javascript
const { theme, toggleTheme } = useTheme();
// ThemeContext manages theme state
// CSS variables update based on theme
```

---

## 6. Data Flow & Logic

### 6.1 Resume-Based Interview Flow

```
1. USER LOGIN
   ↓
   Google OAuth → User record created/fetched
   ↓
2. MODE SELECTION
   ↓
   User selects "Resume-Based Interview"
   ↓
3. RESUME UPLOAD
   ↓
   User uploads PDF → /api/upload-resume
   ↓
   Backend: Save file → Extract text (pdfplumber)
   ↓
   Backend: Analyze resume (Regex + Gemini AI)
   ↓
   Backend: Return {technical_skills, soft_skills, projects, keywords}
   ↓
   Frontend: Display analysis, user selects difficulty
   ↓
4. QUESTION GENERATION
   ↓
   Frontend: POST /api/generate-questions
   {mode: "resume", difficulty, analysis, keywords}
   ↓
   Backend: Create InterviewSession record
   ↓
   Backend: Generate questions (QuestionGenerator)
   - Technical questions (based on skills)
   - HR questions (based on soft skills)
   - Project questions (based on projects)
   ↓
   Backend: Store questions in session
   ↓
   Backend: Return {session_id, questions}
   ↓
5. INTERVIEW SESSION
   ↓
   Frontend: Display questions one by one
   ↓
   User answers (text or voice)
   ↓
   Frontend: POST /api/submit-answer
   {session_id, question_index, answer}
   ↓
   Backend: Update answers array in session
   ↓
   Repeat for all questions
   ↓
6. INTERVIEW COMPLETION
   ↓
   Frontend: POST /api/complete-interview {session_id}
   ↓
   Backend: Fetch session with all Q&A
   ↓
   Backend: Generate feedback (Gemini AI evaluation)
   - Overall score
   - Category scores
   - Strengths
   - Improvements
   - Detailed analysis
   ↓
   Backend: Store feedback in session
   ↓
   Backend: Update status to 'completed'
   ↓
   Backend: Return feedback
   ↓
7. FEEDBACK DISPLAY
   ↓
   Frontend: Render FeedbackDashboard with scores and insights
```

### 6.2 Role-Based Interview Flow

```
1. USER LOGIN (same as above)
   ↓
2. MODE SELECTION
   ↓
   User selects "Role-Based Interview"
   ↓
3. ROLE SELECTION
   ↓
   User selects role (e.g., "Software Engineer")
   ↓
   User selects difficulty
   ↓
4. QUESTION GENERATION
   ↓
   Frontend: POST /api/generate-questions
   {mode: "role", role, difficulty}
   ↓
   Backend: Create InterviewSession record
   ↓
   Backend: Generate role-based questions (QuestionGenerator)
   - Industry-standard questions for the role
   - Technical, behavioral, situational
   ↓
   Backend: Store questions in session
   ↓
   Backend: Return {session_id, questions}
   ↓
5. INTERVIEW SESSION (same as resume-based)
   ↓
6. INTERVIEW COMPLETION (same as resume-based)
   ↓
7. FEEDBACK DISPLAY (same as resume-based)
```

---

## 7. API Endpoints

### 7.1 Authentication Endpoints

#### GET `/auth/google`
**Description**: Initiates Google OAuth flow  
**Authentication**: None  
**Response**: Redirects to Google login page

#### GET `/auth/callback`
**Description**: OAuth callback handler  
**Authentication**: OAuth code (from Google)  
**Process**:
1. Exchange authorization code for access token
2. Fetch user profile from Google
3. Create/update User record in database
4. Create Flask session
5. Redirect to dashboard

**Response**: Redirects to `/` (dashboard)

#### GET `/auth/logout`
**Description**: Logs out current user  
**Authentication**: Required  
**Process**:
1. Clear Flask session
2. Redirect to login page

**Response**: Redirects to `/`

#### GET `/api/user`
**Description**: Get current user information  
**Authentication**: Required (session)  
**Response**:
```json
{
  "id": 1,
  "username": "John Doe",
  "email": "john@example.com"
}
```

### 7.2 Interview Endpoints

#### POST `/api/upload-resume`
**Description**: Upload and analyze PDF resume  
**Authentication**: Required  
**Request**: FormData
```
resume: File (PDF, max 16MB)
```
**Response**:
```json
{
  "message": "Resume uploaded and analyzed successfully",
  "filename": "1_1234567890_resume.pdf",
  "analysis": {
    "technical_skills": [
      {"name": "Python", "category": "Programming", "proficiency": "advanced"}
    ],
    "soft_skills": [
      {"skill": "Leadership", "context": "Led team of 5"}
    ],
    "projects": [
      {
        "title": "E-commerce Platform",
        "description": "Built full-stack app",
        "technologies": ["React", "Node.js"],
        "role": "Full Stack Developer",
        "key_achievements": ["Increased sales by 30%"]
      }
    ],
    "summary": "Experienced developer with 3 years...",
    "experience_level": "intermediate"
  },
  "keywords": ["python", "react", "nodejs"]
}
```

#### POST `/api/generate-questions`
**Description**: Generate interview questions  
**Authentication**: Required  
**Request**:
```json
{
  "mode": "resume",  // or "role"
  "difficulty": "intermediate",  // "beginner", "intermediate", "advanced"
  "role": "Software Engineer",  // for role-based mode
  "filename": "1_1234567890_resume.pdf",  // for resume-based mode
  "analysis": {...},  // resume analysis object
  "keywords": ["python", "react"]
}
```
**Response**:
```json
{
  "session_id": 42,
  "questions": [
    "Explain your experience with Python and provide an example project.",
    "Describe a time when you demonstrated leadership in a team setting.",
    "What was the most challenging aspect of your E-commerce Platform project?"
  ]
}
```

#### POST `/api/submit-answer`
**Description**: Submit answer for a specific question  
**Authentication**: Required  
**Request**:
```json
{
  "session_id": 42,
  "question_index": 0,
  "answer": "In my Python project, I used Flask to build a REST API..."
}
```
**Response**:
```json
{
  "message": "Answer submitted successfully"
}
```

#### POST `/api/complete-interview`
**Description**: Complete interview and generate feedback  
**Authentication**: Required  
**Request**:
```json
{
  "session_id": 42
}
```
**Response**:
```json
{
  "message": "Interview completed successfully",
  "feedback": {
    "overall_score": 75,
    "category_scores": {
      "technical_performance": 80,
      "hr_performance": 70,
      "cultural_fit": 75
    },
    "strengths": [
      "Strong technical knowledge of Python and Flask",
      "Clear communication style",
      "Good understanding of project architecture"
    ],
    "improvements": [
      "Provide more specific examples with metrics",
      "Elaborate on challenges faced and how you overcame them",
      "Use STAR method more consistently in behavioral answers"
    ],
    "detailed_feedback": "Your responses demonstrate solid technical knowledge and good communication skills. You showed strong understanding of Python, Flask, and web development concepts. However, your answers could be enhanced by providing more specific examples with quantifiable results. In behavioral questions, try to structure your responses using the STAR method (Situation, Task, Action, Result) more consistently. Overall, you're on the right track—keep practicing to refine your interview skills."
  }
}
```

---

## 8. Database Schema

### 8.1 User Table

**Table Name**: `user`

| Column      | Type         | Constraints                  | Description                    |
|-------------|--------------|------------------------------|--------------------------------|
| id          | Integer      | PRIMARY KEY, AUTO_INCREMENT  | Unique user identifier         |
| username    | String(80)   | NOT NULL                     | User's display name            |
| email       | String(120)  | UNIQUE, NOT NULL             | User's email (from Google)     |
| created_at  | DateTime     | DEFAULT CURRENT_TIMESTAMP    | Account creation timestamp     |

**Relationships**:
- One-to-Many with `interview_session` (user can have multiple sessions)

### 8.2 InterviewSession Table

**Table Name**: `interview_session`

| Column            | Type         | Constraints                  | Description                           |
|-------------------|--------------|------------------------------|---------------------------------------|
| id                | Integer      | PRIMARY KEY, AUTO_INCREMENT  | Unique session identifier             |
| user_id           | Integer      | FOREIGN KEY (user.id)        | Reference to user                     |
| mode              | String(20)   | NOT NULL                     | 'resume' or 'role'                    |
| difficulty        | String(20)   | NOT NULL                     | 'beginner', 'intermediate', 'advanced'|
| role              | String(100)  | NULLABLE                     | Job role (for role-based mode)        |
| resume_filename   | String(255)  | NULLABLE                     | Uploaded resume filename              |
| technical_skills  | Text (JSON)  | NULLABLE                     | JSON array of technical skills        |
| soft_skills       | Text (JSON)  | NULLABLE                     | JSON array of soft skills             |
| projects          | Text (JSON)  | NULLABLE                     | JSON array of projects                |
| experience_level  | String(20)   | NULLABLE                     | 'entry', 'mid', 'senior'              |
| resume_summary    | Text         | NULLABLE                     | AI-generated resume summary           |
| questions         | Text (JSON)  | NULLABLE                     | JSON array of questions               |
| answers           | Text (JSON)  | NULLABLE                     | JSON array of answers                 |
| feedback          | Text (JSON)  | NULLABLE                     | JSON object with feedback             |
| status            | String(20)   | DEFAULT 'active'             | 'active' or 'completed'               |
| created_at        | DateTime     | DEFAULT CURRENT_TIMESTAMP    | Session creation timestamp            |
| completed_at      | DateTime     | NULLABLE                     | Session completion timestamp          |

**Relationships**:
- Many-to-One with `user` (session belongs to one user)

**JSON Field Examples**:

`technical_skills`:
```json
[
  {"name": "Python", "category": "Programming", "proficiency": "advanced"},
  {"name": "React", "category": "Frontend", "proficiency": "intermediate"}
]
```

`questions`:
```json
[
  "Explain your experience with Python.",
  "Describe a leadership situation.",
  "What challenges did you face in your project?"
]
```

`answers`:
```json
[
  "I have 3 years of Python experience...",
  "I led a team of 5 developers...",
  "The main challenge was scaling..."
]
```

`feedback`:
```json
{
  "overall_score": 75,
  "category_scores": {
    "technical_performance": 80,
    "hr_performance": 70,
    "cultural_fit": 75
  },
  "strengths": ["Strong technical knowledge", "Clear communication"],
  "improvements": ["Provide more examples", "Use STAR method"],
  "detailed_feedback": "Your responses demonstrate..."
}
```

---

## 9. User Interface Components

### 9.1 Component Hierarchy

```
App.jsx
├── ThemeContext.Provider
│   ├── ThemeToggle
│   ├── LoginScreen
│   ├── Dashboard
│   ├── ResumeUpload
│   │   └── LoadingAnimation
│   ├── RoleSelection
│   ├── InterviewSession
│   │   ├── LoadingAnimation
│   │   └── (Speech Recognition)
│   ├── FeedbackDashboard
│   │   └── PieChart (multiple instances)
│   ├── AboutTeam
│   └── PrivacyPolicy
```

### 9.2 Routing Structure

```javascript
<Routes>
  <Route path="/" element={<LoginScreen />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/resume-upload" element={<ResumeUpload />} />
  <Route path="/role-selection" element={<RoleSelection />} />
  <Route path="/interview" element={<InterviewSession />} />
  <Route path="/feedback" element={<FeedbackDashboard />} />
  <Route path="/about" element={<AboutTeam />} />
  <Route path="/privacy" element={<PrivacyPolicy />} />
</Routes>
```

### 9.3 State Management

**App-level State**:
- `currentView`: Current page/component
- `interviewData`: Session data (mode, difficulty, role, analysis)
- `feedbackData`: Evaluation results
- `theme`: Light/Dark theme preference

**Component-level State**:
- `InterviewSession`:
  - `questions`: Array of questions
  - `currentQuestionIndex`: Current question position
  - `answers`: Array of user answers
  - `currentAnswer`: Current answer being typed
  - `isRecording`: Voice input status
  - `isLoading`: Loading state

- `ResumeUpload`:
  - `file`: Selected PDF file
  - `isUploading`: Upload in progress
  - `analysis`: Resume analysis results
  - `difficulty`: Selected difficulty level

### 9.4 Styling Approach

**CSS Architecture**:
- Single `index.css` file with all styles
- CSS custom properties for theming
- Gradient backgrounds and animations
- Responsive design with media queries

**Theme Variables**:
```css
:root {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --text-primary: #c9d1d9;
  --text-secondary: #8b949e;
  --accent-blue: #58a6ff;
  --accent-green: #238636;
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f6f8fa;
  --text-primary: #24292f;
  --text-secondary: #57606a;
}
```

**Key Design Patterns**:
- Card-based layouts
- Gradient buttons with hover effects
- Smooth transitions and animations
- Loading states with custom animations
- Progress indicators
- Responsive grid layouts

---

## 10. Technology Stack

### 10.1 Frontend Technologies

| Technology        | Version  | Purpose                                    | Why Chosen                                |
|-------------------|----------|--------------------------------------------|-------------------------------------------|
| React             | 19.1.1   | UI framework                               | Component-based, rich ecosystem           |
| Vite              | Latest   | Build tool & dev server                    | Fast HMR, modern, simple config           |
| React Router DOM  | Latest   | Client-side routing                        | Standard routing for React SPAs           |
| Web Speech API    | Native   | Voice input (Speech-to-Text)               | Browser-native, no external dependencies  |
| Custom CSS        | -        | Styling                                    | Full control, no framework overhead       |

### 10.2 Backend Technologies

| Technology        | Version  | Purpose                                    | Why Chosen                                |
|-------------------|----------|--------------------------------------------|-------------------------------------------|
| Python            | 3.11+    | Backend language                           | AI/ML ecosystem, readability              |
| Flask             | Latest   | Web framework                              | Lightweight, flexible, easy to learn      |
| Flask-SQLAlchemy  | Latest   | ORM for database operations                | Pythonic database abstraction             |
| Flask-Login       | Latest   | User session management                    | Simple session handling                   |
| Flask-CORS        | Latest   | Cross-origin support                       | Enable frontend-backend communication     |

### 10.3 AI & Data Processing

| Technology           | Version  | Purpose                                 | Why Chosen                                |
|----------------------|----------|-----------------------------------------|-------------------------------------------|
| Google Gemini AI     | 2.0 Flash| Question generation, evaluation         | Fast, cost-effective, generous free tier  |
| Google Gemini AI     | 1.5 Pro  | Resume analysis (complex tasks)         | Advanced reasoning, large context window  |
| Pydantic             | Latest   | Data validation, structured AI outputs  | Type-safe, integrates with Gemini         |
| pdfplumber           | Latest   | PDF text extraction                     | More robust than PyPDF2                   |

### 10.4 Database

| Technology  | Purpose                    | Environment  | Why Chosen                                    |
|-------------|----------------------------|--------------|-----------------------------------------------|
| SQLite      | Development database       | Development  | Zero setup, file-based, portable              |
| PostgreSQL  | Production database        | Production   | Scalable, JSONB support, industry standard    |
| SQLAlchemy  | ORM abstraction layer      | Both         | Database-agnostic, Pythonic API               |

### 10.5 Authentication

| Technology       | Purpose                          | Why Chosen                                    |
|------------------|----------------------------------|-----------------------------------------------|
| Google OAuth 2.0 | User authentication              | Industry-standard, no password management     |
| oauthlib         | OAuth client implementation      | Mature library, well-documented               |
| Flask-Login      | Session management               | Integrates seamlessly with Flask              |

---

## 11. Security & Authentication

### 11.1 Authentication Flow

1. **User Initiates Login**
   - Clicks "Continue with Google" button
   - Frontend redirects to `/auth/google`

2. **OAuth Authorization**
   - Backend redirects to Google OAuth consent screen
   - User grants permissions (email, profile)
   - Google redirects back with authorization code

3. **Token Exchange**
   - Backend exchanges code for access token
   - Fetches user profile from Google API

4. **User Creation/Update**
   - Check if user exists (by email)
   - Create new user or update existing user
   - Store user info in database

5. **Session Creation**
   - Create Flask session with user ID
   - Set session cookie (httpOnly, secure)
   - Redirect to dashboard

6. **Authenticated Requests**
   - All API requests include session cookie
   - `@login_required` decorator validates session
   - Returns 401 if not authenticated

### 11.2 Security Measures

**Session Security**:
- `SESSION_SECRET`: Random, secure secret key
- `httpOnly` cookies: Prevent XSS attacks
- `secure` flag: HTTPS-only cookies (production)
- Session timeout: Configurable expiration

**File Upload Security**:
- File type validation: PDF only
- File size limit: 16MB max
- Secure filename: Werkzeug's `secure_filename()`
- User-specific filenames: `{user_id}_{timestamp}_{filename}`
- Isolated upload directory: `/uploads` (not web-accessible)

**API Security**:
- CORS configuration: Whitelist frontend origin
- Authentication required: All interview endpoints
- User ownership validation: Users can only access their own sessions
- Input validation: Pydantic models, type checking

**Environment Variables**:
- `.env` file for sensitive data
- Never commit `.env` to version control
- `.gitignore` includes `.env`
- Required variables:
  - `SESSION_SECRET`
  - `GOOGLE_OAUTH_CLIENT_ID`
  - `GOOGLE_OAUTH_CLIENT_SECRET`
  - `GEMINI_API_KEY`

**Database Security**:
- ORM prevents SQL injection
- User input sanitized
- No raw SQL queries
- Database credentials in environment variables

---

## 12. Performance Considerations

### 12.1 Frontend Optimization

**Code Splitting**:
- React Router lazy loading (future enhancement)
- Component-level code splitting

**Asset Optimization**:
- Vite production build: Minification, tree-shaking
- CSS bundling and minification
- No external CSS frameworks (reduced bundle size)

**State Management**:
- Minimal state updates
- Efficient re-rendering with React hooks
- Debounced input for voice transcription

**Loading States**:
- Custom loading animations
- Prevent multiple simultaneous requests
- User feedback during long operations

### 12.2 Backend Optimization

**Database**:
- SQLAlchemy connection pooling
- Indexed columns: `user.email`, `interview_session.user_id`
- JSON fields for flexible data storage
- PostgreSQL for production scalability

**File Processing**:
- Asynchronous file upload (future enhancement)
- PDF text extraction optimized with pdfplumber
- Resume analysis caching (future enhancement)

**AI API Calls**:
- Efficient prompt engineering (minimal tokens)
- Gemini Flash for fast operations
- Gemini Pro for complex analysis
- Structured outputs reduce parsing overhead
- Error handling and retries

**Caching Strategy** (Future Enhancement):
- Redis for session caching
- Resume analysis caching (same resume = cached results)
- Question generation caching (same parameters = cached questions)

### 12.3 Scalability Considerations

**Current Architecture**:
- Supports 100+ concurrent users (with PostgreSQL)
- Stateless backend (horizontal scaling possible)
- Session storage in database (not in-memory)

**Future Enhancements**:
- Load balancing (multiple Flask instances)
- Redis for distributed session storage
- CDN for static assets
- Background job queue (Celery) for long-running tasks
- WebSocket for real-time updates

---

## Appendix A: Environment Variables

**Required Variables**:
```env
# Session Security
SESSION_SECRET=your-random-secret-key-here

# Google OAuth 2.0
GOOGLE_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Database
DATABASE_URL=sqlite:///interview_assistant.db
# Or for PostgreSQL:
# DATABASE_URL=postgresql://username:password@localhost:5432/interview_assistant

# Application URL (for OAuth redirects)
REPLIT_DEV_DOMAIN=localhost:5000
```

---

## Appendix B: File Structure

```
Final_Year_Project/
├── backend/
│   ├── app.py                    # Main Flask application
│   ├── models.py                 # Database models
│   ├── google_auth.py            # Google OAuth implementation
│   ├── gemini.py                 # Gemini AI client
│   ├── resume_analyzer.py        # Resume analysis module
│   ├── question_generator.py     # Question generation module
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── RoleSelection.jsx
│   │   │   ├── InterviewSession.jsx
│   │   │   ├── FeedbackDashboard.jsx
│   │   │   ├── LoadingAnimation.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── AboutTeam.jsx
│   │   │   └── PrivacyPolicy.jsx
│   │   ├── App.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── uploads/                      # Uploaded resume files
├── instance/                     # SQLite database
├── .env                          # Environment variables
├── .gitignore
├── README.md
└── pyproject.toml
```

---

## Appendix C: Key Algorithms & Logic

### C.1 Resume Skill Extraction Algorithm

```
INPUT: PDF resume file
OUTPUT: {technical_skills, soft_skills, projects, summary, experience_level}

ALGORITHM:
1. Extract text from PDF using pdfplumber
2. Clean text (remove artifacts, normalize whitespace)

3. PATTERN-BASED EXTRACTION (Regex):
   - For each skill in TECHNICAL_SKILLS dictionary:
     - Search for skill in text (case-insensitive)
     - If found, add to technical_skills_regex[]
   - For each skill in SOFT_SKILLS dictionary:
     - Search for skill in text
     - If found, add to soft_skills_regex[]

4. LLM-BASED EXTRACTION (Gemini AI):
   - Send text to Gemini with structured prompt
   - Request Pydantic-validated response:
     - TechnicalSkill[] (name, category, proficiency)
     - SoftSkill[] (skill, context)
     - Project[] (title, description, technologies, role, achievements)
     - Summary (string)
     - Experience level (entry/mid/senior)

5. DATA FUSION:
   - Merge technical_skills_regex and LLM technical_skills
   - Deduplicate based on skill name (case-insensitive)
   - Prioritize LLM proficiency ratings
   - Merge soft_skills similarly
   - Use LLM projects (more detailed)
   - Use LLM summary and experience level

6. KEYWORD GENERATION:
   - Extract top 15 technical skills
   - Convert to lowercase
   - Return as keywords array

RETURN: Complete resume analysis object
```

### C.2 Question Generation Algorithm

```
INPUT: {mode, difficulty, role, technical_skills, soft_skills, projects}
OUTPUT: questions[] (array of strings)

ALGORITHM:
1. IF mode == "resume":
   - Extract top 15 technical skills
   - Extract top 8 soft skills
   - Extract top 5 projects
   
   2a. GENERATE TECHNICAL QUESTIONS (40% of total):
       - Prompt: "Generate N technical questions for skills: [skills]"
       - Difficulty: Adjust complexity in prompt
       - LLM returns questions[]
   
   2b. GENERATE HR QUESTIONS (30% of total):
       - Prompt: "Generate N behavioral questions using STAR method"
       - Focus on soft_skills
       - LLM returns questions[]
   
   2c. GENERATE PROJECT QUESTIONS (30% of total):
       - Prompt: "Generate N project-based questions about: [projects]"
       - Ask about challenges, design decisions, learnings
       - LLM returns questions[]
   
   3. COMBINE:
      - all_questions = technical + hr + project
      - Shuffle to mix question types
      - Return all_questions

ELSE IF mode == "role":
   - Prompt: "Generate N interview questions for role: [role]"
   - Difficulty: Adjust in prompt
   - Include technical, behavioral, situational
   - LLM returns questions[]
   - Return questions

RETURN: questions[]
```

### C.3 Interview Evaluation Algorithm

```
INPUT: InterviewSession (with questions[] and answers[])
OUTPUT: {overall_score, category_scores, strengths, improvements, detailed_feedback}

ALGORITHM:
1. COMPILE TRANSCRIPT:
   - For i = 0 to len(questions):
     - transcript += "Q{i+1}: {questions[i]}\n"
     - transcript += "A{i+1}: {answers[i]}\n\n"

2. CONSTRUCT EVALUATION PROMPT:
   - System role: "Senior Career Coach & HR Specialist"
   - Provide full transcript
   - Scoring criteria:
     - Technical: Accuracy, depth, problem-solving
     - HR: Communication, STAR method, professionalism
     - Cultural Fit: Collaboration, adaptability, growth mindset
   - Request JSON output with:
     - overall_score (0-100)
     - category_scores {technical, hr, cultural_fit}
     - strengths[] (list of strings)
     - improvements[] (list of strings)
     - detailed_feedback (paragraph)

3. SEND TO GEMINI AI:
   - Call Gemini with evaluation prompt
   - Parse JSON response

4. VALIDATE RESPONSE:
   - Ensure all scores are 0-100
   - Ensure lists are non-empty
   - Provide defaults if parsing fails

5. STORE FEEDBACK:
   - Update InterviewSession.feedback = feedback_json
   - Update InterviewSession.status = 'completed'
   - Update InterviewSession.completed_at = now()
   - Save to database

RETURN: feedback object
```

---

## Document Revision History

| Version | Date           | Author         | Changes                          |
|---------|----------------|----------------|----------------------------------|
| 1.0     | Jan 28, 2026   | Team CogniView | Initial PRD creation             |

---

**End of Product Requirements Document**
