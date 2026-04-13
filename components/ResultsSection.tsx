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

  const getRingColor = (score: number) => {
    if (score >= 80) return '#10b981'; // emerald-500
    if (score >= 60) return '#eab308'; // yellow-500
    return '#ef4444';                  // red-500
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBorderColor = (score: number) => {
    if (score >= 80) return 'border-l-emerald-500';
    if (score >= 60) return 'border-l-yellow-500';
    return 'border-l-red-500';
  };

  // Glass card base classes
  const glassCard = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4';

  const SkillCard: React.FC<{ title: string; score: number; feedback: string }> = ({ title, score, feedback }) => (
    <div className={`${glassCard} border-l-4 ${getBorderColor(score)}`}>
      <h3 className="text-base font-semibold text-cyan-400">{title}</h3>
      <p className={`text-2xl font-bold my-1 ${getScoreTextColor(score)}`}>{score}/100</p>
      <p className="text-slate-300 text-sm leading-relaxed">{feedback}</p>
    </div>
  );

  const ProScoreCard: React.FC<{
    title: string;
    score: number;
    feedback: string;
    locked: boolean;
    onUnlock: () => void;
  }> = ({ title, score, feedback, locked, onUnlock }) => {
    if (locked) {
      return (
        <div className={`relative ${glassCard} border-l-4 border-l-slate-600 overflow-hidden min-h-[100px]`}>
          {/* Blurred content behind */}
          <div className="blur-sm select-none pointer-events-none">
            <h3 className="text-base font-semibold text-cyan-400">{title}</h3>
            <p className="text-2xl font-bold my-1 text-yellow-400">72/100</p>
            <p className="text-slate-400 text-sm">Detailed feedback unlocked with Pro.</p>
          </div>
          {/* Frosted gradient overlay */}
          <div
            className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1"
            style={{
              background: 'linear-gradient(to bottom, rgba(11,22,40,0.2) 0%, rgba(11,22,40,0.75) 50%, rgba(11,22,40,0.92) 100%)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <LockIcon className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-semibold text-teal-300">Pro only</span>
            <button onClick={onUnlock} className="text-xs text-cyan-400 hover:text-cyan-300 underline mt-0.5">
              Unlock
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className={`${glassCard} border-l-4 ${getBorderColor(score)}`}>
        <h3 className="text-base font-semibold text-cyan-400">{title}</h3>
        <p className={`text-2xl font-bold my-1 ${getScoreTextColor(score)}`}>{score}/100</p>
        <p className="text-slate-300 text-sm leading-relaxed">{feedback}</p>
      </div>
    );
  };

  const visibleRecs = tier === 'free' ? recommendations.slice(0, 3) : recommendations;

  return (
    <div className="space-y-8">
      {/* Results header */}
      <div className={`${glassCard.replace('p-4', 'p-8')}`}>
        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
          Analysis Results
        </h2>

        {/* Animated Score Ring */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="score-ring w-48 h-48 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
            style={{
              '--target-pct': `${overallScore}%`,
              '--ring-color': getRingColor(overallScore),
            } as React.CSSProperties}
          >
            <div className="score-ring-inner w-[10.5rem] h-[10.5rem]">
              <span className={`text-5xl font-black tracking-tighter ${getScoreTextColor(overallScore)}`}>
                {overallScore}<span className="text-2xl align-top opacity-60">%</span>
              </span>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Match</p>
            </div>
          </div>
          <p className="mt-5 text-slate-400 text-sm max-w-md text-center leading-relaxed">
            Weighted score: Hard Skills 25% · Tech 20% · Metrics 20% · Soft Skills 15% · Summary 10% · Target Role 5% · AI Literacy 3% · Formatting 2%
          </p>
        </div>

        {/* Radar Chart + Core Skill Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex items-center justify-center p-4 bg-white/3 rounded-xl border border-white/5">
            <ScoreChart data={scoreData} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            <SkillCard title="Hard Skills" score={hardSkills.score} feedback={hardSkills.feedback} />
            <SkillCard title="Soft Skills" score={softSkills.score} feedback={softSkills.feedback} />
            <SkillCard title="Technical Skills" score={techSkills.score} feedback={techSkills.feedback} />
          </div>
        </div>
      </div>

      {/* Metrics Density Callout */}
      <div className={`${metricsPassFail ? 'metrics-pass-glow border-emerald-700/50' : 'border-red-700/50'} bg-white/5 backdrop-blur-sm border rounded-xl p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-cyan-400">Metrics Density</h3>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${metricsPassFail ? 'bg-emerald-800/60 text-emerald-200' : 'bg-red-800/60 text-red-200 animate-pulse'}`}>
                {metricsPassFail ? '✓ PASS' : '✗ FAIL'}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{metricsScore.feedback}</p>
          </div>
          <div className="flex flex-col items-center shrink-0 min-w-[110px] bg-white/5 rounded-xl p-4 border border-white/10">
            <span className={`text-5xl font-black ${metricsPassFail ? 'text-emerald-400' : 'text-red-400'}`}>
              {metricsPercentage}%
            </span>
            <span className="text-slate-500 text-xs mt-1">{bulletCount} bullets</span>
            <span className={`text-xs font-semibold mt-1 ${metricsPassFail ? 'text-emerald-500' : 'text-slate-500'}`}>
              Target: 50%+
            </span>
          </div>
        </div>
      </div>

      {/* 2026 Standards */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-cyan-400">2026 Standards</h3>
          <span className="text-xs bg-cyan-900/50 border border-cyan-700/40 text-cyan-300 px-2.5 py-0.5 rounded-full font-semibold">
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
          <ProScoreCard title="Professional Summary" score={summaryScore.score} feedback={summaryScore.feedback} locked={tier === 'free'} onUnlock={onUnlockPro} />
          <ProScoreCard title="Target Role Clarity" score={targetRoleScore.score} feedback={targetRoleScore.feedback} locked={tier === 'free'} onUnlock={onUnlockPro} />
          <ProScoreCard title="AI Literacy (2026)" score={aiLiteracyScore.score} feedback={aiLiteracyScore.feedback} locked={tier === 'free'} onUnlock={onUnlockPro} />
          <ProScoreCard title="ATS Formatting" score={formattingScore.score} feedback={formattingScore.feedback} locked={tier === 'free'} onUnlock={onUnlockPro} />
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-cyan-400">Recommendations</h3>
          {tier === 'free' && recommendations.length > 3 && (
            <span className="text-xs text-slate-500 ml-auto">
              Showing 3 of {recommendations.length} —{' '}
              <button onClick={onUnlockPro} className="text-teal-400 hover:text-teal-300 underline">
                Unlock all
              </button>
            </span>
          )}
        </div>
        <ul className="space-y-3">
          {visibleRecs.map((rec, index) => (
            <li key={index} className="flex gap-3 bg-white/3 border border-white/8 p-4 rounded-lg border-l-4 border-l-cyan-600">
              <span className="text-slate-300 text-sm leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
        {tier === 'free' && recommendations.length > 3 && (
          <div className="flex items-center gap-3 p-4 bg-white/3 rounded-lg border border-dashed border-white/10">
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
      <div className="text-center pb-4">
        {tier === 'free' ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onUnlockPro}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/5 border border-dashed border-teal-600/60 text-slate-400 font-bold rounded-xl hover:border-teal-400 hover:text-teal-300 transition-colors"
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
            className="btn-shimmer inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-teal-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow duration-200"
          >
            {isRevising ? (
              <>
                <LoadingSpinner className="w-5 h-5" />
                Revising...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
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
