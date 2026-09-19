import React from 'react';
import { Wrench, Info } from 'lucide-react';

interface RecommendedFixesProps {
  fixes?: string[];
}

export const RecommendedFixes: React.FC<RecommendedFixesProps> = ({ fixes }) => {
  return (
    <div className="space-y-4 min-w-0">
      <div className="space-y-3 min-w-0">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm sm:text-base">
          <Wrench className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Recommended Fixes</span>
        </div>

        <ol className="space-y-2 text-xs sm:text-sm text-slate-700 min-w-0">
          {fixes && fixes.length > 0 ? (
            fixes.map((fix, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 min-w-0">
                <span className="font-semibold text-slate-600 shrink-0">{idx + 1}.</span>
                <span className="break-words [overflow-wrap:anywhere] min-w-0 flex-1">{fix}</span>
              </li>
            ))
          ) : (
            <li className="text-xs text-slate-400 italic">No recommended fixes provided.</li>
          )}
        </ol>
      </div>

      {/* Note Callout */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5 sm:gap-3 min-w-0">
        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-[11px] sm:text-xs text-blue-900 leading-relaxed min-w-0 flex-1 break-words">
          <span className="font-bold block text-blue-900 mb-0.5">Note</span>
          These are suggestions based on the provided logs. Review and apply the fixes based on your application context.
        </div>
      </div>
    </div>
  );
};

export default RecommendedFixes;
