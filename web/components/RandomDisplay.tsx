import type { RandomResponse } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Sparkles, TrendingUp } from 'lucide-react';

interface RandomDisplayProps {
  data: RandomResponse;
  type: 'simple' | 'range';
}

export function RandomDisplay({ data, type }: RandomDisplayProps) {
  const isRange = type === 'range' && data.range;

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-xl gap-2">
          {isRange ? <TrendingUp /> : <Sparkles />}
          {isRange ? 'Ranged Random Result' : 'Simple Random Result'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-7xl font-bold tracking-tighter">{data.random}</p>
        {isRange && (
          <p className="text-blue-200">
            (from range {data.range?.min} - {data.range?.max})
          </p>
        )}
        <p className="text-xs text-blue-300">
          Generated at: {new Date(data.timestamp).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
} 