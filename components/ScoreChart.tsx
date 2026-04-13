import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ScoreChartProps {
  data: {
    subject: string;
    score: number;
    fullMark: number;
  }[];
}

const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
        <PolarGrid stroke="#475569" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#94a3b8', fontSize: 12 }} 
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
        <Radar name="Your Score" dataKey="score" stroke="#22d3ee" fill="#06b6d4" fillOpacity={0.6} />
        <Legend wrapperStyle={{ color: '#e2e8f0', paddingTop: '10px' }} />
        <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                borderColor: '#475569',
                color: '#e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            itemStyle={{ color: '#22d3ee' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ScoreChart;