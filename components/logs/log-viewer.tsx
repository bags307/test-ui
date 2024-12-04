'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
}

interface LogViewerProps {
  logs: LogEntry[];
  maxHeight?: string;
  autoScroll?: boolean;
}

export function LogViewer({ logs, maxHeight = '400px', autoScroll = true }: LogViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'bg-destructive text-destructive-foreground';
      case 'warn':
        return 'bg-yellow-500 text-yellow-50';
      case 'info':
        return 'bg-blue-500 text-blue-50';
      case 'debug':
        return 'bg-gray-500 text-gray-50';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="relative">
      <ScrollArea className="h-full" style={{ maxHeight }}>
        <div className="p-4 space-y-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className="font-mono text-sm border-l-2 pl-3 py-1"
              style={{
                borderColor: `var(--${log.level === 'error' ? 'destructive' : 'muted'})`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground">
                  {log.timestamp}
                </span>
                <Badge variant="outline" className={cn('text-xs', getLevelColor(log.level))}>
                  {log.level.toUpperCase()}
                </Badge>
              </div>
              <div className="whitespace-pre-wrap">{log.message}</div>
              {log.metadata && (
                <pre className="mt-1 text-xs text-muted-foreground">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
    </Card>
  );
}