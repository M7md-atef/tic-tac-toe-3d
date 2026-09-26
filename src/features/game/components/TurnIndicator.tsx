"use client";

import React from "react";
import { Bot, Sparkles, Trophy, User } from "lucide-react";
import { useSettings } from "@/features/customization/context/SettingsContext";
import { GameMode, GameStatus, Player } from "../types/game.types";

interface TurnIndicatorProps {
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  gameMode: GameMode;
  isAiThinking: boolean;
  onReset: () => void;
}

export function TurnIndicator({
  currentPlayer,
  status,
  winner,
  gameMode,
  isAiThinking,
  onReset,
}: TurnIndicatorProps) {
  const { settings } = useSettings();

  const activeColor = currentPlayer === "X" ? settings.xColor : settings.oColor;

  if (status === "won" && winner) {
    const isPlayerOneWinner = winner === "X";
    const winTitle =
      gameMode === "pvp"
        ? isPlayerOneWinner
          ? "Player 1 Claims Victory!"
          : "Player 2 Claims Victory!"
        : isPlayerOneWinner
        ? "You Outsmarted the Robot!"
        : "Robot Got Lucky This Time!";

    const winSubtitle =
      gameMode === "pvp"
        ? "Incredible strategic moves!"
        : isPlayerOneWinner
        ? "Pure human brilliance wins the day!"
        : "Machines had the upper hand. Ready for revenge?";

    const winColor = isPlayerOneWinner ? settings.xColor : settings.oColor;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-md mx-auto p-4 rounded-3xl bg-amber-300 text-stone-900 border-4 border-amber-400 shadow-[0_10px_0_0_#d97706,0_15px_25px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white border-2 border-stone-800 shadow-[0_4px_0_0_#292524] text-amber-500"
          >
            <Trophy className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-stone-800">
              Match Decided!
            </p>
            <p className="text-base sm:text-lg font-black tracking-tight" style={{ color: winColor }}>
              {winTitle}
            </p>
            <p className="text-[11px] font-medium text-stone-700">{winSubtitle}</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-stone-900 hover:bg-stone-800 rounded-2xl border-b-4 border-black active:border-b-0 active:translate-y-1 shadow-md transition-all duration-150 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Play Again
        </button>
      </div>
    );
  }

  if (status === "draw") {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-md mx-auto p-4 rounded-3xl bg-stone-200 text-stone-900 border-4 border-stone-300 shadow-[0_8px_0_0_#a8a29e,0_12px_20px_rgba(0,0,0,0.1)] animate-in fade-in">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white border-2 border-stone-400 text-stone-600 shadow-[0_3px_0_0_#78716c]">
            <span className="font-black text-sm">VS</span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-stone-600">
              Draw Match
            </p>
            <p className="text-base sm:text-lg font-black text-stone-800">
              Deadlock! Perfectly Matched!
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 text-xs sm:text-sm font-black text-white bg-stone-800 hover:bg-stone-700 rounded-2xl border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 shadow-sm transition-all cursor-pointer"
        >
          Rematch
        </button>
      </div>
    );
  }

  // Active Game State
  const isPveAiTurn = gameMode === "pve" && currentPlayer === "O";

  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-md mx-auto px-5 py-3.5 rounded-3xl bg-stone-900/90 text-stone-100 border-2 border-stone-800 shadow-[0_8px_0_0_#1c1917,0_12px_20px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3">
        {/* Playful character icon */}
        <div
          className="flex items-center justify-center w-11 h-11 rounded-2xl border-2 transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.3)]"
          style={{
            borderColor: activeColor,
            backgroundColor: `${activeColor}20`,
          }}
        >
          {isPveAiTurn ? (
            <Bot className="w-6 h-6 animate-pulse text-amber-400" />
          ) : (
            <User className="w-6 h-6 text-emerald-400" />
          )}
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">
            {isAiThinking ? "Robot is scheming..." : "Current Turn"}
          </span>
          <span className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <span
              className="inline-block px-2 py-0.5 rounded-lg text-xs font-black text-white"
              style={{ backgroundColor: activeColor }}
            >
              {currentPlayer}
            </span>
            <span>
              {gameMode === "pvp"
                ? currentPlayer === "X"
                  ? "Player 1's Turn"
                  : "Player 2's Turn"
                : isPveAiTurn
                ? "Calculating move..."
                : "Your Turn to Play!"}
            </span>
          </span>
        </div>
      </div>

      {/* Springy pulsing turn indicator light */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800 border border-stone-700">
        <span
          className="w-2.5 h-2.5 rounded-full animate-ping"
          style={{ backgroundColor: activeColor }}
        />
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: activeColor }}
        />
      </div>
    </div>
  );
}
