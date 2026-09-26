"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { useSettings } from "@/features/customization/context/SettingsContext";
import { CellValue, Player } from "../types/game.types";

interface SquareProps {
  index: number;
  value: CellValue;
  onClick: () => void;
  isWinningCell: boolean;
  disabled: boolean;
  hoverPlayer: Player;
}

export function Square({
  index,
  value,
  onClick,
  isWinningCell,
  disabled,
  hoverPlayer,
}: SquareProps) {
  const { settings, theme } = useSettings();

  const isFilled = value !== null;

  // Render physical 3D chunky X toy piece
  const renderToyX = (color: string, isGhost = false) => (
    <div
      className={cn(
        "relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-200",
        isGhost ? "opacity-25" : "animate-spring-pop"
      )}
    >
      {/* First diagonal rounded bar */}
      <div
        className="absolute w-12 sm:w-14 h-3.5 sm:h-4 rounded-full rotate-45 transform transition-transform"
        style={{
          backgroundColor: color,
          boxShadow: isGhost
            ? "none"
            : `0 4px 0 0 rgba(0,0,0,0.25), inset 0 2px 2px rgba(255,255,255,0.6)`,
        }}
      />
      {/* Second diagonal rounded bar */}
      <div
        className="absolute w-12 sm:w-14 h-3.5 sm:h-4 rounded-full -rotate-45 transform transition-transform"
        style={{
          backgroundColor: color,
          boxShadow: isGhost
            ? "none"
            : `0 4px 0 0 rgba(0,0,0,0.25), inset 0 2px 2px rgba(255,255,255,0.6)`,
        }}
      />
    </div>
  );

  // Render physical 3D chunky O torus donut piece
  const renderToyO = (color: string, isGhost = false) => (
    <div
      className={cn(
        "relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-transform duration-200",
        isGhost ? "opacity-25" : "animate-spring-pop"
      )}
      style={{
        borderWidth: "12px",
        borderColor: color,
        boxShadow: isGhost
          ? "none"
          : `0 5px 0 0 rgba(0,0,0,0.25), inset 0 3px 3px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.4)`,
      }}
    />
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isFilled}
      aria-label={`Cell ${index + 1}${value ? `, occupied by ${value}` : ", empty"}`}
      className={cn(
        // Base dimensions & physical claymorphic socket
        "group relative flex items-center justify-center w-full aspect-square rounded-[1.3rem] sm:rounded-[1.7rem]",
        "border-2 transition-all duration-150 select-none outline-none focus-visible:ring-4 focus-visible:ring-amber-400",
        theme?.cellBg || "bg-stone-50",
        theme?.cellBorder || "border-stone-200",
        // Tactile elevation & push down physics
        !isFilled && !disabled
          ? cn(
              theme?.cellShadow || "shadow-[0_8px_0_0_#d6d3d1,0_12px_20px_rgba(0,0,0,0.1),inset_0_2px_2px_rgba(255,255,255,0.9)]",
              "hover:-translate-y-1 hover:brightness-105 active:translate-y-2 active:shadow-none cursor-pointer"
            )
          : isFilled
          ? "shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)] cursor-default"
          : "opacity-80 cursor-default",
        // Winning cell bouncy state
        isWinningCell &&
          "ring-4 ring-amber-400 ring-offset-2 ring-offset-amber-500 scale-105 z-10"
      )}
    >
      {/* Top subtle highlight */}
      <div className="absolute inset-x-2 top-1 h-2 bg-white/40 rounded-t-xl pointer-events-none" />

      {/* Render actual toy piece */}
      {value === "X" && renderToyX(settings.xColor)}
      {value === "O" && renderToyO(settings.oColor)}

      {/* Ghost hover indication */}
      {!isFilled && !disabled && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
          {hoverPlayer === "X"
            ? renderToyX(settings.xColor, true)
            : renderToyO(settings.oColor, true)}
        </div>
      )}
    </button>
  );
}
