import React from 'react';
import { Tooltip } from 'antd';
import { Bug, FileText, BarChart3, Target, Info, CheckCircle2 } from 'lucide-react';
import type { AnalysisResponse } from '../types/debugging';

interface ResultSummaryProps {
  result: AnalysisResponse;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  const getConfidenceLevel = (score: number) => {
    const val = score > 1 ? score / 100 : score;
    if (val >= 0.8) return 'High';
    if (val >= 0.5) return 'Medium';
    return 'Low';
  };

  const isIssue = result.isDebuggingIssue;
  const confidenceScore = result.confidence > 1 ? result.confidence : result.confidence * 100;
  const confidencePercent = Math.round(confidenceScore);
  const confidenceLevel = getConfidenceLevel(result.confidence);
  
  const confidenceText = isIssue
    ? `${confidencePercent}% (${confidenceLevel})`
    : confidencePercent > 0
    ? `${confidencePercent}% (Non-Issue)`
    : 'N/A';

  const displayErrorType = isIssue
    ? (result.errorType || 'Unknown Error')
    : (result.errorType && result.errorType.toLowerCase() !== 'unknown error' ? result.errorType : 'N/A (Not an Error)');

  const displayRootCause = isIssue
    ? (result.rootCause || 'No root cause identified')
    : (result.rootCause || 'The input does not contain a software error or stack trace.');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
      {/* 1. Is Debugging Issue */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-sm flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${isIssue ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
          {isIssue ? <Bug className="w-4 h-4 sm:w-5 sm:h-5" /> : <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">Is Debugging Issue?</p>
          <p className={`text-sm sm:text-base font-bold ${isIssue ? 'text-emerald-600' : 'text-slate-600'}`}>
            {isIssue ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      {/* 2. Error Type */}
      <Tooltip 
        title={
          <div className="p-1 space-y-1 max-w-xs">
            <div className="font-bold text-xs text-indigo-300 uppercase tracking-wide">Error Type Classification</div>
            <div className="text-xs sm:text-sm font-medium text-white break-words">{displayErrorType}</div>
          </div>
        } 
        placement="top"
        color="#1e293b"
      >
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-sm flex items-center gap-3 cursor-help transition-all hover:border-indigo-300 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-xs font-medium text-slate-500">Error Type</p>
              <Info className="w-3 h-3 text-slate-400 shrink-0" />
            </div>
            <p className={`text-sm sm:text-base font-bold truncate break-words ${isIssue ? 'text-indigo-600' : 'text-slate-600'}`}>
              {displayErrorType}
            </p>
          </div>
        </div>
      </Tooltip>

      {/* 3. Confidence */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-sm flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">Confidence</p>
          <p className="text-sm sm:text-base font-bold text-emerald-600">
            {confidenceText}
          </p>
        </div>
      </div>

      {/* 4. Root Cause */}
      <Tooltip 
        title={
          <div className="p-1 space-y-1 max-w-xs">
            <div className="font-bold text-xs text-purple-300 uppercase tracking-wide">Identified Root Cause</div>
            <div className="text-xs sm:text-sm text-white leading-relaxed break-words">{displayRootCause}</div>
          </div>
        } 
        placement="top"
        color="#1e293b"
      >
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-sm flex items-center gap-3 cursor-help transition-all hover:border-purple-300 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-xs font-medium text-slate-500">Root Cause</p>
              <Info className="w-3 h-3 text-slate-400 shrink-0" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 leading-tight break-words">
              {displayRootCause}
            </p>
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

export default ResultSummary;
