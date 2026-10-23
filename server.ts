import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ServerUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'faculty' | 'student';
  department: string;
  avatar: string;
  joinedDate: string;
  enrolledCourseIds?: string[];
  assignedCourseIds?: string[];
}

// Initial Seed Data matching LearnEase Pro / PERFECT LEARN requirements
const INITIAL_USERS: ServerUser[] = [
  {
    id: 'u-admin-1',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin',
    role: 'admin',
    department: 'EdTech Administration',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-01-10',
    enrolledCourseIds: [],
    assignedCourseIds: [],
  },
  {
    id: 'u-fac-1',
    name: 'Dr. Sarah Mitchell',
    email: 'faculty@gmail.com',
    password: 'faculty',
    role: 'faculty',
    department: 'Full Stack & Web Engineering',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-02-15',
    assignedCourseIds: ['c-1', 'c-2'],
  },
  {
    id: 'u-fac-2',
    name: 'Prof. David Vance',
    email: 'david@gmail.com',
    password: 'faculty',
    role: 'faculty',
    department: 'Database & Cloud Systems',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-03-01',
    assignedCourseIds: ['c-3', 'c-4'],
  },
  {
    id: 'u-stud-1',
    name: 'ajay',
    email: 'ajay@gmail.com',
    password: 'student',
    role: 'student',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-04-12',
    enrolledCourseIds: ['c-1'], // Owns Java initially
  },
  {
    id: 'u-stud-2',
    name: 'Priya Sharma',
    email: 'priya@gmail.com',
    password: 'student',
    role: 'student',
    department: 'Information Technology',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-05-18',
    enrolledCourseIds: ['c-1', 'c-2'],
  },
  {
    id: 'u-stud-3',
    name: 'Rohan Mehta',
    email: 'rohan@gmail.com',
    password: 'student',
    role: 'student',
    department: 'Software Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-06-05',
    enrolledCourseIds: [],
  },
];

