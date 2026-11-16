"use client";

import { useEffect, useRef } from "react";

const GRID_SIZE = 32;
const EFFECT_RADIUS = 150;

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  intensity: number;
  active: boolean;
  initialized: boolean;
};

type Cell = {
  column: number;
  row: number;
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  strength: number;
};

const hash = (column: number, row: number) => {
  const value = Math.sin(column * 12.9898 + row * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export default function InteractiveLedgerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    if (!canvas || !context || reducedMotion.matches || coarsePointer.matches) {
      return;
    }

    const styles = getComputedStyle(document.documentElement);
    const paper = styles.getPropertyValue("--color-paper").trim();
    const grid = styles.getPropertyValue("--color-grid").trim();
    const ledger = styles.getPropertyValue("--color-ledger").trim();

    if (!paper || !grid || !ledger) return;

    const pointer: PointerState = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      velocityX: 0,
      velocityY: 0,
      intensity: 0,
      active: false,
      initialized: false,
    };

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const drawBrokenSide = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      jitterX: number,
      jitterY: number,
    ) => {
      context.moveTo(startX + jitterX, startY + jitterY);
      context.lineTo(endX + jitterX, endY + jitterY);
    };

    const render = () => {
      running = false;
      pointer.x += (pointer.targetX - pointer.x) * 0.2;
      pointer.y += (pointer.targetY - pointer.y) * 0.2;
      pointer.velocityX *= 0.78;
      pointer.velocityY *= 0.78;
      pointer.intensity += ((pointer.active ? 1 : 0) - pointer.intensity) * 0.1;

      context.clearRect(0, 0, width, height);

      if (pointer.intensity > 0.01) {
        const cells: Cell[] = [];
        const startColumn = Math.floor((pointer.x - EFFECT_RADIUS) / GRID_SIZE);
        const endColumn = Math.ceil((pointer.x + EFFECT_RADIUS) / GRID_SIZE);
        const startRow = Math.floor((pointer.y - EFFECT_RADIUS) / GRID_SIZE);
        const endRow = Math.ceil((pointer.y + EFFECT_RADIUS) / GRID_SIZE);

        for (let column = startColumn; column <= endColumn; column += 1) {
          for (let row = startRow; row <= endRow; row += 1) {
            const x = column * GRID_SIZE;
            const y = row * GRID_SIZE;
            const centerX = x + GRID_SIZE / 2;
            const centerY = y + GRID_SIZE / 2;
            const distance = Math.hypot(centerX - pointer.x, centerY - pointer.y);

            if (distance < EFFECT_RADIUS) {
              const strength =
                Math.pow(1 - distance / EFFECT_RADIUS, 2) * pointer.intensity;
              cells.push({ column, row, x, y, centerX, centerY, strength });
            }
          }
        }

        context.fillStyle = paper;
        for (const cell of cells) {
          context.fillRect(
            cell.x - 1,
            cell.y - 1,
            GRID_SIZE + 2,
            GRID_SIZE + 2,
          );
        }

        context.lineWidth = 1;
        context.lineCap = "round";

        for (const cell of cells) {
          const distanceX = cell.centerX - pointer.x;
          const distanceY = cell.centerY - pointer.y;
          const distance = Math.max(Math.hypot(distanceX, distanceY), 1);
          const random = hash(cell.column, cell.row);
          const push = 13 * cell.strength;
          const offsetX =
            (distanceX / distance) * push +
            pointer.velocityX * cell.strength * 0.2;
          const offsetY =
            (distanceY / distance) * push +
            pointer.velocityY * cell.strength * 0.2;
          const rotation =
            (random - 0.5) * 0.16 * cell.strength +
            (pointer.velocityX - pointer.velocityY) * 0.0007 * cell.strength;
          const half = GRID_SIZE / 2;
          const gap = 2 + cell.strength * 6;
          const jitter = (random - 0.5) * 4 * cell.strength;

          context.save();
          context.translate(
            cell.centerX + offsetX,
            cell.centerY + offsetY,
          );
          context.rotate(rotation);
          context.beginPath();

          drawBrokenSide(-half, -half, -gap, -half, jitter, -jitter);
          drawBrokenSide(gap, -half, half, -half, -jitter, jitter);
          drawBrokenSide(half, -half, half, -gap, jitter, jitter);
          drawBrokenSide(half, gap, half, half, -jitter, -jitter);
          drawBrokenSide(half, half, gap, half, jitter, -jitter);
          drawBrokenSide(-gap, half, -half, half, -jitter, jitter);
          drawBrokenSide(-half, half, -half, gap, -jitter, -jitter);
          drawBrokenSide(-half, -gap, -half, -half, jitter, jitter);

          context.globalAlpha = 0.55 + cell.strength * 0.45;
          context.strokeStyle =
            cell.strength > 0.55 && random > 0.76 ? ledger : grid;
          context.stroke();
          context.restore();
        }
      }

      const targetIntensity = pointer.active ? 1 : 0;
      const stillMoving =
        Math.abs(targetIntensity - pointer.intensity) > 0.01 ||
        Math.abs(pointer.targetX - pointer.x) > 0.1 ||
        Math.abs(pointer.targetY - pointer.y) > 0.1 ||
        Math.abs(pointer.velocityX) > 0.1 ||
        Math.abs(pointer.velocityY) > 0.1;

      if (stillMoving) {
        running = true;
        frame = window.requestAnimationFrame(render);
      }
    };

    const requestRender = () => {
      if (!running) {
        running = true;
        frame = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      if (!pointer.initialized) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.targetX = event.clientX;
        pointer.targetY = event.clientY;
        pointer.initialized = true;
      }

      pointer.velocityX = Math.max(
        -35,
        Math.min(35, event.clientX - pointer.targetX),
      );
      pointer.velocityY = Math.max(
        -35,
        Math.min(35, event.clientY - pointer.targetY),
      );
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.active = true;
      requestRender();
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      requestRender();
    };

    const handleResize = () => {
      resize();
      requestRender();
    };

    resize();
    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );
    window.addEventListener("blur", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
      window.removeEventListener("blur", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
