import React, { useMemo } from 'react';
import { UsageRecord } from '../types';
import { formatCurrency, formatNumber } from '../utils/parser';
import { StatCard } from './ui/StatCard';
import { TimeSeriesChart } from './charts/TimeSeriesChart';
import { ModelStatsChart } from './charts/ModelStatsChart';
import { TokenBreakdownChart } from './charts/TokenBreakdownChart';
import { CalendarHeatmap } from './charts/CalendarHeatmap';
import { 
  DollarSign, 
  Cpu, 
  Layers, 
  Activity 
} from 'lucide-react';

interface DashboardProps {
  data: UsageRecord[];
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  
  const stats = useMemo(() => {
    const totalCost = data.reduce((acc, curr) => acc + curr.cost, 0);
    const totalTokens = data.reduce((acc, curr) => acc + curr.totalTokens, 0);
    const totalRequests = data.length;
    const modelCount = new Set(data.map(r => r.model)).size;

    return {
      cost: totalCost,
      tokens: totalTokens,
      requests: totalRequests,
      models: modelCount
    };
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Usage Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Analyzing {stats.requests} records from {data[0]?.date.toLocaleDateString()} to {data[data.length-1]?.date.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
        >
          Upload New File
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Cost" 
          value={formatCurrency(stats.cost)} 
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />} 
        />
        <StatCard 
          title="Total Tokens" 
          value={formatNumber(stats.tokens)} 
          icon={<Layers className="w-5 h-5 text-blue-400" />} 
        />
        <StatCard 
          title="Total Requests" 
          value={stats.requests.toLocaleString()} 
          icon={<Activity className="w-5 h-5 text-purple-400" />} 
        />
        <StatCard 
          title="Unique Models" 
          value={stats.models.toString()} 
          icon={<Cpu className="w-5 h-5 text-orange-400" />} 
        />
      </div>

      {/* Main Charts Area */}
      <div className="space-y-6">
        {/* Row 1: Time Series & Models */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TimeSeriesChart data={data} />
          </div>
          <div className="lg:col-span-1">
            <ModelStatsChart data={data} />
          </div>
        </div>

        {/* Row 2: Heatmap */}
        <div>
           <CalendarHeatmap data={data} />
        </div>

        {/* Row 3: Breakdown */}
        <div>
          <TokenBreakdownChart data={data} />
        </div>
      </div>
    </div>
  );
};
