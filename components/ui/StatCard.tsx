import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-slate-700/50 rounded-lg text-slate-300">
        {icon}
      </div>
    </div>
  );
};