const INITIAL_COURSES = [
  {
    id: 'c-1',
    name: 'Java',
    description: 'Enterprise Object-Oriented Programming with Java 21, Spring Boot, Microservices, and multithreading architectures.',
    category: 'Backend & Enterprise',
    level: 'Intermediate',
    duration: '45 hours • 6 Modules',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    facultyId: 'u-fac-1',
    facultyName: 'Dr. Sarah Mitchell',
    createdAt: '2024-02-20',
    updatedAt: '2024-08-10',
    chapters: [
      {
        id: 'ch-1-1',
        title: 'Chapter 1: Java Core Fundamentals & JVM Internal Architecture',
        description: 'Memory management, Garbage Collection algorithms, JIT compiler, and classloaders.',
        order: 1,
        materials: [
          {
            id: 'm-1-1-1',
            title: 'Live Class Recording: Deep Dive into JVM & Memory Layout',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: '42:15 min',
            description: 'Full video lecture recorded during our weekend live accelerator session.',
          },
          {
            id: 'm-1-1-2',
            title: 'Lecture Slide Deck: JVM & Heap Organization',
            type: 'presentation',
            url: '#',
            size: '4.8 MB',
            description: 'Comprehensive 48-slide presentation with structural diagrams and bytecode analysis.',
          },
          {
            id: 'm-1-1-3',
            title: 'Reference Documentation & Code Exercises',
            type: 'document',
            url: '#',
            size: '1.2 MB',
            description: 'Companion PDF with 15 hands-on OOP challenges and solutions.',
          },
        ],
      },
      {
        id: 'ch-1-2',
        title: 'Chapter 2: Collections Framework, Generics & Streams API',
        description: 'Master List, Set, Map hierarchies, thread-safe collections, and functional pipelines.',
        order: 2,
        materials: [
          {
            id: 'm-1-2-1',
            title: 'Video Lecture: Mastering Lambda & Stream Pipelines',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: '35:20 min',
            description: 'Hands-on live coding stream transformations, collectors, and performance tradeoffs.',
          },
          {
            id: 'm-1-2-2',
            title: 'Collections Cheat Sheet & Quick Guide',
            type: 'document',
            url: '#',
            size: '850 KB',
            description: 'Time complexity breakdown for every collection method.',
          },
        ],
      },
      {
        id: 'ch-1-3',
        title: 'Chapter 3: Spring Boot 3 REST APIs & Persistence',
        description: 'Controllers, services, Spring Data JPA repositories, and DTO mapping.',
        order: 3,
        materials: [
          {
            id: 'm-1-3-1',
            title: 'Video Lecture: Building Production Ready REST APIs',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '50:10 min',
            description: 'Step-by-step setup of CRUD endpoints with Swagger OpenAPI documentation.',
          },
        ],
      },
    ],
  },
  {
    id: 'c-2',
    name: 'Angular',
    description: 'Modern front-end enterprise web development with Angular 18+, TypeScript, RxJS, Signals, and NgRx state management.',
    category: 'Frontend Engineering',
    level: 'Intermediate',
    duration: '38 hours • 5 Modules',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    facultyId: 'u-fac-1',
    facultyName: 'Dr. Sarah Mitchell',
    createdAt: '2024-03-01',
    updatedAt: '2024-09-02',
    chapters: [
      {
        id: 'ch-2-1',
        title: 'Chapter 1: Angular Architecture & Signals',
        description: 'Standalone components, modern control flow (@if, @for), and reactive signals.',
        order: 1,
        materials: [
          {
            id: 'm-2-1-1',
            title: 'Live Recording: Migrating to Angular Signals & Zoneless',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: '48:00 min',
            description: 'Master the next generation reactivity model in Angular.',
          },
          {
            id: 'm-2-1-2',
            title: 'Presentation: Component Lifecycle & Dependency Injection',
            type: 'presentation',
            url: '#',
            size: '3.6 MB',
            description: 'In-depth slide deck explaining injector hierarchy and resolution rules.',
          },
        ],
      },
      {
        id: 'ch-2-2',
        title: 'Chapter 2: Reactive Forms, Routing & Guards',
        description: 'Validation schemas, nested form arrays, lazy loading routes, and token auth guards.',
        order: 2,
        materials: [
          {
            id: 'm-2-2-1',
            title: 'Video Guide: Enterprise Forms with Dynamic Controls',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '33:15 min',
            description: 'Building accessible, validated dynamic form builders.',
          },
        ],
      },
    ],
  },
  {
    id: 'c-3',
    name: 'Node.js & Express RESTful APIs',
    description: 'Scalable backend server systems with Node.js, Express, async I/O, event loops, clustering, and security middlewares.',
    category: 'Backend & DevOps',
    level: 'Beginner to Intermediate',
    duration: '32 hours • 4 Modules',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop&q=80',
    facultyId: 'u-fac-2',
    facultyName: 'Prof. David Vance',
    createdAt: '2024-03-15',
    updatedAt: '2024-08-25',
    chapters: [
      {
        id: 'ch-3-1',
        title: 'Chapter 1: Node.js Runtime & Asynchronous Programming',
        description: 'V8 engine internals, Libuv event loop phases, microtasks vs macrotasks.',
        order: 1,
        materials: [
          {
            id: 'm-3-1-1',
            title: 'Live Class: Under the Hood of the Node.js Event Loop',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            duration: '45:30 min',
            description: 'Visual walkthrough of polling, timers, and check phases with benchmark demos.',
          },
          {
            id: 'm-3-1-2',
            title: 'Architecture Blueprint PDF',
            type: 'document',
            url: '#',
            size: '2.1 MB',
            description: 'High level system diagram of asynchronous I/O threads.',
          },
        ],
      },
      {
        id: 'ch-3-2',
        title: 'Chapter 2: Express.js Routing, Middleware & Error Handling',
        description: 'Request pipelines, custom authentication middlewares, and centralized exception filters.',
        order: 2,
        materials: [
          {
            id: 'm-3-2-1',
            title: 'Code Walkthrough: Production Middleware Patterns',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            duration: '28:40 min',
            description: 'Securing headers with Helmet, rate limiting, and CORS configs.',
          },
        ],
      },
    ],
  },
  {
    id: 'c-4',
    name: 'MongoDB & Mongoose Data Modeling',
    description: 'NoSQL schema design, indexing strategies, aggregation pipelines, replica sets, and transactions.',
    category: 'Database & Cloud',
    level: 'Intermediate',
    duration: '26 hours • 4 Modules',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    facultyId: 'u-fac-2',
    facultyName: 'Prof. David Vance',
    createdAt: '2024-04-01',
    updatedAt: '2024-09-12',
    chapters: [
      {
        id: 'ch-4-1',
        title: 'Chapter 1: Document Schemas & Embedded vs Referenced Data',
        description: 'Real-world data modeling tradeoffs for high performance reads and writes.',
        order: 1,
        materials: [
          {
            id: 'm-4-1-1',
            title: 'Live Workshop: Aggregation Framework Mastery',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            duration: '52:10 min',
            description: 'Step-by-step $lookup, $group, $facet, and $unwind pipeline recipes.',
          },
        ],
      },
    ],
  },
  {
    id: 'c-5',
    name: 'React 19 & Next.js Full Stack',
    description: 'Modern component-driven UIs with Hooks, Server Components, suspense streaming, and Tailwind CSS.',
    category: 'Full Stack Web',
    level: 'Beginner to Advanced',
    duration: '40 hours • 6 Modules',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    facultyId: 'u-fac-1',
    facultyName: 'Dr. Sarah Mitchell',
    createdAt: '2024-04-10',
    updatedAt: '2024-09-15',
    chapters: [
      {
        id: 'ch-5-1',
        title: 'Chapter 1: React 19 Actions & Modern Hooks',
        description: 'useActionState, useOptimistic, useFormStatus, and compiler optimizations.',
        order: 1,
        materials: [
          {
            id: 'm-5-1-1',
            title: 'Live Lecture: Deep Dive into React 19 Paradigm Shift',
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
            duration: '41:15 min',
            description: 'Building interactive form actions and optimistic updates without boilerplate.',
          },
        ],
      },
    ],
  },
];

