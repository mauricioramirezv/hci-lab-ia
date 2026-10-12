import { useEffect, useRef } from 'react';
import { heatCells } from './model';
import type { HeatPoint } from './model';
export function Heatmap({ points, width, height, visible,offsetX=0,offsetY=0 }: { points: HeatPoint[]; width: number; height: number; visible: boolean;offsetX?:number;offsetY?:number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !width || !height) return;
    canvas.width = Math.ceil(width); canvas.height = Math.ceil(height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (!visible) return;
    const cells = heatCells(points), max = Math.max(1, ...cells.map(c => c.value));
    for (const cell of cells) {
      const c={...cell,x:cell.x-offsetX,y:cell.y-offsetY};
      if(c.x < -64 || c.y < -64 || c.x>width+64 || c.y>height+64)continue;
      const intensity = c.value / max;
      const gradient = ctx.createRadialGradient(c.x + 14, c.y + 14, 0, c.x + 14, c.y + 14, 32);
      gradient.addColorStop(0, `hsla(${Math.round((1 - intensity) * 45)},100%,45%,${0.25 + intensity * 0.45})`);
      gradient.addColorStop(1, 'rgba(255,0,0,0)');
      ctx.fillStyle = gradient; ctx.fillRect(c.x - 18, c.y - 18, 64, 64);
    }
  }, [points, points.length, width, height, visible,offsetX,offsetY]);
  return <canvas ref={ref} className="tracking-heatmap" aria-hidden="true" style={{ width, height, display: visible ? 'block' : 'none' }}/>;
}
