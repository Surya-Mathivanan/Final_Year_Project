# LLM-Powered Cognitive Interview Assistant

## Overview

The LLM-Powered Cognitive Interview Assistant is a full-stack web application designed to help students and freshers practice HR and technical interviews. The application provides two interview modes: resume-based (where users upload a PDF resume) and role-based (where users select from predefined roles). It uses AI to generate contextual interview questions, evaluate responses, and provide comprehensive feedback to help users improve their interview skills.

## How to Run (Windows)

### Prerequisites
- Python 3.11 or higher
- Node.js (version 16 or higher)
- uv (Python package manager) - Install from https://github.com/astral-sh/uv

### Setup Instructions

1. **Clone or navigate to the project directory**
   ```
   cd e:/FINAL YEAR PROJECT/Project
   ```

2. **Set up Backend**
   - Install Python dependencies using uv:
     ```
     uv sync
     ```
   - Configure environment variables:
     - Copy `.env` file and update the placeholder values:
       - `SESSION_SECRET`: Generate a secure random string
       - `GEMINI_API_KEY`: Get from Google AI Studio
       - `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET`: Set up in Google Cloud Console
       - `DATABASE_URL`: Already configured for PostgreSQL (or use SQLite for local development)
     - Note: Some values are already filled in the provided `.env` file

3. **Set up Frontend**
   - Navigate to frontend directory:
     ```
     cd frontend
     ```
   - Install Node.js dependencies:
     ```
     npm install
     ```
   - Note: There's a port conflict between Vite (port 5000) and Flask (port 5000). To resolve:
     - Either change Vite port in `frontend/vite.config.js` to 3000
     - Or run Flask on a different port (e.g., 8000)

4. **Run the Application**
   - **Backend** (in project root):
     ```
     python backend/app.py
     ```
     - Runs on http://localhost:5000
     - In production, this serves the built frontend

   - **Frontend** (in separate terminal, from project root):
     ```
     cd frontend
     npm run dev
     ```
     - If port conflict resolved, runs on http://localhost:3000 (or 5000 if changed)
     - For production build: `npm run build` then `npm run preview`

5. **Access the Application**
   - Open your browser and go to http://localhost:5000 (backend serving frontend in production)
   - Or http://localhost:3000 for development frontend (if running separately)

### Development Notes
- The backend serves the React frontend in production mode from the `frontend/dist` directory
- For development, run both servers separately for hot reloading
- Database: Uses SQLite by default for development (easily switchable to PostgreSQL)
- API endpoints are available at `/api/*` routes

### Troubleshooting
- If you encounter port conflicts, change the Vite port in `vite.config.js`
- Ensure all environment variables are set correctly
- For database issues, check the `DATABASE_URL` in `.env`
- If Google OAuth doesn't work, verify the redirect URIs in Google Cloud Console

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: React 19.1.1 with Vite as the build tool
- **Styling**: Custom CSS with professional gradient designs and responsive layouts
- **Development Server**: Configured to run on port 5000 with HMR (Hot Module Replacement)
- **Build Process**: Uses Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Python Flask with RESTful API design
- **Authentication**: Google OAuth 2.0 integration using flask-login for session management
- **File Handling**: Secure file upload system for PDF resumes with 16MB size limit
- **AI Integration**: Google Gemini AI (gemini-2.5-flash/pro models) for question generation and response evaluation
- **CORS**: Enabled to support cross-origin requests from the React frontend

### Data Storage
- **Database**: SQLite for development (easily upgradeable to PostgreSQL for production)
- **ORM**: SQLAlchemy for database operations and model definitions
- **Schema Design**:
  - User model: Stores user authentication data and profile information
  - InterviewSession model: Tracks interview sessions, questions, answers, and feedback
  - Relationship: One-to-many between users and interview sessions

### Authentication System
- **Provider**: Google OAuth 2.0 for secure user authentication
- **Session Management**: Flask-Login for maintaining user sessions
- **Security**: Environment-based secret key management for session security

### AI and Natural Language Processing
- **Primary AI Model**: Google Gemini 2.5 series for intelligent question generation
- **Capabilities**: 
  - Resume content analysis and keyword extraction
  - Context-aware interview question generation
  - Response evaluation with sentiment analysis
  - Structured feedback generation using Pydantic models

## External Dependencies

### Third-Party Services
- **Google Cloud Services**:
  - Google OAuth 2.0 API for user authentication
  - Google Gemini AI API for natural language processing and question generation
- **OAuth Configuration**: Requires Google Cloud Console setup with authorized redirect URIs

### Key Python Packages
- **Flask Ecosystem**: flask, flask-cors, flask-sqlalchemy, flask-login
- **Authentication**: oauthlib for OAuth 2.0 client implementation
- **AI Integration**: google-genai SDK for Gemini AI model access
- **Data Validation**: pydantic for structured AI response parsing
- **File Security**: werkzeug for secure filename handling

### Frontend Dependencies
- **React**: Core framework for component-based UI
- **Vite**: Modern build tool for fast development and optimized bundling
- **Development Tools**: @vitejs/plugin-react for React-specific Vite optimizations

### Environment Configuration
- **Required Environment Variables**:
  - SESSION_SECRET: Flask session encryption key
  - GOOGLE_OAUTH_CLIENT_ID: Google OAuth application identifier
  - GOOGLE_OAUTH_CLIENT_SECRET: Google OAuth application secret
  - GEMINI_API_KEY: Google AI API key for Gemini model access
  - REPLIT_DEV_DOMAIN: Domain configuration for OAuth redirects

### Database Choice: PostgreSQL vs MySQL

