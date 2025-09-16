# Flask backend for LLM-Powered Cognitive Interview Assistant
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_required, current_user
import os
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SESSION_SECRET', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///interview_assistant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create upload folder
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Import models and auth blueprint first
from models import User, InterviewSession, db

# Initialize extensions
db.init_app(app)
CORS(app, supports_credentials=True)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'google_auth.login'  # type: ignore

from google_auth import google_auth

# Register blueprint
app.register_blueprint(google_auth)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Serve React App
@app.route('/')
def index():
    return send_from_directory('../frontend/dist', 'index.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('../frontend/dist/assets', filename)

@app.route('/<path:path>')
def serve_react_app(path):
    # For React Router - serve index.html for all non-API routes
    if path.startswith('api/'):
        return {'error': 'API route not found'}, 404
    return send_from_directory('../frontend/dist', 'index.html')

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Interview Assistant Backend Running"})

@app.route('/api/upload-resume', methods=['POST'])
@login_required
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
    
    file = request.files['resume']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file and file.filename and file.filename.lower().endswith('.pdf'):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract keywords from PDF (placeholder for now)
        keywords = extract_resume_keywords(filepath)
        
        return jsonify({
            "message": "Resume uploaded successfully",
            "filename": filename,
            "keywords": keywords
        })
    
    return jsonify({"error": "Invalid file format. Please upload a PDF."}), 400

@app.route('/api/generate-questions', methods=['POST'])
@login_required
def generate_questions():
    data = request.json or {}
    mode = data.get('mode')  # 'resume' or 'role'
    difficulty = data.get('difficulty')  # 'beginner', 'intermediate', 'advanced'
    role = data.get('role', '')
    keywords = data.get('keywords', [])
    
    try:
        questions = generate_interview_questions(mode, difficulty, role, keywords)
        
        # Create interview session
        session = InterviewSession()
        session.user_id = current_user.id
        session.mode = mode
        session.difficulty = difficulty  
        session.role = role
        session.questions = json.dumps(questions)
        session.status = 'active'
        db.session.add(session)
        db.session.commit()
        
        return jsonify({
            "session_id": session.id,
            "questions": questions
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/submit-answer', methods=['POST'])
@login_required
def submit_answer():
    data = request.json or {}
    session_id = data.get('session_id')
    question_index = data.get('question_index')
    answer = data.get('answer')
    
    try:
        session = InterviewSession.query.filter_by(id=session_id, user_id=current_user.id).first()
        if not session:
            return jsonify({"error": "Interview session not found"}), 404
        
        # Get current answers or initialize
        answers = json.loads(session.answers) if session.answers else []
        
        # Add/update answer
        if question_index is not None and len(answers) <= question_index:
            answers.extend([None] * (question_index + 1 - len(answers)))
        if question_index is not None:
            answers[question_index] = answer
        
        session.answers = json.dumps(answers)
        db.session.commit()
        
        return jsonify({"message": "Answer submitted successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/complete-interview', methods=['POST'])
@login_required
def complete_interview():
    data = request.json or {}
    session_id = data.get('session_id')
    
    try:
        session = InterviewSession.query.filter_by(id=session_id, user_id=current_user.id).first()
        if not session:
            return jsonify({"error": "Interview session not found"}), 404
        
        # Generate feedback using Gemini API
        feedback = generate_interview_feedback(session)
        
        session.feedback = json.dumps(feedback)
        session.status = 'completed'
        db.session.commit()
        
        return jsonify({
            "message": "Interview completed successfully",
            "feedback": feedback
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user-info')
@login_required
def user_info():
    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    })

# Helper functions
def extract_resume_keywords(filepath):
    """Extract keywords from uploaded PDF resume"""
    try:
        import PyPDF2
        import re
        from collections import Counter
        
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        
        # Common technical skills and keywords
        skill_patterns = [
            r'\b(?:python|java|javascript|typescript|c\+\+|c#|php|ruby|go|rust|swift|kotlin)\b',
            r'\b(?:react|angular|vue|node\.?js|express|django|flask|spring|laravel)\b',
            r'\b(?:html|css|sass|scss|bootstrap|tailwind)\b',
            r'\b(?:sql|mysql|postgresql|mongodb|redis|elasticsearch)\b',
            r'\b(?:aws|azure|gcp|docker|kubernetes|jenkins|git|github|gitlab)\b',
            r'\b(?:machine learning|data science|ai|tensorflow|pytorch|pandas|numpy)\b',
            r'\b(?:agile|scrum|devops|ci/cd|microservices|api|rest|graphql)\b'
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for pattern in skill_patterns:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            found_skills.extend(matches)
        
        # Additional keyword extraction from common resume terms
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text_lower)
        
        # Filter common resume keywords
        resume_keywords = ['experience', 'project', 'developed', 'designed', 'implemented', 
                          'managed', 'created', 'built', 'led', 'collaborated', 'analyzed',
                          'optimization', 'performance', 'testing', 'debugging', 'integration']
        
        found_keywords = [word for word in words if word in resume_keywords]
        
        # Combine and get most frequent
        all_keywords = found_skills + found_keywords
        if all_keywords:
            keyword_counts = Counter(all_keywords)
            return [keyword for keyword, count in keyword_counts.most_common(10)]
        else:
            # Fallback to basic skill detection
            basic_skills = ['programming', 'development', 'software', 'engineering', 'technical']
            return [skill for skill in basic_skills if skill in text_lower][:5]
        
    except Exception as e:
        print(f"Error extracting keywords: {e}")
        return ['general programming', 'software development']

def generate_interview_questions(mode, difficulty, role, keywords):
    """Generate interview questions using Gemini API"""
    try:
        from gemini import client
        
        if mode == 'resume':
            prompt = f"""Generate interview questions based on the following:
            - Difficulty: {difficulty}
            - Skills/Keywords: {', '.join(keywords)}
            
            Create 3 HR questions, 4 technical questions, and 3 cultural fit questions.
            Return as JSON with categories: hr_questions, technical_questions, cultural_questions"""
        else:
            prompt = f"""Generate interview questions for the role: {role}
            - Difficulty: {difficulty}
            
            Create 3 HR questions, 4 technical questions, and 3 cultural fit questions.
            Return as JSON with categories: hr_questions, technical_questions, cultural_questions"""
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        # Parse response and return structured questions
        questions_text = response.text
        
        # For now, return sample questions
        return {
            "hr_questions": [
                "Tell me about yourself and your career goals.",
                "Why are you interested in this position?",
                "What are your greatest strengths and weaknesses?"
            ],
            "technical_questions": [
                f"Explain your experience with {keywords[0] if keywords else 'programming'}.",
                "How do you approach problem-solving in software development?",
                "Describe a challenging project you've worked on.",
                "What's your experience with version control systems?"
            ],
            "cultural_questions": [
                "How do you handle working in a team environment?",
                "Describe a time when you had to adapt to change.",
                "What motivates you in your work?"
            ]
        }
        
    except Exception as e:
        print(f"Error generating questions: {e}")
        # Return default questions as fallback
        return {
            "hr_questions": ["Tell me about yourself.", "Why should we hire you?", "What are your career goals?"],
            "technical_questions": ["Explain your programming experience.", "How do you debug code?", "Describe your development process.", "What's your favorite programming language and why?"],
            "cultural_questions": ["How do you work in teams?", "Describe your work style.", "What motivates you?"]
        }

def generate_interview_feedback(session):
    """Generate feedback for completed interview using Gemini API"""
    try:
        from gemini import client
        
        questions = json.loads(session.questions)
        answers = json.loads(session.answers) if session.answers else []
        
        # Prepare interview data for analysis
        interview_data = []
        all_questions = []
        
        # Flatten questions from categories
        for category, question_list in questions.items():
            for q in question_list:
                all_questions.append({"category": category.replace("_", " ").title(), "text": q})
        
        # Pair questions with answers
        for i, question in enumerate(all_questions):
            answer = answers[i] if i < len(answers) and answers[i] else "No answer provided"
            interview_data.append({
                "category": question["category"],
                "question": question["text"],
                "answer": answer
            })
        
        # Create detailed prompt for Gemini
        analysis_prompt = f"""
        You are an expert HR interviewer and career coach. Analyze this interview session and provide detailed feedback.
        
        Interview Mode: {session.mode}
        Difficulty Level: {session.difficulty}
        Role: {session.role or 'General'}
        
        Interview Questions and Answers:
        {json.dumps(interview_data, indent=2)}
        
        Provide feedback in the following JSON format:
        {{
            "overall_score": number (0-100),
            "category_scores": {{
                "hr_performance": number (0-100),
                "technical_performance": number (0-100), 
                "cultural_fit": number (0-100)
            }},
            "strengths": [list of 3-5 specific strengths observed],
            "improvements": [list of 3-5 specific areas for improvement],
            "detailed_feedback": "comprehensive paragraph feedback"
        }}
        
        Scoring Criteria:
        - HR Performance: Communication skills, self-awareness, career goals
        - Technical Performance: Problem-solving, technical knowledge, methodology
        - Cultural Fit: Team collaboration, adaptability, values alignment
        
        Be constructive, specific, and encouraging while providing actionable feedback.
        """
        
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=analysis_prompt
            )
            
            if response.text:
                # Try to parse the JSON response
                import re
                json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
                if json_match:
                    feedback_data = json.loads(json_match.group())
                    return feedback_data
            
        except Exception as gemini_error:
            print(f"Gemini API error: {gemini_error}")
        
        # Fallback: Generate structured feedback based on answer quality
        feedback = analyze_answers_locally(interview_data, session)
        return feedback
        
    except Exception as e:
        print(f"Error generating feedback: {e}")
        return generate_fallback_feedback()

def analyze_answers_locally(interview_data, session):
    """Local fallback analysis when Gemini API is not available"""
    total_answers = len([item for item in interview_data if item['answer'] != "No answer provided"])
    answer_quality_score = min(100, (total_answers / len(interview_data)) * 100)
    
    # Calculate average answer length as a proxy for detail
    answer_lengths = [len(item['answer']) for item in interview_data if item['answer'] != "No answer provided"]
    avg_length = sum(answer_lengths) / len(answer_lengths) if answer_lengths else 0
    
    # Score based on completeness and detail
    completeness_score = (total_answers / len(interview_data)) * 100
    detail_score = min(100, (avg_length / 50) * 100)  # 50 chars as baseline
    
    overall_score = int((completeness_score + detail_score) / 2)
    
    # Generate category scores
    hr_score = max(60, min(100, overall_score + (10 if avg_length > 30 else -10)))
    tech_score = max(50, min(100, overall_score - 5))
    cultural_score = max(65, min(100, overall_score + 5))
    
    # Generate strengths and improvements based on performance
    strengths = []
    improvements = []
    
    if total_answers > len(interview_data) * 0.8:
        strengths.append("Provided comprehensive answers to most questions")
    if avg_length > 40:
        strengths.append("Gave detailed and thoughtful responses")
    
    if total_answers < len(interview_data) * 0.7:
        improvements.append("Try to answer all questions completely")
    if avg_length < 30:
        improvements.append("Provide more detailed explanations and examples")
    
    # Add default feedback items
    if not strengths:
        strengths = ["Participated in the interview process", "Showed willingness to answer questions"]
    if not improvements:
        improvements = ["Continue practicing interview skills", "Consider preparing more specific examples"]
    
    return {
        "overall_score": overall_score,
        "category_scores": {
            "hr_performance": hr_score,
            "technical_performance": tech_score,
            "cultural_fit": cultural_score
        },
        "strengths": strengths,
        "improvements": improvements,
        "detailed_feedback": f"You completed {total_answers} out of {len(interview_data)} questions with an average response length of {int(avg_length)} characters. Focus on providing more comprehensive answers and specific examples to improve your interview performance."
    }

def generate_fallback_feedback():
    """Generate basic feedback when all else fails"""
    return {
        "overall_score": 70,
        "category_scores": {
            "hr_performance": 70,
            "technical_performance": 65,
            "cultural_fit": 75
        },
        "strengths": ["Completed the interview session", "Demonstrated interest in the role"],
        "improvements": ["Practice answering questions more thoroughly", "Prepare specific examples from your experience"],
        "detailed_feedback": "Thank you for completing the interview session. Continue practicing to improve your interview skills and confidence."
    }

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)