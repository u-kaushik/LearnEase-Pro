import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, GraduationCap, Shield, UserCheck, BookOpen, MessageSquare, Key, LogOut, CheckCircle, ChevronDown, Bell, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenChangePassword: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pendingRequestsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenChangePassword,
  searchQuery,
  onSearchChange,
  pendingRequestsCount = 0,
}) => {
  const { user, role, logout, quickSwitchRole } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    onSelectTab(tab);
    setMobileDrawerOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner: Quick Demo Switcher Bar (Responsive from 320px to 4K TV) */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs px-2.5 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-800">
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-slate-200 tracking-tight">MERN Capstone</span>
          <span className="text-slate-600 hidden xs:inline">|</span>
          <span className="hidden sm:inline text-slate-400 font-medium">LearnEase Pro</span>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 ml-auto">
          <span className="text-slate-400 font-medium text-[10px] sm:text-xs hidden md:inline">Demo Role:</span>
          <button
            onClick={() => quickSwitchRole('student')}
            className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
              role === 'student'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <span className="hidden xs:inline">Learner </span>(Ajay)
          </button>
          <button
            onClick={() => quickSwitchRole('faculty')}
            className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
              role === 'faculty'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Faculty
          </button>
          <button
            onClick={() => quickSwitchRole('admin')}
            className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
              role === 'admin'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo matching Slide 10-13 */}
          <div
            onClick={() => handleTabClick(role ? 'dashboard' : 'home')}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <div className="text-lg sm:text-xl lg:text-2xl font-black tracking-wider leading-none">
                <span className="text-blue-700">PERFECT</span>{' '}
                <span className="text-amber-500">LEARN</span>
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-slate-400">
                LearnEase Pro LMS
              </span>
            </div>
          </div>

          {/* Desktop / Large Screen Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 uppercase text-xs font-bold tracking-wider">
            {!user && (
              <>
                <button
                  onClick={() => handleTabClick('home')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    currentTab === 'home'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  HOME
                </button>
                <button
                  onClick={() => handleTabClick('courses')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    currentTab === 'courses'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  COURSES
                </button>
                <button
                  onClick={() => handleTabClick('news')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    currentTab === 'news'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  NEWS
                </button>
                <button
                  onClick={() => handleTabClick('contact')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    currentTab === 'contact'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  CONTACT US
                </button>
                <button
                  onClick={() => handleTabClick('login')}
                  className="px-4 py-2 ml-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs"
                >
                  LOGIN
                </button>
              </>
            )}

            {user && role === 'admin' && (
              <>
                <button
                  onClick={() => handleTabClick('facultydetails')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'facultydetails' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  FACULTYDETAILS
                </button>
                <button
                  onClick={() => handleTabClick('studentdetails')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'studentdetails' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  STUDENTDETAILS
                </button>
                <button
                  onClick={() => handleTabClick('coursedetails')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'coursedetails' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  COURSEDETAILS
                </button>
                <button
                  onClick={() => handleTabClick('addcourse')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'addcourse' ? 'text-blue-600 bg-blue-50 font-black' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  ADD COURSE
                </button>
                <button
                  onClick={() => handleTabClick('requests')}
                  className={`relative px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'requests' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  REQUESTS
                  {pendingRequestsCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleTabClick('chat')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'chat' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  GROUP CHAT
                </button>
                <button
                  onClick={onOpenChangePassword}
                  className="px-2.5 py-2 text-slate-600 hover:text-blue-600 rounded-md transition-colors"
                >
                  CHANGE PASSWORD
                </button>
                <button
                  onClick={logout}
                  className="px-2.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors font-black"
                >
                  LOGOUT
                </button>
              </>
            )}

            {user && role === 'student' && (
              <>
                <button
                  onClick={() => handleTabClick('requestcourse')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'requestcourse' ? 'text-blue-600 bg-blue-50 font-black' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  REQUEST FOR COURSE
                </button>
                <button
                  onClick={() => handleTabClick('viewrequest')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'viewrequest' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  VIEW REQUEST
                </button>
                <button
                  onClick={() => handleTabClick('owncourse')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'owncourse' ? 'text-blue-600 bg-blue-50 font-black' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  OWN COURSE
                </button>
                <button
                  onClick={() => handleTabClick('feedback')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'feedback' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  FEEDBACK & RATINGS
                </button>
                <button
                  onClick={() => handleTabClick('chat')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'chat' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  GROUP CHAT
                </button>
                <button
                  onClick={onOpenChangePassword}
                  className="px-2.5 py-2 text-slate-600 hover:text-blue-600 rounded-md transition-colors"
                >
                  CHANGE PASSWORD
                </button>
                <button
                  onClick={logout}
                  className="px-2.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors font-black"
                >
                  LOGOUT
                </button>
              </>
            )}

            {user && role === 'faculty' && (
              <>
                <button
                  onClick={() => handleTabClick('coursedetails')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'coursedetails' ? 'text-blue-600 bg-blue-50 font-black' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  COURSEDETAILS
                </button>
                <button
                  onClick={() => handleTabClick('updatecourse')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'updatecourse' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  UPDATE COURSE
                </button>
                <button
                  onClick={() => handleTabClick('enrolledstudents')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'enrolledstudents' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  STUDENTDETAILS
                </button>
                <button
                  onClick={() => handleTabClick('chat')}
                  className={`px-2.5 py-2 rounded-md transition-colors ${
                    currentTab === 'chat' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  GROUP CHAT
                </button>
                <button
                  onClick={onOpenChangePassword}
                  className="px-2.5 py-2 text-slate-600 hover:text-blue-600 rounded-md transition-colors"
                >
                  CHANGE PASSWORD
                </button>
                <button
                  onClick={logout}
                  className="px-2.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors font-black"
                >
                  LOGOUT
                </button>
              </>
            )}
          </nav>

          {/* Right Action Area: Search + Hamburger */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Desktop Search Bar */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search catalog, modules..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-36 lg:w-52 xl:w-60 pl-3 pr-8 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all"
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 text-white p-1 rounded-md transition-colors"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Search Toggle Icon */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Mobile Search Field */}
        {mobileSearchOpen && (
          <div className="md:hidden py-2 px-1 border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search courses, chapters..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-xs bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch-Friendly Horizontal Pill Bar for Mobile & Tablets (Scrollable) */}
      {user && (
        <div className="xl:hidden bg-slate-50 border-t border-slate-200 px-3 py-1.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-1.5 min-w-max text-[11px] font-bold uppercase tracking-wider">
            {role === 'admin' && (
              <>
                <button
                  onClick={() => handleTabClick('addcourse')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'addcourse' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  ADD COURSE
                </button>
                <button
                  onClick={() => handleTabClick('requests')}
                  className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
                    currentTab === 'requests' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  <span>REQUESTS</span>
                  {pendingRequestsCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px]">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleTabClick('coursedetails')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'coursedetails' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  COURSES
                </button>
                <button
                  onClick={() => handleTabClick('studentdetails')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'studentdetails' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  STUDENTS
                </button>
                <button
                  onClick={() => handleTabClick('facultydetails')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'facultydetails' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  FACULTY
                </button>
                <button
                  onClick={() => handleTabClick('chat')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'chat' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  CHAT
                </button>
              </>
            )}

            {role === 'student' && (
              <>
                <button
                  onClick={() => handleTabClick('requestcourse')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'requestcourse' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  REQUEST FOR COURSE
                </button>
                <button
                  onClick={() => handleTabClick('viewrequest')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'viewrequest' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  VIEW REQUEST
                </button>
                <button
                  onClick={() => handleTabClick('owncourse')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'owncourse' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  OWN COURSE
                </button>
                <button
                  onClick={() => handleTabClick('feedback')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'feedback' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  FEEDBACK
                </button>
                <button
                  onClick={() => handleTabClick('chat')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'chat' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  GROUP CHAT
                </button>
              </>
            )}

            {role === 'faculty' && (
              <>
                <button
                  onClick={() => handleTabClick('coursedetails')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'coursedetails' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  COURSES
                </button>
                <button
                  onClick={() => handleTabClick('updatecourse')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'updatecourse' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  UPDATE COURSE
                </button>
                <button
                  onClick={() => handleTabClick('enrolledstudents')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'enrolledstudents' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  STUDENTDETAILS
                </button>
                <button
                  onClick={() => handleTabClick('chat')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    currentTab === 'chat' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  GROUP CHAT
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Slide-Over Drawer Navigation */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-slate-800 text-sm">Navigation Menu</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card inside Mobile Drawer */}
            {user && (
              <div className="p-4 border-b border-slate-100 bg-blue-50/50 flex items-center space-x-3">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-blue-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-xs truncate">{user.name}</div>
                  <div className="text-[10px] text-blue-700 uppercase font-black">{user.role} Account</div>
                  <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                </div>
              </div>
            )}

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 text-xs font-bold uppercase tracking-wider">
              {!user ? (
                <>
                  <button
                    onClick={() => handleTabClick('home')}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    HOME
                  </button>
                  <button
                    onClick={() => handleTabClick('courses')}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    COURSES
                  </button>
                  <button
                    onClick={() => handleTabClick('news')}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    NEWS
                  </button>
                  <button
                    onClick={() => handleTabClick('contact')}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    CONTACT US
                  </button>
                  <button
                    onClick={() => handleTabClick('login')}
                    className="w-full text-left px-3 py-2.5 rounded-lg bg-blue-600 text-white font-black"
                  >
                    LOGIN
                  </button>
                </>
              ) : (
                <>
                  {role === 'admin' && (
                    <>
                      <button
                        onClick={() => handleTabClick('addcourse')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'addcourse' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        ADD COURSE
                      </button>
                      <button
                        onClick={() => handleTabClick('requests')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${currentTab === 'requests' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        <span>STUDENT REQUESTS</span>
                        {pendingRequestsCount > 0 && (
                          <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                            {pendingRequestsCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => handleTabClick('coursedetails')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'coursedetails' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        COURSEDETAILS
                      </button>
                      <button
                        onClick={() => handleTabClick('studentdetails')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'studentdetails' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        STUDENTDETAILS
                      </button>
                      <button
                        onClick={() => handleTabClick('facultydetails')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'facultydetails' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        FACULTYDETAILS
                      </button>
                      <button
                        onClick={() => handleTabClick('chat')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'chat' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        GROUP CHAT
                      </button>
                    </>
                  )}

                  {role === 'student' && (
                    <>
                      <button
                        onClick={() => handleTabClick('requestcourse')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'requestcourse' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        REQUEST FOR COURSE
                      </button>
                      <button
                        onClick={() => handleTabClick('viewrequest')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'viewrequest' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        VIEW REQUEST
                      </button>
                      <button
                        onClick={() => handleTabClick('owncourse')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'owncourse' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        OWN COURSE
                      </button>
                      <button
                        onClick={() => handleTabClick('feedback')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'feedback' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        RATINGS & FEEDBACK
                      </button>
                      <button
                        onClick={() => handleTabClick('chat')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'chat' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        GROUP CHAT
                      </button>
                    </>
                  )}

                  {role === 'faculty' && (
                    <>
                      <button
                        onClick={() => handleTabClick('coursedetails')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'coursedetails' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        COURSEDETAILS
                      </button>
                      <button
                        onClick={() => handleTabClick('updatecourse')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'updatecourse' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        UPDATE COURSE
                      </button>
                      <button
                        onClick={() => handleTabClick('enrolledstudents')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'enrolledstudents' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        STUDENTDETAILS
                      </button>
                      <button
                        onClick={() => handleTabClick('chat')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg ${currentTab === 'chat' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        GROUP CHAT
                      </button>
                    </>
                  )}

                  <div className="pt-3 border-t border-slate-200 mt-3 space-y-1.5">
                    <button
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        onOpenChangePassword();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center space-x-2"
                    >
                      <Key className="w-4 h-4" />
                      <span>CHANGE PASSWORD</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-black"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>LOGOUT</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
