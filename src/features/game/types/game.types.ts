export type Player = "X" | "O";

export type CellValue = Player | null;

export type BoardState = CellValue[];

export type GameMode = "pve" | "pvp";

export type AIDifficulty = "easy" | "medium" | "impossible";

export type GameStatus = "idle" | "playing" | "won" | "draw";

export type WinDirection = "row-0" | "row-1" | "row-2" | "col-0" | "col-1" | "col-2" | "diag-main" | "diag-anti";

export interface WinningInfo {
  winner: Player;
  combination: [number, number, number];
  direction: WinDirection;
}

export interface MoveStep {
  index: number;
  player: Player;
  boardSnapshot: BoardState;
}

export interface MatchRecord {
  id: string;
  winner: Player | "draw";
  mode: GameMode;
  difficulty?: AIDifficulty;
  totalMoves: number;
  date: string;
  durationSeconds: number;
}

export interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  totalGames: number;
  currentStreak: number;
  bestStreak: number;
  streakHolder: Player | null;
}
