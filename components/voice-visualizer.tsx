'use client';

import { useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
  audioData?: Float32Array;
}

export function VoiceVisualizer({ isActive, audioData }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (!isActive || !audioData) {
        // Draw idle state
        ctx.fillStyle = 'hsl(var(--muted-foreground))';
        const barWidth = 3;
        const gap = 2;
        const totalBars = Math.floor(width / (barWidth + gap));
        const baseHeight = height * 0.3;

        for (let i = 0; i < totalBars; i++) {
          const x = i * (barWidth + gap);
          ctx.fillRect(x, height / 2 - baseHeight / 2, barWidth, baseHeight);
        }
        return;
      }

      // Draw active voice visualization
      ctx.fillStyle = 'hsl(var(--primary))';
      const sliceWidth = width / audioData.length;

      for (let i = 0; i < audioData.length; i++) {
        const value = audioData[i];
        const barHeight = height * Math.abs(value);
        const x = i * sliceWidth;
        const y = (height - barHeight) / 2;
        ctx.fillRect(x, y, sliceWidth - 1, barHeight);
      }
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();
  }, [isActive, audioData]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-12 bg-background rounded-md"
      width={300}
      height={48}
    />
  );
}