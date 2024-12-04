'use client';

import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  audioData: Float32Array;
  height?: number;
  barWidth?: number;
  barGap?: number;
}

export function AudioVisualizer({
  isActive,
  audioData,
  height = 48,
  barWidth = 6,
  barGap = 4
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed number of bars
    const numBars = 7;
    const totalWidth = numBars * (barWidth + barGap) - barGap;
    const startX = (canvas.width - totalWidth) / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, height);

      // Define vibrant colors for the bars
      const colors = [
        'hsl(var(--chart-1))',  // Red/Orange
        'hsl(var(--chart-2))',  // Teal
        'hsl(var(--chart-3))',  // Navy
        'hsl(var(--chart-4))',  // Yellow
        'hsl(var(--chart-5))',  // Orange
        'hsl(var(--chart-2))',  // Teal
        'hsl(var(--chart-1))'   // Red/Orange
      ];

      for (let i = 0; i < numBars; i++) {
        const x = startX + i * (barWidth + barGap);
        let barHeight;

        if (isActive && audioData && i < audioData.length) {
          // Use the actual audio data value
          barHeight = Math.max(8, Math.min(height - 4, audioData[i] * height));
        } else {
          // Default height when inactive
          barHeight = 8;
        }

        const y = (height - barHeight) / 2;
        
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    draw();
  }, [isActive, audioData, height, barWidth, barGap]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={height}
      className="w-full rounded-md bg-background"
      style={{ height }}
    />
  );
}