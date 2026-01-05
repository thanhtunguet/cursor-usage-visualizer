import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { UsageRecord } from '../../types';
import { formatNumber } from '../../utils/parser';

interface TokenBreakdownChartProps {
  data: UsageRecord[];
}

export const TokenBreakdownChart: React.FC<TokenBreakdownChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    // Group by week or roughly 20 data points to avoid overcrowding
    const sorted = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
    if (sorted.length === 0) return [];

    const map = new Map<string, { 
      date: string; 
      input: number; 
      cache: number; 
      output: number; 
    }>();

    sorted.forEach(record => {
      const day = record.date.toISOString().split('T')[0];
      const current = map.get(day) || { date: day, input: 0, cache: 0, output: 0 };
      
      current.input += record.inputNoCacheWrite + record.inputCacheWrite; // Combining basic inputs
      current.cache += record.cacheRead;
      current.output += record.outputTokens;
      
      map.set(day, current);
    });

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-white mb-6">Daily Token Breakdown</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={12}
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => formatNumber(val)} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              formatter={(val: number) => formatNumber(val)}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="input" name="Input" stackId="a" fill="#3b82f6" />
            <Bar dataKey="cache" name="Cache Read" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="output" name="Output" stackId="a" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
