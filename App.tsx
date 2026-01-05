import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { parseUsageCSV } from './utils/parser';
import { UsageRecord } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<UsageRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDataLoaded = (content: string) => {
    try {
      const records = parseUsageCSV(content);
      if (records.length === 0) {
        setError("No valid records found. Please check your CSV format.");
        return;
      }
      setData(records);
      setError(null);
    } catch (e) {
      setError("Failed to parse CSV file.");
      console.error(e);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  if (!data) {
    return (
      <div className="bg-slate-900 min-h-screen">
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500 text-red-200 px-4 py-2 rounded-lg shadow-xl z-50 flex items-center gap-2">
             <span>⚠️ {error}</span>
             <button onClick={() => setError(null)} className="ml-2 hover:text-white">&times;</button>
          </div>
        )}
        <FileUpload onDataLoaded={handleDataLoaded} />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200">
      <Dashboard data={data} onReset={handleReset} />
    </div>
  );
};

export default App;