const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    courseId: 'c-2',
    courseName: 'Angular',
    studentId: 'u-stud-1',
    studentName: 'ajay',
    studentEmail: 'ajay@gmail.com',
    status: 'Pending',
    requestedAt: '2024-10-14 09:30',
    reason: 'Enrolled in full-stack frontend track and need Angular certification materials.',
  },
  {
    id: 'req-2',
    courseId: 'c-3',
    courseName: 'Node.js & Express RESTful APIs',
    studentId: 'u-stud-1',
    studentName: 'ajay',
    studentEmail: 'ajay@gmail.com',
    status: 'Pending',
    requestedAt: '2024-10-15 14:20',
    reason: 'Want to complete the backend REST API requirements.',
  },
  {
    id: 'req-3',
    courseId: 'c-4',
    courseName: 'MongoDB & Mongoose Data Modeling',
    studentId: 'u-stud-2',
    studentName: 'Priya Sharma',
    studentEmail: 'priya@gmail.com',
    status: 'Approved',
    requestedAt: '2024-10-10 11:15',
    decidedAt: '2024-10-11 16:00',
    reason: 'Need database design fundamentals for upcoming capstone project.',
  },
];

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    courseId: 'c-1',
    userId: 'u-stud-1',
    userName: 'ajay',
    rating: 5,
    comment: 'The Java JVM deep dive lecture recording cleared all my multithreading and garbage collection questions! Fantastic presentation notes.',
    createdAt: '2024-09-18',
  },
  {
    id: 'rev-2',
    courseId: 'c-1',
    userId: 'u-stud-2',
    userName: 'Priya Sharma',
    rating: 5,
    comment: 'Exceptional curriculum. The code examples for Spring Boot 3 REST controllers made building microservices so intuitive.',
    createdAt: '2024-09-22',
  },
  {
    id: 'rev-3',
    courseId: 'c-2',
    userId: 'u-stud-2',
    userName: 'Priya Sharma',
    rating: 4,
    comment: 'Great overview of Angular signals and standalone components. Would love more RxJS operator live examples.',
    createdAt: '2024-10-01',
  },
  {
    id: 'rev-4',
    courseId: 'c-3',
    userId: 'u-stud-3',
    userName: 'Rohan Mehta',
    rating: 5,
    comment: 'Prof. David Vance explains the Libuv event loop like no one else. The middleware patterns were gold!',
    createdAt: '2024-10-05',
  },
];

