# Study Buddy - Project Documentation

## 1. Project Overview
**Study Buddy** is a comprehensive student performance tracking and AI-powered study assistant. It helps students manage their academic progress by tracking scores, visualizing performance trends, and providing AI-driven predictions and study recommendations.

---

## 2. Tech Stack
- **Framework**: Next.js 16.2.9 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via LibSQL)
- **ORM**: Prisma 7.8.0
- **Authentication**: JWT-based auth with `jose` and HTTP-only cookies
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form with Zod validation
- **Visualization**: Recharts

---

## 3. Architecture

### 3.1. Routing & Middleware
The project uses the Next.js App Router. Access to private routes is controlled via a custom `proxy.ts` (Next.js Proxy/Middleware) which intercept requests to ensure the user is authenticated.

- **Public Routes**: `/login`, `/register`, `/api/auth/*`
- **Protected Routes**: `/dashboard`, `/subjects`, `/data-entry`, `/predictions`, `/recommendations`, `/api/*` (except auth)

### 3.2. Authentication Flow
1. **Registration/Login**: Users interact with forms that hit `/api/auth/register` or `/api/auth/login`.
2. **Session**: Upon success, a JWT token is generated using a secret key and stored in a `session` cookie.
3. **Verification**: The `proxy.ts` middleware verifies the JWT for every protected request.

---

## 4. Database Schema (Prisma)

The database consists of five main models:

- **Student**: Core user model (name, email, hashed password).
- **Subject**: Academic subjects (name, credit hours, difficulty).
- **Performance**: Records of student scores and study hours for specific subjects.
- **AIPrediction**: AI-calculated predictions for final scores based on performance data.
- **StudyRecommendation**: Generated advice and classification (e.g., "Excellent", "Needs Improvement") for subjects.

*Note: Cascading deletes are implemented. Deleting a Subject or Student will automatically clean up all associated records.*

---

## 5. Key Features

### 5.1. Dashboard
- Visualizes performance trends using line and bar charts.
- Shows a summary of recent grades and study efforts.

### 5.2. Subject Management
- Allows students to add, view, and delete subjects they are enrolled in.

### 5.3. Performance Tracking
- Interface for entering scores and study hours for various subjects.

### 5.4. AI Predictions & Recommendations
- Uses historical data to predict future performance.
- Provides actionable study advice based on current grades and difficulty levels.

---

## 6. Project Structure

```text
study-buddy/
├── app/                  # Next.js App Router (Pages & API)
│   ├── api/              # Backend API endpoints
│   ├── (auth)/           # Login and Register pages
│   ├── dashboard/        # Main overview
│   └── ...               # Feature-specific pages
├── components/           # Reusable UI components (Button, Input, Navbar)
├── lib/                  # Shared utilities (Prisma client)
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── types/                # TypeScript interfaces
├── proxy.ts              # Authentication middleware
└── tailwind.config.ts    # Styling configuration
```

---

## 7. Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_secret_key"
   ```

3. **Database Setup**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 8. Recent Technical Fixes
- **SQLite Migration**: Moved from MySQL to SQLite for easier portability.
- **Prisma 7 Compatibility**: Updated LibSQL adapter initialization for the latest Prisma version.
- **Middleware Hardening**: Implemented `proxy.ts` to solve Turbopack routing issues.
- **Form Submission Fix**: Resolved issues where forms would default to GET requests.
