import { BoardState, WinDirection, WinningInfo } from "../types/game.types";

export const WINNING_COMBINATIONS: Array<{
  combo: [number, number, number];
  direction: WinDirection;
}> = [
  // Rows
  { combo: [0, 1, 2], direction: "row-0" },
  { combo: [3, 4, 5], direction: "row-1" },
  { combo: [6, 7, 8], direction: "row-2" },
  // Columns
  { combo: [0, 3, 6], direction: "col-0" },
  { combo: [1, 4, 7], direction: "col-1" },
  { combo: [2, 5, 8], direction: "col-2" },
  // Diagonals
  { combo: [0, 4, 8], direction: "diag-main" },
  { combo: [2, 4, 6], direction: "diag-anti" },
];

/**
 * Checks the board for a win condition
 * Returns WinningInfo if a player has connected 3 in a row
 */
export function checkWinner(board: BoardState): WinningInfo | null {
  for (const item of WINNING_COMBINATIONS) {
    const [a, b, c] = item.combo;
    const valA = board[a];
    if (valA && valA === board[b] && valA === board[c]) {
      return {
        winner: valA,
        combination: item.combo,
        direction: item.direction,
      };
    }
  }
  return null;
}

/**
 * Checks if the board is completely filled without a winner
 */
export function isBoardFull(board: BoardState): boolean {
  return board.every((cell) => cell !== null);
}
