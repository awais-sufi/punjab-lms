# Learning Management System Frontend

This is the frontend of a full-stack LMS built with React, TypeScript, and Vite. It provides a responsive dashboard for admins, instructors, and students to manage courses, enrollments, assignments, and more.

## Features

- Role-based dashboards (Admin, Instructor, Student)
- Course catalog and enrollment system
- Assignment submissions and quiz attempts
- Progress tracking and analytics
- Secure authentication with JWT
- Responsive design

## Technologies Used

- React 18
- TypeScript
- Vite
- Lucide React (icons)
- Axios (HTTP client)
- React Router DOM
- Context API (state management)

## Installation

```bash
cd Frontend
pnpm install
```

## Environment Variables

Create a `.env` file in the Frontend directory with:

```bash
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

- `pnpm run dev` - Start development server (http://localhost:5173)
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## Project Structure

```
Frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React context providers
│   ├── services/       # API service functions
│   ├── utils/          # Utility functions
│   ├── assets/         # Static assets
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static files
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Screenshots

See the root README.md for screenshots of the application.

## Backend Setup

Make sure to set up the backend first (see Backend/README.md) before running the frontend.

The frontend expects the backend to be running on `http://localhost:5000/api`.
