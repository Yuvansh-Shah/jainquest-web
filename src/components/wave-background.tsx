'use client';

// Port of the interactive wave canvas from the original JainQuest landing
// page (project/web/index.html). Fixed full-screen, pointer-reactive, behind
// all content, and disabled when the user prefers reduced motion.
import { useEffect, useRef } from 'react';

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const pointer = {
      x: -10,
      y: window.innerHeight * 0.5,
      lx: -10,
      ly: window.innerHeight * 0.5,
      sx: -10,
      sy: window.innerHeight * 0.5,
      v: 0,
      vs: 0,
      a: 0,
      set: false,
    };

    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      frameId: 0,
      lines: [] as {
        x: number;
        y: number;
        waveX: number;
        waveY: number;
        cursorX: number;
        cursorY: number;
        cursorVx: number;
        cursorVy: number;
      }[][],
      lineSpacingX: 14,
      lineSpacingY: 14,
      running: true,
    };

    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const hash2D = (x: number, y: number) => {
      const n = x * 374761393 + y * 668265263;
      let hash = (n ^ (n >> 13)) * 1274126177;
      hash ^= hash >> 16;
      return (hash & 0x7fffffff) / 0x7fffffff;
    };

    const valueNoise2D = (x: number, y: number) => {
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const xf = x - x0;
      const yf = y - y0;
      const u = xf * xf * (3 - 2 * xf);
      const v = yf * yf * (3 - 2 * yf);
      const n00 = hash2D(x0, y0);
      const n10 = hash2D(x0 + 1, y0);
      const n01 = hash2D(x0, y0 + 1);
      const n11 = hash2D(x0 + 1, y0 + 1);
      const nx0 = lerp(n00, n10, u);
      const nx1 = lerp(n01, n11, u);
      return lerp(nx0, nx1, v) * 2 - 1;
    };

    const buildLines = () => {
      const oWidth = state.width + 200;
      const oHeight = state.height + 30;
      const totalLines = Math.ceil(oWidth / state.lineSpacingX);
      const totalPoints = Math.ceil(oHeight / state.lineSpacingY);
      const xStart = (state.width - state.lineSpacingX * totalLines) / 2;
      const yStart = (state.height - state.lineSpacingY * totalPoints) / 2;
      state.lines = Array.from({ length: totalLines }, (_, li) =>
        Array.from({ length: totalPoints }, (_, pi) => ({
          x: xStart + state.lineSpacingX * li,
          y: yStart + state.lineSpacingY * pi,
          waveX: 0,
          waveY: 0,
          cursorX: 0,
          cursorY: 0,
          cursorVx: 0,
          cursorVy: 0,
        })),
      );
    };

    const resize = () => {
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      state.lineSpacingX = window.innerWidth < 720 ? 18 : 14;
      state.lineSpacingY = window.innerWidth < 720 ? 18 : 14;
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      buildLines();
      if (!pointer.set) {
        pointer.y = state.height * 0.5;
        pointer.sy = pointer.y;
        pointer.ly = pointer.y;
      }
    };

    const updatePointer = (cx: number, cy: number) => {
      pointer.x = clamp(cx, -10, state.width + 10);
      pointer.y = clamp(cy, -10, state.height + 10);
      if (pointer.set) return;
      pointer.sx = pointer.x;
      pointer.sy = pointer.y;
      pointer.lx = pointer.x;
      pointer.ly = pointer.y;
      pointer.set = true;
    };

    const clearPointer = () => {
      pointer.x = -10;
      pointer.y = state.height * 0.5;
    };

    const updatePointerSmoothing = () => {
      pointer.sx += (pointer.x - pointer.sx) * 0.1;
      pointer.sy += (pointer.y - pointer.sy) * 0.1;
      const dx = pointer.x - pointer.lx;
      const dy = pointer.y - pointer.ly;
      const distance = Math.sqrt(dx * dx + dy * dy);
      pointer.v = distance;
      pointer.vs += (distance - pointer.vs) * 0.1;
      pointer.vs = clamp(pointer.vs, 0, 100);
      pointer.lx = pointer.x;
      pointer.ly = pointer.y;
      pointer.a = Math.atan2(dy, dx);
    };

    const movePoints = (timeMs: number) => {
      for (const points of state.lines) {
        for (const point of points) {
          const move =
            valueNoise2D(
              (point.x + timeMs * 0.008) * 0.003,
              (point.y + timeMs * 0.003) * 0.002,
            ) *
            Math.PI *
            2;
          point.waveX = Math.cos(move) * 12;
          point.waveY = Math.sin(move) * 6;
          const dx = point.x - pointer.sx;
          const dy = point.y - pointer.sy;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const limit = Math.max(175, pointer.vs);
          if (distance < limit) {
            const strength = 1 - distance / limit;
            const force = Math.cos(distance * 0.001) * strength;
            point.cursorVx +=
              Math.cos(pointer.a) * force * limit * pointer.vs * 0.00035;
            point.cursorVy +=
              Math.sin(pointer.a) * force * limit * pointer.vs * 0.00035;
          }
          point.cursorVx += (0 - point.cursorX) * 0.01;
          point.cursorVy += (0 - point.cursorY) * 0.01;
          point.cursorVx *= 0.95;
          point.cursorVy *= 0.95;
          point.cursorX += point.cursorVx;
          point.cursorY += point.cursorVy;
          point.cursorX = clamp(point.cursorX, -50, 50);
          point.cursorY = clamp(point.cursorY, -50, 50);
        }
      }
    };

    const draw = () => {
      if (!state.running) return;
      updatePointerSmoothing();
      movePoints(reducedMotion ? 0 : performance.now());
      ctx.clearRect(0, 0, state.width, state.height);
      ctx.fillStyle = '#030507';
      ctx.fillRect(0, 0, state.width, state.height);
      ctx.strokeStyle = 'rgba(246, 240, 231, 0.22)';
      ctx.lineWidth = 1;
      for (const points of state.lines) {
        if (points.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(
          points[0].x + points[0].waveX,
          points[0].y + points[0].waveY,
        );
        for (let i = 1; i < points.length; i += 1) {
          const p = points[i];
          ctx.lineTo(p.x + p.waveX + p.cursorX, p.y + p.waveY + p.cursorY);
        }
        ctx.stroke();
      }
      if (pointer.sx > -9) {
        ctx.beginPath();
        ctx.arc(pointer.sx, pointer.sy, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 137, 67, 0.9)';
        ctx.fill();
      }
      state.frameId = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(state.frameId);
      } else if (state.running) {
        draw();
      }
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onMove);
    document.addEventListener('mouseleave', clearPointer);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      state.running = false;
      cancelAnimationFrame(state.frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      document.removeEventListener('mouseleave', clearPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
