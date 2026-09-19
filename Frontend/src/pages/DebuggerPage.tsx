import React, { useState, useEffect } from 'react';
import { Drawer } from 'antd';
import { Sparkles, Clock, Hourglass, ShieldAlert, X } from 'lucide-react';
import Header from '../components/Header';
import LogInput from '../components/LogInput';
import AnalysisResult from '../components/AnalysisResult';
import type { AnalysisResponse } from '../types/debugging';
import { analyzeLogApi, ApiError } from '../services/debuggingApi';

export const DebuggerPage: React.FC = () => {
  const [logInput, setLogInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Handle rate-limit cooldown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds((prev) => prev - 1);
      }, 1000);
    } else if (cooldownSeconds === 0 && isRateLimited) {
      setIsRateLimited(false);
      setError(null);
    }
    return () => clearInterval(timer);
  }, [cooldownSeconds, isRateLimited]);

  const handleAnalyze = async () => {
    if (!logInput.trim() || cooldownSeconds > 0) return;

    setIsLoading(true);
    setError(null);
    setIsRateLimited(false);

    try {
      const res = await analyzeLogApi(logInput);
      setAnalysisResult(res);
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      if (err instanceof ApiError && err.isRateLimit) {
        setIsRateLimited(true);
        setCooldownSeconds(60);
        setError('Too Many Requests: Rate limit exceeded. Please wait a moment before trying again.');
      } else {
        const msg = err instanceof Error ? err.message : 'Failed to analyze logs. Please check backend connection.';
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setLogInput('');
    setAnalysisResult(null);
    setError(null);
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full space-y-8">
      <div className="space-y-8">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">AI Debugger</h2>
            <p className="text-xs text-slate-400 font-normal">Understand errors. Find solutions.</p>
          </div>
        </div>

        {/* History Nav */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-200 px-1">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>History</span>
          </div>

          {/* Empty History Card */}
          <div className="border border-dashed border-slate-700/80 bg-slate-900/40 rounded-xl p-6 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
              <Hourglass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">No history yet</p>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                Your analyzed logs will appear here in a future version.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info in sidebar */}
      <div className="text-[11px] text-slate-500 text-center">
        AI Debugger &copy; 2026
      </div>
    </div>
  );

  const handleLoadSample = () => {
    setLogInput(`System.NullReferenceException: Object reference not set to an instance of an object.
   at MyApp.Services.UserService.GetUserById(Int32 id) in C:\\Projects\\MyApp\\Services\\UserService.cs:line 25
   at MyApp.Controllers.UserController.GetUser(Int32 id) in C:\\Projects\\MyApp\\Controllers\\UserController.cs:line 18`);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-[#161c2e] text-white flex-col justify-between p-6 shrink-0 border-r border-slate-800">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Navigation Drawer */}
      <Drawer
        placement="left"
        width={280}
        onClose={() => setIsMobileSidebarOpen(false)}
        open={isMobileSidebarOpen}
        className="font-sans"
        styles={{ body: { backgroundColor: '#161c2e', padding: '1.5rem', color: '#fff' }, header: { display: 'none' } }}
      >
        {renderSidebarContent()}
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50">
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-6xl w-full mx-auto space-y-6 sm:space-y-8">
          <LogInput
            logInput={logInput}
            setLogInput={setLogInput}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isLoading={isLoading}
            cooldownSeconds={cooldownSeconds}
          />

          {/* User-friendly Rate Limit Exceeded Alert */}
          {isRateLimited && (
            <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                    <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-amber-950 flex flex-wrap items-center gap-2">
                      <span>Rate Limit Reached</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] sm:text-xs font-semibold">
                        429 Too Many Requests
                      </span>
                    </h4>
                    <p className="text-xs text-amber-900/80 leading-relaxed max-w-2xl">
                      You've submitted too many log analysis requests in a short period (limited to 10 requests per minute for backend stability). Please wait for the cooldown timer before trying again.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setError(null)}
                  className="text-amber-700 hover:text-amber-950 p-1 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress & Countdown indicator */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs font-medium text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                    Cooldown in progress...
                  </span>
                  <span className="font-bold font-mono">{cooldownSeconds}s remaining</span>
                </div>
                <div className="w-full h-2 rounded-full bg-amber-200/60 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(cooldownSeconds / 60) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* General Error Alert */}
          {error && !isRateLimited && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center justify-between shadow-xs">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-xs underline font-semibold cursor-pointer hover:text-red-900"
              >
                Dismiss
              </button>
            </div>
          )}

          {analysisResult && <AnalysisResult result={analysisResult} onLoadSample={handleLoadSample} />}
        </main>
      </div>
    </div>
  );
};

export default DebuggerPage;
