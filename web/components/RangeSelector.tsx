'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Shuffle } from 'lucide-react';

interface RangeSelectorProps {
  onGenerate: (min: number, max: number) => void;
  loading: boolean;
}

export function RangeSelector({ onGenerate, loading }: RangeSelectorProps) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);

  const handleGenerate = () => {
    onGenerate(min, max);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Shuffle className="w-6 h-6 mr-2 text-indigo-600" />
          Ranged Random
        </CardTitle>
        <CardDescription>
          Generate a number within your chosen range.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            placeholder="Min"
            disabled={loading}
          />
          <Input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            placeholder="Max"
            disabled={loading}
          />
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? 'Loading...' : 'Generate from Range'}
        </Button>
      </CardContent>
    </Card>
  );
} 