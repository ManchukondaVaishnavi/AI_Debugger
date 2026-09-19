import React from 'react';
import { CheckCircle2, Clock, HelpCircle, Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import type { AnalysisResponse } from '../types/debugging';
import ResultSummary from './ResultSummary';
import EvidenceSection from './EvidenceSection';
import PossibleCauses from './PossibleCauses';
import RecommendedFixes from './RecommendedFixes';

interface AnalysisResultProps {
  result: AnalysisResponse;
  onLoadSample?: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onLoadSample }) => {
  const isIssue = result.isDebuggingIssue;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 min-w-0 max-w-full overflow-hidden">
      {/* Banner */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border min-w-0 ${
        isIssue 
          ? 'bg-emerald-50/80 border-emerald-200/70' 
          : 'bg-slate-100/80 border-slate-200/80'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
            isIssue ? 'bg-emerald-500' : 'bg-slate-600'
          }`}>
            {isIssue ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {isIssue ? 'Analysis Complete' : 'No Debugging Issue Detected'}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-tight sm:leading-normal mt-0.5 break-words">
              {isIssue 
                ? "Here's what I found based on the provided logs." 
                : 'The submitted text does not appear to contain a valid stack trace or error log.'}
            </p>
          </div>
        </div>

        {result.timestamp && (
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-medium shrink-0 pt-1 sm:pt-0">
            <Clock className="w-3.5 h-3.5" />
            <span>Analyzed on {result.timestamp}</span>
          </div>
        )}
      </div>

      {/* 4 Summary Cards */}
      <ResultSummary result={result} />

      {/* Details Grid or Non-Error Guidance Section */}
      {isIssue ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-1 sm:pt-2 min-w-0">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/60 border border-slate-200/60 space-y-5 sm:space-y-6 min-w-0 max-w-full overflow-hidden">
            <EvidenceSection evidence={result.evidence} />
            <hr className="border-slate-200/80" />
            <PossibleCauses causes={result.possibleCauses} />
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/60 border border-slate-200/60 min-w-0 max-w-full overflow-hidden">
            <RecommendedFixes fixes={result.possibleFixes} />
          </div>
        </div>
      ) : (
        /* Friendly Guidance Box when non-error text is submitted */
        <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100 space-y-4">
          <div className="flex items-center gap-2.5 text-indigo-700 font-bold text-sm sm:text-base">
            <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>How to Get the Best Results with AI Debugger</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            AI Debugger works best when you paste code stack traces, exception messages, compiler outputs, or runtime error logs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-indigo-600 block">1. Stack Traces</span>
              <span className="text-slate-500 block text-[11px]">Copy the full stack trace including exception names and line numbers.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-indigo-600 block">2. Server & API Logs</span>
              <span className="text-slate-500 block text-[11px]">Paste HTTP 500, DB connection failures, or ASP.NET/Node error logs.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-indigo-600 block">3. Compiler Output</span>
              <span className="text-slate-500 block text-[11px]">Paste build failures from `dotnet build`, `npm run build`, or TypeScript errors.</span>
            </div>
          </div>

          {onLoadSample && (
            <div className="pt-2 flex justify-start">
              <button
                onClick={onLoadSample}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Stack Trace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
