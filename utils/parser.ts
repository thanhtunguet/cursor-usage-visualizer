import { UsageRecord } from '../types';

// Helper to parse a CSV line handling quoted strings
const parseCSVLine = (text: string): string[] => {
  const result: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }
  result.push(cell);
  return result;
};

export const parseUsageCSV = (csvContent: string): UsageRecord[] => {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  // Parse headers to find indices (robustness against column ordering)
  const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
  
  const colMap = {
    Date: headers.indexOf('Date'),
    Kind: headers.indexOf('Kind'),
    Model: headers.indexOf('Model'),
    MaxMode: headers.indexOf('Max Mode'),
    InputCacheWrite: headers.indexOf('Input (w/ Cache Write)'),
    InputNoCacheWrite: headers.indexOf('Input (w/o Cache Write)'),
    CacheRead: headers.indexOf('Cache Read'),
    OutputTokens: headers.indexOf('Output Tokens'),
    TotalTokens: headers.indexOf('Total Tokens'),
    Cost: headers.indexOf('Cost'),
  };

  const records: UsageRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map(v => v.trim().replace(/^"|"$/g, ''));
    
    // Skip empty lines or lines that don't match column count roughly
    if (values.length < headers.length) continue;

    try {
      const record: UsageRecord = {
        id: `row-${i}`,
        date: new Date(values[colMap.Date]),
        kind: values[colMap.Kind],
        model: values[colMap.Model],
        maxMode: values[colMap.MaxMode] === 'Yes',
        inputCacheWrite: parseInt(values[colMap.InputCacheWrite] || '0', 10),
        inputNoCacheWrite: parseInt(values[colMap.InputNoCacheWrite] || '0', 10),
        cacheRead: parseInt(values[colMap.CacheRead] || '0', 10),
        outputTokens: parseInt(values[colMap.OutputTokens] || '0', 10),
        totalTokens: parseInt(values[colMap.TotalTokens] || '0', 10),
        cost: parseFloat(values[colMap.Cost] || '0'),
      };
      
      if (!isNaN(record.date.getTime())) {
        records.push(record);
      }
    } catch (e) {
      console.warn(`Failed to parse row ${i}`, e);
    }
  }

  return records.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(val);
};

export const formatNumber = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short"
  }).format(val);
};
