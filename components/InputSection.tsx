import React from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface InputSectionProps {
  resume: string;
  setResume: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  resume,
  setResume,
  jobDescription,
  setJobDescription,
  onAnalyze,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="resume" className="text-sm font-semibold text-slate-300 tracking-wide">
            Your Resume
          </label>
          <textarea
            id="resume"
            rows={18}
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-slate-300 placeholder-slate-500 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/8 focus:shadow-[0_0_20px_rgba(34,211,238,0.08)]"
            placeholder="Paste your full resume here..."
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="job-description" className="text-sm font-semibold text-slate-300 tracking-wide">
            Job Description
          </label>
          <textarea
            id="job-description"
            rows={18}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-slate-300 placeholder-slate-500 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/8 focus:shadow-[0_0_20px_rgba(34,211,238,0.08)]"
            placeholder="Paste the job description here..."
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="btn-shimmer inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-cyan-900/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-shadow duration-200"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="w-5 h-5" />
              Analyzing...
            </>
          ) : (
            'Analyze My Resume'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
