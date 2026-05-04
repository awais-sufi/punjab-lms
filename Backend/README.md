# Learning Management System Backend

This is the backend of a full-stack LMS built with Node.js, Express, and MongoDB. It provides RESTful APIs for user authentication, course management, enrollment, assignments, quizzes, and more.

## Features

- User authentication with JWT
- Role-based authorization (Admin, Instructor, Student)
- Course CRUD operations
- Enrollment and progress tracking
- Assignment submission and grading
- Quiz attempts with automatic scoring
- Dashboard analytics for admins and instructors
- Input validation and error handling
- Secure password hashing with bcrypt

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- dotenv for environment variables
- cors for Cross-Origin Resource Sharing
- nodemon for development

## Installation

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy the example environment file:
     ```bash
     cp src/.env.example src/.env
     ```
   - Edit `src/.env` to configure your environment (see below)

4. Seed the database with initial data:
   ```bash
   pnpm run seed
   ```

5. Start the development server:
   ```bash
   pnpm run dev
   ```

## Environment Variables

Create a `.env` file in the `src/` directory with the following variables:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_lms
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Variable Descriptions

- `PORT`: The port on which the server will run (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for signing JWT tokens (use a strong, random string)
- `JWT_EXPIRES_IN`: Expiration time for JWT tokens (e.g., 7d, 24h)
- `CLIENT_URL`: URL of the frontend application (for CORS configuration)
- `NODE_ENV`: Environment mode (development, production)

## Available Scripts

- `pnpm run dev`: Start the server with nodemon (development)
- `pnpm run start`: Start the server with Node.js (production)
- `pnpm run seed`: Seed the database with initial data (users, courses, etc.)

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### User Routes
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Course Routes
- `GET /api/courses` - Get all courses (with filtering)
- `GET /api/courses/:slug` - Get course by slug
- `POST /api/courses` - Create a new course (Admin/Instructor)
- `PUT /api/courses/:id` - Update a course (Admin/Instructor)
- `DELETE /api/courses/:id` - Delete a course (Admin/Instructor)

### Enrollment Routes
- `POST /api/enrollments` - Enroll in a course
- `GET /api/enrollments` - Get user's enrollments
- `GET /api/enrollments/:id` - Get enrollment by ID
- `PUT /api/enrollments/:id` - Update enrollment progress

### Assignment Routes
- `GET /api/assignments` - Get all assignments (with filtering)
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create assignment (Admin/Instructor)
- `PUT /api/assignments/:id` - Update assignment (Admin/Instructor)
- `DELETE /api/assignments/:id` - Delete assignment (Admin/Instructor)
- `POST /api/submissions` - Submit assignment
- `GET /api/submissions` - Get submissions (with filtering)
- `GET /api/submissions/:id` - Get submission by ID
- `PUT /api/submissions/:id` - Grade submission (Admin/Instructor)

### Quiz Routes
- `GET /api/quizzes` - Get all quizzes (with filtering)
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes` - Create quiz (Admin/Instructor)
- `PUT /api/quizzes/:id` - Update quiz (Admin/Instructor)
- `DELETE /api/quizzes/:id` - Delete quiz (Admin/Instructor)
- `POST /api/quiz-attempts` - Attempt a quiz
- `GET /api/quiz-attempts` - Get quiz attempts (with filtering)
- `GET /api/quiz-attempts/:id` - Get quiz attempt by ID

### Dashboard Routes
- `GET /api/dashboard/stats` - Get dashboard statistics (Admin/Instructor)
- `GET /api/dashboard/instructor` - Get instructor dashboard data
- `GET /api/dashboard/student` - Get student dashboard data

## Database Models

### User
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: Enum ['admin', 'instructor', 'student']
- `isVerified`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

### Course
- `title`: String
- `slug`: String (unique)
- `category`: String
- `level`: String
- `description`: String
- `thumbnail`: String (URL)
- `price`: Number
- `instructor`: ObjectId (ref: User)
- `lessons`: Array of objects
- `assignments`: Array of objects
- `quizzes`: Array of objects
- `isPublished`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

### Enrollment
- `student`: ObjectId (ref: User)
- `course`: ObjectId (ref: Course)
- `progress`: Number (0-100)
- `enrolledAt`: Date
- `completedAt`: Date

### Submission
- `student`: ObjectId (ref: User)
- `assignment`: ObjectId (ref: Assignment)
- `submissionUrl`: String
- `marksObtained`: Number
- `feedback`: String
- `submittedAt`: Date
- `gradedAt`: Date

### QuizAttempt
- `student`: ObjectId (ref: User)
- `quiz`: ObjectId (ref: Quiz)
- `answers`: Array of objects (questionId, selectedOption)
- `score`: Number
- `attemptedAt`: Date

## Seeded Data

Running `pnpm run seed` will create:
- 1 Admin user: admin@lms.com / password123
- 1 Instructor user: instructor@lms.com / password123
- 1 Student user: student@lms.com / password123
- 2 Sample courses with lessons, assignments, and quizzes
- 1 Sample enrollment (student enrolled in first course)

## Error Handling

The backend uses centralized error handling with async wrappers and custom error classes. All errors are formatted as JSON responses with appropriate HTTP status codes.

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication with expiration
- Role-based middleware protects routes
- CORS is configured to only allow requests from the frontend URL
- Input validation is performed on all incoming data
- HTTP headers are secured with helmet (if implemented)

## Development Guidelines

1. All controllers should use asyncHandler utility to avoid try/catch blocks
2. Validation should be done in controllers or with middleware
3. Business logic should be kept in controllers or service layers
4. Always hash passwords before storing
5. Never expose sensitive data in responses (passwords, tokens)
6. Use environment variables for configuration
7. Write clear, descriptive commit messages

## Deployment

For production deployment:
1. Set NODE_ENV to production
2. Use a strong JWT_SECRET
3. Set MONGO_URI to your production MongoDB instance
4. Update CLIENT_URL to your production frontend URL
5. Consider using a process manager like PM2
6. Ensure proper logging and monitoring are set up

## Troubleshooting

- **MongoDB connection errors**: Ensure MongoDB is running and MONGO_URI is correct
- **JWT authentication failures**: Check JWT_SECRET matches and token is being sent correctly
- **CORS errors**: Verify CLIENT_URL is set correctly in backend .env
- **Seed script failures**: Ensure MongoDB is accessible and database exists

## License

This project is licensed under the ISC License.
