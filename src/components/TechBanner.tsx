import React from 'react';

export const TechBanner: React.FC = () => {
  const techs = [
    { name: 'Node.js', color: 'from-emerald-600 to-green-700', badge: 'node', label: 'Node.js' },
    { name: 'React', color: 'from-cyan-500 to-blue-600', badge: '⚛', label: 'React.js' },
    { name: 'Angular', color: 'from-rose-600 to-red-700', badge: 'A', label: 'Angular' },
    { name: 'Python', color: 'from-blue-600 to-amber-500', badge: '🐍', label: 'Python' },
    { name: 'Java', color: 'from-orange-600 to-amber-700', badge: '☕', label: 'Java' },
    { name: 'TypeScript', color: 'from-blue-500 to-indigo-600', badge: 'TS', label: 'TypeScript' },
    { name: 'JavaScript', color: 'from-amber-400 to-yellow-500', badge: 'JS', label: 'JavaScript' },
    { name: 'PHP', color: 'from-indigo-400 to-purple-600', badge: 'php', label: 'PHP' },
    { name: 'C# / .NET', color: 'from-purple-600 to-indigo-700', badge: 'C#', label: '.NET Core' },
    { name: 'MongoDB', color: 'from-emerald-500 to-green-600', badge: '🍃', label: 'MongoDB' },
    { name: 'HTML5', color: 'from-orange-500 to-rose-600', badge: '5', label: 'HTML5' },
    { name: 'Rails', color: 'from-red-600 to-rose-700', badge: 'Rails', label: 'Ruby Rails' },
    { name: 'Pascal', color: 'from-blue-600 to-cyan-700', badge: 'P', label: 'Pascal' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 py-6 sm:py-10 px-3 sm:px-6 border-y border-slate-800">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl 2xl:max-w-7xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-0.5 sm:py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4">
          <span>Enterprise EdTech Platform</span>
          <span>•</span>
          <span>Full Stack & Industry Ready</span>
        </div>

        <h2 className="text-xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3">
          Master Modern Technologies with <span className="text-amber-400">PERFECT LEARN</span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto mb-6 sm:mb-8 font-normal leading-relaxed px-2">
          Comprehensive curriculum spanning frontend, backend, databases, and microservices with interactive live recordings and faculty-guided study rooms.
        </p>

        {/* Tech Grid Mosaic matching Slide 10 - Highly responsive across all viewports */}
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 2xl:grid-cols-13 gap-2 sm:gap-3 max-w-6xl mx-auto">
          {techs.map((tech, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-500/80 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 group cursor-default"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${tech.color} flex items-center justify-center text-white font-extrabold text-xs sm:text-sm shadow-md mb-1.5 group-hover:scale-110 transition-transform`}
              >
                {tech.badge}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors truncate max-w-full">
                {tech.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
