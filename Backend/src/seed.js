const mongoose = require('mongoose');
require('dotenv').config({ path: `${__dirname}/.env` });

const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const QuizAttempt = require('./models/QuizAttempt');
const Submission = require('./models/Submission');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_lms');
  await Promise.all([
    Course.deleteMany({}),
    Enrollment.deleteMany({}),
    QuizAttempt.deleteMany({}),
    Submission.deleteMany({}),
    User.deleteMany({}),
  ]);

  const [admin, instructor, student] = await User.create([
    { name: 'Admin User', email: 'admin@lms.com', password: 'password123', role: 'admin' },
    { name: 'Sara Instructor', email: 'instructor@lms.com', password: 'password123', role: 'instructor' },
    { name: 'Ali Student', email: 'student@lms.com', password: 'password123', role: 'student' },
  ]);

  const courses = await Course.create([
    {
      title: 'MERN Stack Foundations',
      slug: 'mern-stack-foundations',
      category: 'Web Development',
      level: 'Beginner',
      description: 'Build full-stack applications with React, Express, MongoDB, and practical REST APIs.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      price: 12000,
      instructor: instructor._id,
      lessons: [
        { title: 'Project architecture', duration: '42 min', content: 'Folder structure, API contracts, and environment setup.', isPreview: true },
        { title: 'Authentication flow', duration: '55 min', content: 'JWT login, protected routes, and roles.' },
        { title: 'Course APIs', duration: '48 min', content: 'CRUD endpoints and MongoDB relations.' },
      ],
      assignments: [
        { title: 'Create an Express API', dueDate: new Date(Date.now() + 7 * 86400000), maxMarks: 100, instructions: 'Submit a REST API with validation and error handling.' },
      ],
      quizzes: [
        {
          title: 'MERN Basics Quiz',
          totalMarks: 20,
          questions: [
            { prompt: 'Which database is used in MERN?', options: ['MySQL', 'MongoDB', 'SQLite'], correctOption: 1 },
            { prompt: 'Which library builds the UI?', options: ['React', 'Express', 'Mongoose'], correctOption: 0 },
          ],
        },
      ],
    },
    {
      title: 'Advanced React LMS UI',
      slug: 'advanced-react-lms-ui',
      category: 'Frontend',
      level: 'Intermediate',
      description: 'Create dashboard screens, enrollment workflows, and course learning pages in React.',
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
      price: 9000,
      instructor: instructor._id,
      lessons: [
        { title: 'Dashboard layouts', duration: '35 min', content: 'Dense, useful dashboard views for real LMS users.', isPreview: true },
        { title: 'State and API integration', duration: '50 min', content: 'Fetch data, handle loading states, and surface errors.' },
      ],
    },
  ]);

  await Enrollment.create({ student: student._id, course: courses[0]._id, progress: 62 });
  console.log(`Seeded LMS data. Admin id: ${admin._id}`);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
