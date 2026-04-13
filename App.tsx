import React, { useState, useCallback } from 'react';
import type { AnalysisResult, RevisionResult } from './types';
import { analyzeResumeAndJD, getRevisedResume } from './services/claudeService';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import RevisedResume from './components/RevisedResume';
import { SparklesIcon } from './components/icons/SparklesIcon';

type Tier = 'free' | 'pro';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [revisionData, setRevisionData] = useState<RevisionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRevising, setIsRevising] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier>('free');

  const handleAnalyze = useCallback(async () => {
    if (!resumeText || !jobDescriptionText) {
      setError('Please paste both your resume and the job description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setRevisionData(null);

    try {
      const result = await analyzeResumeAndJD(resumeText, jobDescriptionText);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeText, jobDescriptionText]);

  const handleRevise = useCallback(async () => {
    if (tier === 'free') return;
    if (!resumeText || !jobDescriptionText) {
      setError('Cannot revise without a resume and job description.');
      return;
    }
    setIsRevising(true);
    setError(null);

    try {
      const result = await getRevisedResume(resumeText, jobDescriptionText);
      setRevisionData(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred while revising the resume. Please try again.');
    } finally {
      setIsRevising(false);
    }
  }, [resumeText, jobDescriptionText, tier]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SparklesIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
              ATS Resume Optimizer
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 bg-cyan-900/30 border border-cyan-700/50 rounded-full px-4 py-1 mb-3">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Think Like a Recruiter</span>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            2026 ATS standards. Human judgment encoded into AI. Built by Dan Lopez with 18 years of workforce development experience.
          </p>
        </header>

        {/* Pro Upgrade Banner */}
        {tier === 'free' && (
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-teal-900/60 to-cyan-900/60 border border-teal-600/50 rounded-xl px-5 py-4">
            <div>
              <p className="font-semibold text-teal-300 text-sm">You're on the Free tier</p>
              <p className="text-slate-400 text-sm mt-0.5">
                Unlock all 2026 scores, full recommendations, and the AI resume rewriter.
              </p>
            </div>
            <button
              onClick={() => setTier('pro')}
              className="shrink-0 px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold rounded-lg text-sm shadow-lg transition-all"
            >
              Unlock Pro — Free Preview
            </button>
          </div>
        )}

        {tier === 'pro' && (
          <div className="mb-8 flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-600/50 rounded-xl px-5 py-3">
            <p className="text-emerald-300 text-sm font-semibold">Pro tier active — all features unlocked</p>
            <button
              onClick={() => setTier('free')}
              className="text-slate-500 hover:text-slate-400 text-xs underline"
            >
              Switch to Free
            </button>
          </div>
        )}

        <InputSection
          resume={resumeText}
          setResume={setResumeText}
          jobDescription={jobDescriptionText}
          setJobDescription={setJobDescriptionText}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {analysisResult && (
          <ResultsSection
            result={analysisResult}
            onRevise={handleRevise}
            isRevising={isRevising}
            tier={tier}
            onUnlockPro={() => setTier('pro')}
          />
        )}

        {revisionData && (
          <RevisedResume revisionResult={revisionData} />
        )}
      </main>

      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Built by Dan Lopez | <span className="text-cyan-700">Dan's Career Corner</span></p>
      </footer>
    </div>
  );
};

export default App;
