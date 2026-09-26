import { AIDifficulty, BoardState, Player } from "../types/game.types";
import { checkWinner, isBoardFull } from "./winDetection";

/**
 * Returns all available indices (empty cells) on the board
 */
export function getAvailableMoves(board: BoardState): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Evaluates the terminal state of a board.
 * AI (O) winning scores positive, Human (X) winning scores negative.
 * We incorporate depth so the AI prefers quick wins and slow losses.
 */
function evaluateBoard(board: BoardState, depth: number, aiPlayer: Player, humanPlayer: Player): number {
  const winInfo = checkWinner(board);
  if (winInfo) {
    if (winInfo.winner === aiPlayer) {
      return 10 - depth;
    } else if (winInfo.winner === humanPlayer) {
      return depth - 10;
    }
  }
  return 0;
}

/**
 * Core recursive Minimax algorithm with depth calculation
 */
function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha = -Infinity,
  beta = Infinity
): { score: number; bestMove?: number } {
  const winInfo = checkWinner(board);
  if (winInfo || isBoardFull(board)) {
    return { score: evaluateBoard(board, depth, aiPlayer, humanPlayer) };
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const result = minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null; // Backtrack

      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) {
        break; // Alpha-beta pruning
      }
    }

    return { score: maxScore, bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = humanPlayer;
      const result = minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null; // Backtrack

      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) {
        break; // Alpha-beta pruning
      }
    }

    return { score: minScore, bestMove };
  }
}

/**
 * Finds if there is an immediate winning move or blocking move
 */
function findImmediateStrategicMove(board: BoardState, player: Player): number | null {
  const availableMoves = getAvailableMoves(board);
  for (const move of availableMoves) {
    board[move] = player;
    const isWin = checkWinner(board);
    board[move] = null;
    if (isWin) return move;
  }
  return null;
}

/**
 * Computes the optimal or difficulty-adjusted move for the AI
 */
export function getBestMove(
  board: BoardState,
  difficulty: AIDifficulty = "impossible",
  aiPlayer: Player = "O",
  humanPlayer: Player = "X"
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  // 1. Easy Mode: 75% random moves, 25% smart heuristic
  if (difficulty === "easy") {
    const shouldPlaySmart = Math.random() < 0.25;
    if (shouldPlaySmart) {
      const winningMove = findImmediateStrategicMove(board, aiPlayer);
      if (winningMove !== null) return winningMove;

      const blockingMove = findImmediateStrategicMove(board, humanPlayer);
      if (blockingMove !== null) return blockingMove;
    }
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // 2. Medium Mode: 60% optimal Minimax, 40% heuristic (take center, corners, or block)
  if (difficulty === "medium") {
    const useMinimax = Math.random() < 0.6;
    if (useMinimax) {
      const { bestMove } = minimax(board, 0, true, aiPlayer, humanPlayer);
      if (bestMove !== undefined) return bestMove;
    }

    // Heuristics:
    // a. Win if possible
    const winningMove = findImmediateStrategicMove(board, aiPlayer);
    if (winningMove !== null) return winningMove;

    // b. Block human win
    const blockingMove = findImmediateStrategicMove(board, humanPlayer);
    if (blockingMove !== null) return blockingMove;

    // c. Take Center if open
    if (board[4] === null) return 4;

    // d. Take random corner
    const corners = [0, 2, 6, 8].filter((idx) => board[idx] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Fallback to random
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // 3. Impossible / Unbeatable Mode: Pure Minimax with Alpha-Beta Pruning
  // First move optimization: if center is free on first move, taking center is fast & optimal
  if (availableMoves.length === 9) {
    // 50% center, 50% random corner
    const openers = [0, 2, 4, 6, 8];
    return openers[Math.floor(Math.random() * openers.length)];
  }

  const { bestMove } = minimax(board, 0, true, aiPlayer, humanPlayer);
  return bestMove !== undefined ? bestMove : availableMoves[0];
}
