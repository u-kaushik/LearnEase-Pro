import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Course, AccessRequest, Review, StudentProgress } from '../types';
import { BookOpen, Video, FileText, CheckCircle2, Star, Clock, AlertCircle, Play, Download, Send, Check, ChevronRight } from 'lucide-react';

interface StudentViewProps {
  activeSubTab: string;
  courses: Course[];
  requests: AccessRequest[];
  onRefreshData: () => Promise<void>;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
}

export const StudentView: React.FC<StudentViewProps> = ({
  activeSubTab,
  courses,
  requests,
  onRefreshData,
  onSelectTab,
  searchQuery,
}) => {
  const { user } = useAuth();
  const [requestMsg, setRequestMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedOwnCourse, setSelectedOwnCourse] = useState<Course | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<any>(null);

  // Reviews state
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [courseReviews, setCourseReviews] = useState<Review[]>([]);

  // Progress state
  const [progress, setProgress] = useState<{ completedChapterIds: string[]; completedMaterialIds: string[] }>({
    completedChapterIds: [],
    completedMaterialIds: [],
  });

  const studentRequests = requests.filter((r) => r.studentId === user?.id);
  const enrolledCourseIds = user?.enrolledCourseIds || [];
  const ownCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

  // Default select first own course if none selected
  useEffect(() => {
    if (ownCourses.length > 0 && !selectedOwnCourse) {
      setSelectedOwnCourse(ownCourses[0]);
      if (ownCourses[0]?.chapters?.[0]?.materials?.[0]) {
        setActiveMaterial(ownCourses[0].chapters[0].materials[0]);
      }
    }
  }, [ownCourses, selectedOwnCourse]);

  // Load progress when selected course changes
  useEffect(() => {
    if (user && selectedOwnCourse) {
      fetch(`/api/progress/${user.id}/${selectedOwnCourse.id}`)
        .then((res) => res.json())
        .then((data) => setProgress(data))
        .catch(console.error);

      fetch(`/api/reviews?courseId=${selectedOwnCourse.id}`)
        .then((res) => res.json())
        .then((data) => setCourseReviews(data))
        .catch(console.error);
    }
  }, [user, selectedOwnCourse]);

  // Submit Course Access Request matching Slide 13 "Request for Course"
  const handleRequestCourse = async (course: Course) => {
    setErrorMsg(null);
    setRequestMsg(null);

    if (enrolledCourseIds.includes(course.id)) {
      setErrorMsg(`You are already enrolled in "${course.name}"! Access it immediately under "Own Course".`);
      return;
    }

    const existing = studentRequests.find((r) => r.courseId === course.id && r.status === 'Pending');
    if (existing) {
      setErrorMsg(`You already have a pending request for "${course.name}". Please wait for Admin approval.`);
      return;
    }

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          courseName: course.name,
          studentId: user?.id,
          studentName: user?.name,
          studentEmail: user?.email,
          reason: `Learner request for ${course.name} module access.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to submit request');
      } else {
        setRequestMsg(`Success! Your request for "${course.name}" has been sent to the Admin.`);
        await onRefreshData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    }
  };

  // Toggle chapter progress
  const handleToggleChapterProgress = async (chapterId: string) => {
    if (!user || !selectedOwnCourse) return;
    const isCompleted = progress.completedChapterIds.includes(chapterId);

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          courseId: selectedOwnCourse.id,
          chapterId,
          completed: !isCompleted,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProgress(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Feedback & Rating
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedOwnCourse || !reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedOwnCourse.id,
          userId: user.id,
          userName: user.name,
          rating: userRating,
          comment: reviewComment.trim(),
        }),
      });

      if (res.ok) {
        const newRev = await res.json();
        setCourseReviews([newRev, ...courseReviews]);
        setReviewComment('');
        setRequestMsg('Thank you! Your feedback and rating have been recorded.');
        setTimeout(() => setRequestMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Slide 13 Welcome Banner: "Welcome to home page ajay" */}
      <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-slate-200 gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
            Welcome to home page <span className="text-blue-700">{user?.name || 'student'}</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Student Portal • Request Course Access, Track Approvals & Access Live Class Recordings
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-blue-100 text-blue-800">
            Student: {user?.email}
          </span>
        </div>
      </div>

      {requestMsg && (
        <div className="mb-5 p-3.5 sm:p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs sm:text-sm animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{requestMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-5 p-3.5 sm:p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center space-x-3 text-amber-800 text-xs sm:text-sm animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* ---------------- SUB-TAB: REQUEST FOR COURSE (Exact match to Slide 13) ---------------- */}
      {activeSubTab === 'requestcourse' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Available Course Catalog</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Browse courses and click "Request for Course" to submit authorization request to administrator
              </p>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
              {filteredCourses.length} Courses
            </span>
          </div>

          {/* Table matching Slide 13 screenshot with SrNo, CourseName, Request */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Desktop & Tablet Table (>= sm screen) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3.5 px-4 w-16 text-center shrink-0">SrNo</th>
                    <th className="py-3.5 px-4 w-1/3 min-w-[160px] max-w-[260px]">CourseName</th>
                    <th className="py-3.5 px-4 w-48 whitespace-nowrap shrink-0">Category</th>
                    <th className="py-3.5 px-4 w-44 whitespace-nowrap shrink-0">Faculty</th>
                    <th className="py-3.5 px-6 w-52 whitespace-nowrap text-right shrink-0">Status / Request</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {filteredCourses.map((c, index) => {
                    const isEnrolled = enrolledCourseIds.includes(c.id);
                    const isPending = studentRequests.some(
                      (r) => r.courseId === c.id && r.status === 'Pending'
                    );

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 text-center font-bold text-slate-500 text-sm shrink-0">
                          {index + 1}
                        </td>
                        <td className="py-4 px-4 max-w-[260px]">
                          <div className="font-bold text-slate-900 text-sm lg:text-base leading-tight">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-1 max-w-[240px]">
                            {c.description}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap shrink-0">
                          <span className="inline-flex items-center px-2.5 py-1 bg-blue-50/80 text-blue-700 border border-blue-200/80 rounded-md text-xs font-semibold whitespace-nowrap">
                            {c.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap shrink-0 text-slate-700 font-medium">
                          {c.facultyName}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-right shrink-0">
                          {isEnrolled ? (
                            <button
                              onClick={() => {
                                setSelectedOwnCourse(c);
                                onSelectTab('owncourse');
                              }}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold hover:bg-emerald-100 whitespace-nowrap transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>Enrolled (Open)</span>
                            </button>
                          ) : isPending ? (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold whitespace-nowrap">
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span>Request Pending</span>
                            </span>
                          ) : (
                            /* Exact action matching Slide 13: "Request for Course" with clean non-wrapping button */
                            <button
                              onClick={() => handleRequestCourse(c)}
                              className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 rounded-lg text-xs font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer"
                            >
                              <span>Request for Course</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (Narrowest & Phone screens < sm) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {filteredCourses.map((c, index) => {
                const isEnrolled = enrolledCourseIds.includes(c.id);
                const isPending = studentRequests.some((r) => r.courseId === c.id && r.status === 'Pending');

                return (
                  <div key={c.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        #{index + 1} • {c.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{c.facultyName}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>

                    <div className="pt-2 flex items-center justify-between">
                      {isEnrolled ? (
                        <button
                          onClick={() => {
                            setSelectedOwnCourse(c);
                            onSelectTab('owncourse');
                          }}
                          className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Open Enrolled Course</span>
                        </button>
                      ) : isPending ? (
                        <div className="w-full py-2 bg-amber-50 text-amber-700 border border-amber-300 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Admin Approval</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRequestCourse(c)}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                        >
                          Request for Course
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB: VIEW REQUEST ---------------- */}
      {activeSubTab === 'viewrequest' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Your Course Requests & Approval Status</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Track the status of your submitted course enrollment applications
              </p>
            </div>
            <button
              onClick={() => onSelectTab('requestcourse')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Request More
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Desktop / Tablet Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center shrink-0">SrNo</th>
                    <th className="py-3 px-4 w-1/4 min-w-[150px] max-w-[220px]">Course Name</th>
                    <th className="py-3 px-4 w-40 whitespace-nowrap shrink-0">Requested Date</th>
                    <th className="py-3 px-4 min-w-[180px]">Notes</th>
                    <th className="py-3 px-4 w-36 whitespace-nowrap text-center shrink-0">Status</th>
                    <th className="py-3 px-6 w-44 whitespace-nowrap text-right shrink-0">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {studentRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">
                        You have not submitted any course requests yet. Visit "Request for Course" to get started!
                      </td>
                    </tr>
                  ) : (
                    studentRequests.map((r, index) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-500 shrink-0">{index + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 text-sm max-w-[220px] truncate">{r.courseName}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 shrink-0">{r.requestedAt}</td>
                        <td className="py-3.5 px-4 text-slate-600 line-clamp-1 max-w-xs">{r.reason}</td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap shrink-0">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
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
                        <td className="py-3.5 px-6 whitespace-nowrap text-right shrink-0">
                          {r.status === 'Approved' ? (
                            <button
                              onClick={() => {
                                const target = courses.find((c) => c.id === r.courseId);
                                if (target) setSelectedOwnCourse(target);
                                onSelectTab('owncourse');
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
                            >
                              Go to Classroom
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic whitespace-nowrap">Awaiting Admin</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Requests View */}
            <div className="sm:hidden divide-y divide-slate-100">
              {studentRequests.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No course requests submitted yet.
                </div>
              ) : (
                studentRequests.map((r, index) => (
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

                    <h4 className="font-bold text-slate-900 text-sm">{r.courseName}</h4>
                    <p className="text-xs text-slate-500">{r.reason}</p>

                    {r.status === 'Approved' && (
                      <button
                        onClick={() => {
                          const target = courses.find((c) => c.id === r.courseId);
                          if (target) setSelectedOwnCourse(target);
                          onSelectTab('owncourse');
                        }}
                        className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Enter Classroom &rarr;
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB: OWN COURSE (Live Class Recordings & Learning Materials) ---------------- */}
      {activeSubTab === 'owncourse' && (
        <div className="space-y-6">
          {ownCourses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Enrolled Courses Yet</h3>
              <p className="text-xs text-slate-500 mb-6">
                You haven't been granted access to any courses yet. Go to "Request for Course" to apply, or ask an administrator to approve your pending requests.
              </p>
              <button
                onClick={() => onSelectTab('requestcourse')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Browse Course Catalog
              </button>
            </div>
          ) : (
            <div>
              {/* Course Selector Tabs - Responsive horizontal scroll */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto scrollbar-none">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                  Enrolled Tracks:
                </span>
                {ownCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedOwnCourse(c);
                      if (c.chapters?.[0]?.materials?.[0]) {
                        setActiveMaterial(c.chapters[0].materials[0]);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      selectedOwnCourse?.id === c.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {selectedOwnCourse && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  {/* Left Column: Video Lecture Player & Learning Material Showcase */}
                  <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                      {/* Video Player (Responsive aspect-video) */}
                      <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                        {activeMaterial?.type === 'video' ? (
                          <video
                            key={activeMaterial.url}
                            controls
                            autoPlay={false}
                            className="w-full h-full object-cover"
                            poster={selectedOwnCourse.thumbnail}
                          >
                            <source src={activeMaterial.url} type="video/mp4" />
                            Your browser does not support HTML5 video.
                          </video>
                        ) : (
                          <div className="text-center p-6 sm:p-8 text-white">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-600/30 border border-blue-400 flex items-center justify-center mx-auto mb-3">
                              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />
                            </div>
                            <h4 className="font-bold text-sm sm:text-base mb-1">{activeMaterial?.title}</h4>
                            <p className="text-xs text-slate-300 max-w-md mx-auto mb-4">
                              {activeMaterial?.description || 'Downloadable companion lecture document and presentation notes.'}
                            </p>
                            <button
                              onClick={() => alert(`Downloading "${activeMaterial?.title}" companion pack...`)}
                              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download Material</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600">
                              Active Material • {activeMaterial?.type?.toUpperCase() || 'VIDEO'}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                              {activeMaterial?.title || selectedOwnCourse.name}
                            </h3>
                          </div>
                          {activeMaterial?.duration && (
                            <span className="inline-flex items-center text-xs text-slate-500 font-medium">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {activeMaterial.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                          {activeMaterial?.description || selectedOwnCourse.description}
                        </p>
                      </div>
                    </div>

                    {/* Feedback & Ratings section (Slide 5 Deliverable) */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
                      <div className="border-b border-slate-100 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Course Feedback & Rating</h4>
                          <p className="text-[11px] text-slate-500">
                            Share your learning experience and rate this course
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs sm:text-sm">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>4.8 / 5.0 (Student Average)</span>
                        </div>
                      </div>

                      <form onSubmit={handleSubmitReview} className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Your Star Rating
                          </label>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setUserRating(star)}
                                className="p-1 text-amber-400 hover:scale-125 transition-transform"
                              >
                                <Star
                                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                    userRating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-slate-600 ml-2">
                              {userRating} of 5 Stars
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Feedback Review
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="How were the class recordings, presentation notes, and syllabus clarity?"
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-2"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{submittingReview ? 'Submitting...' : 'Submit Feedback'}</span>
                        </button>
                      </form>

                      {/* Display Existing Reviews */}
                      <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Learner Reviews ({courseReviews.length})
                        </h5>
                        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                          {courseReviews.map((rev) => (
                            <div key={rev.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                                <div className="flex items-center space-x-1 text-amber-500 text-xs">
                                  {Array.from({ length: rev.rating }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-slate-600">{rev.comment}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{rev.createdAt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Chapters Checklist & Progress Tracking */}
                  <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-900 text-sm">Course Syllabus & Progress</h3>
                        <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          {Math.round(
                            ((progress.completedChapterIds?.length || 0) /
                              (selectedOwnCourse.chapters?.length || 1)) *
                              100
                          )}
                          % Done
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.round(
                              ((progress.completedChapterIds?.length || 0) /
                                (selectedOwnCourse.chapters?.length || 1)) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <div className="space-y-3">
                        {selectedOwnCourse.chapters?.map((ch, idx) => {
                          const isDone = progress.completedChapterIds.includes(ch.id);
                          return (
                            <div
                              key={ch.id}
                              className={`p-3 rounded-xl border transition-all ${
                                isDone
                                  ? 'bg-emerald-50/60 border-emerald-200'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleChapterProgress(ch.id)}
                                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                                        isDone
                                          ? 'bg-emerald-600 text-white'
                                          : 'border border-slate-400 bg-white hover:border-slate-600'
                                      }`}
                                      title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                                    >
                                      {isDone && <Check className="w-3 h-3 stroke-3" />}
                                    </button>
                                    <span
                                      className={`text-xs font-bold leading-tight ${
                                        isDone ? 'text-emerald-900 line-through' : 'text-slate-800'
                                      }`}
                                    >
                                      {ch.title}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 ml-6 mt-0.5 line-clamp-1">
                                    {ch.description}
                                  </p>
                                </div>
                              </div>

                              {/* Chapter Materials */}
                              <div className="ml-6 space-y-1 pt-1.5 border-t border-slate-200/50">
                                {ch.materials?.map((m) => {
                                  const isActive = activeMaterial?.id === m.id;
                                  return (
                                    <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => setActiveMaterial(m)}
                                      className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center justify-between transition-colors ${
                                        isActive
                                          ? 'bg-blue-600 text-white font-bold'
                                          : 'hover:bg-slate-200/70 text-slate-700'
                                      }`}
                                    >
                                      <div className="flex items-center space-x-1.5 truncate">
                                        {m.type === 'video' ? (
                                          <Video className="w-3.5 h-3.5 shrink-0" />
                                        ) : (
                                          <FileText className="w-3.5 h-3.5 shrink-0" />
                                        )}
                                        <span className="truncate">{m.title}</span>
                                      </div>
                                      {m.duration && (
                                        <span className={`text-[10px] shrink-0 ml-1 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                                          {m.duration}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------- SUB-TAB: FEEDBACK ---------------- */}
      {activeSubTab === 'feedback' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Course Ratings & Reviews</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Read authentic learner reviews and submit your own feedback for courses you are enrolled in
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {course.category}
                    </span>
                    <div className="flex items-center text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span>5.0</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{course.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                  <div className="text-[11px] text-slate-400 mt-2">Faculty: {course.facultyName}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedOwnCourse(course);
                      onSelectTab('owncourse');
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 text-xs font-bold rounded-lg transition-colors text-center cursor-pointer"
                  >
                    {enrolledCourseIds.includes(course.id) ? 'Review in Classroom' : 'View Course Syllabus'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
