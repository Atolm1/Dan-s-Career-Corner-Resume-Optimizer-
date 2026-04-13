export interface SkillScore {
  score: number;
  feedback: string;
}

export interface AnalysisResult {
  overallScore: number;
  hardSkills: SkillScore;
  softSkills: SkillScore;
  techSkills: SkillScore;
  metricsScore: SkillScore;
  summaryScore: SkillScore;
  targetRoleScore: SkillScore;
  aiLiteracyScore: SkillScore;
  formattingScore: SkillScore;
  metricsPercentage: number;
  bulletCount: number;
  metricsPassFail: boolean;
  recommendations: string[];
}

export interface RevisionResult {
  topChanges: string[];
  revisedResume: string;
}

export interface MetricsData {
  peopleServed: string;
  processImprovement: string;
  workVolume: string;
  teamSize: string;
  accuracyScores: string;
  budgetImpact: string;
}
