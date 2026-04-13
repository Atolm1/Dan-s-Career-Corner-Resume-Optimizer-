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
    link.setAttribute('download', 'resumelens-optimized.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

      {/* Header row */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-white/8">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
          Your Optimized Resume
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/8 hover:bg-white/12 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            {copied ? <><CheckIcon className="w-4 h-4 text-emerald-400" /> Copied!</> : <><ClipboardIcon className="w-4 h-4" /> Copy</>}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/8 hover:bg-white/12 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            <DownloadIcon className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Disclaimer banner */}
        <div className="flex items-start gap-3 bg-emerald-900/20 border border-emerald-700/40 rounded-xl px-4 py-3">
          <span className="text-emerald-400 text-sm font-bold shrink-0 mt-0.5">✓</span>
          <p className="text-emerald-300 text-sm leading-relaxed">
            <span className="font-semibold">ResumeLens never fabricates your experience.</span>{' '}
            Numbers marked{' '}
            <code className="bg-slate-800 text-cyan-400 px-1 py-0.5 rounded text-xs">[#]</code> and{' '}
            <code className="bg-slate-800 text-cyan-400 px-1 py-0.5 rounded text-xs">[X]%</code>{' '}
            are yours to complete.
          </p>
        </div>

        {/* LinkedIn reminder banner */}
        <div className="flex items-start gap-3 bg-sky-900/20 border border-sky-700/40 rounded-xl px-4 py-3">
          <span className="text-sky-400 text-sm shrink-0 mt-0.5">📎</span>
          <p className="text-sky-300 text-sm leading-relaxed">
            <span className="font-semibold">Don't forget to add your LinkedIn URL</span> — recruiters
            check it before calling. Replace{' '}
            <code className="bg-slate-800 text-cyan-400 px-1 py-0.5 rounded text-xs">
              linkedin.com/in/[your-linkedin-handle]
            </code>{' '}
            with your actual profile link.
          </p>
        </div>

        {/* Key Optimizations */}
        <div>
          <h3 className="text-base font-semibold text-cyan-400 mb-3">Key Optimizations Made</h3>
          <ul className="space-y-2">
            {topChanges.map((change, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="text-teal-400 font-bold shrink-0 mt-0.5">✓</span>
                <span className="text-slate-300 text-sm leading-relaxed">{change}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resume text */}
        <div className="bg-slate-900/60 border border-white/8 rounded-xl p-5 whitespace-pre-wrap text-slate-300 text-sm leading-relaxed font-mono">
          {revisedResume}
        </div>
      </div>
    </div>
  );
};

export default RevisedResume;
