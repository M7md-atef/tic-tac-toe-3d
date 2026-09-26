# 🎮 3D Tic-Tac-Toe Pro — Tactile Arcade Game with Minimax AI

[![Next.js](https://img.shields.io/badge/Next.js-14.2.25-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-149eca?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

> A browser-based Tic-Tac-Toe game featuring local two-player matches, three AI difficulty levels, a customizable arcade-console look, and persistent local scorekeeping. Its dimensional presentation is built with CSS, not a WebGL engine.

---

## 📑 Table of Contents

- [Core Concept](#core-concept)
- [Key Features](#key-features)
- [Technology Stack & Architecture](#technology-stack--architecture)
- [Architecture Details](#architecture-details)
- [Local Data & Privacy](#local-data--privacy)
- [Visual Design & Interaction](#visual-design--interaction)
- [AI and Game Logic](#ai-and-game-logic)
- [Getting Started](#getting-started)
- [Available NPM Scripts](#available-npm-scripts)
- [Project Directory Structure](#project-directory-structure)

---

## Core Concept

This project brings the familiar three-in-a-row game into a tactile, customizable arcade-style interface. Play against another person on the same device or challenge a computer opponent, then review scores and recent match results. The game runs entirely in the browser and does not require an account or a backend service.

## Key Features

- **Two ways to play:** Local player-versus-player or player-versus-computer mode.
- **Three AI difficulty levels:** Casual random play, a mixed strategy, and full Minimax search with alpha-beta pruning.
- **Customizable console:** Five visual themes, separate X/O token colors, adjustable sound, and optional pointer-driven board tilt.
- **Match controls:** Start a new round, undo moves, see the active turn, and highlight a winning line.
- **Scoreboard and match log:** Track wins, draws, streaks, move counts, duration, and up to 30 recent match results.
- **Tactile feedback:** Synthesized Web Audio effects, animated tokens, and a confetti celebration on a win.
- **Keyboard shortcuts:** `R` starts a new round, `U` undoes a move, `S` opens settings, and `M` toggles sound.
- **Responsive interface:** Board and controls adapt to smaller screens.

## Technology Stack & Architecture

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14.2](https://nextjs.org/) App Router | Application route, layout, and production build tooling |
| **UI** | [React 18](https://react.dev/) | Client-side interactive components and state |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Types for game state, settings, and match records |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) and CSS | Responsive layout, themes, transitions, and tactile visual effects |
| **Icons** | [Lucide React](https://lucide.dev/) | Interface icon set |
| **Class utilities** | `clsx` and `tailwind-merge` | Conditional class names and conflict-aware Tailwind class merging |
| **Feedback** | Web Audio API and `canvas-confetti` | Synthesized sound effects and win celebration |
| **Persistence** | Browser `localStorage` | Customization, scoreboard totals, and recent match records |

The code follows a **feature-oriented, client-side architecture**. The App Router provides the application shell, feature folders keep related UI and logic together, and React hooks own mutable state for each domain. Components render state and report user actions through callbacks; the game rules and AI calculations are kept in utility modules.

### Architecture Details

### Application Composition

`src/app/layout.tsx` is the root shell. It sets document metadata and wraps the route in `SettingsProvider`, making the active settings and theme available to descendants. `src/app/page.tsx` is the composition root for the game screen: it creates the game and statistics hooks, reads customization settings, and passes state and callbacks into the header, board, turn indicator, scoreboard, and history/settings dialogs. It also handles global keyboard shortcuts.

### Feature Ownership

- **Game domain (`src/features/game/`)**: `useTicTacToe.ts` owns the current board, player, mode, difficulty, status, winning result, AI-thinking flag, and move snapshots. It coordinates legal moves, turns, undo/reset, sounds, AI scheduling, and completion callbacks. `types/game.types.ts` defines the shared domain types. `utils/winDetection.ts` contains the winning combinations and board terminal checks; `utils/minimax.ts` selects computer moves. UI components under `components/` render the board and game status. `useBoardTilt.ts` handles pointer-driven presentation state separately from game state.
- **Customization (`src/features/customization/`)**: `SettingsContext.tsx` exposes settings, the resolved theme, update/reset actions, and settings-dialog state through React context. It hydrates preferences after mount and persists updates to `localStorage`. `SettingsModal.tsx` is the settings interface; `theme.types.ts` describes settings and theme data.
- **Scoreboard (`src/features/scoreboard/`)**: `useGameStats.ts` owns aggregate results and recent match records. It loads and writes them to `localStorage`, updates streaks when games finish, and limits the saved match list to 30 records. `Scoreboard.tsx` renders the aggregate values.
- **Shared UI and utilities**: `src/components/` contains application-wide layout, modal, and feedback pieces. `src/constants/themes.ts` defines theme/color presets. `src/utils/sound.ts` encapsulates synthesized Web Audio effects, and `src/utils/cn.ts` combines conditional CSS classes.

### Move and Result Flow

1. A board cell invokes the `onCellClick` callback supplied by the page. The game hook rejects occupied cells and input when a game is over or the AI is thinking.
2. The hook places the active player's mark, appends a board snapshot to move history, and checks for a win or a full-board draw using `winDetection.ts`.
3. If the game is still active, the hook switches turns. In player-versus-computer mode, it marks the AI as thinking and schedules its move after a short delay. `getBestMove` in `minimax.ts` chooses an empty cell according to the selected difficulty.
4. The AI move passes through the same win/draw checks. On completion, the game hook calls the page's `onWin` or `onDraw` callback, which is connected to `useGameStats` and records the result.
5. React state changes flow back down as props, updating the board, turn indicator, scoreboard, and history dialog. The board uses `WinningInfo` to highlight the three winning cells and draw the line overlay.

## Local Data & Privacy

- **Current match state** lives in `useTicTacToe`; it is in memory and is not restored after a page reload. Undo uses the sequence of board snapshots held in the hook.
- **Settings** live in `SettingsContext` and are stored under `tictactoe-3d-customization-v1`. The provider guards browser storage access and falls back to the defaults if stored data cannot be read.
- **Statistics and completed-match history** live in `useGameStats` and are stored separately under `tictactoe-3d-stats-v1` and `tictactoe-3d-history-v1`. These are browser-local and are not synced between devices.
- **Rules and AI calculations** are isolated in game utility modules and operate on the board model; they do not depend on React rendering or a server API.

There is no backend service or database. The interface is client-interactive, while Next.js supplies the route, layout, and build framework.

## Visual Design & Interaction

- **Five built-in themes:** Playdate Console, Bubblegum Arcade, Classic Handheld, Terracotta Studio, and Midnight Mech.
- **Token customization:** Choose separate colors for X and O from the available color presets.
- **CSS-based depth:** Layered shadows, pressed states, perspective, and transitions create the toy-console appearance; no WebGL engine or 3D scene is used.
- **Pointer tilt:** The board follows pointer movement with a restrained CSS rotation; this effect can be disabled in settings.
- **Sound synthesis:** Web Audio oscillators generate move, win, draw, and reset cues without bundled audio files.

## AI and Game Logic

The board is stored as nine cells (`X`, `O`, or empty). The win detector checks the eight possible three-in-a-row lines: three rows, three columns, and two diagonals. A full board with no winning line is a draw.

The computer plays as `O` against the human `X`:

- **Easy:** usually chooses a random empty cell. On 25% of turns it first looks for an immediate win or a move that blocks the human.
- **Medium:** uses Minimax on 60% of turns. Otherwise, it tries to win immediately, block an immediate human win, take the center, choose a corner, or fall back to a random empty cell.
- **Impossible:** searches future moves with Minimax and alpha-beta pruning. It scores terminal positions to prefer quicker wins and delay losses. On an empty board it randomly chooses among the center and four corners, which are optimal opening choices.

Minimax alternates between maximizing the AI's score and minimizing the human's score. Alpha-beta pruning skips branches that cannot change the choice, reducing unnecessary search. Since Tic-Tac-Toe has a small state space, this is fast enough to run in the browser.

## Getting Started

### Prerequisites

- **Node.js:** 18.17 or newer.
- **Package manager:** npm (included with Node.js).

Check installed versions:

```bash
node --version
npm --version
```

### Installation

Install project dependencies from the repository root:

```bash
npm install
```

### Development Server

Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development server refreshes the app as source files change.

### Production Build

Build the optimized app, then launch it locally:

```bash
npm run build
npm start
```

## Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Creates the production build. |
| `npm run start` | Serves the production build. Run `npm run build` first. |
| `npm run lint` | Runs the Next.js ESLint checks. |

## Project Structure

```text
tic-tac-toe-3d/
├── public/                                      # Static assets served from the site root
│   ├── file.svg                                 # Default Next.js file illustration
│   ├── globe.svg                                # Default Next.js globe illustration
│   ├── next.svg                                 # Next.js logo asset
│   ├── vercel.svg                               # Vercel logo asset
│   └── window.svg                               # Default Next.js window illustration
├── src/
│   ├── app/
│   │   ├── favicon.ico                          # Browser tab icon
│   │   ├── globals.css                          # Global styles, animation, and Tailwind layers
│   │   ├── layout.tsx                           # Root layout, metadata, and settings provider
│   │   └── page.tsx                             # Main game screen and feature composition
│   ├── components/
│   │   ├── feedback/
│   │   │   └── Confetti.tsx                     # Win celebration effect
│   │   ├── layout/
│   │   │   ├── Footer.tsx                       # Footer and keyboard shortcut hints
│   │   │   └── Header.tsx                       # Game mode, difficulty, and action controls
│   │   └── ui/
│   │       ├── Button.tsx                       # Shared button component
│   │       └── Modal.tsx                        # Shared modal dialog
│   ├── constants/
│   │   └── themes.ts                            # Theme presets and default customization
│   ├── features/
│   │   ├── customization/
│   │   │   ├── components/
│   │   │   │   └── SettingsModal.tsx            # Theme, token, sound, and tilt controls
│   │   │   ├── context/
│   │   │   │   └── SettingsContext.tsx          # Settings state and localStorage persistence
│   │   │   └── types/
│   │   │       └── theme.types.ts               # Theme and customization types
│   │   ├── game/
│   │   │   ├── components/
│   │   │   │   ├── Board.tsx                    # Board composition and win effects
│   │   │   │   ├── HistoryDrawer.tsx            # Recent match history dialog
│   │   │   │   ├── Square.tsx                   # Interactive board cell and token rendering
│   │   │   │   ├── TurnIndicator.tsx            # Turn, winner, and draw status
│   │   │   │   └── WinningLine.tsx              # Winning combination overlay
│   │   │   ├── hooks/
│   │   │   │   ├── useBoardTilt.ts              # Pointer-driven CSS board tilt
│   │   │   │   └── useTicTacToe.ts              # Match state, turns, undo, and AI scheduling
│   │   │   ├── types/
│   │   │   │   └── game.types.ts                # Board, player, match, and result types
│   │   │   └── utils/
│   │   │       ├── minimax.ts                   # AI strategy and Minimax search
│   │   │       └── winDetection.ts              # Winning lines and draw detection
│   │   └── scoreboard/
│   │       ├── components/
│   │       │   └── Scoreboard.tsx               # Match statistics display
│   │       └── hooks/
│   │           └── useGameStats.ts              # Persistent statistics and match history
│   └── utils/
│       ├── cn.ts                                # Conditional class-name helper
│       └── sound.ts                             # Web Audio sound effects
├── .eslintrc.json                               # ESLint configuration
├── .gitignore                                   # Git ignore rules
├── next-env.d.ts                                # Next.js TypeScript declarations
├── next.config.mjs                              # Next.js configuration
├── package.json                                 # Scripts and dependency manifest
├── package-lock.json                            # Locked npm dependency versions
├── postcss.config.mjs                           # PostCSS configuration
├── tailwind.config.ts                           # Tailwind theme and content configuration
├── tsconfig.json                                # TypeScript compiler configuration
└── README.md                                    # Project documentation

---

<div align="center">
  <sub>Developed with ❤️ for seamless, empowering financial technology across borders.</sub>
</div>