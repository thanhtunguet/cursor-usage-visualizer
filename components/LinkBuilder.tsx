import React, { useState, useEffect } from 'react';
import { Calendar, Link as LinkIcon, Copy, ExternalLink, Check } from 'lucide-react';

export const LinkBuilder: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      // Parse dates as local time to ensure we get the full day in user's timezone
      const [sy, sm, sd] = startDate.split('-').map(Number);
      const start = new Date(sy, sm - 1, sd, 0, 0, 0, 0);

      const [ey, em, ed] = endDate.split('-').map(Number);
      const end = new Date(ey, em - 1, ed, 23, 59, 59, 999);

      if (start > end) {
        setGeneratedLink('');
        return;
      }

      // Construct URL with timestamps in milliseconds
      const url = `https://cursor.com/api/dashboard/export-usage-events-csv?startDate=${start.getTime()}&endDate=${end.getTime()}&strategy=tokens`;
      setGeneratedLink(url);
    } else {
      setGeneratedLink('');
    }
  }, [startDate, endDate]);

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 w-full bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 transition-all hover:border-slate-600/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-indigo-500/10 rounded-lg">
          <LinkIcon className="w-4 h-4 text-indigo-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Generate Custom Export Link</h3>
      </div>
      
      <p className="text-slate-400 text-xs mb-5 leading-relaxed">
        Cursor's UI limits exports to 30 days. Select a custom range below to generate a direct download link.
        <br />
        <span className="text-slate-500 italic">Note: You must be logged into cursor.com for the link to work.</span>
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Start Date</label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-600"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">End Date</label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-600"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <label className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Download Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={generatedLink}
            placeholder="Select dates to generate link..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-400 text-xs font-mono focus:outline-none truncate"
          />
          <button
            onClick={copyToClipboard}
            disabled={!generatedLink}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          {generatedLink && (
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-lg transition-colors border border-slate-600"
              title="Open Link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};