'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function QuietTimeReadingPage() {
  return (
    <main className="min-h-screen bg-light dark:bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-dark dark:text-light mb-8">📖 Reading Quiet Time</h1>

        <Card className="mb-8">
          <h2 className="text-3xl font-bold mb-2">John 15:4-5</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">King James Version</p>

          <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg mb-8 border-l-4 border-primary">
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed italic">
              "Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in
              the vine; no more can ye, except ye abide in me. I am the vine, ye are the branches: He
              that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye
              can do nothing."
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Commentary</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Jesus uses the metaphor of a vine and branches to illustrate the intimate relationship
              between himself and his followers. Just as a branch cannot produce fruit without remaining
              connected to the vine, believers cannot live fruitfully without abiding in Christ.
            </p>
          </div>

          <Button>Continue Reading</Button>
        </Card>
      </div>
    </main>
  );
}
