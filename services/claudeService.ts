import type { AnalysisResult, RevisionResult } from '../types';

export const analyzeResumeAndJD = async (resume: string, jobDescription: string): Promise<AnalysisResult> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobDescription }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to analyze resume');
  }

  return response.json() as Promise<AnalysisResult>;
};

export const getRevisedResume = async (resume: string, jobDescription: string): Promise<RevisionResult> => {
  const response = await fetch('/api/revise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobDescription }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to revise resume');
  }

  return response.json() as Promise<RevisionResult>;
};
