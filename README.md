# LearnEase Pro — PERFECT LEARN LMS
### MERN Stack Capstone • Phase-End Project

![MERN Stack Capstone](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80)

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

---

## 📌 Executive Summary & Objective

**LearnEase Pro (PERFECT LEARN)** is a comprehensive, enterprise-ready eLearning Management System (LMS) engineered as a MERN Stack Capstone project. 

The application is tailored for modern EdTech institutions seeking to expand their reach from regional classrooms to international online spheres, enabling remote learners to access live class recordings, download presentations, engage in collaborative peer study groups, and track syllabus completion.

### Key Goals (as per Problem Statement):
* **Robust User Authentication & Authorization**: Role-based access control (RBAC) supporting **Administrators**, **Faculty Members**, and **Students**.
* **Curriculum Archival & Course Creation**: Complete course authoring suite with dynamic chapter builders and diverse content type support (live video recordings, presentation slides, documentation PDFs).
* **Audited Student Enrollment & Access Requests**: Workflow where students submit course access requests, and administrators approve or reject enrollment.
* **Interactive Classroom Experience**: Embedded HTML5 lecture video playback, syllabus checklist, and completion percentage progress tracking.
* **Collaborative Discussion Rooms**: Real-time group chat channels for campus-wide discussion and course-specific technical study circles.
* **Course Ratings & Feedback**: Student reviews and 5-star ratings system.

---

## 👥 User Roles & Demo Credentials

The platform includes convenient **One-Click Demo Login** buttons on the top status bar and login page:

| Role | Name | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Admin User | `admin@gmail.com` | `admin` | Add/Update courses, approve/reject student access requests, inspect faculty & student rosters, oversee all group chats. |
| **Faculty** | Dr. Sarah Mitchell | `faculty@gmail.com` | `faculty` | Update course syllabi, append chapters, upload live lecture video URLs and companion presentations, monitor enrolled learners. |
| **Student** | Ajay Kumar | `ajay@gmail.com` | `student` | Browse catalog, submit course access requests, track approval status, access live recordings in Classroom, rate courses, chat in study groups. |

---

## 🚀 Key Features by Problem Statement Deliverables

### 1. Course Management & Administration (Slide 12)
* **Add Course Details**: Input course title, engineering category, difficulty level, estimated duration, and syllabus synopsis.
* **Dynamic Chapter Builder**: Add unlimited modules with associated learning materials (videos, slide decks, and companion documentation PDFs).
* **Faculty Directory (`FACULTYDETAILS`)**: Comprehensive roster tracking department assignments, contact information, and teaching tracks.
* **Student Directory (`STUDENTDETAILS`)**: Roster displaying student names, branch/department, registration dates, and enrolled courses.
* **Course Catalog Management (`COURSEDETAILS`)**: Course overview with chapter count, student enrollment count, and delete/edit tools.

### 2. Student Enrollment & Access Requests (Slide 13)
* **`REQUEST FOR COURSE`**: Clean catalog table with course titles (*Java*, *Angular*, *Node.js*, *MongoDB*, *React 19*), instructor names, and clickable **Request for Course** action.
* **`VIEW REQUEST`**: Status tracker showing real-time decision states:
  * 🟡 **Pending**: Request received, awaiting administrator authorization.
  * 🟢 **Approved**: Access unlocked immediately; one-click link straight to the Classroom.
  * 🔴 **Rejected**: Request declined with administrative notes.

### 3. Virtual Classroom & Progress Tracking (`OWN COURSE`)
* **HTML5 Video Lecture Player**: Responsive 16:9 media player for live class recordings.
* **Companion Resources**: Downloadable PDF lecture notes and presentation slide decks.
* **Interactive Progress Engine**: Interactive chapter checkboxes that dynamically compute and update the learner's completion percentage bar.
* **Course Feedback & Rating**: 5-star rating input with testimonials published directly to the course review board.

### 4. Real-Time Collaborative Group Chat
* **Multi-Channel Discussion Rooms**:
  * `# General Campus Lounge`: Institute-wide community chat.
  * `# Java Study Group`: Focused technical discussions on JVM, Spring Boot, and multithreading.
  * `# Angular / Node / MongoDB Study Groups`: Dedicated problem-solving channels led by faculties.
* **Role Verification Badges**: Distinct visual badges for Admins, Instructors, and Students with message timestamps.

