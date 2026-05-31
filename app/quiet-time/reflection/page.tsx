'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function QuietTimeReflectionPage() {
  const reflectionQuestions = [
    'What did this Scripture passage reveal to you about God?',
    'How does this apply to your current situation?',
    'What action can you take based on this passage?',
    'How will you pray about what you learned?',
  ];

  return (
    <main className="min-h-screen bg-light dark:bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-dark dark:text-light mb-8">💭 Reflection</h1>

        <Card className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Guided Reflection Questions</h3>
          <div className="space-y-6">
            {reflectionQuestions.map((question, idx) => (
              <div key={idx}>
                <p className="font-medium text-dark dark:text-light mb-2">
                  {idx + 1}. {question}
                </p>
                <textarea
                  placeholder="Write your reflection here..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <Button>Save Reflection</Button>
            <Button variant="outline">Clear All</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
