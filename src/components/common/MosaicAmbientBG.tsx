import React, { useEffect, useRef } from 'react';

export const MosaicAmbientBG: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const tileSize = 18;
    const gap = 5;
    const step = tileSize + gap;

    let time = 0;

    const render = () => {
      time += 0.012; // Smooth progressive tempo
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * step + gap / 2;
          const y = r * step + gap / 2;

          // Multi-harmonic progressive wave formulas (Diagonal + Harmonic Pulse + Starlight Shimmer)
          const diagonalWave = Math.sin((c * 0.25 + r * 0.25) - time * 0.8);
          const crossWave = Math.cos((c * 0.15 - r * 0.2) + time * 0.5);
          const microShimmer = Math.sin((c * 7 + r * 13) + time * 1.5) * 0.15;

          // Combined smooth intensity normalized between 0 and 1
          let rawIntensity = (diagonalWave * 0.5 + crossWave * 0.35 + microShimmer + 1.0) / 2.0;
          rawIntensity = Math.max(0, Math.min(1, rawIntensity));

          // Soft cubic curve for polished contrast
          const intensity = Math.pow(rawIntensity, 1.8);

          if (intensity > 0.01) {
            ctx.save();
            ctx.beginPath();
            
            // Sub-pixel subtle scale modulation
            const scale = 0.95 + intensity * 0.08;
            const drawSize = tileSize * scale;
            const offsetX = (tileSize - drawSize) / 2;
            const offsetY = (tileSize - drawSize) / 2;

            ctx.roundRect(x + offsetX, y + offsetY, drawSize, drawSize, 4);

            if (isDark) {
              // Sage Green Dark Mode Accent
              const baseAlpha = 0.02 + intensity * 0.12;
              ctx.fillStyle = `hsla(98, 25%, 62%, ${baseAlpha})`;
            } else {
              // Sage Green Light Mode Accent
              const baseAlpha = 0.03 + intensity * 0.14;
              ctx.fillStyle = `hsla(98, 20%, 42%, ${baseAlpha})`;
            }

            ctx.fill();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="block w-full h-full opacity-90" />
    </div>
  );
};
