'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useParams } from 'next/navigation';

export default function CommunityGroupPage() {
  const params = useParams();
  const { id } = params;

  const group = {
    id: id,
    name: 'Bible Study Group',
    description: 'Daily Bible reading and discussion for spiritual growth',
    members: 142,
    created: '3 months ago',
    category: 'Study',
  };

  return (
    <main className="min-h-screen bg-light dark:bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Back
          </Button>
        </div>

        <Card className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-dark dark:text-light mb-2">{group.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{group.description}</p>
              <div className="flex gap-4 text-sm">
                <span>👥 {group.members} members</span>
                <span>📅 Created {group.created}</span>
                <span>🏷️ {group.category}</span>
              </div>
            </div>
            <Button size="lg">Join Group</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-2xl font-semibold mb-4">Recent Discussions</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(idx => (
              <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition">
                <h4 className="font-semibold text-dark dark:text-light">Discussion {idx}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Posted 2 days ago</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
