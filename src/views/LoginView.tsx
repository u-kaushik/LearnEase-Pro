import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Lock, Mail, UserCheck, Shield, GraduationCap, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onNavigateHome }) => {
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [typeOfUser, setTypeOfUser] = useState<UserRole>('admin');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please provide your full name');
          setLoading(false);
          return;
        }
        const res = await register(name, email, password, typeOfUser, department);
        if (!res.success) {
          setError(res.error || 'Failed to sign up');
        } else {
          onSuccess();
        }
      } else {
        const res = await login(email, password, typeOfUser);
        if (!res.success) {
          setError(res.error || 'Authentication failed');
        } else {
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setName('');
    setDepartment('');
    setError(null);
  };

  const fillDemoAccount = (role: UserRole) => {
    setTypeOfUser(role);
    if (role === 'admin') {
      setEmail('admin@gmail.com');
      setPassword('admin');
    } else if (role === 'faculty') {
      setEmail('faculty@gmail.com');
      setPassword('faculty');
    } else {
      setEmail('ajay@gmail.com');
      setPassword('student');
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-8rem)] flex items-center justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center space-x-2 text-xl sm:text-2xl font-black mb-1">
            <span className="text-blue-700">PERFECT</span>{' '}
            <span className="text-amber-500">LEARN</span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-bold">
            LearnEase Pro eLearning System
          </p>
        </div>

        {/* Card matching Slide 11 */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-200 overflow-hidden">
          <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-3 sm:pb-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {isSignUp ? 'Create New Account' : 'Login Page'}
            </h2>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Slide 11
            </span>
          </div>

          <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-5 sm:py-6 space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ajay Kumar"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address / Username
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Branch</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Computer Science, Information Tech..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* TypeOfUser Radio Options matching Slide 11 - Responsive grid */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                TypeOfUser
              </label>
              <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1.5 sm:p-2 bg-slate-50 rounded-xl border border-slate-200">
                <label
                  className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg cursor-pointer text-xs font-semibold transition-all ${
                    typeOfUser === 'admin'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/50'
                  } ${isSignUp ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="typeOfUser"
                    value="admin"
                    checked={typeOfUser === 'admin'}
                    onChange={() => setTypeOfUser('admin')}
                    disabled={isSignUp}
                    className="sr-only"
                  />
                  <span>Admin</span>
                </label>

                <label
                  className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg cursor-pointer text-xs font-semibold transition-all ${
                    typeOfUser === 'faculty'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="typeOfUser"
                    value="faculty"
                    checked={typeOfUser === 'faculty'}
                    onChange={() => setTypeOfUser('faculty')}
                    className="sr-only"
                  />
                  <span>Faculty</span>
                </label>

                <label
                  className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg cursor-pointer text-xs font-semibold transition-all ${
                    typeOfUser === 'student'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="typeOfUser"
                    value="student"
                    checked={typeOfUser === 'student'}
                    onChange={() => setTypeOfUser('student')}
                    className="sr-only"
                  />
                  <span>Student</span>
                </label>
              </div>
            </div>

            {/* Buttons: SignIn & Reset (Slide 11 exact match) */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer text-center"
              >
                {loading ? 'Processing...' : isSignUp ? 'Register Account' : 'SignIn'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* SignUp / SignIn Toggle */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  if (!isSignUp && typeOfUser === 'admin') {
                    setTypeOfUser('student');
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
              >
                {isSignUp ? 'Already have an account? SignIn' : 'SignUp for an Account'}
              </button>
            </div>

            {/* Quick Demo Credentials Helpers */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Demo Autofill:
                </span>
                <span className="text-[10px] text-slate-400 hidden xs:inline">1-Click credentials</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin')}
                  className="px-2 py-1.5 text-[10px] sm:text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition-colors"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('faculty')}
                  className="px-2 py-1.5 text-[10px] sm:text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
                >
                  Faculty
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('student')}
                  className="px-2 py-1.5 text-[10px] sm:text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg border border-amber-200 transition-colors"
                >
                  Ajay
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
