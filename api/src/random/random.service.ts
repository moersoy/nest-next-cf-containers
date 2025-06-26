import { Injectable } from '@nestjs/common';

export interface RandomResponse {
  random: number;
  timestamp: string;
  range?: {
    min: number;
    max: number;
  };
}

@Injectable()
export class RandomService {
  generateRandom(): RandomResponse {
    return {
      random: Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString(),
    };
  }

  generateRandomInRange(min: number, max: number): RandomResponse {
    if (min > max) {
      [min, max] = [max, min]; // Swap if min > max
    }
    
    return {
      random: Math.floor(Math.random() * (max - min + 1)) + min,
      timestamp: new Date().toISOString(),
      range: { min, max },
    };
  }
} 