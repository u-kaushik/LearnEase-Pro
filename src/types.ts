export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  joinedDate: string;
  enrolledCourseIds?: string[];
  assignedCourseIds?: string[];
}

export type MaterialType = 'video' | 'document' | 'presentation' | 'code' | 'quiz';

export interface LearningMaterial {
  id: string;
  title: string;
  type: MaterialType;
  url: string;
  duration?: string;
  size?: string;
  description?: string;
  completedBy?: string[]; // user IDs
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  materials: LearningMaterial[];
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  facultyId: string;
  facultyName: string;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
}

export interface AccessRequest {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
  reason?: string;
  decidedAt?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string; // 'general' or courseId
  userId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  timestamp: string;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  completedChapterIds: string[];
  completedMaterialIds: string[];
  lastAccessedAt: string;
}
