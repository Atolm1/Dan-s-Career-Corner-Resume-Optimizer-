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
    <div className="min-h-screen text-slate-200 font-sans">
      <main className="container mx-auto px-4 py-10 md:py-16 max-w-5xl">

        {/* Header */}
        <header className="text-center mb-10 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <SparklesIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
              ResumeLens
            </h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            See your resume the way recruiters and hiring software actually do.
            Built on 18 years of workforce development expertise.
          </p>
        </header>

        {/* Pro Upgrade Banner */}
        {tier === 'free' && (
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4">
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
          <div className="mb-8 flex items-center justify-between gap-4 bg-emerald-900/20 border border-emerald-700/40 rounded-xl px-5 py-3">
            <p className="text-emerald-300 text-sm font-semibold">Pro tier active — all features unlocked</p>
            <button
              onClick={() => setTier('free')}
              className="text-slate-500 hover:text-slate-400 text-xs underline"
            >
              Switch to Free
            </button>
          </div>
        )}

        <div className="space-y-8">
          <InputSection
            resume={resumeText}
            setResume={setResumeText}
            jobDescription={jobDescriptionText}
            setJobDescription={setJobDescriptionText}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />

          {error && (
            <div className="bg-red-900/40 border border-red-700/60 text-red-300 px-5 py-4 rounded-xl text-center">
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
        </div>
      </main>

      <footer className="text-center py-8 text-slate-500 text-sm border-t border-white/5">
        <p>
          Built by Dan Lopez ·{' '}
          <a
            href="https://danscareercorner.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 hover:text-cyan-400 transition-colors"
          >
            Dan's Career Corner
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
