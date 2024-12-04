'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { AudioVisualizer } from './audio-visualizer';

interface VoiceControlProps {
  isActive: boolean;
  audioData: Float32Array;
  onToggle: () => void;
}

export function VoiceControl({ isActive, audioData, onToggle }: VoiceControlProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <AudioVisualizer
          isActive={isActive}
          audioData={audioData}
          height={48}
        />
        <Button
          variant={isActive ? 'destructive' : 'secondary'}
          size="icon"
          onClick={onToggle}
          className="ml-4"
        >
          <Mic className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}