'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function InsightPage() {
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInsights([
        {
          id: 1,
          title: `Insights about "${query}"`,
          content: 'This is an AI-generated insight based on your query.',
          source: 'Scripture Analysis',
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-light dark:bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-dark dark:text-light mb-8 text-center">
          💡 AI Insights
        </h1>

        <Card className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask for spiritual insights..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" loading={loading}>
              Search
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          {insights.map(insight => (
            <Card key={insight.id} hover>
              <h3 className="text-xl font-semibold text-dark dark:text-light mb-2">
                {insight.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{insight.content}</p>
              <span className="inline-block bg-primary/10 text-primary px-2 py-1 text-xs rounded">
                {insight.source}
              </span>
            </Card>
          ))}

          {insights.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Enter a query to get personalized insights
              </p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
