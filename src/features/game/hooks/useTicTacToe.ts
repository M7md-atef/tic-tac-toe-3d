"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { soundEngine } from "@/utils/sound";
import {
  AIDifficulty,
  BoardState,
  GameMode,
  GameStatus,
  MoveStep,
  Player,
  WinningInfo,
} from "../types/game.types";
import { getBestMove } from "../utils/minimax";
import { checkWinner, isBoardFull } from "../utils/winDetection";

interface UseTicTacToeProps {
  soundEnabled: boolean;
  soundVolume: number;
  onWin: (winner: Player, mode: GameMode, movesCount: number, duration: number, difficulty?: AIDifficulty) => void;
  onDraw: (mode: GameMode, movesCount: number, duration: number, difficulty?: AIDifficulty) => void;
}

const EMPTY_BOARD: BoardState = Array(9).fill(null);

export function useTicTacToe({ soundEnabled, soundVolume, onWin, onDraw }: UseTicTacToeProps) {
  const [board, setBoard] = useState<BoardState>(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameMode, setGameMode] = useState<GameMode>("pve");
  const [difficulty, setDifficulty] = useState<AIDifficulty>("impossible");
  const [status, setStatus] = useState<GameStatus>("idle");
  const [winningInfo, setWinningInfo] = useState<WinningInfo | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [history, setHistory] = useState<MoveStep[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Trigger sound helper
  const playSound = useCallback(
    (action: "move" | "win" | "tie" | "reset", player?: Player) => {
      if (!soundEnabled) return;
      if (action === "move" && player) {
        soundEngine.playMove(player, soundVolume);
      } else if (action === "win") {
        soundEngine.playWin(soundVolume);
      } else if (action === "tie") {
        soundEngine.playTie(soundVolume);
      } else if (action === "reset") {
        soundEngine.playReset(soundVolume);
      }
    },
    [soundEnabled, soundVolume]
  );

  // Reset Game
  const resetGame = useCallback(() => {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer("X");
    setStatus("idle");
    setWinningInfo(null);
    setIsAiThinking(false);
    setHistory([]);
    startTimeRef.current = Date.now();
    playSound("reset");
  }, [playSound]);

  // Handle cell click by human player
  const handleCellClick = useCallback(
    (index: number) => {
      // Ignore if cell occupied, game over, or AI is currently computing
      if (board[index] !== null || status === "won" || status === "draw" || isAiThinking) {
        return;
      }

      const activePlayer = currentPlayer;
      const nextBoard = [...board];
      nextBoard[index] = activePlayer;

      const nextHistory = [
        ...history,
        { index, player: activePlayer, boardSnapshot: nextBoard },
      ];
      setHistory(nextHistory);
      setBoard(nextBoard);
      playSound("move", activePlayer);

      // Check win condition
      const win = checkWinner(nextBoard);
      if (win) {
        setWinningInfo(win);
        setStatus("won");
        playSound("win");
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        onWin(win.winner, gameMode, nextHistory.length, duration, gameMode === "pve" ? difficulty : undefined);
        return;
      }

      // Check draw condition
      if (isBoardFull(nextBoard)) {
        setStatus("draw");
        playSound("tie");
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        onDraw(gameMode, nextHistory.length, duration, gameMode === "pve" ? difficulty : undefined);
        return;
      }

      // Switch turn
      const nextPlayer: Player = activePlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);
      setStatus("playing");

      // Trigger AI turn if 1P mode
      if (gameMode === "pve" && nextPlayer === "O") {
        setIsAiThinking(true);
      }
    },
    [board, currentPlayer, status, isAiThinking, history, playSound, onWin, onDraw, gameMode, difficulty]
  );

  // AI Turn effect
  useEffect(() => {
    if (gameMode !== "pve" || !isAiThinking || status === "won" || status === "draw") {
      return;
    }

    // Natural 320ms human-like thinking delay
    const timer = setTimeout(() => {
      const bestMoveIndex = getBestMove(board, difficulty, "O", "X");
      if (bestMoveIndex < 0 || board[bestMoveIndex] !== null) {
        setIsAiThinking(false);
        return;
      }

      const aiPlayer: Player = "O";
      const nextBoard = [...board];
      nextBoard[bestMoveIndex] = aiPlayer;

      const nextHistory: MoveStep[] = [
        ...history,
        { index: bestMoveIndex, player: aiPlayer, boardSnapshot: nextBoard },
      ];

      setHistory(nextHistory);
      setBoard(nextBoard);
      playSound("move", aiPlayer);
      setIsAiThinking(false);

      const win = checkWinner(nextBoard);
      if (win) {
        setWinningInfo(win);
        setStatus("won");
        playSound("win");
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        onWin("O", gameMode, nextHistory.length, duration, difficulty);
        return;
      }

      if (isBoardFull(nextBoard)) {
        setStatus("draw");
        playSound("tie");
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        onDraw(gameMode, nextHistory.length, duration, difficulty);
        return;
      }

      setCurrentPlayer("X");
    }, 340);

    return () => clearTimeout(timer);
  }, [isAiThinking, board, gameMode, difficulty, history, playSound, status, onWin, onDraw]);

  // Undo Move
  const undoMove = useCallback(() => {
    if (history.length === 0 || status === "won" || isAiThinking) return;

    if (gameMode === "pvp") {
      // Revert 1 move
      const newHistory = history.slice(0, -1);
      const prevBoard = newHistory.length > 0 ? newHistory[newHistory.length - 1].boardSnapshot : EMPTY_BOARD;
      setBoard(prevBoard);
      setHistory(newHistory);
      setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
      setStatus(newHistory.length > 0 ? "playing" : "idle");
      setWinningInfo(null);
    } else {
      // Revert 2 moves (AI move + human move)
      const movesToKeep = history.length % 2 === 0 ? history.length - 2 : history.length - 1;
      const newHistory = history.slice(0, Math.max(0, movesToKeep));
      const prevBoard = newHistory.length > 0 ? newHistory[newHistory.length - 1].boardSnapshot : EMPTY_BOARD;
      setBoard(prevBoard);
      setHistory(newHistory);
      setCurrentPlayer("X");
      setStatus(newHistory.length > 0 ? "playing" : "idle");
      setWinningInfo(null);
    }
  }, [history, status, isAiThinking, gameMode]);

  return {
    board,
    currentPlayer,
    gameMode,
    difficulty,
    status,
    winningInfo,
    isAiThinking,
    moveCount: history.length,
    setGameMode,
    setDifficulty,
    handleCellClick,
    resetGame,
    undoMove,
  };
}
