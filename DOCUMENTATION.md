# Study Buddy - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Project Structure](#project-structure)
6. [Features](#features)
7. [Installation & Setup](#installation--setup)
8. [API Documentation](#api-documentation)
9. [Pages & Components](#pages--components)
10. [Authentication System](#authentication-system)
11. [Key Algorithms & Logic](#key-algorithms--logic)
12. [Getting Started](#getting-started)

---

## Project Overview

**Study Buddy** is an intelligent, AI-powered study companion web application designed to help students optimize their learning strategies and improve academic performance. The application tracks student performance across multiple subjects, generates AI-based predictions about future grades, and provides personalized study hour recommendations.

### Core Objectives
- **Track Performance**: Log exam scores and study hours for each subject
- **Predict Grades**: Use AI algorithms to predict future academic performance
- **Generate Recommendations**: Provide intelligent study hour recommendations based on subject difficulty and current performance
- **Visualize Progress**: Display comprehensive dashboards with performance metrics and trends

### Target Users
- Students wanting to optimize their study strategies
- Educators monitoring student progress
- Academic advisors helping students plan their workload

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16.2.9 (Latest version with breaking changes)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Client Storage**: Dexie (IndexedDB) + dexie-react-hooks — the frontend persists user data locally in the browser using Dexie/IndexedDB for responsive UI and offline-capable workflows
- **Forms**: React Hook Form with Zod validation
- **Visualization**: Recharts 3.8.1

### Backend & Database
- **Runtime**: Node.js (via Next.js API routes)
- **ORM**: Prisma 7.8.0 (configured via DATABASE_URL). The backend is present and can connect to a server-side database (MySQL/MariaDB in production). For local development and quick demos the project also includes a local SQLite database file (`dev.db`) and the Prisma datasource can be switched to SQLite via the DATABASE_URL environment variable.
- **Authentication**: JWT (Jose library)
- **Password Hashing**: bcryptjs 3.0.3

### Development Tools
- **Language**: TypeScript 5
- **Linting**: ESLint 9
- **Package Manager**: npm (specified in scripts)

---

## Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────┐
│                  Next.js Application                │  
├─────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐   │
│  │  Frontend (React Components)                 │   │
│  │  - Pages (Login, Dashboard, Predictions...)  │   │
│  │  - Reusable Components (Button, Card, Input) │   │
│  └──────────────────────────────────────────────┘   │
│            ↑                        ↑               │ 
│            │                        │               │ 
│  ┌─────────┴────────────────────────┴────────────┐  │
│  │  API Routes (Backend Logic)                   │  │
│  │  - /api/auth/* (Login, Register, Logout)      │  │
│  │  - /api/subjects/* (Subject CRUD)             │  │
│  │  - /api/performance/* (Track scores/hours)    │  │
│  │  - /api/predictions/* (AI predictions)        │  │
│  │  - /api/recommendations/* (Study recommendations)│
│  └──────────────────────────────────────────────┘   │
│            ↑                                        │
│            │                                        │
│  ┌─────────┴──────────────────────────────────┐     │
│  │  Database Layer (Prisma Client)            │     │
│  │  - Connects to MySQL database              │     │
│  │  - Handles all CRUD operations             │     │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
            ↑
            │
    ┌───────┴──────────┐
    │   MySQL Database  │
    │   (MariaDB)       │
    └──────────────────┘
```

Note: The frontend uses Dexie (IndexedDB) to store subjects, performance entries, predictions and recommendations locally in the browser for a responsive, offline-friendly user experience. The backend API (Prisma + a server-side database) is included and can be used for centralized storage, multi-user scenarios, or production deployments. The application currently supports running with local IndexedDB only (frontend-first) while the backend Prisma layer is available as an opt-in component depending on your DATABASE_URL configuration.

### Request Flow Example
```
User Action → React Component → HTTP Request → 
API Route Handler → Prisma Client → Database → 
JSON Response → Component State Update → UI Render
```

---

## Database Schema

### Entity Relationship Diagram
```
┌──────────────────┐
│     Student      │
├──────────────────┤
│ id (PK)          │
│ name             │
│ email (unique)   │
│ password         │
│ createdAt        │
└──────────────────┘
    ├── 1:N Performance
    ├── 1:N AIPrediction
    └── 1:N StudyRecommendation

┌──────────────────┐
│     Subject      │
├──────────────────┤
│ id (PK)          │
│ name             │
│ creditHours      │
│ difficulty       │
└──────────────────┘
    ├── 1:N Performance
    ├── 1:N AIPrediction
    └── 1:N StudyRecommendation

┌──────────────────┐
│   Performance    │
├──────────────────┤
│ id (PK)          │
│ studentId (FK)   │
│ subjectId (FK)   │
│ score            │
│ studyHours       │
│ grade            │
│ createdAt        │
└──────────────────┘

┌──────────────────────┐
│   AIPrediction       │
├──────────────────────┤
│ id (PK)              │
│ studentId (FK)       │
│ subjectId (FK)       │
│ predictedGrade       │
│ classification       │
│ finalScore           │
│ createdAt            │
└──────────────────────┘

┌──────────────────────────┐
│  StudyRecommendation     │
├──────────────────────────┤
│ id (PK)                  │
│ studentId (FK)           │
│ subjectId (FK)           │
│ recommendedHours         │
│ classification           │
│ createdAt                │
└──────────────────────────┘
```

### Schema Details

**Student Table**
- Stores user account information
- Email must be unique for login
- Password is hashed with bcryptjs
- Timestamps creation for audit

**Subject Table**
- Represents academic subjects/courses
- Difficulty levels: 1 (Easy), 2 (Medium), 3 (Hard)
- Credit hours represent course weight

**Performance Table**
- Records each score entry with study hours
- Tracks temporal data (when entered)
- Links student and subject together

**AIPrediction Table**
- Stores AI-generated grade predictions
- Classification: "Weak" (< 60%), "Average" (60-85%), "Strong" (> 85%)
- Final score is the calculated prediction

**StudyRecommendation Table**
- Personalized study hour recommendations
- Based on performance and difficulty
- Timestamps when recommendation was created

---

## Project Structure

```
study-buddy/
├── app/                          # Next.js App Router
│   ├── api/                     # API Route Handlers
│   │   ├── auth/
│   │   │   ├── login/route.ts           # JWT login endpoint
│   │   │   ├── logout/route.ts          # Session cleanup
│   │   │   └── register/route.ts        # User registration
│   │   ├── performance/route.ts         # Track scores & study hours
│   │   ├── predictions/route.ts         # AI prediction endpoint
│   │   ├── recommendations/route.ts     # Study recommendations
│   │   └── subjects/
│   │       ├── route.ts                 # List & create subjects
│   │       └── [id]/route.ts            # Individual subject management
│   │
│   ├── admin/page.tsx           # Admin dashboard
│   ├── dashboard/page.tsx       # Student dashboard with charts
│   ├── data-entry/page.tsx      # Form to log performance
│   ├── login/page.tsx           # Login page
│   ├── predictions/page.tsx     # AI predictions view
│   ├── recommendations/page.tsx # Recommendations view
│   ├── register/page.tsx        # Registration page
│   ├── subjects/page.tsx        # Subject management
│   ├── layout.tsx               # Global layout wrapper
│   └── page.tsx                 # Home/landing page
│
├── components/                   # Reusable React Components
│   ├── Button.tsx               # Styled button component
│   ├── Card.tsx                 # Container card component
│   ├── Input.tsx                # Form input field
│   ├── Navbar.tsx               # Navigation bar
│   └── SummaryCard.tsx          # Statistics display card
│
├── lib/                         # Library & Utility Code
│   └── prisma.ts               # Prisma client singleton
│
├── prisma/                      # Database Configuration
│   ├── schema.prisma           # Data models
│   └── migrations/             # Database migration history
│
├── types/                       # TypeScript Type Definitions
│   └── index.ts                # Zod schemas, interfaces, constants
│
├── public/                      # Static assets
│   ├── *.svg                   # Logos and icons
│   └── *.ico                   # Favicon
│
├── Configuration Files
│   ├── next.config.ts          # Next.js configuration
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.js      # Tailwind CSS config
│   ├── package.json            # Dependencies
│   └── eslint.config.mjs       # Linting rules
│
└── Documentation
    ├── README.md               # Getting started (default)
    ├── DOCUMENTATION.md        # This comprehensive guide
    ├── AGENTS.md               # AI agent guidelines
    └── CLAUDE.md               # References AGENTS.md
```

---

## Features

### 1. Authentication System
**Login**
- Email & password validation
- Secure password comparison using bcryptjs
- JWT token generation with 24-hour expiration
- HTTP-only cookie storage for session management

**Registration**
- Email uniqueness validation
- Password hashing before storage
- Automatic user creation
- Input validation with Zod schemas

**Logout**
- Session cleanup
- Cookie removal

### 2. Subject Management
- Create new subjects with difficulty ratings
- List all available subjects
- Associate credit hours with subjects
- Filter and sort subjects

### 3. Performance Tracking
- Log exam scores (0-100)
- Record study hours per session
- Timestamped entries for historical analysis
- Associate performance with student + subject

### 4. Dashboard & Visualization
- **Key Metrics Display**:
  - Total subjects enrolled
  - Average score across all subjects
  - Number of weak subjects (score < 60%)
  
- **Charts & Graphs**:
  - Bar chart: Latest scores vs total study hours
  - Performance data visualization
  - Subject breakdown by score

### 5. AI Predictions
- Predict future grades based on historical performance
- Performance classification:
  - **Weak**: Average score < 60%
  - **Average**: Score between 60-85%
  - **Strong**: Average score > 85%
- Calculate predicted final scores

### 6. Study Recommendations
- Intelligent hourly recommendations based on:
  - Subject difficulty (1-3 scale)
  - Current performance classification
  - Weak subjects get 2x recommended hours
  - Strong subjects get 0.75x recommended hours
  - Average subjects maintain base hours
- Personalized to each subject

### 7. Data-Driven Insights
- View performance history in tabular format
- Color-coded score indicators:
  - Green: Score ≥ 70% (Good)
  - Yellow: Score 50-69% (Average)
  - Red: Score < 50% (Weak)
- Recent history pagination

---

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MySQL Server running (or MariaDB)
- npm or yarn package manager

### Step-by-Step Setup

1. **Clone/Navigate to Project**
   ```bash
   cd study-buddy
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Create a `.env.local` file in the root:
   ```
   # Database
   DATABASE_URL="mysql://user:password@localhost:3306/study_buddy"
   
   # JWT Secret (use a strong random string for production)
   JWT_SECRET="your-secret-key-here"
   
   # Node Environment
   NODE_ENV="development"
   ```

4. **Setup Database**
   ```bash
   # Push Prisma schema to database
   npx prisma migrate dev --name init
   
   # Optional: Open Prisma Studio to view/manage data
   npx prisma studio
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:3000`

6. **Build for Production**
   ```bash
   npm run build
   npm run start
   ```

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### POST `/auth/register`
Register a new student account
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (201):
{
  "message": "User registered successfully",
  "userId": "clx4a5b6c7d8e9f0g"
}

Response (400):
{
  "error": "User already exists"
}
```

#### POST `/auth/login`
Authenticate and receive session token
```json
Request:
{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": "clx4a5b6c7d8e9f0g",
    "email": "john@example.com",
    "name": "John Doe"
  }
}

Response (401):
{
  "error": "Invalid email or password"
}
```
*Sets `session` cookie (HTTP-only, 24h expiration)*

#### POST `/auth/logout`
Clear session
```json
Response (200):
{
  "message": "Logout successful"
}
```

### Subject Endpoints

#### GET `/subjects`
Fetch all subjects (requires authentication)
```json
Response (200):
[
  {
    "id": "clx4a5b6c7d8e9f0g",
    "name": "Mathematics",
    "creditHours": 4,
    "difficulty": 2
  },
  {
    "id": "clx4a5b6c7d8e9f0h",
    "name": "Chemistry",
    "creditHours": 3,
    "difficulty": 3
  }
]

Response (401):
{
  "error": "Unauthorized"
}
```

#### POST `/subjects`
Create a new subject (requires authentication)
```json
Request:
{
  "name": "Physics",
  "creditHours": 4,
  "difficulty": 3
}

Response (201):
{
  "id": "clx4a5b6c7d8e9f0i",
  "name": "Physics",
  "creditHours": 4,
  "difficulty": 3
}

Response (400):
{
  "error": "Validation failed"
}
```

### Performance Endpoints

#### GET `/performance`
Get all performance records for logged-in student
```json
Response (200):
[
  {
    "id": "clx4a5b6c7d8e9f0j",
    "studentId": "clx4a5b6c7d8e9f0g",
    "subjectId": "clx4a5b6c7d8e9f0g",
    "score": 85,
    "studyHours": 5.5,
    "grade": "A",
    "createdAt": "2026-06-15T10:30:00Z",
    "subject": {
      "id": "clx4a5b6c7d8e9f0g",
      "name": "Mathematics",
      "creditHours": 4,
      "difficulty": 2
    }
  }
]
```

#### POST `/performance`
Record a new performance entry (requires authentication)
```json
Request:
{
  "subjectId": "clx4a5b6c7d8e9f0g",
  "score": 85,
  "studyHours": 5.5
}

Response (201):
{
  "id": "clx4a5b6c7d8e9f0j",
  "studentId": "clx4a5b6c7d8e9f0g",
  "subjectId": "clx4a5b6c7d8e9f0g",
  "score": 85,
  "studyHours": 5.5,
  "grade": null,
  "createdAt": "2026-06-15T10:30:00Z",
  "subject": {...}
}

Response (400):
{
  "error": "Score must be between 0 and 100"
}
```

### Predictions Endpoint

#### POST `/predictions`
Trigger AI prediction calculation
```json
Response (200):
{
  "message": "Predictions triggered"
}
```

### Recommendations Endpoint

#### GET `/recommendations`
Get personalized study recommendations
```json
Response (200):
[
  {
    "subjectId": "clx4a5b6c7d8e9f0g",
    "subjectName": "Mathematics",
    "classification": "Average",
    "recommendedHours": 4.5,
    "avgScore": 72
  },
  {
    "subjectId": "clx4a5b6c7d8e9f0h",
    "subjectName": "Chemistry",
    "classification": "Weak",
    "recommendedHours": 9,
    "avgScore": 55
  }
]
```

---

## Pages & Components

### Pages

#### Home Page (`/`)
- Landing page with project introduction
- Quick navigation buttons (Login/Register)
- Summary cards showing system statistics

#### Login Page (`/login`)
- Email & password form
- Client-side validation
- Redirect to dashboard on success
- Error message display

#### Register Page (`/register`)
- Name, email, password form
- Password confirmation
- Terms & conditions (optional)
- Auto-login after successful registration

#### Dashboard (`/dashboard`)
- **Overview Cards**: Total subjects, avg score, weak subjects count
- **Performance Chart**: Bar chart of scores vs study hours
- **Quick Actions**: Links to predictions, recommendations, data entry
- Responsive grid layout
- Loading states

#### Data Entry (`/data-entry`)
- Form to log new performance records
- Subject dropdown selection
- Score input (0-100)
- Study hours input
- Recent history table with color-coded scores
- Real-time form validation

#### Predictions (`/predictions`)
- Display AI-predicted grades
- Classification badges (Weak/Average/Strong)
- Predicted vs actual scores comparison
- Subject-wise breakdown

#### Recommendations (`/recommendations`)
- Personalized study hour recommendations
- Difficulty-based suggestions
- Performance-based adjustments
- Interactive recommendation cards

#### Subjects (`/subjects`)
- List of all subjects
- Create new subject form
- Subject difficulty levels
- Credit hour display

#### Admin (`/admin`)
- System overview and statistics
- User management (if implemented)
- Subject administration

### Components

#### Button.tsx
Reusable button component with variants
```typescript
Props:
- variant: "primary" | "secondary" | "tab" | "danger"
- active: boolean (for tab navigation)
- disabled: boolean
- onClick: function
- children: React elements
```

#### Card.tsx
Container component for content sections
```typescript
Props:
- title: string (optional)
- children: React elements
- className: string (optional)
- style: CSS properties
```

#### Input.tsx
Form input field with styling
```typescript
Props:
- type: string (text, number, email, password, etc.)
- placeholder: string
- value: string/number
- onChange: function
- disabled: boolean
- step: string (for number inputs)
- register: React Hook Form register
```

#### Navbar.tsx
Navigation header with links and user info
```typescript
Props:
- currentUser: User object (optional)
- onLogout: function
```

#### SummaryCard.tsx
Statistics display card
```typescript
Props:
- title: string
- value: string | number
- variant: "primary" | "success" | "error"
```

---

## Authentication System

### JWT Token Structure
- **Header**: `{ "alg": "HS256", "typ": "JWT" }`
- **Payload**: 
  ```json
  {
    "userId": "student_id",
    "email": "student@email.com",
    "name": "Student Name",
    "iat": 1234567890,
    "exp": 1234654290
  }
  ```
- **Expiration**: 24 hours from issue
- **Secret**: Configured via `JWT_SECRET` environment variable

### Token Storage
- Stored in `session` cookie
- HTTP-only flag (prevents XSS access)
- Secure flag in production (HTTPS only)
- SameSite: "lax" (CSRF protection)

### Protected Routes
All API routes except `/auth/login` and `/auth/register` require:
1. Valid `session` cookie
2. Valid JWT signature
3. Non-expired token

Token verification happens via `jwtVerify()` from jose library at route entry point.

---

## Key Algorithms & Logic

### Recommendation Algorithm
```typescript
Algorithm: generateStudyRecommendations(subject, performances)
Input: Subject object, array of recent performances
Output: Recommendation object with hours

Steps:
1. Calculate average score from recent performances
2. Determine classification:
   - IF avgScore < 60 THEN classification = "Weak"
   - ELSE IF avgScore > 85 THEN classification = "Strong"
   - ELSE classification = "Average"

3. Calculate base hours = subject.difficulty * 2
   (difficulty: 1=Easy, 2=Medium, 3=Hard)
   
4. Adjust based on classification:
   - Weak subjects: hours = hours * 2 (double effort)
   - Strong subjects: hours = hours * 0.75 (reduce effort)
   - Average subjects: no adjustment

5. Round to 1 decimal place
6. Return recommendation object
```

### Performance Analysis
```typescript
Algorithm: calculateDashboardStats(performances, subjects)

1. Total Subjects = COUNT(unique subjects in performances)

2. Average Score = SUM(all scores) / COUNT(scores)
   Or 0 if no performances

3. Weak Subjects Count:
   FOR EACH subject:
     avg_score = SUM(scores for subject) / COUNT(scores for subject)
     IF avg_score < 60 THEN increment weak_count

4. Performance Data for Charts:
   FOR EACH subject:
     latest_score = performances[0].score (sorted by date desc)
     total_hours = SUM(study_hours for subject)
     ADD to chart data
```

### Classification Logic
```typescript
IF score < 60:
   Classification = "Weak"
   Indicator Color = Red (#E74C3C)
   
ELSE IF 60 <= score < 70:
   Classification = "Average-Low"
   Indicator Color = Yellow (#F39C12)
   
ELSE IF 70 <= score < 85:
   Classification = "Average-High"
   Indicator Color = Yellow (#F39C12)
   
ELSE IF score >= 85:
   Classification = "Strong"
   Indicator Color = Green (#27AE60)
```

---

## Getting Started

### For Development

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Access Application**
   Open browser to `http://localhost:3000`

3. **Test Features**
   - Register a new account
   - Add subjects
   - Log performance data
   - View dashboard
   - Check predictions and recommendations

4. **View Database** (optional)
   ```bash
   npx prisma studio
   ```
   Access at `http://localhost:5555`

### Common Tasks

**Troubleshooting Connection Issues**
```bash
# Verify database connection
npm run test-prisma

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

**Updating Database Schema**
1. Modify `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name description_of_change`
3. Prisma will generate migration files

**Adding New API Routes**
1. Create file: `app/api/[resource]/route.ts`
2. Implement GET/POST/PUT/DELETE handlers
3. Add authentication check if needed
4. Return NextResponse.json()

**Creating New Pages**
1. Create directory: `app/[page-name]/`
2. Create file: `page.tsx` inside
3. Define default export React component
4. Add navigation link in Navbar

---

## Environment Variables Reference

```env
# Database Connection (required)
DATABASE_URL="mysql://user:password@localhost:3306/study_buddy"

# JWT Secret (use strong random string in production)
JWT_SECRET="your-super-secret-key-minimum-32-characters"

# Environment Mode
NODE_ENV="development" # or "production"

# Optional: Debug logging
DEBUG="prisma:*"
```

---

## Type System & Validation

The project uses **Zod** for runtime schema validation:

### Auth Schema
```typescript
email: required, valid email format
password: min 6 characters
name: optional, min 2 characters
```

### Subject Schema
```typescript
name: required, non-empty string
creditHours: required, minimum 1
difficulty: required, 1-3 (Easy to Hard)
```

### Performance Schema
```typescript
subjectId: required, valid ID
score: required, 0-100 range
studyHours: required, non-negative number
```

---

## Security Features

1. **Password Security**: bcryptjs hashing with salt rounds
2. **SQL Injection Prevention**: Prisma parameterized queries
3. **XSS Protection**: React automatic escaping + HTTP-only cookies
4. **CSRF Protection**: SameSite cookie attribute
5. **JWT Token Management**: Time-limited tokens with secret signing
6. **Input Validation**: Zod schema validation on all inputs
7. **Environment Variables**: Sensitive data never hardcoded

---

## Performance Considerations

1. **Database Queries**: 
   - Implemented pagination in history views
   - Selected fields to minimize data transfer
   - Indexed unique fields (email)

2. **Frontend Optimization**:
   - Next.js automatic code splitting
   - Responsive components for different screen sizes
   - Lazy loading for charts (Recharts)

3. **Caching**:
   - User session cached in HTTP-only cookie
   - JWT reused until expiration

---

## Future Enhancements

Potential features for future versions:
1. **Machine Learning**: Replace prediction placeholder with actual ML model
2. **Study Plan Generation**: Auto-generate weekly study schedules
3. **Goal Setting**: User-defined academic goals and tracking
4. **Collaboration**: Group study features and peer comparison
5. **Mobile App**: React Native version for mobile platforms
6. **Analytics**: Advanced reporting and trend analysis
7. **Notifications**: Email/push reminders for study sessions
8. **Integration**: Connect with calendar applications
9. **Export**: PDF reports and performance export
10. **Cloud Deployment**: Ready-to-deploy configurations

---

## Conclusion

Study Buddy is a comprehensive full-stack web application demonstrating:
- Modern React and Next.js best practices
- Type-safe TypeScript implementation
- RESTful API design
- Database design and ORM usage
- Authentication and authorization
- Form handling and validation
- Data visualization
- Component-based architecture

The project is production-ready with proper error handling, validation, and security practices implemented throughout.

---

**Project Version**: 0.1.0  
**Last Updated**: June 2026  
**Database**: MySQL/MariaDB  
**Framework**: Next.js 16.2.9  
**Node Version**: 18+

