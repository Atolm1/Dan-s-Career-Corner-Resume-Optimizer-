import React from 'react';
import type { RecruiterIntelTip } from '../types';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface RecruiterIntelProps {
  tips: RecruiterIntelTip[] | null;
  isLoading: boolean;
}

const RecruiterIntel: React.FC<RecruiterIntelProps> = ({ tips, isLoading }) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl"
         style={{ background: 'linear-gradient(135deg, rgba(13,35,45,0.95) 0%, rgba(7,25,35,0.98) 100%)', border: '1px solid rgba(20,184,166,0.25)' }}>

      {/* Header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(20,184,166,0.2)' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h2 className="text-xl font-bold text-teal-300">Recruiter Intel — Before You Apply</h2>
              <p className="text-slate-500 text-xs mt-0.5">Powered by 18 years of workforce expertise</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-900/60 border border-teal-700/50 text-teal-300">
            Pro Feature
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-10 text-slate-400">
            <LoadingSpinner className="w-5 h-5 text-teal-400" />
            <span className="text-sm">Thinking like a recruiter...</span>
          </div>
        )}

        {!isLoading && !tips && (
          <p className="text-slate-500 text-sm text-center py-6">
            Intel unavailable for this analysis.
          </p>
        )}

        {!isLoading && tips && tips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="rounded-xl p-4 flex gap-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-2xl shrink-0 leading-none mt-0.5">{tip.icon}</span>
                <div>
                  <p className="text-sm font-bold text-teal-300 mb-1">{tip.headline}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterIntel;
