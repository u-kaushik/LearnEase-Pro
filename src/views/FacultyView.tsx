import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Course, User, Chapter, LearningMaterial } from '../types';
import { Plus, Edit3, Trash2, CheckCircle2, BookOpen, Video, FileText, Users, Save, Sparkles } from 'lucide-react';

interface FacultyViewProps {
  activeSubTab: string;
  courses: Course[];
  usersList: User[];
  onRefreshData: () => Promise<void>;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
}

export const FacultyView: React.FC<FacultyViewProps> = ({
  activeSubTab,
  courses,
  usersList,
  onRefreshData,
  onSelectTab,
  searchQuery,
}) => {
  const { user } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New chapter inputs
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterDesc, setNewChapterDesc] = useState('');
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialType, setNewMaterialType] = useState<'video' | 'presentation' | 'document'>('video');
  const [newMaterialUrl, setNewMaterialUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [newMaterialDuration, setNewMaterialDuration] = useState('45:00 min');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const students = usersList.filter((u) => u.role === 'student');

  const handleAddChapterToCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !newChapterTitle.trim()) return;

    setUpdating(true);
    const newChapter: Chapter = {
      id: `ch-${Date.now()}`,
      title: newChapterTitle.trim(),
      description: newChapterDesc.trim() || 'Comprehensive module lecture and resources.',
      order: (selectedCourse.chapters?.length || 0) + 1,
      materials: [
        {
          id: `m-${Date.now()}-1`,
          title: newMaterialTitle.trim() || 'Live Class Recording',
          type: newMaterialType,
          url: newMaterialUrl,
          duration: newMaterialDuration,
          description: 'Faculty-uploaded learning material for students.',
        },
      ],
    };

    const updatedChapters = [...(selectedCourse.chapters || []), newChapter];

    try {
      const res = await fetch(`/api/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapters: updatedChapters,
        }),
      });

      if (res.ok) {
        setSuccessMsg(`Chapter "${newChapterTitle}" added successfully to ${selectedCourse.name}!`);
        setNewChapterTitle('');
        setNewChapterDesc('');
        setNewMaterialTitle('');
        await onRefreshData();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Welcome Banner */}
      <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b border-slate-200 gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
            Welcome to home page <span className="text-blue-700">{user?.name || 'Faculty Member'}</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Faculty Instructor Portal • Update Course Curriculums, Upload Class Recordings & Supervise Students
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800">
            Faculty: {user?.department || 'Academic Department'}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="mb-5 p-3.5 sm:p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs sm:text-sm animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* ---------------- SUB-TAB: UPDATE COURSE ---------------- */}
      {activeSubTab === 'updatecourse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">Update Course Syllabus & Materials</h2>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Select a course to append chapters, update recordings, or edit syllabus
                </p>
              </div>
            </div>

            <form onSubmit={handleAddChapterToCourse} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Select Target Course to Update
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.chapters?.length || 0} Chapters)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 sm:p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 mb-3 flex items-center space-x-1.5">
                  <Plus className="w-4 h-4 text-blue-700" />
                  <span>Add New Chapter & Learning Material</span>
                </h3>

                <div className="space-y-2.5 sm:space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Chapter Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      placeholder="e.g. Chapter 4: Microservices with Kafka & Redis"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Chapter Description / Synopsis
                    </label>
                    <input
                      type="text"
                      value={newChapterDesc}
                      onChange={(e) => setNewChapterDesc(e.target.value)}
                      placeholder="High level overview of concepts covered in this module..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Material Title
                      </label>
                      <input
                        type="text"
                        value={newMaterialTitle}
                        onChange={(e) => setNewMaterialTitle(e.target.value)}
                        placeholder="Live Recording / Slide Deck"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Material Type
                      </label>
                      <select
                        value={newMaterialType}
                        onChange={(e) => setNewMaterialType(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800"
                      >
                        <option value="video">Live Class Video Recording</option>
                        <option value="presentation">Presentation Deck (PPT/Keynote)</option>
                        <option value="document">Documentation PDF / Notes</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Video / Resource URL
                      </label>
                      <input
                        type="text"
                        value={newMaterialUrl}
                        onChange={(e) => setNewMaterialUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Lecture Duration
                      </label>
                      <input
                        type="text"
                        value={newMaterialDuration}
                        onChange={(e) => setNewMaterialDuration(e.target.value)}
                        placeholder="e.g. 45:00 min"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{updating ? 'Saving...' : 'Update Course & Append Chapter'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Existing Chapters in Selected Course */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Current Curriculum: {selectedCourse?.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedCourse?.chapters?.length || 0} chapters published
            </p>

            <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
              {selectedCourse?.chapters?.map((ch, idx) => (
                <div key={ch.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      #{idx + 1} {ch.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{ch.description}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center space-x-2 text-[10px] text-blue-700 font-semibold">
                    <Video className="w-3 h-3" />
                    <span>{ch.materials?.length || 0} attached resources</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB: COURSEDETAILS ---------------- */}
      {activeSubTab === 'coursedetails' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">All Course Syllabi</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Explore learning outcomes, modules, and live class materials
              </p>
            </div>
            <button
              onClick={() => onSelectTab('updatecourse')}
              className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider self-start sm:self-auto shadow-xs"
            >
              + Update / Add Chapters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {courses.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <img src={c.thumbnail} alt={c.name} className="w-full h-36 sm:h-40 object-cover" />
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{c.duration}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{c.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                    <div className="mt-3 text-xs text-slate-500 font-medium">
                      Faculty: <span className="text-slate-800 font-bold">{c.facultyName}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0">
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {c.chapters?.length || 0} Modules
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCourseId(c.id);
                        onSelectTab('updatecourse');
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      Update Course &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- SUB-TAB: ENROLLED STUDENTS ---------------- */}
      {activeSubTab === 'enrolledstudents' && (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Enrolled Students in Courses</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Students authorized to access live lectures, exercises, and exams
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">SrNo</th>
                    <th className="py-3 px-4">Learner Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Enrolled Tracks</th>
                    <th className="py-3 px-4 text-center">Class Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {students.map((s, index) => {
                    const enrolled = courses.filter((c) => s.enrolledCourseIds?.includes(c.id));
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-500">{index + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                        <td className="py-3.5 px-4 text-blue-700">{s.email}</td>
                        <td className="py-3.5 px-4 text-slate-600">{s.department || 'Undergrad'}</td>
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
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            Active Enrolled
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
                  <div className="text-xs text-slate-600">Branch: {s.department}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
