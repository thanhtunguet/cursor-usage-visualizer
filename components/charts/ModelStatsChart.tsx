import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { UsageRecord } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/parser';

interface ModelStatsChartProps {
  data: UsageRecord[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

export const ModelStatsChart: React.FC<ModelStatsChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const map = new Map<string, { model: string; cost: number; tokens: number }>();
    
    data.forEach(record => {
      const current = map.get(record.model) || { model: record.model, cost: 0, tokens: 0 };
      current.cost += record.cost;
      current.tokens += record.totalTokens;
      map.set(record.model, current);
    });

    return Array.from(map.values())
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 8); // Top 8 models
  }, [data]);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-white mb-6">Cost by Model (Top 8)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val}`} />
            <YAxis 
              dataKey="model" 
              type="category" 
              stroke="#94a3b8" 
              fontSize={12} 
              width={150}
              tickFormatter={(val) => val.length > 20 ? val.substring(0, 20) + '...' : val}
            />
            <Tooltip 
              cursor={{ fill: '#334155', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              formatter={(val: number, name: string, props: any) => [
                <div>
                  <div>Cost: {formatCurrency(val)}</div>
                  <div className="text-xs text-slate-400">Tokens: {formatNumber(props.payload.tokens)}</div>
                </div>, 
                ''
              ]}
            />
            <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
