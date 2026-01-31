"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ----------------------------------------
 * Config
 * -------------------------------------- */

const COLORS = ["#000000", "#e11d48", "#2563eb", "#16a34a", "#d97706"];
const EXPERT_WATERMARK_URL = "https://github.com/shadcn.png";

/* ----------------------------------------
 * Types
 * -------------------------------------- */

type WhiteboardProps = {
  socket?: any;
  roomId: string;
  canvasRef?: React.RefObject<HTMLCanvasElement | null> | React.MutableRefObject<HTMLCanvasElement | null>;
};

/* ----------------------------------------
 * Component
 * -------------------------------------- */

export default function Whiteboard({
  socket,
  roomId,
  canvasRef,
}: WhiteboardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLImageElement | null>(null);

  const canvas = canvasRef ?? internalCanvasRef;

  // drawing state refs (DO NOT attach to canvas element)
  const lastPointRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  const lastEmitRef = useRef<number>(0);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  /* ----------------------------------------
   * Drawing Start
   * -------------------------------------- */

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvas.current) return;

    const { offsetX, offsetY } = getCoordinates(e);
    setIsDrawing(true);

    lastPointRef.current = { x: offsetX, y: offsetY };

    updateLocalCursor(offsetX, offsetY, true);
    drawLine(offsetX, offsetY, offsetX, offsetY, true);
    emitCursor(offsetX, offsetY);
  };

  /* ----------------------------------------
   * Pointer Move
   * -------------------------------------- */

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvas.current) return;

    const { offsetX, offsetY } = getCoordinates(e);

    updateLocalCursor(offsetX, offsetY, true);
    emitCursor(offsetX, offsetY);

    if (!isDrawing) return;

    const { x, y } = lastPointRef.current;
    if (x === null || y === null) return;

    drawLine(x, y, offsetX, offsetY, true);
    lastPointRef.current = { x: offsetX, y: offsetY };
  };

  /* ----------------------------------------
   * Stop / Leave
   * -------------------------------------- */

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = { x: null, y: null };
  };

  const handleLeave = () => {
    stopDrawing();
    hideLocalCursor();

    socket?.emit("wb-cursor", {
      roomId,
      hidden: true,
    });
  };

  /* ----------------------------------------
   * Drawing Core
   * -------------------------------------- */

  const drawLine = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    emit: boolean
  ) => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;

    const w = canvas.current.width;
    const h = canvas.current.height;

    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? 20 : 2;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    if (emit && socket) {
      socket.emit("wb-draw", {
        roomId,
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: ctx.strokeStyle,
        width: ctx.lineWidth,
      });
    }
  };

  /* ----------------------------------------
   * Cursor Emit (Network)
   * -------------------------------------- */

  const emitCursor = (x: number, y: number) => {
    if (!socket || !canvas.current) return;

    const now = Date.now();
    if (now - lastEmitRef.current < 30) return;

    socket.emit("wb-cursor", {
      roomId,
      x: x / canvas.current.width,
      y: y / canvas.current.height,
    });

    lastEmitRef.current = now;
  };

  /* ----------------------------------------
   * Local Cursor
   * -------------------------------------- */

  const updateLocalCursor = (x: number, y: number, visible: boolean) => {
    if (!cursorRef.current) return;

    cursorRef.current.style.opacity = visible ? "0.7" : "0";
    cursorRef.current.style.transform = `translate(${x + 10}px, ${y + 10}px)`;
  };

  const hideLocalCursor = () => {
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "0";
    }
  };

  /* ----------------------------------------
   * Coordinates Helper
   * -------------------------------------- */

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvas.current) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.current.getBoundingClientRect();

    if ("touches" in e && e.touches.length) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top,
      };
    }

    if ("changedTouches" in e && e.changedTouches.length) {
      return {
        offsetX: e.changedTouches[0].clientX - rect.left,
        offsetY: e.changedTouches[0].clientY - rect.top,
      };
    }

    const mouseEvent = e as React.MouseEvent;
    return {
      offsetX: mouseEvent.nativeEvent.offsetX,
      offsetY: mouseEvent.nativeEvent.offsetY,
    };
  };

  /* ----------------------------------------
   * Resize Safe Redraw
   * -------------------------------------- */

  useEffect(() => {
    const handleResize = () => {
      if (!canvas.current || !containerRef.current) return;

      const temp = document.createElement("canvas");
      temp.width = canvas.current.width;
      temp.height = canvas.current.height;

      const tempCtx = temp.getContext("2d");
      const ctx = canvas.current.getContext("2d");
      if (!tempCtx || !ctx) return;

      tempCtx.drawImage(canvas.current, 0, 0);

      canvas.current.width = containerRef.current.offsetWidth;
      canvas.current.height = containerRef.current.offsetHeight;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
      ctx.drawImage(temp, 0, 0);
    };

    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 100);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ----------------------------------------
   * Clear Board
   * -------------------------------------- */

  const clearBoard = () => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);

    socket?.emit("wb-clear", roomId);
  };

  /* ----------------------------------------
   * UI
   * -------------------------------------- */

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-white cursor-crosshair touch-none overflow-hidden rounded-xl border border-zinc-200"
    >
      <canvas
        ref={canvas}
        onMouseDown={startDrawing}
        onMouseMove={handleMove}
        onMouseUp={stopDrawing}
        onMouseOut={handleLeave}
        onTouchStart={startDrawing}
        onTouchMove={handleMove}
        onTouchEnd={handleLeave}
        className="block w-full h-full touch-none"
      />

      <img
        ref={cursorRef}
        src={EXPERT_WATERMARK_URL}
        alt="Expert Cursor"
        className="absolute w-8 h-8 rounded-full border-2 border-indigo-500 shadow-md pointer-events-none transition-opacity duration-150 z-50 opacity-0"
        style={{ top: 0, left: 0, willChange: "transform" }}
      />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-zinc-200 shadow-lg rounded-full p-2 flex items-center gap-2 z-10">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => {
              setColor(c);
              setTool("pen");
            }}
            className={cn(
              "w-6 h-6 rounded-full transition-transform hover:scale-110",
              color === c && tool === "pen" && "ring-2 ring-offset-2 ring-zinc-400"
            )}
            style={{ backgroundColor: c }}
          />
        ))}

        <div className="w-px h-6 bg-zinc-200 mx-1" />

        <Button
          size="icon"
          variant={tool === "eraser" ? "secondary" : "ghost"}
          className="h-8 w-8 rounded-full"
          onClick={() => setTool("eraser")}
        >
          <Eraser className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full text-red-600 hover:bg-red-50"
          onClick={clearBoard}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
