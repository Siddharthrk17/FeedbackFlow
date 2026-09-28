# FeedbackFlow

A Course Feedback Collection System built with Spring Boot (backend) and React + Vite (frontend).

## Tech Stack
- **Backend**: Spring Boot 3, Spring Data JPA, H2 (in-memory), Jakarta Validation
- **Frontend**: React 18, Vite, React Router, Lucide React

## Project Structure
```
feedbackflow/
├── backend/     ← Spring Boot application (port 8080)
└── frontend/    ← React + Vite application (port 5173)
```

## Running the Project

### Backend
```bash
cd backend
mvn spring-boot:run
```
API available at: `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
UI available at: `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List all courses |
| GET | `/api/forms` | List all feedback forms |
| POST | `/api/feedback/forms` | Create a feedback form |
| POST | `/api/feedback/responses` | Submit student response |
| GET | `/api/feedback/summary/{facultyName}` | Faculty feedback summary |

## Features
1. Create feedback forms with rating questions per course
2. Students submit one response per course per semester
3. Average ratings computed per question and overall
4. Faculty dashboard showing feedback across all courses
5. Business rules enforced in service layer (no duplicate submissions, deadline enforcement)
