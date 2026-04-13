
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
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-slate-300 mb-2">
            Your Resume
          </label>
          <textarea
            id="resume"
            rows={15}
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
            placeholder="Paste your full resume here..."
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="job-description" className="block text-sm font-medium text-slate-300 mb-2">
            Job Description
          </label>
          <textarea
            id="job-description"
            rows={15}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
            placeholder="Paste the job description here..."
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="mr-2" />
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
