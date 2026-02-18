
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              ?
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Real or <span className="text-blue-500">AI?</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it works</a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Privacy</a>
          </nav>
          <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10 transition-all">
            Forensic API
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 Real or AI? — Powered by Google Gemini Flash.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
