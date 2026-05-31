'use client';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface DevotionalCardProps {
  title: string;
  content: string;
  scripture?: string;
  date: string;
}

export function AIDevotionalCard({ title, content, scripture, date }: DevotionalCardProps) {
  return (
    <Card hover className="mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-dark dark:text-light">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{content}</p>

      {scripture && (
        <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-lg mb-4 border-l-4 border-primary">
          <p className="text-sm text-gray-600 dark:text-gray-300 italic">{scripture}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Share
        </Button>
        <Button variant="ghost" size="sm">
          Save
        </Button>
      </div>
    </Card>
  );
}