For this LLM-Powered Cognitive Interview Assistant project, **PostgreSQL is the recommended database** over MySQL. Here's a detailed comparison and reasoning:

#### Project Requirements Analysis
- **Data Complexity**: The application handles user profiles, interview sessions, AI-generated questions/answers, feedback, and potentially parsed resume data (which may include JSON structures).
- **Query Patterns**: Needs support for complex queries, potentially full-text search on interview responses, and analytics on user performance.
- **Scalability**: As a web application that may grow, it requires robust concurrency handling and ACID compliance.
- **AI Integration**: May need to store structured AI responses or metadata in JSON format.

#### PostgreSQL Advantages for This Project
- **JSON/JSONB Support**: Native support for storing and querying JSON data, perfect for AI responses, resume metadata, or structured feedback.
- **Advanced Features**: Full-text search, advanced indexing, window functions, and complex query capabilities ideal for interview analytics.
- **Data Integrity**: Strong ACID compliance and transactional support, crucial for maintaining consistency in user sessions and feedback.
- **Extensibility**: Rich ecosystem of extensions and better support for custom data types.
- **Concurrency**: Superior handling of concurrent connections, important for a multi-user interview platform.
- **Community and Ecosystem**: Excellent Python integration via psycopg2, widely used in Flask/SQLAlchemy applications.

#### MySQL Considerations
- **Simplicity**: Easier setup and slightly faster for simple CRUD operations.
- **Familiarity**: More commonly used in some environments.
- **Performance**: Can be faster for read-heavy workloads with simpler queries.

#### Recommendation
PostgreSQL is better suited due to the project's need for complex data handling, AI integration, and potential for advanced analytics. The existing SQLAlchemy setup makes migration straightforward.

### PostgreSQL Setup and Configuration

#### 1. Installation
**On Windows:**
- Download and install PostgreSQL from the official website: https://www.postgresql.org/download/windows/
- During installation, note the password for the 'postgres' user.
- Alternatively, use a package manager like Chocolatey: `choco install postgresql`

**On Linux/Ubuntu:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**On macOS:**
```bash
brew install postgresql
```

#### 2. Database Creation
After installation, create a database for your project:

**Using psql command line:**
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE interview_assistant;

# Create user (optional, for better security)
CREATE USER interview_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE interview_assistant TO interview_user;

# Exit
\q
```

**Using pgAdmin (GUI tool included with PostgreSQL):**
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name: `interview_assistant`
5. Owner: `postgres` (or your created user)

#### 3. Python Dependencies
Install PostgreSQL adapter for SQLAlchemy:

```bash
pip install psycopg2-binary
```

Or add to your `requirements.txt` or `pyproject.toml`:
```
psycopg2-binary==2.9.9
```

#### 4. Environment Configuration
Create or update your `.env` file with PostgreSQL connection details:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/interview_assistant
# Or if using a custom user:
# DATABASE_URL=postgresql://interview_user:your_secure_password@localhost:5432/interview_assistant

# Other existing variables...
SESSION_SECRET=your-secret-key-here
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret
GEMINI_API_KEY=your-gemini-api-key
```

**Security Note:** Never commit `.env` files to version control. Add `.env` to your `.gitignore`.

#### 5. Flask Configuration Update
Update your `backend/app.py` configuration to use PostgreSQL:

**Original SQLite Configuration:**
```python
app.config['SECRET_KEY'] = os.environ.get('SESSION_SECRET', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///interview_assistant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
```

**Updated PostgreSQL Configuration:**
```python
import os

app.config['SECRET_KEY'] = os.environ.get('SESSION_SECRET', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:your_password@localhost:5432/interview_assistant')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
```

**Alternative: Using URL parsing for flexibility:**
```python
from urllib.parse import urlparse

database_url = os.environ.get('DATABASE_URL', 'postgresql://postgres:your_password@localhost:5432/interview_assistant')
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
```

#### 6. Database Migration
Since you're using SQLAlchemy, migrate your existing data:

**If starting fresh:**
1. Delete any existing `interview_assistant.db` file
2. Run your Flask application - SQLAlchemy will create tables automatically

**If migrating from SQLite:**
1. Use a tool like `pgloader` or export/import data manually
2. Or recreate tables and import data programmatically

#### 7. Testing the Connection
Add a simple test in your Flask app to verify the connection:

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
# ... your config ...

db = SQLAlchemy(app)

@app.route('/test-db')
def test_db():
    try:
        db.engine.execute('SELECT 1')
        return 'Database connection successful!'
    except Exception as e:
        return f'Database connection failed: {str(e)}'
```

#### 8. Production Considerations
- **Connection Pooling**: For production, consider using `SQLAlchemy` connection pooling
- **SSL**: Enable SSL for secure connections: `postgresql://user:pass@host/db?sslmode=require`
- **Environment Variables**: Always use environment variables for sensitive data
- **Backup**: Set up regular database backups
- **Monitoring**: Monitor connection counts and query performance

#### 9. Troubleshooting Common Issues
- **Connection Refused**: Ensure PostgreSQL service is running and port 5432 is accessible
- **Authentication Failed**: Verify username/password in connection string
- **Database Does Not Exist**: Create the database first using psql or pgAdmin
- **Import Errors**: Ensure `psycopg2-binary` is installed correctly
- **Migration Issues**: Check SQLAlchemy model definitions for PostgreSQL compatibility

### Database Migration Strategy
- **Current**: SQLite for rapid development and testing
- **Production Ready**: Architecture supports easy migration to PostgreSQL (now implemented)
- **Scalability**: SQLAlchemy ORM abstracts database specifics for seamless transitions