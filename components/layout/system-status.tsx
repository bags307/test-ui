'use client';

import { useStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Wifi, Mic, Database } from 'lucide-react';
import { AudioVisualizer } from '@/components/voice/audio-visualizer';
import { useState, useEffect } from 'react';

export function SystemStatus() {
  const connectionState = useStore((state) => state.state.connection);
  const voiceState = useStore((state) => state.state.voice);
  const [audioData, setAudioData] = useState<Float32Array>(new Float32Array(128).fill(0.1));

  // Simulate voice activity with more natural waveform
  useEffect(() => {
    if (voiceState.status === 'active') {
      const interval = setInterval(() => {
        const newData = new Float32Array(128);
        for (let i = 0; i < newData.length; i++) {
          // Create a more natural-looking waveform with multiple frequencies
          newData[i] = 
            Math.sin(Date.now() * 0.01 + i * 0.1) * 0.3 + // Base frequency
            Math.sin(Date.now() * 0.02 + i * 0.2) * 0.2 + // Secondary frequency
            Math.sin(Date.now() * 0.005 + i * 0.05) * 0.1 + // Slow modulation
            (Math.random() * 0.1); // Subtle noise
        }
        setAudioData(newData);
      }, 50);

      return () => clearInterval(interval);
    } else {
      setAudioData(new Float32Array(128).fill(0.1));
    }
  }, [voiceState.status]);

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">System Status</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span className="text-sm">Assistant</span>
            </div>
            <Badge variant={connectionState.assistant.status === 'connected' ? 'default' : 'destructive'}>
              {connectionState.assistant.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="text-sm">Voice</span>
            </div>
            <Badge variant={voiceState.status === 'active' ? 'default' : 'secondary'}>
              {voiceState.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm">Memory</span>
            </div>
            <Badge variant={connectionState.memory.status === 'connected' ? 'default' : 'destructive'}>
              {connectionState.memory.status}
            </Badge>
          </div>
        </div>

        {/* Voice Visualizer */}
        <div className="pt-2">
          <AudioVisualizer
            isActive={voiceState.status === 'active'}
            audioData={audioData}
            height={48}
            barWidth={2}
            barGap={1}
          />
        </div>
      </div>
    </Card>
  );
}