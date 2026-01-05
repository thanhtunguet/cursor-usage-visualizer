import React, { useMemo } from 'react';
import { UsageRecord } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/parser';

interface CalendarHeatmapProps {
  data: UsageRecord[];
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ data }) => {
  const { gridData, months, maxCost } = useMemo(() => {
    if (data.length === 0) return { gridData: [], months: [], maxCost: 0 };

    // 1. Group by date
    const dayMap = new Map<string, { cost: number; count: number; date: Date }>();
    let maxC = 0;

    // Get date range
    const start = new Date(data[0].date);
    const end = new Date(data[data.length - 1].date);
    
    // Normalize to start of week (Sunday)
    const startDate = new Date(start);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Normalize to end of week (Saturday)
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // Populate Data Map
    data.forEach(r => {
      const key = r.date.toISOString().split('T')[0];
      const cur = dayMap.get(key) || { cost: 0, count: 0, date: r.date };
      cur.cost += r.cost;
      cur.count += 1;
      dayMap.set(key, cur);
      if (cur.cost > maxC) maxC = cur.cost;
    });

    // 2. Build Grid (Weeks x Days)
    const weeks = [];
    let currentWeek = [];
    let currentMonthLabel = '';
    const monthLabels = [];

    const itr = new Date(startDate);
    let weekIndex = 0;

    while (itr <= endDate) {
      const key = itr.toISOString().split('T')[0];
      const dayData = dayMap.get(key);
      
      // Month labels logic
      const mLabel = itr.toLocaleString('default', { month: 'short' });
      if (mLabel !== currentMonthLabel && itr.getDate() < 8) {
        monthLabels.push({ label: mLabel, index: weekIndex });
        currentMonthLabel = mLabel;
      }

      currentWeek.push({
        date: new Date(itr),
        value: dayData?.cost || 0,
        count: dayData?.count || 0,
        key
      });

      if (itr.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
        weekIndex++;
      }

      itr.setDate(itr.getDate() + 1);
    }

    return { gridData: weeks, months: monthLabels, maxCost: maxC };
  }, [data]);

  const getColor = (val: number) => {
    if (val === 0) return 'bg-slate-800 border-slate-700/50';
    // Simple 4-level scale
    const intensity = val / maxCost;
    if (intensity < 0.1) return 'bg-emerald-900/40 border-emerald-900';
    if (intensity < 0.4) return 'bg-emerald-700/60 border-emerald-700';
    if (intensity < 0.7) return 'bg-emerald-600 border-emerald-600';
    return 'bg-emerald-400 border-emerald-400';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm overflow-x-auto">
      <h3 className="text-lg font-semibold text-white mb-6">Daily Cost Heatmap</h3>
      
      <div className="min-w-[600px]">
        {/* Months Header */}
        <div className="flex mb-2 pl-8">
          {months.map((m, i) => (
            <div 
              key={i} 
              className="text-xs text-slate-400"
              style={{ 
                // Approximate width calculation based on week index diff
                width: i < months.length - 1 
                  ? `${(months[i+1].index - m.index) * 16}px` 
                  : 'auto' 
              }}
            >
              {m.label}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Days of Week Y-Axis */}
          <div className="flex flex-col justify-between pr-2 text-[10px] text-slate-500 h-[100px] py-1">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {gridData.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => (
                  <div
                    key={day.key}
                    className={`w-3 h-3 rounded-[2px] border ${getColor(day.value)} group relative`}
                  >
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap z-10 pointer-events-none border border-slate-700 shadow-xl">
                      <div className="font-semibold">{day.date.toLocaleDateString()}</div>
                      <div>Cost: {formatCurrency(day.value)}</div>
                      <div className="text-slate-400">{day.count} requests</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 justify-end">
          <span>Less</span>
          <div className="w-3 h-3 bg-slate-800 rounded-[2px] border border-slate-700/50"></div>
          <div className="w-3 h-3 bg-emerald-900/40 rounded-[2px] border border-emerald-900"></div>
          <div className="w-3 h-3 bg-emerald-700/60 rounded-[2px] border border-emerald-700"></div>
          <div className="w-3 h-3 bg-emerald-600 rounded-[2px] border border-emerald-600"></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-[2px] border border-emerald-400"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