const INITIAL_CHATS = [
  {
    id: 'msg-1',
    roomId: 'general',
    userId: 'u-admin-1',
    userName: 'Admin User',
    userRole: 'admin',
    text: 'Welcome learners and faculty to LearnEase Pro (PERFECT LEARN)! Please post any questions regarding course access and upcoming live sessions here.',
    timestamp: '2024-10-18 08:00',
  },
  {
    id: 'msg-2',
    roomId: 'general',
    userId: 'u-fac-1',
    userName: 'Dr. Sarah Mitchell',
    userRole: 'faculty',
    text: 'Hello everyone! I have just updated Chapter 1 in the Java course with new bytecode analysis slides.',
    timestamp: '2024-10-18 09:15',
  },
  {
    id: 'msg-3',
    roomId: 'general',
    userId: 'u-stud-1',
    userName: 'ajay',
    userRole: 'student',
    text: 'Thank you Dr. Mitchell! Just submitted my request for Angular course access as well.',
    timestamp: '2024-10-18 10:30',
  },
  {
    id: 'msg-4',
    roomId: 'c-1',
    userId: 'u-stud-1',
    userName: 'ajay',
    userRole: 'student',
    text: 'Has anyone tried the garbage collection benchmarking exercise on Java 21?',
    timestamp: '2024-10-18 11:00',
  },
  {
    id: 'msg-5',
    roomId: 'c-1',
    userId: 'u-fac-1',
    userName: 'Dr. Sarah Mitchell',
    userRole: 'faculty',
    text: 'Yes Ajay! Make sure to run with the -XX:+UseZGC flag to observe sub-millisecond pauses.',
    timestamp: '2024-10-18 11:20',
  },
];

const INITIAL_PROGRESS: Record<string, { completedChapterIds: string[]; completedMaterialIds: string[] }> = {
  'u-stud-1:c-1': {
    completedChapterIds: ['ch-1-1'],
    completedMaterialIds: ['m-1-1-1', 'm-1-1-2'],
  },
  'u-stud-2:c-1': {
    completedChapterIds: ['ch-1-1', 'ch-1-2'],
    completedMaterialIds: ['m-1-1-1', 'm-1-1-2', 'm-1-1-3', 'm-1-2-1'],
  },
};

