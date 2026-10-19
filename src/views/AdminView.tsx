import React, { useState } from 'react';
import { Course, User, AccessRequest, Chapter, LearningMaterial } from '../types';
import { Plus, Trash2, CheckCircle2, XCircle, Search, Users, GraduationCap, BookOpen, Layers, Clock, AlertCircle, Save, RotateCcw, ShieldCheck, Video, FileText, Check } from 'lucide-react';

interface AdminViewProps {
  activeSubTab: string;
  courses: Course[];
  usersList: User[];
  requests: AccessRequest[];
  onRefreshData: () => Promise<void>;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
}

export const AdminView: React.FC<AdminViewProps> = ({
  activeSubTab,
  courses,
  usersList,
  requests,
  onRefreshData,
  onSelectTab,
  searchQuery,
}) => {
  // Course creation state matching Slide 12
  const [courseName, setCourseName] = useState('');
  const [courseCategory, setCourseCategory] = useState('Full Stack Engineering');
  const [courseLevel, setCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [courseDuration, setCourseDuration] = useState('36 hours • 5 Modules');
  const [courseDescription, setCourseDescription] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState('u-fac-1');

  // Chapters list for new course
  const [chapters, setChapters] = useState<
    Array<{
      title: string;
      description: string;
      materialTitle: string;
      materialType: 'video' | 'document' | 'presentation';
      materialUrl: string;
      duration?: string;
    }>
  >([
    {
      title: 'Chapter 1: Foundations and System Setup',
      description: 'Environment installation, architecture overview, and core syntax.',
      materialTitle: 'Live Class Recording: Kickoff Session',
      materialType: 'video',
      materialUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '40:00 min',
    },
  ]);

  const [savingCourse, setSavingCourse] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const faculties = usersList.filter((u) => u.role === 'faculty');
  const students = usersList.filter((u) => u.role === 'student');

  const handleAddChapterRow = () => {
    setChapters([
      ...chapters,
      {
        title: `Chapter ${chapters.length + 1}: Advanced Concepts & Implementations`,
        description: 'Detailed analysis, real-world case studies, and coding lab.',
        materialTitle: `Lecture Recording: Chapter ${chapters.length + 1} Deep Dive`,
        materialType: 'video',
        materialUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '35:00 min',
      },
    ]);
  };

  const handleRemoveChapterRow = (index: number) => {
    if (chapters.length === 1) return;
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleResetCourseForm = () => {
    setCourseName('');
    setCourseDescription('');
    setCourseCategory('Full Stack Engineering');
    setChapters([
      {
        title: 'Chapter 1: Foundations and System Setup',
        description: 'Environment installation, architecture overview, and core syntax.',
        materialTitle: 'Live Class Recording: Kickoff Session',
        materialType: 'video',
        materialUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '40:00 min',
      },
    ]);
  };

  // Submit / Store Course matching Slide 12 "Store Course"
  const handleStoreCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      alert('Please enter a course name');
      return;
    }

    setSavingCourse(true);
    const facultyObj = faculties.find((f) => f.id === selectedFacultyId) || faculties[0];

    const formattedChapters: Chapter[] = chapters.map((ch, idx) => ({
      id: `ch-${Date.now()}-${idx}`,
      title: ch.title,
      description: ch.description,
      order: idx + 1,
      materials: [
        {
          id: `m-${Date.now()}-${idx}-1`,
          title: ch.materialTitle || 'Lecture Video',
          type: ch.materialType,
          url: ch.materialUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          duration: ch.duration || '30:00 min',
          description: 'Official course learning material for this module.',
        },
      ],
    }));

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: courseName,
          description: courseDescription || `Comprehensive hands-on training curriculum for ${courseName}.`,
          category: courseCategory,
          level: courseLevel,
          duration: courseDuration,
          facultyId: facultyObj?.id || 'u-fac-1',
          facultyName: facultyObj?.name || 'Dr. Sarah Mitchell',
          chapters: formattedChapters,
        }),
      });

      if (res.ok) {
        setActionSuccessMsg(`Course "${courseName}" has been successfully stored to database!`);
        handleResetCourseForm();
        await onRefreshData();
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCourse(false);
    }
  };

  // Request Decision (Approve / Reject)
  const handleDecision = async (requestId: string, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete course "${name}"?`)) return;
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      if (res.ok) {
        await onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.facultyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Slide 12 Welcome Banner: "Welcome to home page admin" */}
      <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-slate-200 gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
            Welcome to home page <span className="text-blue-700">admin</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            System Administration • Manage Course Catalog, Faculty Rosters, Student Enrollments & Access Requests
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Administrator Authority
          </span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="mb-5 p-3.5 sm:p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs sm:text-sm animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccessMsg}</span>
        </div>
      )}

      {/* ---------------- SUB-TAB: ADD COURSE (Exact match to Slide 12) ---------------- */}
      {activeSubTab === 'addcourse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Form matching Slide 12 left column */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Add Course Details</h2>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Slide 12 Interface</span>
            </div>

            <form onSubmit={handleStoreCourse} className="space-y-4 sm:space-y-6">
              {/* Course Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Course Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java, Angular, Next.js Full Stack..."
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium transition-all"
                />
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  >
                    <option value="Frontend Engineering">Frontend Engineering</option>
                    <option value="Backend & Enterprise">Backend & Enterprise</option>
                    <option value="Full Stack Engineering">Full Stack Engineering</option>
                    <option value="Database & Cloud">Database & Cloud</option>
                    <option value="DevOps & System Architecture">DevOps & System Architecture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Faculty
                  </label>
                  <select
                    value={selectedFacultyId}
                    onChange={(e) => setSelectedFacultyId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  >
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.department || 'Faculty'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Learning Outcomes
                </label>
                <textarea
                  rows={2}
                  placeholder="Outline syllabus milestones, key prerequisites, and real-world project deliverables..."
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                ></textarea>
              </div>

              {/* Chapters & Materials Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Course Chapters & Materials ({chapters.length})
                  </label>
                  {/* "Add Chapter" Button matching Slide 12 */}
                  <button
                    type="button"
                    onClick={handleAddChapterRow}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Chapter</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto pr-1">
                  {chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 relative group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wide">
                          Chapter #{idx + 1}
                        </span>
                        {chapters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveChapterRow(idx)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove chapter"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          value={ch.title}
                          onChange={(e) => {
                            const updated = [...chapters];
                            updated[idx].title = e.target.value;
                            setChapters(updated);
                          }}
                          placeholder="Chapter Title"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded font-semibold text-slate-800"
                        />

                        <input
                          type="text"
                          value={ch.description}
                          onChange={(e) => {
                            const updated = [...chapters];
                            updated[idx].description = e.target.value;
                            setChapters(updated);
                          }}
                          placeholder="Chapter Synopsis"
                          className="w-full px-3 py-1 text-xs bg-white border border-slate-300 rounded text-slate-600"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                              Material Title
                            </span>
                            <input
                              type="text"
                              value={ch.materialTitle}
                              onChange={(e) => {
                                const updated = [...chapters];
                                updated[idx].materialTitle = e.target.value;
                                setChapters(updated);
                              }}
                              placeholder="e.g. Live Class Recording"
                              className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-800"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                              Material Type
                            </span>
                            <select
                              value={ch.materialType}
                              onChange={(e) => {
                                const updated = [...chapters];
                                updated[idx].materialType = e.target.value as any;
                                setChapters(updated);
                              }}
                              className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-800"
                            >
                              <option value="video">Live Class Video Recording</option>
                              <option value="presentation">Presentation Slides</option>
                              <option value="document">Documentation & PDF</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Store Course & Reset matching Slide 12 */}
              <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={savingCourse}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingCourse ? 'Storing...' : 'Store Course'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetCourseForm}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column Graphic Illustration matching Slide 12 */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-100 rounded-2xl border border-blue-100">
            <div className="relative w-full aspect-4/3 flex items-center justify-center mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-xl w-full text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-500/30">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1">
                  Curriculum Archival Engine
                </h3>
                <p className="text-[11px] text-slate-500 mb-3">
                  Upload lecture recordings, attach slide decks, and publish directly to students.
                </p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-left space-y-1.5 text-xs font-semibold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Active Courses</span>
                    <span className="text-blue-600 font-bold">{courses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pending Requests</span>
                    <span className="text-amber-600 font-bold">
                      {requests.filter((r) => r.status === 'Pending').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Registered Faculties</span>
                    <span className="text-indigo-600 font-bold">{faculties.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">
                PERFECT LEARN • COURSE ARCHIVE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB: COURSEDETAILS ---------------- */}
      {activeSubTab === 'coursedetails' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">All Registered Courses</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Manage live courses, review module counts, and update learning content
              </p>
            </div>
            <button
              onClick={() => onSelectTab('addcourse')}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Course</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center shrink-0">SrNo</th>
                    <th className="py-3 px-4 w-1/3 min-w-[160px] max-w-[260px]">Course Name</th>
                    <th className="py-3 px-4 w-44 whitespace-nowrap shrink-0">Category</th>
                    <th className="py-3 px-4 w-40 whitespace-nowrap shrink-0">Faculty In Charge</th>
                    <th className="py-3 px-4 w-24 text-center whitespace-nowrap shrink-0">Chapters</th>
                    <th className="py-3 px-4 w-36 whitespace-nowrap shrink-0">Duration</th>
                    <th className="py-3 px-4 w-20 text-right whitespace-nowrap shrink-0">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {filteredCourses.map((c, index) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-500 shrink-0">{index + 1}</td>
                      <td className="py-3.5 px-4 max-w-[260px]">
                        <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{c.description}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap shrink-0">
                        <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold border border-blue-200 whitespace-nowrap">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap shrink-0 font-medium text-slate-700">{c.facultyName}</td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap shrink-0">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          {c.chapters?.length || 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap shrink-0 text-slate-600">{c.duration}</td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap shrink-0">
                        <button
                          onClick={() => handleDeleteCourse(c.id, c.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredCourses.map((c, index) => (
                <div key={c.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      #{index + 1} • {c.category}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {c.chapters?.length || 0} Chapters
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">Faculty: {c.facultyName}</span>
                    <button
                      onClick={() => handleDeleteCourse(c.id, c.name)}
                      className="text-rose-600 hover:text-rose-800 font-bold p-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB: FACULTYDETAILS ---------------- */}
      {activeSubTab === 'facultydetails' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Faculty Details</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Complete roster of faculty members and assigned teaching tracks
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {faculties.length} Faculties
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">SrNo</th>
                    <th className="py-3 px-4">Faculty Name</th>
                    <th className="py-3 px-4">Email ID</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Assigned Courses</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {faculties.map((f, index) => {
                    const assignedCourses = courses.filter((c) => c.facultyId === f.id);
                    return (
                      <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-500">{index + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={f.avatar}
                              alt={f.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <span className="font-bold text-slate-900">{f.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-blue-700 font-medium">{f.email}</td>
                        <td className="py-3.5 px-4 text-slate-600">{f.department || 'Computer Science'}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {assignedCourses.map((c) => (
                              <span
                                key={c.id}
                                className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11px] font-semibold border border-blue-200"
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{f.joinedDate}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {faculties.map((f, index) => (
                <div key={f.id} className="p-4 space-y-2">
                  <div className="flex items-center space-x-3">
                    <img src={f.avatar} alt={f.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{f.name}</h4>
                      <p className="text-xs text-blue-700">{f.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600">Dept: {f.department}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB: STUDENTDETAILS ---------------- */}
      {activeSubTab === 'studentdetails' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Student Details</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Registered learners, course enrollment statuses, and progress
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {students.length} Learners
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">SrNo</th>
                    <th className="py-3 px-4">Learner Name</th>
                    <th className="py-3 px-4">Email ID</th>
                    <th className="py-3 px-4">Branch / Dept</th>
                    <th className="py-3 px-4">Enrolled Courses</th>
                    <th className="py-3 px-4">Registration Date</th>
                    <th className="py-3 px-4 text-center">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {students.map((s, index) => {
                    const enrolled = courses.filter((c) => s.enrolledCourseIds?.includes(c.id));
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-500">{index + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={s.avatar}
                              alt={s.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{s.name}</div>
                              {s.name.toLowerCase() === 'ajay' && (
                                <span className="text-[10px] text-amber-600 font-bold">
                                  ★ Slide 13 Student
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-blue-700 font-medium">{s.email}</td>
                        <td className="py-3.5 px-4 text-slate-600">{s.department || 'Engineering'}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {enrolled.map((c) => (
                              <span
                                key={c.id}
                                className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[11px] font-semibold border border-emerald-200"
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{s.joinedDate}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
                            Enrolled
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {students.map((s, index) => (
                <div key={s.id} className="p-4 space-y-2">
                  <div className="flex items-center space-x-3">
                    <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                      <p className="text-xs text-blue-700">{s.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600">Dept: {s.department}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB: REQUESTS ---------------- */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Student Course Access Requests</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Authorize learner enrollment requests to unlock video lectures & learning materials
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center shrink-0">SrNo</th>
                    <th className="py-3 px-4 w-36 whitespace-nowrap shrink-0">Student Name</th>
                    <th className="py-3 px-4 w-44 whitespace-nowrap shrink-0">Student Email</th>
                    <th className="py-3 px-4 w-44 whitespace-nowrap shrink-0">Course Name</th>
                    <th className="py-3 px-4 w-36 whitespace-nowrap shrink-0">Requested On</th>
                    <th className="py-3 px-4 min-w-[160px]">Reason / Notes</th>
                    <th className="py-3 px-4 w-32 whitespace-nowrap text-center shrink-0">Status</th>
                    <th className="py-3 px-6 w-44 whitespace-nowrap text-right shrink-0">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {requests.map((r, index) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-500 shrink-0">{index + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap shrink-0">{r.studentName}</td>
                      <td className="py-3.5 px-4 text-blue-700 whitespace-nowrap shrink-0">{r.studentEmail}</td>
                      <td className="py-3.5 px-4 font-bold text-indigo-900 whitespace-nowrap shrink-0">{r.courseName}</td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap shrink-0">{r.requestedAt}</td>
                      <td className="py-3.5 px-4 text-slate-600 line-clamp-1 max-w-xs">{r.reason}</td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            r.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : r.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right whitespace-nowrap shrink-0">
                        {r.status === 'Pending' ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleDecision(r.id, 'Approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs uppercase cursor-pointer whitespace-nowrap"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecision(r.id, 'Rejected')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-xs uppercase cursor-pointer whitespace-nowrap"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic whitespace-nowrap">Decided</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="lg:hidden divide-y divide-slate-100">
              {requests.map((r, index) => (
                <div key={r.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      #{index + 1} • {r.requestedAt}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{r.courseName}</h4>
                    <p className="text-xs text-slate-600">Student: <strong>{r.studentName}</strong> ({r.studentEmail})</p>
                    <p className="text-[11px] text-slate-500 mt-1">{r.reason}</p>
                  </div>

                  {r.status === 'Pending' && (
                    <div className="pt-2 flex items-center space-x-2">
                      <button
                        onClick={() => handleDecision(r.id, 'Approved')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Approve Access
                      </button>
                      <button
                        onClick={() => handleDecision(r.id, 'Rejected')}
                        className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
