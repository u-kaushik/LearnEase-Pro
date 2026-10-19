import React, { useState } from 'react';
import { Course } from '../types';
import { TechBanner } from '../components/TechBanner';
import { BookOpen, Video, Users, Award, Star, ArrowRight, CheckCircle2, Search, Play, Mail, Phone, MapPin, Send } from 'lucide-react';

interface HomeViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onNavigateLogin: () => void;
  onQuickRole: (role: 'admin' | 'faculty' | 'student') => void;
  activeSection?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  courses,
  onSelectCourse,
  onNavigateLogin,
  onQuickRole,
  activeSection = 'home',
}) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Slide 10 Tech Stack Banner & Hero */}
      <TechBanner />

      {/* Main Content Area */}
      <div className="max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-10 sm:space-y-16 pb-12 sm:pb-16">
        {/* Quick Role Access Strip */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-widest">
              <span>MERN Stack Capstone</span>
              <span>•</span>
              <span>LearnEase Pro</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black">
              Try Any Persona with 1-Click:
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Experience role-based workflows for Administrators (manage courses), Faculties (update syllabus), and Learners (request access & watch recordings).
            </p>
          </div>

          <div className="grid grid-cols-3 xs:flex xs:flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onQuickRole('student')}
              className="px-2.5 sm:px-4 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] sm:text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer text-center"
            >
              Ajay (Student)
            </button>
            <button
              onClick={() => onQuickRole('faculty')}
              className="px-2.5 sm:px-4 py-2 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer text-center"
            >
              Faculty
            </button>
            <button
              onClick={() => onQuickRole('admin')}
              className="px-2.5 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Featured Courses Showcase */}
        <section id="courses" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 sm:gap-2 border-b border-slate-200 pb-3 sm:pb-4">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-700">
                Curriculum Catalog
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                Featured Engineering Tracks
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Full-stack, backend, enterprise Java, and cloud databases designed for modern EdTech learning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-blue-700/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
                      {course.category}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
                      <span>{course.duration}</span>
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 truncate mr-2">
                        By <strong className="text-slate-800">{course.facultyName}</strong>
                      </span>
                      <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded shrink-0">
                        {course.chapters?.length || 0} Modules
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0">
                  <button
                    onClick={() => onQuickRole('student')}
                    className="w-full py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Request Access / Learn</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Capabilities Grid */}
        <section className="bg-slate-50 rounded-3xl p-5 sm:p-10 lg:p-12 border border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Deliverables & Architecture
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Engineered for Modern EdTech Scaling
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              LearnEase Pro bridges the gap between students, educators, and enterprise training managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Video className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">Live Class Recordings & Docs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamless streaming of recorded classroom lectures, presentation slides, code repositories, and downloadable companion PDFs.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">Role-Based Enrollment Requests</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students request access with instant status tracking; administrators approve or decline with complete audit trails.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">Collaborative Group Chat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated real-time channels for campus lounge and per-course technical discussions with role-verified badges.
              </p>
            </div>
          </div>
        </section>

        {/* NEWS & UPDATES */}
        <section id="news" className="space-y-4 sm:space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Campus Bulletins
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Latest EdTech News & Releases
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Curriculum Update
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-2">
                Java 21 Virtual Threads & ZGC Performance Workshop Released
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dr. Sarah Mitchell uploaded 45 minutes of live class recordings analyzing heap allocation and sub-millisecond GC latency.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                International Expansion
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-2">
                LearnEase Pro Expands to European & APAC Online Learners
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Asynchronous class recordings and peer group chats now support students across multiple international timezones.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT US */}
        <section id="contact" className="bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Get In Touch
              </span>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight mt-1">
                Contact the PERFECT LEARN Academic Office
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 sm:mt-3 leading-relaxed">
                Have questions regarding semester course access, faculty assignments, or corporate training partnerships? We are here to help.
              </p>

              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-xs text-slate-300">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">support@perfectlearn.edu</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>+1 (800) 555-LEARN</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Global EdTech Tower, Tech Corridor</span>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleContactSubmit} className="bg-slate-800/90 border border-slate-700 p-5 sm:p-6 rounded-2xl space-y-3 sm:space-y-4">
              {contactSubmitted && (
                <div className="p-3 bg-emerald-900/80 border border-emerald-500 rounded-lg text-emerald-200 text-xs font-semibold">
                  Thank you! Your inquiry has been sent to our academic desk.
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Inquire about course tracks, certifications, or access..."
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Inquiry</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
