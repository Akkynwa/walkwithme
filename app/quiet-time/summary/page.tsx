'use client';

import { Card } from '@/components/ui/Card';

export default function QuietTimeSummaryPage() {
  const stats = [
    { label: 'Total Sessions', value: '24' },
    { label: 'Current Streak', value: '7 days' },
    { label: 'Average Duration', value: '22 min' },
    { label: 'This Month', value: '15 sessions' },
  ];

  return (
    <main className="min-h-screen bg-light dark:bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-dark dark:text-light mb-8 text-center">
          📋 Your Quiet Time Summary
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          <h3 className="text-2xl font-semibold mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {['May 18', 'May 17', 'May 16', 'May 15', 'May 14'].map((date, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <span className="text-dark dark:text-light">{date}</span>
                <span className="text-primary font-semibold">25 min</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
