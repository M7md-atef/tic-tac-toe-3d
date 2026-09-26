# 3D Tic-Tac-Toe

A responsive Tic-Tac-Toe game with local two-player play, an AI opponent with three difficulty levels, customizable themes, match history, and synthesized sound effects. The board's dimensional look and pointer tilt are made with CSS transforms and shadows; the project does not use a WebGL or 3D rendering engine.

## Technology Stack

- **Next.js 14** with the App Router for the application shell and build tooling.
- **React 18** for the interactive client-side interface and stateful components.
- **TypeScript** for game, settings, and statistics types.
- **Tailwind CSS 3** plus custom CSS for responsive styling, themes, animations, and the tactile board presentation.
- **Lucide React** for interface icons.
- **Web Audio API** for synthesized move, win, draw, and reset sounds.
- **canvas-confetti** for the win celebration.
- **Browser `localStorage`** for customization, scoreboard totals, and recent match history; there is no server-side game API or database.

## Architecture

The code follows a **feature-oriented, client-side architecture**. The App Router provides the application shell, feature folders keep related UI and logic together, and React hooks own the mutable state for each domain. Components render state and report user actions through callbacks; they do not implement the game rules themselves.

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

### State and Persistence Boundaries

- **Current match state** lives in `useTicTacToe`; it is in memory and is not restored after a page reload. Undo uses the sequence of board snapshots held in the hook.
- **Settings** live in `SettingsContext` and are stored under `tictactoe-3d-customization-v1`. The provider guards browser storage access and falls back to the defaults if stored data cannot be read.
- **Statistics and completed-match history** live in `useGameStats` and are stored separately under `tictactoe-3d-stats-v1` and `tictactoe-3d-history-v1`. These are browser-local and are not synced between devices.
- **Rules and AI calculations** are isolated in game utility modules and operate on the board model; they do not depend on React rendering or a server API.

There is no backend service or database. The interface is client-interactive, while Next.js supplies the route/build/runtime framework. The tactile depth and tilt are CSS-based presentation effects, not a separate 3D scene or physics layer.

## Game Rules and AI

The board is stored as nine cells (`X`, `O`, or empty). The win detector checks the eight possible three-in-a-row lines: three rows, three columns, and two diagonals. A full board with no winning line is a draw.

The computer plays as `O` against the human `X`:

- **Easy:** usually chooses a random empty cell. On 25% of turns it first looks for an immediate win or a move that blocks the human.
- **Medium:** uses Minimax on 60% of turns. Otherwise, it tries to win immediately, block an immediate human win, take the center, choose a corner, or fall back to a random empty cell.
- **Impossible:** searches future moves with Minimax and alpha-beta pruning. It scores terminal positions to prefer quicker wins and delay losses. On an empty board it randomly chooses among the center and four corners, which are optimal opening choices.

Minimax alternates between maximizing the AI's score and minimizing the human's score. Alpha-beta pruning skips branches that cannot change the choice, reducing unnecessary search. Since Tic-Tac-Toe has a small state space, this is fast enough to run in the browser.

## Run Locally

Use Node.js 18.17 or newer and npm:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To create and run a production build:

```bash
npm run build
npm start
```

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
