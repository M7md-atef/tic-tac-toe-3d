"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Board } from "@/features/game/components/Board";
import { TurnIndicator } from "@/features/game/components/TurnIndicator";
import { HistoryDrawer } from "@/features/game/components/HistoryDrawer";
import { Scoreboard } from "@/features/scoreboard/components/Scoreboard";
import { SettingsModal } from "@/features/customization/components/SettingsModal";
import { useSettings } from "@/features/customization/context/SettingsContext";
import { useGameStats } from "@/features/scoreboard/hooks/useGameStats";
import { useTicTacToe } from "@/features/game/hooks/useTicTacToe";
import { RefreshCw, Undo2 } from "lucide-react";

export default function TicTacToeApp() {
  const { settings, theme, setIsSettingsOpen, updateSettings } = useSettings();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { stats, history, recordWin, recordDraw, resetStats } = useGameStats();

  const {
    board,
    currentPlayer,
    gameMode,
    difficulty,
    status,
    winningInfo,
    isAiThinking,
    moveCount,
    setGameMode,
    setDifficulty,
    handleCellClick,
    resetGame,
    undoMove,
  } = useTicTacToe({
    soundEnabled: settings.soundEnabled,
    soundVolume: settings.soundVolume,
    onWin: recordWin,
    onDraw: recordDraw,
  });

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        resetGame();
      } else if (e.key === "u" || e.key === "U") {
        e.preventDefault();
        undoMove();
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        setIsSettingsOpen(true);
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        updateSettings({ soundEnabled: !settings.soundEnabled });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetGame, undoMove, setIsSettingsOpen, settings.soundEnabled, updateSettings]);

  return (
    <main
      className={`min-h-screen flex flex-col justify-between transition-colors duration-500 bg-gradient-to-b ${theme?.backgroundGradient || "from-amber-100 via-orange-50 to-amber-200 text-stone-900"}`}
    >
      {/* Console Navigation Header */}
      <Header
        gameMode={gameMode}
        difficulty={difficulty}
        onModeChange={setGameMode}
        onDifficultyChange={setDifficulty}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onUndo={undoMove}
        canUndo={moveCount > 0 && status !== "won" && !isAiThinking}
      />

      {/* Main Play Arena */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 w-full max-w-2xl mx-auto space-y-4">
        {/* Playful Turn & Character Status Banner */}
        <TurnIndicator
          currentPlayer={currentPlayer}
          status={status}
          winner={winningInfo?.winner || null}
          gameMode={gameMode}
          isAiThinking={isAiThinking}
          onReset={resetGame}
        />

        {/* Tactile 3D Console Board with Interactive Tilt */}
        <Board
          board={board}
          onCellClick={handleCellClick}
          winningInfo={winningInfo}
          status={status}
          currentPlayer={currentPlayer}
          isAiThinking={isAiThinking}
        />

        {/* Chunky Physical Console Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetGame}
            title="Start New Round (R)"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm border-2 border-stone-900 shadow-[0_6px_0_0_#292524] active:translate-y-1.5 active:shadow-[0_1px_0_0_#292524] transition-all duration-150 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 stroke-[3]" />
            <span>New Round</span>
          </button>

          <button
            type="button"
            onClick={undoMove}
            disabled={moveCount === 0 || status === "won" || isAiThinking}
            title="Take Back Move (U)"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm border-2 border-stone-900 shadow-[0_6px_0_0_#0c0a09] active:translate-y-1.5 active:shadow-[0_1px_0_0_#0c0a09] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
          >
            <Undo2 className="w-4 h-4 stroke-[2.5]" />
            <span>Take Back</span>
          </button>
        </div>

        {/* Tactile Scoreboard Counter */}
        <div className="w-full pt-1">
          <Scoreboard
            stats={stats}
            gameMode={gameMode}
            onResetScores={resetStats}
          />
        </div>
      </div>

      {/* Footer & Hotkeys Guide */}
      <Footer />

      {/* Toy Customization Studio Modal */}
      <SettingsModal />

      {/* Match History Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
      />
    </main>
  );
}