// One atomic MongoDB document stores the teaching dataset. Requests are serialized
// in this single-process capstone so a successful response always follows persistence.
const stateSchema = new mongoose.Schema({
  _id: String,
  users: [mongoose.Schema.Types.Mixed], courses: [mongoose.Schema.Types.Mixed],
  requests: [mongoose.Schema.Types.Mixed], reviews: [mongoose.Schema.Types.Mixed],
  chats: [mongoose.Schema.Types.Mixed], progress: mongoose.Schema.Types.Mixed,
}, { versionKey: false });
const LearningState = mongoose.model('LearningState', stateSchema);
const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
};
const verifyPassword = (password: string, stored: string) => {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};
const freshUsers = () => INITIAL_USERS.map(u => ({ ...u, password: hashPassword(u.password) }));
let users: ServerUser[] = freshUsers();
let courses = structuredClone(INITIAL_COURSES);
let requests = structuredClone(INITIAL_REQUESTS);
let reviews = structuredClone(INITIAL_REVIEWS);
let chats = structuredClone(INITIAL_CHATS);
let progressStore: Record<string, { completedChapterIds: string[]; completedMaterialIds: string[] }> = structuredClone(INITIAL_PROGRESS);
const sessions = new Map<string, { userId: string; expires: number }>();
const saveState = () => LearningState.replaceOne({ _id: 'capstone' }, {
  _id: 'capstone', users, courses, requests, reviews, chats, progress: progressStore,
}, { upsert: true });

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  if (process.env.DEMO_MONGO === 'true') {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    console.log('Temporary MongoDB demo: data resets when this process stops.');
  } else {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnease');
  }
  const saved = await LearningState.findById('capstone').lean();
  if (saved) {
    users = saved.users as ServerUser[];
    courses = saved.courses as typeof courses;
    requests = saved.requests as typeof requests;
    reviews = saved.reviews as typeof reviews;
    chats = saved.chats as typeof chats;
    progressStore = saved.progress;
  } else await saveState();
  app.use(express.json({ limit: '1mb' }));
  let queue = Promise.resolve();
  app.use('/api', async (req, res, next) => {
    let release!: () => void;
    const previous = queue;
    queue = new Promise<void>(resolve => { release = resolve; });
    await previous;
    let released = false;
    const done = () => { if (!released) { released = true; release(); } };
    res.on('finish', done);
    res.on('close', done);
    const originalJson = res.json.bind(res);
    res.json = ((data: unknown) => {
      if (req.method === 'GET' || res.statusCode >= 400) return originalJson(data);
      void saveState().then(() => originalJson(data)).catch(() => {
        res.status(503);
        originalJson({ error: 'Database write failed; restart the server before continuing.' });
      });
      return res;
    }) as typeof res.json;
    next();
  });
  app.use('/api', (req, res, next) => {
    if (['/auth/login', '/auth/register'].includes(req.path)) return next();
    if (req.method === 'GET' && (req.path === '/courses' || req.path.startsWith('/courses/'))) return next();
    const token = req.headers.cookie?.split('; ').find(c => c.startsWith('learnease_session='))?.split('=')[1];
    const session = token ? sessions.get(token) : undefined;
    const actor = session && session.expires > Date.now() ? users.find(u => u.id === session.userId) : undefined;
    if (!actor) return res.status(401).json({ error: 'Please sign in.' });
    const admin = actor.role === 'admin';
    const forbidden = () => res.status(403).json({ error: 'Not permitted for this account.' });
    if (req.path === '/users') {
      if (!admin) req.query.role = actor.role;
    }
    if (req.path === '/reset-demo' && !admin) return forbidden();
    if (req.path.startsWith('/courses') && req.method !== 'GET') {
      if (!admin && actor.role !== 'faculty') return forbidden();
      const course = courses.find(c => c.id === req.path.split('/')[2]);
      if (!admin && (req.method === 'DELETE' || (course && course.facultyId !== actor.id))) return forbidden();
      if (!admin) { req.body.facultyId = actor.id; req.body.facultyName = actor.name; }
    }
    if (req.path === '/requests' && req.method === 'GET' && !admin) return forbidden();
    if (req.path.startsWith('/requests/') && req.method === 'PUT' && !admin) return forbidden();
    if (req.path.startsWith('/requests/student/') && !admin && req.path.split('/')[3] !== actor.id) return forbidden();
    if (req.path === '/requests' && req.method === 'POST') {
      if (actor.role !== 'student') return forbidden();
      Object.assign(req.body, { studentId: actor.id, studentName: actor.name, studentEmail: actor.email });
    }
    if (req.path === '/reviews' && req.method === 'POST') {
      if (actor.role !== 'student' || !actor.enrolledCourseIds?.includes(req.body.courseId)) return forbidden();
      if (!Number.isInteger(Number(req.body.rating)) || req.body.rating < 1 || req.body.rating > 5) return res.status(400).json({ error: 'Rating must be 1 to 5.' });
      Object.assign(req.body, { userId: actor.id, userName: actor.name });
    }
    if (req.path.startsWith('/chat/') && req.method === 'POST') Object.assign(req.body, { userId: actor.id, userName: actor.name, userRole: actor.role });
    if (req.path === '/auth/change-password' && req.body.userId !== actor.id) return forbidden();
    if (req.path.startsWith('/progress')) {
      const id = req.method === 'GET' ? req.path.split('/')[2] : req.body.studentId;
      const courseId = req.method === 'GET' ? req.path.split('/')[3] : req.body.courseId;
      if (!admin && (id !== actor.id || !actor.enrolledCourseIds?.includes(courseId))) return forbidden();
    }
    next();
  });

  // ---------------- AUTHENTICATION & USERS ---------------- //
  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && verifyPassword(password, u.password)
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({
        error: `Account found, but role is "${user.role.toUpperCase()}", not "${role.toUpperCase()}". Please select the correct user type.`,
      });
    }

    const token = randomBytes(32).toString('hex');
    sessions.set(token, { userId: user.id, expires: Date.now() + 8 * 60 * 60 * 1000 });
    res.cookie('learnease_session', token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 });
    // Return safe user without password
    const { password: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    if (!['student', 'faculty'].includes(role)) return res.status(400).json({ error: 'Invalid registration role.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword(password),
      role: role as 'student' | 'faculty',
      department: department?.trim() || (role === 'faculty' ? 'Computer Science & Tech' : 'Undergraduate Engineering'),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      joinedDate: new Date().toISOString().split('T')[0],
      enrolledCourseIds: [],
      assignedCourseIds: [],
    };

    users.push(newUser);
    const token = randomBytes(32).toString('hex');
    sessions.set(token, { userId: newUser.id, expires: Date.now() + 8 * 60 * 60 * 1000 });
    res.cookie('learnease_session', token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 });
    const { password: _, ...safeUser } = newUser;
    return res.status(201).json({ success: true, user: safeUser });
  });

  app.post('/api/auth/change-password', (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!verifyPassword(oldPassword, user.password)) {
      return res.status(400).json({ error: 'Current password does not match' });
    }
    user.password = hashPassword(newPassword);
    return res.json({ success: true, message: 'Password updated successfully' });
  });

  // Admin view users
  app.get('/api/users', (req, res) => {
    const { role } = req.query;
    let list = users;
    if (role) {
      list = list.filter((u) => u.role === role);
    }
    const safeUsers = list.map(({ password, ...u }) => u);
    return res.json(safeUsers);
  });

  // ---------------- COURSES ---------------- //
  app.get('/api/courses', (req, res) => {
    return res.json(courses);
  });

  app.get('/api/courses/:id', (req, res) => {
    const course = courses.find((c) => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.json(course);
  });

  // Add course (Admin or Faculty)
  app.post('/api/courses', (req, res) => {
    const { name, description, category, level, duration, thumbnail, facultyId, facultyName, chapters } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Course name is required' });
    }

    const newCourse = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || 'Comprehensive course syllabus with practical lectures and resources.',
      category: category?.trim() || 'Software Development',
      level: level || 'Intermediate',
      duration: duration || '30 hours • 4 Modules',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      facultyId: facultyId || 'u-fac-1',
      facultyName: facultyName || 'Dr. Sarah Mitchell',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      chapters: chapters && Array.isArray(chapters) && chapters.length > 0 ? chapters : [
        {
          id: `ch-${Date.now()}-1`,
          title: 'Chapter 1: Getting Started & Foundations',
          description: 'Introduction and setup guide for the learning path.',
          order: 1,
          materials: [
            {
              id: `m-${Date.now()}-1`,
              title: 'Live Class Recording: Module Overview',
              type: 'video' as const,
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              duration: '35:00 min',
              description: 'Introductory live lecture explaining syllabus and outcomes.',
            },
            {
              id: `m-${Date.now()}-2`,
              title: 'Course Syllabus & Reference Documentation',
              type: 'document' as const,
              url: '#',
              size: '1.5 MB',
              description: 'Official downloadable PDF guidelines.',
            },
          ],
        },
      ],
    };

    courses.unshift(newCourse);
    return res.status(201).json(newCourse);
  });

  // Update course (Admin or Faculty)
  app.put('/api/courses/:id', (req, res) => {
    const index = courses.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existing = courses[index];
    const updated = {
      ...existing,
      ...req.body,
      id: existing.id, // cannot change ID
      updatedAt: new Date().toISOString().split('T')[0],
    };

    courses[index] = updated;
    return res.json(updated);
  });

  // Delete course (Admin)
  app.delete('/api/courses/:id', (req, res) => {
    const initialLen = courses.length;
    courses = courses.filter((c) => c.id !== req.params.id);
    if (courses.length === initialLen) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.json({ success: true, message: 'Course deleted successfully' });
  });

  // ---------------- COURSE ACCESS REQUESTS ---------------- //
  // Slide 5: "Learners should be able to request for the course access", "Admin should be able to view details"
  app.get('/api/requests', (req, res) => {
    return res.json(requests);
  });

  app.get('/api/requests/student/:studentId', (req, res) => {
    const studentRequests = requests.filter((r) => r.studentId === req.params.studentId);
    return res.json(studentRequests);
  });

  app.post('/api/requests', (req, res) => {
    const { courseId, courseName, studentId, studentName, studentEmail, reason } = req.body;
    if (!courseId || !studentId) {
      return res.status(400).json({ error: 'Course ID and Student ID are required' });
    }

    // Check if already requested or enrolled
    const student = users.find((u) => u.id === studentId);
    if (student?.enrolledCourseIds?.includes(courseId)) {
      return res.status(400).json({ error: 'You are already enrolled in this course! Check "Own Course".' });
    }

    const existingPending = requests.find(
      (r) => r.studentId === studentId && r.courseId === courseId && r.status === 'Pending'
    );
    if (existingPending) {
      return res.status(400).json({ error: 'You have already submitted a pending request for this course.' });
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      courseId,
      courseName: courseName || 'Unknown Course',
      studentId,
      studentName: studentName || 'Student',
      studentEmail: studentEmail || '',
      status: 'Pending' as const,
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reason: reason || 'Learner enrollment request for semester course access.',
    };

    requests.unshift(newRequest);
    return res.status(201).json(newRequest);
  });

  // Admin approves / rejects request
  app.put('/api/requests/:id', (req, res) => {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Approved or Rejected' });
    }

    const request = requests.find((r) => r.id === req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = status;
    request.decidedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // If approved, add course to student's enrolled courses list
    if (status === 'Approved') {
      const student = users.find((u) => u.id === request.studentId);
      if (student) {
        if (!student.enrolledCourseIds) {
          student.enrolledCourseIds = [];
        }
        if (!student.enrolledCourseIds.includes(request.courseId)) {
          student.enrolledCourseIds.push(request.courseId);
        }
      }
    }

    return res.json(request);
  });

  // ---------------- REVIEWS & RATINGS ---------------- //
  // Slide 5: "Learners can provide feedback and ratings for courses"
  app.get('/api/reviews', (req, res) => {
    const { courseId } = req.query;
    if (courseId) {
      return res.json(reviews.filter((r) => r.courseId === courseId));
    }
    return res.json(reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const { courseId, userId, userName, rating, comment } = req.body;
    if (!courseId || !userId || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required review fields' });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      courseId,
      userId,
      userName: userName || 'Learner',
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    reviews.unshift(newReview);
    return res.status(201).json(newReview);
  });

  // ---------------- GROUP CHAT ---------------- //
  // Slide 5: "Group chat options for collaborative discussions"
  app.get('/api/chat/:roomId', (req, res) => {
    const roomMessages = chats.filter((c) => c.roomId === req.params.roomId);
    return res.json(roomMessages);
  });

  app.post('/api/chat/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { userId, userName, userRole, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text cannot be empty' });
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      roomId,
      userId: userId || 'anonymous',
      userName: userName || 'User',
      userRole: (userRole || 'student') as 'admin' | 'faculty' | 'student',
      text: text.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    chats.push(newMsg);
    return res.status(201).json(newMsg);
  });

  // ---------------- STUDENT PROGRESS TRACKING ---------------- //
  app.get('/api/progress/:studentId/:courseId', (req, res) => {
    const key = `${req.params.studentId}:${req.params.courseId}`;
    const progress = progressStore[key] || { completedChapterIds: [], completedMaterialIds: [] };
    return res.json(progress);
  });

  app.post('/api/progress', (req, res) => {
    const { studentId, courseId, chapterId, materialId, completed } = req.body;
    const key = `${studentId}:${courseId}`;
    if (!progressStore[key]) {
      progressStore[key] = { completedChapterIds: [], completedMaterialIds: [] };
    }

    const current = progressStore[key];
    if (materialId) {
      if (completed && !current.completedMaterialIds.includes(materialId)) {
        current.completedMaterialIds.push(materialId);
      } else if (!completed) {
        current.completedMaterialIds = current.completedMaterialIds.filter((id) => id !== materialId);
      }
    }

    if (chapterId) {
      if (completed && !current.completedChapterIds.includes(chapterId)) {
        current.completedChapterIds.push(chapterId);
      } else if (!completed) {
        current.completedChapterIds = current.completedChapterIds.filter((id) => id !== chapterId);
      }
    }

    return res.json(current);
  });

  // ---------------- RESET DEMO DATA ---------------- //
  app.post('/api/reset-demo', (req, res) => {
    users = freshUsers();
    courses = JSON.parse(JSON.stringify(INITIAL_COURSES));
    requests = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
    reviews = JSON.parse(JSON.stringify(INITIAL_REVIEWS));
    chats = JSON.parse(JSON.stringify(INITIAL_CHATS));
    progressStore = JSON.parse(JSON.stringify(INITIAL_PROGRESS));
    return res.json({ success: true, message: 'Demo data restored successfully' });
  });

  // ---------------- VITE MIDDLEWARE / STATIC FILES ---------------- //
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), process.env.HOST || '127.0.0.1', () => {
    console.log(`LearnEase Pro / PERFECT LEARN Server running on port ${PORT}`);
  });
}

startServer();
