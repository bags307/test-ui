'use client';

import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome to Sam</h2>
      <Card className="p-6">
        <p>Your AI assistant dashboard is ready.</p>
      </Card>
    </div>
  );
}