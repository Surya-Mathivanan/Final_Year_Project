# Database models for Interview Assistant
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)  # Removed unique constraint
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with interview sessions
    sessions = db.relationship('InterviewSession', backref='user', lazy=True)
    
    def __repr__(self):
        return f'<User {self.username}>'

class InterviewSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    mode = db.Column(db.String(20), nullable=False)  # 'resume' or 'role'
    difficulty = db.Column(db.String(20), nullable=False)  # 'beginner', 'intermediate', 'advanced'
    role = db.Column(db.String(100))  # For role-based mode
    questions = db.Column(db.Text)  # JSON string of questions
    answers = db.Column(db.Text)  # JSON string of answers
    feedback = db.Column(db.Text)  # JSON string of feedback
    status = db.Column(db.String(20), default='active')  # 'active', 'completed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<InterviewSession {self.id} - {self.mode} - {self.status}>'