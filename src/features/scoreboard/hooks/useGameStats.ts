"use client";

import { useEffect, useState } from "react";
import { AIDifficulty, GameMode, GameStats, MatchRecord, Player } from "@/features/game/types/game.types";

const STATS_KEY = "tictactoe-3d-stats-v1";
const HISTORY_KEY = "tictactoe-3d-history-v1";

const INITIAL_STATS: GameStats = {
  xWins: 0,
  oWins: 0,
  draws: 0,
  totalGames: 0,
  currentStreak: 0,
  bestStreak: 0,
  streakHolder: null,
};

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [history, setHistory] = useState<MatchRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedStats = localStorage.getItem(STATS_KEY);
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch {
      // Storage access error handling
    }
    setIsLoaded(true);
  }, []);

  const saveStats = (newStats: GameStats) => {
    setStats(newStats);
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    } catch {
      // Ignore
    }
  };

  const saveHistory = (newHistory: MatchRecord[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignore
    }
  };

  const recordWin = (
    winner: Player,
    mode: GameMode,
    movesCount: number,
    durationSeconds = 0,
    difficulty?: AIDifficulty
  ) => {
    setStats((prev) => {
      const isSameStreakHolder = prev.streakHolder === winner;
      const currentStreak = isSameStreakHolder ? prev.currentStreak + 1 : 1;
      const bestStreak = Math.max(prev.bestStreak, currentStreak);

      const nextStats: GameStats = {
        ...prev,
        xWins: winner === "X" ? prev.xWins + 1 : prev.xWins,
        oWins: winner === "O" ? prev.oWins + 1 : prev.oWins,
        totalGames: prev.totalGames + 1,
        currentStreak,
        bestStreak,
        streakHolder: winner,
      };

      saveStats(nextStats);
      return nextStats;
    });

    const newRecord: MatchRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      winner,
      mode,
      difficulty,
      totalMoves: movesCount,
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      durationSeconds,
    };

    setHistory((prev) => {
      const updated = [newRecord, ...prev].slice(0, 30);
      saveHistory(updated);
      return updated;
    });
  };

  const recordDraw = (
    mode: GameMode,
    movesCount: number,
    durationSeconds = 0,
    difficulty?: AIDifficulty
  ) => {
    setStats((prev) => {
      const nextStats: GameStats = {
        ...prev,
        draws: prev.draws + 1,
        totalGames: prev.totalGames + 1,
        currentStreak: 0,
        streakHolder: null,
      };
      saveStats(nextStats);
      return nextStats;
    });

    const newRecord: MatchRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      winner: "draw",
      mode,
      difficulty,
      totalMoves: movesCount,
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      durationSeconds,
    };

    setHistory((prev) => {
      const updated = [newRecord, ...prev].slice(0, 30);
      saveHistory(updated);
      return updated;
    });
  };

  const resetStats = () => {
    saveStats(INITIAL_STATS);
    saveHistory([]);
  };

  return {
    stats: isLoaded ? stats : INITIAL_STATS,
    history: isLoaded ? history : [],
    recordWin,
    recordDraw,
    resetStats,
  };
}
