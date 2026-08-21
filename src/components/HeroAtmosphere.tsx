"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient light field for the hero.
 *
 * The idea is the way light moves across a carbon fibre panel as you walk past
 * it — slow, soft, directional. Three large radial blobs drift on independent
 * sine paths and drift gently toward the pointer.
 *
 * Deliberately cheap: the canvas renders at a fixed low resolution (the blobs
 * are enormous and soft, so nobody can tell) and CSS scales it up, which is
 * what makes the blur free. It pauses entirely when scrolled out of view or
 * when the tab is hidden, and renders one static frame under
 * `prefers-reduced-motion`.
 */

interface Blob {
  /** Base position in 0–1 space. */
  x: number;
  y: number;
  /** Drift amplitude and speed. */
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  phase: number;
  radius: number;
  color: [number, number, number];
  alpha: number;
  /** How strongly this blob follows the pointer. */
  pull: number;
}

// Rendered at this size regardless of display size — the blobs are soft enough
// that upscaling reads as blur rather than pixelation.
const W = 200;
const H = 120;

export function HeroAtmosphere({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    // Read the accent from the live token so the field tracks the theme.
    const styles = getComputedStyle(document.documentElement);
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.hasAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const accent: [number, number, number] = isDark ? [230, 58, 64] : [206, 35, 41];
    const cool: [number, number, number] = isDark ? [90, 130, 180] : [120, 150, 190];
    void styles;

    const blobs: Blob[] = [
      {
        x: 0.74, y: 0.16, ax: 0.09, ay: 0.07, sx: 0.00011, sy: 0.00017,
        phase: 0, radius: 0.62, color: accent, alpha: isDark ? 0.5 : 0.24, pull: 0.05,
      },
      {
        x: 0.28, y: 0.72, ax: 0.11, ay: 0.06, sx: 0.00008, sy: 0.00013,
        phase: 2.1, radius: 0.7, color: cool, alpha: isDark ? 0.3 : 0.16, pull: 0.03,
      },
      {
        x: 0.92, y: 0.78, ax: 0.07, ay: 0.09, sx: 0.00014, sy: 0.00009,
        phase: 4.3, radius: 0.5, color: accent, alpha: isDark ? 0.26 : 0.12, pull: 0.07,
      },
    ];

    // Pointer target and its eased follower, both in 0–1 space.
    let targetX = 0.5;
    let targetY = 0.5;
    let easedX = 0.5;
    let easedY = 0.5;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      easedX += (targetX - easedX) * 0.045;
      easedY += (targetY - easedY) * 0.045;

      for (const b of blobs) {
        const cx =
          (b.x + Math.sin(time * b.sx + b.phase) * b.ax + (easedX - 0.5) * b.pull) * W;
        const cy =
          (b.y + Math.cos(time * b.sy + b.phase) * b.ay + (easedY - 0.5) * b.pull) * H;
        const r = b.radius * W;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const [red, green, blue] = b.color;
        gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${b.alpha})`);
        gradient.addColorStop(0.45, `rgba(${red}, ${green}, ${blue}, ${b.alpha * 0.28})`);
        gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      draw(0);
      return;
    }

    let frame = 0;
    let running = true;

    const loop = (time: number) => {
      if (!running) return;
      draw(time);
      frame = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (running && !frame) frame = window.requestAnimationFrame(loop);
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    // Only animate while the hero is actually on screen.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) start();
        else stop();
      },
      { threshold: 0 },
    );
    visibility.observe(canvas);

    const onPointer = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      targetX = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
      targetY = Math.max(0, Math.min(1, (e.clientY - box.top) / box.height));
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ filter: "blur(0.5px)" }}
    />
  );
}
