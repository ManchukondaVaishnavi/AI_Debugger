import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface PossibleCausesProps {
  causes: string[];
}

export const PossibleCauses: React.FC<PossibleCausesProps> = ({ causes }) => {
  return (
    <div className="space-y-3 min-w-0">
      <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm sm:text-base">
        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span>Possible Causes</span>
      </div>

      <ol className="space-y-2 text-xs sm:text-sm text-slate-700 min-w-0">
        {causes && causes.length > 0 ? (
          causes.map((cause, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 min-w-0">
              <span className="font-semibold text-slate-600 shrink-0">{idx + 1}.</span>
              <span className="break-words [overflow-wrap:anywhere] min-w-0 flex-1">{cause}</span>
            </li>
          ))
        ) : (
          <li className="text-xs text-slate-400 italic">No possible causes listed.</li>
        )}
      </ol>
    </div>
  );
};

export default PossibleCauses;
