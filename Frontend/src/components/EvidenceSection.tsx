import React from 'react';
import { Search } from 'lucide-react';

interface EvidenceSectionProps {
  evidence: string[];
}

export const EvidenceSection: React.FC<EvidenceSectionProps> = ({ evidence }) => {
  return (
    <div className="space-y-3 min-w-0">
      <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm sm:text-base">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span>Evidence from Input</span>
      </div>

      <ul className="space-y-2 pl-1 sm:pl-2 min-w-0">
        {evidence && evidence.length > 0 ? (
          evidence.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
              <span className="font-mono text-xs sm:text-sm text-slate-800 break-words [overflow-wrap:anywhere] min-w-0 flex-1">
                {item}
              </span>
            </li>
          ))
        ) : (
          <li className="text-xs text-slate-400 italic">No explicit evidence found.</li>
        )}
      </ul>
    </div>
  );
};

export default EvidenceSection;
