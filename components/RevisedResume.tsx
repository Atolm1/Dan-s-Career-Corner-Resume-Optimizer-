import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import type { RevisionResult } from '../types';

interface RevisedResumeProps {
  revisionResult: RevisionResult;
}

const RevisedResume: React.FC<RevisedResumeProps> = ({ revisionResult }) => {
  const { topChanges, revisedResume } = revisionResult;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(revisedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([revisedResume], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'optimized-resume.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-10 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Your Optimized Resume</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg transition-colors duration-200"
          >
            {copied ? (
              <>
                <CheckIcon className="mr-2" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardIcon className="mr-2" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg transition-colors duration-200"
          >
            <DownloadIcon className="mr-2" />
            Download
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-cyan-400 mb-3">Key Optimizations Made</h3>
        <ul className="space-y-2">
          {topChanges.map((change, index) => (
            <li key={index} className="flex items-start">
              <span className="text-cyan-400 mr-2 mt-1">&#10003;</span>
              <span className="text-slate-300">{change}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="prose prose-invert max-w-none bg-slate-900/50 p-4 rounded-lg border border-slate-700 whitespace-pre-wrap">
        {revisedResume}
      </div>
    </div>
  );
};

export default RevisedResume;