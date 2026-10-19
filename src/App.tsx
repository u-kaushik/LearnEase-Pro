/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { LoginView } from './views/LoginView';
import { AdminView } from './views/AdminView';
import { StudentView } from './views/StudentView';
import { FacultyView } from './views/FacultyView';
import { GroupChat } from './components/GroupChat';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { Course, User, AccessRequest } from './types';
import { RotateCcw, GraduationCap, CheckCircle } from 'lucide-react';

function LMSApp() {
  const { user, role, quickSwitchRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('requestcourse'); // default to student course view matching slide 13
  const [courses, setCourses] = useState<Course[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Synchronize default tab on role changes
  useEffect(() => {
    if (!user) {
      setCurrentTab('home');
    } else if (role === 'admin') {
      if (['requestcourse', 'viewrequest', 'owncourse', 'home'].includes(currentTab)) {
        setCurrentTab('addcourse'); // match Slide 12
      }
    } else if (role === 'student') {
      if (['addcourse', 'facultydetails', 'studentdetails', 'updatecourse', 'home'].includes(currentTab)) {
        setCurrentTab('requestcourse'); // match Slide 13
      }
    } else if (role === 'faculty') {
      if (['addcourse', 'requestcourse', 'viewrequest', 'owncourse', 'home'].includes(currentTab)) {
        setCurrentTab('coursedetails');
      }
    }
  }, [role, user]);

  const fetchData = async () => {
    try {
      const [coursesRes, usersRes, requestsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/users'),
        fetch('/api/requests'),
      ]);

      if (coursesRes.ok) setCourses(await coursesRes.json());
      if (usersRes.ok) setUsersList(await usersRes.json());
      if (requestsRes.ok) setRequests(await requestsRes.json());
    } catch (err) {
      console.error('Error fetching LMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResetDemoData = async () => {
    if (!confirm('Reset all courses, users, and requests to default sample data?')) return;
    try {
      const res = await fetch('/api/reset-demo', { method: 'POST' });
      if (res.ok) {
        await fetchData();
        alert('Sample demo data has been reset successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {/* Guest / Public Views */}
        {currentTab === 'login' && (
          <LoginView
            onSuccess={() => {
              // Redirect to role home
              if (role === 'admin') setCurrentTab('addcourse');
              else if (role === 'student') setCurrentTab('requestcourse');
              else setCurrentTab('coursedetails');
            }}
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {['home', 'courses', 'news', 'contact'].includes(currentTab) && !user && (
          <HomeView
            courses={courses}
            activeSection={currentTab}
            onSelectCourse={() => setCurrentTab('login')}
            onNavigateLogin={() => setCurrentTab('login')}
            onQuickRole={async (r) => {
              await quickSwitchRole(r);
              if (r === 'admin') setCurrentTab('addcourse');
              else if (r === 'student') setCurrentTab('requestcourse');
              else setCurrentTab('coursedetails');
            }}
          />
        )}

        {/* Global Chat Tab */}
        {currentTab === 'chat' && user && <GroupChat courses={courses} />}

        {/* Admin Views (Slide 12) */}
        {user && role === 'admin' && ['facultydetails', 'studentdetails', 'coursedetails', 'addcourse', 'requests'].includes(currentTab) && (
          <AdminView
            activeSubTab={currentTab}
            courses={courses}
            usersList={usersList}
            requests={requests}
            onRefreshData={fetchData}
            onSelectTab={(tab) => setCurrentTab(tab)}
            searchQuery={searchQuery}
          />
        )}

        {/* Student Views (Slide 13) */}
        {user && role === 'student' && ['requestcourse', 'viewrequest', 'owncourse', 'feedback'].includes(currentTab) && (
          <StudentView
            activeSubTab={currentTab}
            courses={courses}
            requests={requests}
            onRefreshData={fetchData}
            onSelectTab={(tab) => setCurrentTab(tab)}
            searchQuery={searchQuery}
          />
        )}

        {/* Faculty Views (Slide 5 Deliverable) */}
        {user && role === 'faculty' && ['coursedetails', 'updatecourse', 'enrolledstudents'].includes(currentTab) && (
          <FacultyView
            activeSubTab={currentTab}
            courses={courses}
            usersList={usersList}
            onRefreshData={fetchData}
            onSelectTab={(tab) => setCurrentTab(tab)}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {/* Change Password Dialog */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <span className="font-bold text-slate-700">PERFECT LEARN</span>
            <span>•</span>
            <span>LearnEase Pro MERN Capstone LMS</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleResetDemoData}
              className="inline-flex items-center space-x-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              title="Reset mock courses, accounts and access requests"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
            <span>•</span>
            <span>All rights reserved &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LMSApp />
    </AuthProvider>
  );
}
