import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { UsageRecord } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/parser';

interface TimeSeriesChartProps {
  data: UsageRecord[];
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const [metric, setMetric] = useState<'cost' | 'tokens'>('cost');

  const chartData = useMemo(() => {
    const map = new Map<string, { date: string; cost: number; tokens: number }>();
    
    data.forEach(record => {
      const day = record.date.toISOString().split('T')[0];
      const current = map.get(day) || { date: day, cost: 0, tokens: 0 };
      
      current.cost += record.cost;
      current.tokens += record.totalTokens;
      
      map.set(day, current);
    });

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Usage Over Time</h3>
        <div className="flex bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => setMetric('cost')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              metric === 'cost' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cost
          </button>
          <button
            onClick={() => setMetric('tokens')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              metric === 'tokens' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tokens
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              tickFormatter={(val) => metric === 'cost' ? `$${val}` : formatNumber(val)}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
              formatter={(val: number) => [
                metric === 'cost' ? formatCurrency(val) : formatNumber(val),
                metric === 'cost' ? 'Cost' : 'Tokens'
              ]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Area 
              type="monotone" 
              dataKey={metric} 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorMetric)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
