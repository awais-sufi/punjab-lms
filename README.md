# MERN Stack Learning Management System

A full-stack LMS final project built with React, Node.js, Express, MongoDB, and Mongoose. It includes authentication, role-based authorization, course management, enrollments, progress tracking, quizzes, assignments, dashboard metrics, and a responsive React interface.

## Project Structure

- `Frontend/` - React + TypeScript + Vite LMS dashboard
- `Backend/` - Node.js + Express + MongoDB REST API
- `Backend/src/models/` - Mongoose schemas for users, courses, enrollments, submissions, and quiz attempts
- `Backend/src/routes/` - REST API route modules
- `Backend/src/controllers/` - Request handlers and business logic
- `Backend/src/middleware/` - Authentication, authorization, and error handling

## Installation

```bash
cd Backend
pnpm install
cp src/.env src/.env.local
pnpm run seed
pnpm run dev
```

```bash
cd Frontend
pnpm install
pnpm run dev
```

The frontend runs on `http://localhost:5173` and the backend API runs on `http://localhost:5000/api`.

## Demo Accounts

After running `pnpm run seed` in `Backend/`, use:

- Admin: `admin@lms.com` / `password123`
- Instructor: `instructor@lms.com` / `password123`
- Student: `student@lms.com` / `password123`

## Technologies Used

React, TypeScript, Vite, Lucide React, Axios, Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, dotenv, cors, and nodemon.

## Major Modules

- User registration and login
- JWT protected API routes
- Admin, instructor, and student role authorization
- Course CRUD for admins and instructors
- Course catalog for students
- Enrollment and progress tracking
- Assignment submissions
- Quiz attempts with score calculation
- Dashboard metrics for admin and instructor roles

## Environment Variables

`Backend/src/.env` contains:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_lms
JWT_SECRET=change_this_secret_for_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Use a strong `JWT_SECRET` and a real MongoDB URI before deployment.
