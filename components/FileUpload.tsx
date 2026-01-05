import React, { useCallback } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { LinkBuilder } from './LinkBuilder';

interface FileUploadProps {
  onDataLoaded: (content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onDataLoaded(content);
      }
    };
    reader.readAsText(file);
  }, [onDataLoaded]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 mb-6 shadow-lg shadow-indigo-900/20">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Cursor Usage Visualizer
          </h1>
          <p className="text-slate-400 text-lg">
            Upload your usage.csv file to unlock insights about your coding patterns, costs, and model utilization.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-dashed border-slate-600 rounded-2xl p-10 text-center hover:bg-slate-800/80 hover:border-blue-500 transition-all group">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
          >
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Select CSV File
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Click to browse your device. Only .csv files exported from Cursor are supported.
            </p>
          </label>
        </div>

        {/* Export Link Builder Section */}
        <LinkBuilder />
        
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Your data stays in your browser. No data is uploaded to any server.</p>
        </div>
      </div>
    </div>
  );
};