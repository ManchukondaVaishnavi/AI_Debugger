import React, { useState } from 'react';
import { Drawer } from 'antd';
import { Info, Sparkles, Code2, Server, Database, Bot, Zap, CheckCircle2, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const techStack = [
    { name: 'ASP.NET Core', icon: Server, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { name: 'React', icon: Code2, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { name: 'OpenAI', icon: Bot, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'MongoDB', icon: Database, color: 'bg-green-50 text-green-700 border-green-200' },
  ];

  return (
    <>
      <header className="flex justify-between items-center py-3.5 px-4 sm:px-8 border-b border-slate-200/60 bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle Button */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Mobile Branding (visible on mobile only) */}
          <div className="flex md:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-base">AI Debugger</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={showDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
          >
            <Info className="w-4 h-4 text-indigo-500" />
            <span>About</span>
          </button>
        </div>
      </header>

      {/* About Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3 py-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">About AI Debugger</h3>
              <p className="text-xs text-slate-500 font-normal">Intelligent Error Analysis System</p>
            </div>
          </div>
        }
        placement="right"
        width={Math.min(440, typeof window !== 'undefined' ? window.innerWidth * 0.9 : 440)}
        onClose={onClose}
        open={open}
        className="font-sans"
      >
        <div className="space-y-6 text-slate-700">
          {/* Main Description */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>AI-Powered Assistant</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              AI Debugger is an AI-powered debugging assistant that helps developers understand software errors and application logs.
            </p>
          </div>

          {/* Core Capability */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>How It Works</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Paste your error log or stack trace, and AI Debugger analyzes it to identify the error type, likely root cause, evidence, possible causes, and recommended fixes.
            </p>
          </div>

          {/* Mission Quote */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50/80 border-l-4 border-indigo-600">
            <p className="text-sm font-medium italic text-indigo-950 leading-relaxed">
              "Built for developers who want to understand why something failed instead of spending hours digging through logs."
            </p>
          </div>

          {/* Built With Tech Stack */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Built with
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {techStack.map((tech) => {
                const IconComp = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border ${tech.color} text-xs font-semibold shadow-sm transition-transform hover:scale-[1.02]`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
