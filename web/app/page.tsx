'use client';

import { useRandomNumber } from '@/hooks/useRandomNumber';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { RandomDisplay } from '@/components/RandomDisplay';
import { RangeSelector } from '@/components/RangeSelector';
import { ErrorAlert } from '@/components/ErrorAlert';
import { Dice6, Sparkles } from 'lucide-react';

export default function Home() {
  const {
    data,
    loading,
    error,
    fetchRandom,
    fetchRandomInRange,
    clearData
  } = useRandomNumber();

  const isRangeData = data?.range !== undefined;

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-indigo-600" />
            Random Number Generator
          </h1>
          <p className="text-muted-foreground md:text-xl">
            A modern demo powered by Cloudflare Containers.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Simple Random */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Dice6 className="w-6 h-6 mr-2 text-indigo-600" />
                Simple Random
              </CardTitle>
              <CardDescription>
                Generate a random number between 0-100.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={fetchRandom}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading && !data ? 'Loading...' : '🎲 Generate Random Number'}
              </Button>
            </CardContent>
          </Card>

          {/* Range Random */}
          <RangeSelector onGenerate={fetchRandomInRange} loading={loading} />
        </div>

        {error && (
          <ErrorAlert message={error} onDismiss={clearData} />
        )}

        {data && (
          <RandomDisplay data={data} type={isRangeData ? 'range' : 'simple'} />
        )}

        {data && (
          <div className="text-center">
            <Button onClick={clearData} variant="ghost" size="sm">
              Clear Result
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
