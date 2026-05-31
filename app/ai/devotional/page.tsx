'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AIDevotionalCard } from '@/components/ai/AIDevotionalCard';

export default function DevotionalPage() {
  const [devotionals, setDevotionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch devotionals
    const mockDevotionals = [
      {
        id: 1,
        title: 'Trust in the Lord',
        content: 'When we place our trust in God, we find peace that surpasses all understanding. Today, reflect on areas where you need to let go and trust God more fully.',
        scripture: '"Trust in the Lord with all your heart and lean not on your own understanding" - Proverbs 3:5',
        date: new Date().toLocaleDateString(),
      },
      {
        id: 2,
        title: 'Love One Another',
        content: 'Jesus taught us to love one another as He loved us. This is not just an emotion but an active choice to serve and care for those around us.',
        scripture: '"As I have loved you, so you must love one another." - John 13:34',
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
      },
    ];
    setDevotionals(mockDevotionals);
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-12">Loading devotionals...</div>;

  return (
    <main className="min-h-screen bg-light dark:bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-dark dark:text-light mb-2 text-center">
          📖 Daily Devotionals
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Start your day with inspiration and spiritual guidance
        </p>

        <div className="space-y-6">
          {devotionals.map(devotional => (
            <AIDevotionalCard
              key={devotional.id}
              title={devotional.title}
              content={devotional.content}
              scripture={devotional.scripture}
              date={devotional.date}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button>Load More Devotionals</Button>
        </div>
      </div>
    </main>
  );
}
