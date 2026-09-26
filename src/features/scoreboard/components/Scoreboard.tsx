"use client";

import React from "react";
import { Flame, RotateCcw, Trophy, Users } from "lucide-react";
import { useSettings } from "@/features/customization/context/SettingsContext";
import { GameMode, GameStats } from "@/features/game/types/game.types";

interface ScoreboardProps {
  stats: GameStats;
  gameMode: GameMode;
  onResetScores: () => void;
}

export function Scoreboard({ stats, gameMode, onResetScores }: ScoreboardProps) {
  const { settings } = useSettings();

  const p1Label = gameMode === "pvp" ? "Player 1 (X)" : "Human (X)";
  const p2Label = gameMode === "pvp" ? "Player 2 (O)" : "Robot (O)";

  const total = stats.totalGames || 1;
  const xPercent = Math.round((stats.xWins / total) * 100);
  const oPercent = Math.round((stats.oWins / total) * 100);
  const drawPercent = Math.max(0, 100 - xPercent - oPercent);

  return (
    <div className="w-full max-w-md mx-auto bg-stone-900/90 text-stone-100 border-2 border-stone-800 rounded-[2rem] p-4 sm:p-5 shadow-[0_12px_0_0_#1c1917,0_18px_25px_rgba(0,0,0,0.3)] space-y-4">
      {/* Header with Title & Reset Button */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-400 text-stone-900 font-bold shadow-[0_2px_0_0_#b45309]">
            <Trophy className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-stone-200">
            Console Scoreboard
          </h3>
        </div>

        <button
          onClick={onResetScores}
          title="Reset Scores to Zero"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-300 hover:text-rose-400 bg-stone-800 hover:bg-rose-950/40 border border-stone-700 hover:border-rose-700/50 rounded-xl transition-all shadow-[0_2px_0_0_#0c0a09] active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Chunky Physical 3D Score Cards */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        {/* Human / Player 1 Card */}
        <div
          className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 border-2 transition-transform duration-150"
          style={{
            borderColor: settings.xColor,
            boxShadow: `0 4px 0 0 rgba(0,0,0,0.3)`,
          }}
        >
          <span
            className="text-[11px] font-black uppercase tracking-wider truncate max-w-full"
            style={{ color: settings.xColor }}
          >
            {p1Label}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white mt-1">
            {stats.xWins}
          </span>
          <span className="text-[10px] text-stone-400 font-bold">
            {stats.totalGames > 0 ? `${xPercent}%` : "0%"}
          </span>
        </div>

        {/* Ties Card */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 border-2 border-stone-700 shadow-[0_4px_0_0_rgba(0,0,0,0.3)]">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
            Draws
          </span>
          <span className="text-2xl sm:text-3xl font-black text-stone-200 mt-1">
            {stats.draws}
          </span>
          <span className="text-[10px] text-stone-400 font-bold">
            {stats.totalGames > 0 ? `${drawPercent}%` : "0%"}
          </span>
        </div>

        {/* Robot / Player 2 Card */}
        <div
          className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 border-2 transition-transform duration-150"
          style={{
            borderColor: settings.oColor,
            boxShadow: `0 4px 0 0 rgba(0,0,0,0.3)`,
          }}
        >
          <span
            className="text-[11px] font-black uppercase tracking-wider truncate max-w-full"
            style={{ color: settings.oColor }}
          >
            {p2Label}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white mt-1">
            {stats.oWins}
          </span>
          <span className="text-[10px] text-stone-400 font-bold">
            {stats.totalGames > 0 ? `${oPercent}%` : "0%"}
          </span>
        </div>
      </div>

      {/* Arcade Ratio Meter */}
      {stats.totalGames > 0 && (
        <div className="space-y-1">
          <div className="h-3 w-full bg-stone-950 p-0.5 rounded-full overflow-hidden flex border border-stone-800 shadow-inner">
            <div
              style={{
                width: `${xPercent}%`,
                backgroundColor: settings.xColor,
              }}
              className="h-full rounded-s-full transition-all duration-500"
            />
            <div
              style={{ width: `${drawPercent}%` }}
              className="h-full bg-stone-600 transition-all duration-500"
            />
            <div
              style={{
                width: `${oPercent}%`,
                backgroundColor: settings.oColor,
              }}
              className="h-full rounded-e-full transition-all duration-500"
            />
          </div>
        </div>
      )}

      {/* Streak and Total Counters */}
      <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800 px-1">
        <div className="flex items-center gap-1.5 font-bold">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>
            Streak: <strong className="text-white font-black">{stats.currentStreak}</strong>{" "}
            (Record: {stats.bestStreak})
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-bold">
          <Users className="w-4 h-4 text-amber-400" />
          <span>
            Total Rounds: <strong className="text-white font-black">{stats.totalGames}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
