# LearnEase Pro / PERFECT LEARN

Fortray / Simplilearn MERN capstone by Utkarsh Kaushik.

React and TypeScript frontend, Node/Express API, MongoDB and Mongoose persistence.
Educational demonstration with fictional seed accounts. Not a production service.

## Run locally

Requires Node.js 22.12+ and npm. MongoDB can run locally or on your own cluster.

```sh
git clone https://github.com/u-kaushik/LearnEase-Pro.git
cd LearnEase-Pro
npm ci
cp .env.example .env
# Set MONGODB_URI to your own database; never commit credentials.
npm run dev
```

Open http://localhost:3000. The server seeds an empty database on first start.
An alternative self-contained demo starts a real, temporary MongoDB process:

```sh
DEMO_MONGO=true npm run dev
```

Temporary demo data is discarded when the server stops. First start downloads a MongoDB binary. For persistent storage use MONGODB_URI and omit DEMO_MONGO.

```sh
npm run lint
npm run build
npm start
```

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@gmail.com | admin |
| Faculty | faculty@gmail.com | faculty |
| Student | ajay@gmail.com | student |

These publicly documented accounts are for local assessment only. Quick-login buttons use the same server login as the form. Passwords are salted and hashed with scrypt in MongoDB; sessions use HttpOnly SameSite cookies and expire after eight hours. Sessions are held in server memory. Run locally; do not expose this demo as a real student service.

## Features and assessment mapping

- Admin creates courses, views faculty/student records, approves/rejects access requests.
- Faculty browses courses and updates courses assigned to that faculty.
- Learners register/login, browse courses, request access, inspect status, view enrolled materials and track chapter/material progress.
- Learners submit course feedback and 1–5 ratings; authenticated users use discussion rooms.
- Administrators attach video/presentation/document URLs; PDF files up to 500 KB can be uploaded through the course form and are saved with course data. Larger media uses a hosted URL.
- React Router is included; the current screen navigation uses React component state.

## Storage design and limits

A Mongoose LearningState schema persists users, courses, requests, reviews, messages and progress in one atomic MongoDB document. API requests are serialized in the single server process and successful mutation responses follow database writes. This is a deliberately small assessment architecture, not a scalable multi-process service; MongoDB's document size limit applies. A production version would use separate indexed collections, durable sessions, object storage, upload scanning, stronger registration policies, pagination, rate limits and fuller validation.

Fictional sample account passwords are intentionally simple. Sample media and images are externally hosted and availability depends on those services. Chat uses polling, not WebSockets. Some seed documents are placeholder links. The contact form is a UI demonstration. No production-readiness or independent security-audit claim is made.

## Validation

TypeScript checking and Vite production build; API checks covering login, unauthenticated access, student permissions, invalid admin registration, admin course creation, faculty update, access request approval, progress, ratings, chat, learner registration and demo reset. Administrator, faculty, student, classroom and chat screens inspected in Chrome.
