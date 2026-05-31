'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function OfflineBiblePage() {
  const [translations] = useState([
    { name: 'King James Version', size: '45 MB', downloaded: true },
    { name: 'NIV', size: '42 MB', downloaded: false },
    { name: 'ESV', size: '40 MB', downloaded: false },
  ]);

  return (
    <main className="min-h-screen bg-light dark:bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-dark dark:text-light mb-8">📚 Offline Bible</h1>

        <Card className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Available Translations</h3>
          <div className="space-y-3">
            {translations.map(trans => (
              <div key={trans.name} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div>
                  <p className="font-semibold text-dark dark:text-light">{trans.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Size: {trans.size}</p>
                </div>
                <Button size="sm" variant={trans.downloaded ? 'outline' : 'primary'}>
                  {trans.downloaded ? '✓ Downloaded' : 'Download'}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You have downloaded <strong>1 translation</strong> using <strong>45 MB</strong> of storage
          </p>
          <Button variant="outline">Delete Downloaded Files</Button>
        </Card>
      </div>
    </main>
  );
}