### 5. High-Fidelity Public Portal & Technology Showcase (Slide 10)
* **PERFECT LEARN Mosaic Grid**: Interactive technology banner displaying Node.js, React, Angular, Python, Java, TypeScript, C#, PHP, .NET Core, MongoDB, HTML5, Ruby on Rails, and Pascal.
* **EdTech Bulletins & News**: Campus announcements and curriculum release notes.
* **Academic Inquiry Desk**: Interactive contact form with input validation.

---

## 🛠️ Architecture & Technology Stack

```
learn-ease-pro/
├── server.ts                  # Express backend running RESTful APIs + Vite dev middleware
├── src/
│   ├── components/
│   │   ├── Navbar.tsx         # Responsive header with role-aware tabs & demo quick-switcher
│   │   ├── TechBanner.tsx     # Slide 10 technology mosaic banner
│   │   ├── GroupChat.tsx      # Multi-channel collaborative discussion room
│   │   └── ChangePasswordModal.tsx # Account password update dialog
│   ├── views/
│   │   ├── HomeView.tsx       # Slide 10 public landing, news & contact portal
│   │   ├── LoginView.tsx      # Slide 11 login card with TypeOfUser radio selector
│   │   ├── AdminView.tsx      # Slide 12 admin console (Add Course, Rosters, Requests)
│   │   ├── StudentView.tsx    # Slide 13 student portal (Request, Track, Classroom)
│   │   └── FacultyView.tsx    # Instructor console for syllabus & material management
│   ├── context/
│   │   └── AuthContext.tsx    # Client-side authentication & role-switching context
│   ├── types.ts               # Shared TypeScript domain models
│   ├── App.tsx                # Client application root & role-based view orchestration
│   ├── main.tsx               # DOM entry point
│   └── index.css              # Tailwind CSS v4 styling & accessibility focus rules
├── index.html                 # HTML document entry
├── package.json               # Full-stack dependencies & scripts
├── tsconfig.json              # TypeScript compilation specifications
└── vite.config.ts             # Vite build & bundler configuration
```

### Backend REST API Endpoints (`server.ts`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user via email, password, and role |
| `POST` | `/api/auth/register` | Register new student or faculty account |
| `POST` | `/api/auth/change-password` | Update account credentials |
| `GET` | `/api/users` | List users filtered by role (`admin`, `faculty`, `student`) |
| `GET` | `/api/courses` | Retrieve complete course catalog |
| `POST` | `/api/courses` | Store new course with chapters and materials (Admin/Faculty) |
| `PUT` | `/api/courses/:id` | Update course syllabus, append chapters and video URLs |
| `DELETE` | `/api/courses/:id` | Remove course from database (Admin) |
| `GET` | `/api/requests` | List all student course access requests (Admin) |
| `POST` | `/api/requests` | Submit course enrollment request (Student) |
| `PUT` | `/api/requests/:id` | Approve or reject student access request (Admin) |
| `GET` | `/api/reviews` | Fetch reviews and star ratings for courses |
| `POST` | `/api/reviews` | Submit course rating and review (Student) |
| `GET` | `/api/chat/:roomId` | Retrieve discussion messages for specific channel |
| `POST` | `/api/chat/:roomId` | Broadcast new message to channel |
| `POST` | `/api/progress` | Update chapter completion progress |
| `POST` | `/api/reset-demo` | Restore initial sample demo dataset |

---

## 💻 Local Installation & Setup

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher) or **yarn** / **pnpm**

### Step-by-Step Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/learn-ease-pro.git
   cd learn-ease-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000` with the Express API and Vite client running simultaneously.

4. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

---

## 📱 Responsive Breakpoint Support

The user interface has been designed and tested across multiple device viewports:
* **Narrow Mobile (320px – 375px)**: Touch-optimized cards, non-wrapping status badges, scrollable pill navigation, and slide-over menu drawer.
* **Standard Mobile (375px – 480px)**: 16:9 video player, collapsible search, and room switcher for group chats.
* **Landscape Mobile / Tablets (480px – 1024px)**: Landscape-safe modal dialogs with vertical scroll bounds, balanced 2-column grids.
* **Large Monitors & 4K TVs (1440px – 3840px)**: Centered layout containers (`2xl:max-w-7xl`), accessible `:focus-visible` rings for keyboard and remote navigation, and dynamic 13-column tech stack mosaic.

---

## 📄 License

This project is licensed under the Apache-2.0 License.
