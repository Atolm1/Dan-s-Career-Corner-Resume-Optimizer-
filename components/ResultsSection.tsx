import React from 'react';
import type { AnalysisResult } from '../types';
import ScoreChart from './ScoreChart';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { LockIcon } from './icons/LockIcon';

interface ResultsSectionProps {
  result: AnalysisResult;
  onRevise: () => void;
  isRevising: boolean;
  tier: 'free' | 'pro';
  onUnlockPro: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result, onRevise, isRevising, tier, onUnlockPro }) => {
  const {
    overallScore,
    hardSkills,
    softSkills,
    techSkills,
    metricsScore,
    summaryScore,
    targetRoleScore,
    aiLiteracyScore,
    formattingScore,
    metricsPercentage,
    bulletCount,
    metricsPassFail,
    recommendations,
  } = result;

  const scoreData = [
    { subject: 'Hard Skills', score: hardSkills.score, fullMark: 100 },
    { subject: 'Tech Skills', score: techSkills.score, fullMark: 100 },
    { subject: 'Soft Skills', score: softSkills.score, fullMark: 100 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return 'border-emerald-500 shadow-emerald-500/20';
    if (score >= 60) return 'border-yellow-500 shadow-yellow-500/20';
    return 'border-red-500 shadow-red-500/20';
  };

  const SkillCard: React.FC<{ title: string; score: number; feedback: string }> = ({ title, score, feedback }) => {
    const scoreColor = score > 75 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-red-400';
    return (
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-cyan-400">{title}</h3>
        <p className={`text-2xl font-bold my-1 ${scoreColor}`}>{score}/100</p>
        <p className="text-slate-400 text-sm">{feedback}</p>
      </div>
    );
  };

  const ProScoreCard: React.FC<{ title: string; score: number; feedback: string; locked: boolean; onUnlock: () => void }> = ({
    title, score, feedback, locked, onUnlock,
  }) => {
    const scoreColor = score > 75 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-red-400';
    if (locked) {
      return (
        <div className="relative bg-slate-800/50 p-4 rounded-lg border border-slate-700 overflow-hidden">
          <div className="blur-sm select-none pointer-events-none">
            <h3 className="text-lg font-semibold text-cyan-400">{title}</h3>
            <p className="text-2xl font-bold my-1 text-yellow-400">72/100</p>
            <p className="text-slate-400 text-sm">Upgrade to see detailed feedback for this category.</p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-[1px] rounded-lg">
            <LockIcon className="w-6 h-6 text-teal-400 mb-1" />
            <p className="text-xs font-semibold text-teal-300">Pro only</p>
            <button onClick={onUnlock} className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 underline">
              Unlock
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-cyan-400">{title}</h3>
        <p className={`text-2xl font-bold my-1 ${scoreColor}`}>{score}/100</p>
        <p className="text-slate-400 text-sm">{feedback}</p>
      </div>
    );
  };

  const visibleRecs = tier === 'free' ? recommendations.slice(0, 3) : recommendations;

  return (
    <div className="mt-10 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
        Analysis Results
      </h2>

      {/* Overall Score */}
      <div className="flex flex-col items-center justify-center mb-10">
        <div className={`relative flex items-center justify-center w-40 h-40 rounded-full border-[6px] ${getScoreRingColor(overallScore)} bg-slate-900 shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-500`}>
          <div className="text-center">
            <span className={`text-5xl font-black tracking-tighter ${getScoreColor(overallScore)} drop-shadow-lg`}>
              {overallScore}
              <span className="text-2xl align-top opacity-70">%</span>
            </span>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Match</p>
          </div>
        </div>
        <p className="mt-4 text-slate-400 text-sm max-w-md text-center">
          Weighted ATS score: Hard Skills 25% · Tech 20% · Metrics 20% · Soft Skills 15% · Summary 10% · Target Role 5% · AI Literacy 3% · Formatting 2%
        </p>
      </div>

      {/* Core Skills + Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex items-center justify-center p-4 bg-slate-900/50 rounded-lg">
          <ScoreChart data={scoreData} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-1 gap-4">
          <SkillCard title="Hard Skills" score={hardSkills.score} feedback={hardSkills.feedback} />
          <SkillCard title="Soft Skills" score={softSkills.score} feedback={softSkills.feedback} />
          <SkillCard title="Technical Skills" score={techSkills.score} feedback={techSkills.feedback} />
        </div>
      </div>

      {/* Metrics Density Callout */}
      <div className="mt-8">
        <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border ${metricsPassFail ? 'border-emerald-600/60 bg-emerald-900/20' : 'border-red-600/60 bg-red-900/20'}`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-cyan-400">Metrics Density</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${metricsPassFail ? 'bg-emerald-700 text-emerald-200' : 'bg-red-700 text-red-200'}`}>
                {metricsPassFail ? '✓ PASS' : '✗ FAIL'}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{metricsScore.feedback}</p>
          </div>
          <div className="flex flex-col items-center min-w-[100px]">
            <span className={`text-4xl font-black ${metricsPassFail ? 'text-emerald-400' : 'text-red-400'}`}>
              {metricsPercentage}%
            </span>
            <span className="text-slate-500 text-xs mt-1">{bulletCount} bullets counted</span>
            <span className="text-slate-500 text-xs">Target: 50%+</span>
          </div>
        </div>
      </div>

      {/* 2026 Standards Section */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-2xl font-semibold text-cyan-400">2026 Standards</h3>
          <span className="text-xs bg-cyan-900/50 border border-cyan-700/50 text-cyan-300 px-2 py-0.5 rounded-full font-semibold">
            NEW
          </span>
          {tier === 'free' && (
            <span className="text-xs text-slate-500 ml-auto">
              3 of 4 locked —{' '}
              <button onClick={onUnlockPro} className="text-teal-400 hover:text-teal-300 underline">
                Unlock Pro
              </button>
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProScoreCard
            title="Professional Summary"
            score={summaryScore.score}
            feedback={summaryScore.feedback}
            locked={tier === 'free'}
            onUnlock={onUnlockPro}
          />
          <ProScoreCard
            title="Target Role Clarity"
            score={targetRoleScore.score}
            feedback={targetRoleScore.feedback}
            locked={tier === 'free'}
            onUnlock={onUnlockPro}
          />
          <ProScoreCard
            title="AI Literacy (2026)"
            score={aiLiteracyScore.score}
            feedback={aiLiteracyScore.feedback}
            locked={tier === 'free'}
            onUnlock={onUnlockPro}
          />
          <ProScoreCard
            title="ATS Formatting"
            score={formattingScore.score}
            feedback={formattingScore.feedback}
            locked={tier === 'free'}
            onUnlock={onUnlockPro}
          />
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-2xl font-semibold text-cyan-400">Recommendations</h3>
          {tier === 'free' && recommendations.length > 3 && (
            <span className="text-xs text-slate-500 ml-auto">
              Showing 3 of {recommendations.length} —{' '}
              <button onClick={onUnlockPro} className="text-teal-400 hover:text-teal-300 underline">
                Unlock all
              </button>
            </span>
          )}
        </div>
        <ul className="space-y-3 list-disc list-inside text-slate-300">
          {visibleRecs.map((rec, index) => (
            <li key={index} className="bg-slate-800/50 p-3 rounded-md border-l-4 border-cyan-500">
              {rec}
            </li>
          ))}
        </ul>
        {tier === 'free' && recommendations.length > 3 && (
          <div className="mt-3 flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg border border-dashed border-slate-700">
            <LockIcon className="w-4 h-4 text-teal-400 shrink-0" />
            <p className="text-slate-500 text-sm">
              {recommendations.length - 3} more recommendations hidden.{' '}
              <button onClick={onUnlockPro} className="text-teal-400 hover:text-teal-300 underline">
                Unlock Pro
              </button>{' '}
              to see all.
            </p>
          </div>
        )}
      </div>

      {/* Generate Revised Resume Button */}
      <div className="mt-8 text-center">
        {tier === 'free' ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onUnlockPro}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-700 border border-dashed border-teal-600 text-slate-400 font-bold rounded-lg cursor-pointer hover:border-teal-400 hover:text-teal-300 transition-colors"
            >
              <LockIcon className="w-5 h-5 text-teal-500" />
              Generate Revised Resume
            </button>
            <p className="text-slate-500 text-xs">Pro feature — click to unlock</p>
          </div>
        ) : (
          <button
            onClick={onRevise}
            disabled={isRevising}
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isRevising ? (
              <>
                <LoadingSpinner className="mr-2" />
                Revising...
              </>
            ) : (
              <>
                <SparklesIcon className="mr-2" />
                Generate Revised Resume
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsSection;
