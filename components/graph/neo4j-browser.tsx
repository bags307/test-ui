'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

interface Neo4jBrowserProps {
  url: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function Neo4jBrowser({ url, isFullscreen, onToggleFullscreen }: Neo4jBrowserProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (isFullscreen) {
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.zIndex = '50';
    } else {
      iframe.style.position = 'relative';
      iframe.style.width = '100%';
      iframe.style.height = '600px';
      iframe.style.zIndex = '1';
    }
  }, [isFullscreen]);

  return (
    <Card className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={onToggleFullscreen}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full border-none rounded-lg"
        style={{ height: '600px' }}
      />
    </Card>
  );
}