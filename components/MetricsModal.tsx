import React, { useState } from 'react';
import type { MetricsData } from '../types';

interface MetricsModalProps {
  onSubmit: (metrics: MetricsData) => void;
  onSkip: () => void;
}

const EMPTY: MetricsData = {
  peopleServed: '',
  processImprovement: '',
  workVolume: '',
  teamSize: '',
  accuracyScores: '',
  budgetImpact: '',
};

const fields: {
  key: keyof MetricsData;
  label: string;
  placeholder: string;
}[] = [
  {
    key: 'peopleServed',
    label: 'People, clients, or customers served',
    placeholder: 'e.g. 50+ clients daily, 200 students per semester',
  },
  {
    key: 'processImprovement',
    label: 'Process improvements',
    placeholder: 'e.g. reduced errors by 30%, cut processing time in half',
  },
  {
    key: 'workVolume',
    label: 'Volume of work',
    placeholder: 'e.g. processed 200+ documents monthly, handled 80 calls/day',
  },
  {
    key: 'teamSize',
    label: 'Team size supported or managed',
    placeholder: 'e.g. supported team of 12, supervised 3 staff',
  },
  {
    key: 'accuracyScores',
    label: 'Accuracy rates or satisfaction scores',
    placeholder: 'e.g. 98% accuracy rate, 95% client satisfaction',
  },
  {
    key: 'budgetImpact',
    label: 'Budget, cost savings, or revenue impact',
    placeholder: 'e.g. reduced supply costs by $2K, managed $50K budget',
  },
];

const MetricsModal: React.FC<MetricsModalProps> = ({ onSubmit, onSkip }) => {
  const [metrics, setMetrics] = useState<MetricsData>(EMPTY);

  const set = (key: keyof MetricsData, value: string) =>
    setMetrics((prev) => ({ ...prev, [key]: value }));

  const hasAny = Object.values(metrics).some((v) => (v as string).trim() !== '');

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(5, 12, 24, 0.85)', backdropFilter: 'blur(6px)' }}>

      {/* Modal card */}
      <div className="w-full max-w-2xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-5 border-b border-white/8">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400 mb-2">
            Great resumes use real numbers. Tell us yours.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            We'll use <span className="text-slate-300 font-medium">only your actual metrics</span> — never made-up ones.
            Leave anything blank and we'll add a{' '}
            <code className="text-cyan-500 bg-slate-800 px-1.5 py-0.5 rounded text-xs">[placeholder]</code>{' '}
            so you know exactly where to fill it in.
          </p>
        </div>

        {/* Fields */}
        <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {label}
              </label>
              <input
                type="text"
                value={metrics[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-8 py-5 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onSkip}
            className="text-slate-500 hover:text-slate-300 text-sm underline underline-offset-2 transition-colors order-2 sm:order-1"
          >
            Skip — I'll add numbers later
          </button>
          <button
            onClick={() => onSubmit(metrics)}
            className="btn-shimmer order-1 sm:order-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 transition-shadow"
          >
            {hasAny ? 'Build My Resume With Real Numbers' : 'Build My Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricsModal;
