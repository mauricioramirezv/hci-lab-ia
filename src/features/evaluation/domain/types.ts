export type Source = 'human' | 'ai';
export type FindingStatus = 'pending' | 'validated' | 'rejected';

export type Finding = {
  id: string;
  task?:string;
  heuristicId?:string;
  heuristic: string;
  severity: number;
  problem: string;
  evidence: string;
  recommendation: string;
  source: Source;
  status: FindingStatus;
  createdAt: string;
};

export type TestSession = {
  id: string;
  participant: string;
  task: string;
  success: boolean;
  seconds: number;
  errors: number;
  seq: number;
  emotion: number;
  sus: number;
  susResponses?: number[];
  notes: string;
  createdAt: string;
};
