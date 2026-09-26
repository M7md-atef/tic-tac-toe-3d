"use client";

import React, { useEffect } from "react";
import { cn } from "@/utils/cn";
import { triggerCelebrationConfetti } from "@/components/feedback/Confetti";
import { useSettings } from "@/features/customization/context/SettingsContext";
import { useBoardTilt } from "../hooks/useBoardTilt";
import { BoardState, GameStatus, Player, WinningInfo } from "../types/game.types";
import { Square } from "./Square";
import { WinningLine } from "./WinningLine";

interface BoardProps {
  board: BoardState;
  onCellClick: (index: number) => void;
  winningInfo: WinningInfo | null;
  status: GameStatus;
  currentPlayer: Player;
  isAiThinking: boolean;
}

export function Board({
  board,
  onCellClick,
  winningInfo,
  status,
  currentPlayer,
  isAiThinking,
}: BoardProps) {
  const { settings, theme } = useSettings();
  const { containerRef, tilt } = useBoardTilt(settings.tiltEnabled);

  useEffect(() => {
    if (status === "won" && winningInfo) {
      const winnerColor = winningInfo.winner === "X" ? settings.xColor : settings.oColor;
      triggerCelebrationConfetti(winnerColor);
    }
  }, [status, winningInfo, settings.xColor, settings.oColor]);

  const isGameOver = status === "won" || status === "draw";

  return (
    <div
      className="relative flex items-center justify-center p-2 sm:p-4 my-2"
      style={{ perspective: "1000px" }}
    >
      {/* Physical Console Shell — tilt is a flat CSS projection (no preserve-3d),
          so pointer events are correctly inverse-mapped to all 9 cells */}
      <div
        ref={containerRef}
        className={cn(
          "relative w-full max-w-[360px] sm:max-w-[430px] rounded-[2.5rem] p-5 sm:p-6",
          "border-4 select-none",
          theme?.boardBg || "bg-amber-400 border-amber-500/80 shadow-[0_20px_40px_rgba(217,119,6,0.35),0_8px_0_0_#b45309]",
          theme?.boardBorder || "border-amber-500"
        )}
        style={{
          /* NO transformStyle: preserve-3d — keeps all children in a flat hit-test plane */
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: "transform 200ms ease-out",
        }}
      >
        {/* Hardware Details: 4 Corner Screws */}
        <div className="absolute top-3.5 start-3.5 w-3 h-3 rounded-full bg-stone-400/50 border border-stone-600/60 shadow-inner flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-stone-600/70" />
        </div>
        <div className="absolute top-3.5 end-3.5 w-3 h-3 rounded-full bg-stone-400/50 border border-stone-600/60 shadow-inner flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-stone-600/70" />
        </div>
        <div className="absolute bottom-3.5 start-3.5 w-3 h-3 rounded-full bg-stone-400/50 border border-stone-600/60 shadow-inner flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-stone-600/70" />
        </div>
        <div className="absolute bottom-3.5 end-3.5 w-3 h-3 rounded-full bg-stone-400/50 border border-stone-600/60 shadow-inner flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-stone-600/70" />
        </div>

        {/* Top Header of the console chassis */}
        <div className="flex items-center justify-between mb-3 px-3 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-75">
              TACTILE-3D // SYS-01
            </span>
          </div>
          <div className="flex gap-1 opacity-40">
            <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
          </div>
        </div>

        {/* Sunken Arena for the 3×3 Grid */}
        <div className="relative rounded-[2rem] p-3 bg-black/10 shadow-[inset_0_3px_6px_rgba(0,0,0,0.25)] border border-black/10">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
            {board.map((cellValue, index) => {
              const isWinningCell = winningInfo?.combination.includes(index) || false;
              return (
                <Square
                  key={index}
                  index={index}
                  value={cellValue}
                  onClick={() => onCellClick(index)}
                  isWinningCell={isWinningCell}
                  disabled={isGameOver || isAiThinking}
                  hoverPlayer={currentPlayer}
                />
              );
            })}
          </div>

          {/* Winning Line Overlay — pointer-events-none so it never blocks cells */}
          {winningInfo && (
            <div className="pointer-events-none">
              <WinningLine winningInfo={winningInfo} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
