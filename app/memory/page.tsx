'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Neo4jBrowser } from '@/components/graph/neo4j-browser';
import { LogViewer } from '@/components/logs/log-viewer';
import { SearchInterface } from '@/components/memory/search-interface';
import { NamespaceSelector } from '@/components/memory/namespace-selector';

export default function MemoryPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('search');

  // Replace with your actual Neo4j Browser URL
  const neo4jBrowserUrl = 'http://localhost:7474';

  const sampleLogs = [
    {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Memory context updated for Project A',
      metadata: { contextId: '123', operation: 'update' },
    },
    {
      timestamp: new Date().toISOString(),
      level: 'debug',
      message: 'Retrieved related entities for Task 1',
      metadata: { count: 5, depth: 2 },
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Memory Management</h2>
        <NamespaceSelector />
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="browser">Neo4j Browser</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search">
          <SearchInterface />
        </TabsContent>

        <TabsContent value="browser" className="space-y-4">
          <Neo4jBrowser
            url={neo4jBrowserUrl}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        </TabsContent>
        
        <TabsContent value="logs">
          <LogViewer logs={sampleLogs} maxHeight="600px" />
        </TabsContent>
      </Tabs>
    </div>
  );
}