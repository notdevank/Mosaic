import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

// 3x5 Pixel Digit Matrices for digits 0-9 and colon
const DIGIT_MAP: Record<string, number[][]> = {
  '0': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
  '2': [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
  '3': [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
  '4': [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  '5': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
  '6': [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
  '7': [[1,1,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0]],
  '8': [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
  '9': [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]],
  ':': [[0],[1],[0],[1],[0]],
};

const COLS = 17;
const ROWS = 5;

export const MosaicPixelGrid: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = format(time, 'HH');
  const minutes = format(time, 'mm');

  const buildMatrixGrid = (): number[][] => {
    const grid: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    const h1 = DIGIT_MAP[hours[0]];
    const h2 = DIGIT_MAP[hours[1]];
    const colon = DIGIT_MAP[':'];
    const m1 = DIGIT_MAP[minutes[0]];
    const m2 = DIGIT_MAP[minutes[1]];

    const modules = [
      { pattern: h1, col: 0 },
      { pattern: h2, col: 4 },
      { pattern: colon, col: 8, isColon: true },
      { pattern: m1, col: 10 },
      { pattern: m2, col: 14 },
    ];

    modules.forEach(({ pattern, col, isColon }) => {
      if (!pattern) return;
      const w = pattern[0].length;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < w; c++) {
          if (pattern[r] && pattern[r][c] === 1) {
            if (isColon) {
              if (time.getSeconds() % 2 === 0) {
                grid[r][col + c] = 1;
              }
            } else {
              grid[r][col + c] = 1;
            }
          }
        }
      }
    });

    return grid;
  };

  const grid = buildMatrixGrid();

  return (
    <div className="pt-3 border-t border-warm-border dark:border-warm-border-dark/60 mt-3 select-none">
      <div 
        className="w-full p-3.5 rounded-2xl bg-warm-subtle/70 dark:bg-[#141416] border border-warm-border/80 dark:border-[#222226] flex items-center justify-center"
        title={`Current Time: ${format(time, 'HH:mm:ss')}`}
      >
        <div className="grid grid-cols-[repeat(17,minmax(0,1fr))] gap-1 w-full max-w-[190px]">
          {grid.map((row, rIdx) =>
            row.map((val, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`aspect-square rounded-[2px] transition-all duration-300 ${
                  val === 1
                    ? 'bg-sage-600 dark:bg-sage-400 scale-100 shadow-[0_0_6px_rgba(155,176,136,0.3)]'
                    : 'bg-warm-border/50 dark:bg-[#1E1E22] scale-90'
                }`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
