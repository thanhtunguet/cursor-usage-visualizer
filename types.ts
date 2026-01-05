export interface RawCsvRecord {
  Date: string;
  Kind: string;
  Model: string;
  "Max Mode": string;
  "Input (w/ Cache Write)": string;
  "Input (w/o Cache Write)": string;
  "Cache Read": string;
  "Output Tokens": string;
  "Total Tokens": string;
  Cost: string;
}

export interface UsageRecord {
  id: string;
  date: Date;
  kind: string;
  model: string;
  maxMode: boolean;
  inputCacheWrite: number;
  inputNoCacheWrite: number;
  cacheRead: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
}

export interface DayStat {
  date: string; // YYYY-MM-DD
  totalCost: number;
  totalTokens: number;
  requestCount: number;
}

export interface ModelStat {
  name: string;
  value: number; // Cost or Tokens
  count: number;
}
