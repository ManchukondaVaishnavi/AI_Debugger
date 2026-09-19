import React from 'react';
import { Sparkles, Trash2, Loader2, Clock } from 'lucide-react';

interface LogInputProps {
  logInput: string;
  setLogInput: (val: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isLoading: boolean;
  cooldownSeconds?: number;
}

export const LogInput: React.FC<LogInputProps> = ({
  logInput,
  setLogInput,
  onAnalyze,
  onClear,
  isLoading,
  cooldownSeconds = 0,
}) => {
  const maxLength = 5000;

  const placeholderText = `Paste your logs here...

Example:
System.NullReferenceException: Object reference not set to an instance of an object.
   at MyApp.Services.UserService.GetUserById(Int32 id) in C:\\Projects\\MyApp\\Services\\UserService.cs:line 25
   at MyApp.Controllers.UserController.GetUser(Int32 id) in C:\\Projects\\MyApp\\Controllers\\UserController.cs:line 18`;

  const isRateLimited = cooldownSeconds > 0;
  const isButtonDisabled = isLoading || !logInput.trim() || isRateLimited;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Title & Description */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Analyze <span className="text-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Your Logs</span>
        </h1>
        <p className="mt-1.5 sm:mt-2 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
          Paste an error message, stack trace, or log. Our AI will analyze it and provide possible causes and fixes.
        </p>
      </div>

      {/* Textarea Container */}
      <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 overflow-hidden">
        <textarea
          value={logInput}
          onChange={(e) => setLogInput(e.target.value.slice(0, maxLength))}
          placeholder={placeholderText}
          rows={6}
          className="w-full p-3 sm:p-4 font-mono text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-y min-h-[140px] sm:min-h-[180px]"
        />
        <div className="flex justify-end px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-50/50 border-t border-slate-100">
          <span className="text-[11px] sm:text-xs font-medium text-slate-400">
            {logInput.length}/{maxLength}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
        <button
          onClick={onAnalyze}
          disabled={isButtonDisabled}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-xs sm:text-sm text-white shadow-sm transition-all cursor-pointer w-full sm:w-auto ${
            isButtonDisabled
              ? 'bg-indigo-400 opacity-60 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isRateLimited ? (
            <Clock className="w-4 h-4 text-amber-200 animate-pulse" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>
            {isLoading
              ? 'Analyzing...'
              : isRateLimited
              ? `Rate Limited (${cooldownSeconds}s)`
              : 'Analyze Logs'}
          </span>
        </button>

        <button
          onClick={onClear}
          disabled={isLoading || !logInput}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white font-medium text-xs sm:text-sm text-slate-700 shadow-sm hover:bg-slate-50 transition-all cursor-pointer w-full sm:w-auto ${
            isLoading || !logInput ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Trash2 className="w-4 h-4 text-slate-500" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};

export default LogInput;
