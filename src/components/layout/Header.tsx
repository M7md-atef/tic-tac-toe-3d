"use client";

import React from "react";
import { Bot, History, Settings, Undo2, Users } from "lucide-react";
import { useSettings } from "@/features/customization/context/SettingsContext";
import { AIDifficulty, GameMode } from "@/features/game/types/game.types";

interface HeaderProps {
  gameMode: GameMode;
  difficulty: AIDifficulty;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (diff: AIDifficulty) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function Header({
  gameMode,
  difficulty,
  onModeChange,
  onDifficultyChange,
  onOpenSettings,
  onOpenHistory,
  onUndo,
  canUndo,
}: HeaderProps) {
  const { settings } = useSettings();

  return (
    <header className="w-full max-w-2xl mx-auto flex flex-col gap-3 py-3 px-3 sm:px-4">
      {/* Top Branding Bar */}
      <div className="flex items-center justify-between">
        {/* Brand Console Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-400 border-2 border-stone-800 shadow-[0_4px_0_0_#292524] text-stone-900 font-black text-xl">
            #
            <div className="absolute -top-1 -end-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-stone-900" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-white">
                POCKET <span style={{ color: settings.xColor }}>TAC-TOE</span>
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 border border-stone-800 shadow-sm">
                TACTILE
              </span>
            </div>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 hidden sm:block">
              Physical toy aesthetic • Minimax AI Master
            </p>
          </div>
        </div>

        {/* Console Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Undo Action */}
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo Move (U)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-2 border-stone-300 dark:border-stone-700 shadow-[0_3px_0_0_rgba(0,0,0,0.2)] active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          {/* History Modal Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            title="Match History"
            className="p-2 sm:px-3 sm:py-2 flex items-center gap-1.5 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-2 border-stone-300 dark:border-stone-700 shadow-[0_3px_0_0_rgba(0,0,0,0.2)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer font-bold text-xs"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Log</span>
          </button>

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Customization Studio (S)"
            className="p-2 sm:px-3 sm:py-2 flex items-center gap-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black border-2 border-stone-900 shadow-[0_4px_0_0_#292524] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-xs"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Customize</span>
          </button>
        </div>
      </div>

      {/* Chunky Physical Mode & Difficulty Switches */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 bg-stone-900/90 text-stone-100 rounded-2xl border-2 border-stone-800 shadow-[0_4px_0_0_#1c1917]">
        {/* Game Mode Rocker Switch */}
        <div className="flex items-center p-1 bg-stone-950 rounded-xl border border-stone-800">
          <button
            type="button"
            onClick={() => onModeChange("pve")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
              gameMode === "pve"
                ? "bg-amber-400 text-stone-950 shadow-[0_2px_0_0_#b45309]"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>vs Robot</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange("pvp")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
              gameMode === "pvp"
                ? "bg-amber-400 text-stone-950 shadow-[0_2px_0_0_#b45309]"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2 Players</span>
          </button>
        </div>

        {/* AI Difficulty Selector */}
        {gameMode === "pve" && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 me-1">
              Level:
            </span>
            {(["easy", "medium", "impossible"] as AIDifficulty[]).map((level) => {
              const isActive = difficulty === level;
              const labels = {
                easy: "Casual",
                medium: "Clever",
                impossible: "Unbeatable",
              };
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onDifficultyChange(level)}
                  className={`px-2.5 py-1 text-xs font-black rounded-lg border-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-rose-500 text-white border-rose-600 shadow-[0_2px_0_0_#9f1239]"
                      : "bg-stone-800 text-stone-400 border-stone-700 hover:text-white"
                  }`}
                >
                  {labels[level]}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
