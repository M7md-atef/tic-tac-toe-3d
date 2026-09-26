"use client";

import React from "react";
import { useSettings } from "@/features/customization/context/SettingsContext";
import { WinningInfo } from "../types/game.types";

interface WinningLineProps {
  winningInfo: WinningInfo;
}

export function WinningLine({ winningInfo }: WinningLineProps) {
  const { settings } = useSettings();
  const strokeColor = winningInfo.winner === "X" ? settings.xColor : settings.oColor;

  const getCoordinates = () => {
    switch (winningInfo.direction) {
      case "row-0":
        return { x1: "8%", y1: "18%", x2: "92%", y2: "18%" };
      case "row-1":
        return { x1: "8%", y1: "50%", x2: "92%", y2: "50%" };
      case "row-2":
        return { x1: "8%", y1: "82%", x2: "92%", y2: "82%" };
      case "col-0":
        return { x1: "18%", y1: "8%", x2: "18%", y2: "92%" };
      case "col-1":
        return { x1: "50%", y1: "8%", x2: "50%", y2: "92%" };
      case "col-2":
        return { x1: "82%", y1: "8%", x2: "82%", y2: "92%" };
      case "diag-main":
        return { x1: "10%", y1: "10%", x2: "90%", y2: "90%" };
      case "diag-anti":
        return { x1: "90%", y1: "10%", x2: "10%", y2: "90%" };
      default:
        return { x1: "0%", y1: "0%", x2: "0%", y2: "0%" };
    }
  };

  const coords = getCoordinates();

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[2rem]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Soft shadow under the marker line */}
        <line
          x1={coords.x1}
          y1={coords.y1}
          x2={coords.x2}
          y2={coords.y2}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="14"
          strokeLinecap="round"
          className="transform translate-y-1"
        />

        {/* Outer toy connection strip */}
        <line
          x1={coords.x1}
          y1={coords.y1}
          x2={coords.x2}
          y2={coords.y2}
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          className="transition-all duration-300"
        />

        {/* Top gloss highlight */}
        <line
          x1={coords.x1}
          y1={coords.y1}
          x2={coords.x2}
          y2={coords.y2}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  );
}
