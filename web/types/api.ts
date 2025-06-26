export interface RandomResponse {
  random: number;
  timestamp: string;
  range?: {
    min: number;
    max: number;
  };
} 