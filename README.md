# Rook(e)Meta

Minimalist chess opening reference. Vanilla JS + Vite.

## Run locally
Requires Node.js 18+.

    npm install
    npm run dev        # http://localhost:5173

Production build: `npm run build` (output in `dist/`), preview with `npm run preview`.

## Structure
- `src/data/openings.js` – opening data (add new openings here); `details.js` – extra page text
- `src/utils/` – theme, icons, clock; `src/components/` – Navbar, ThemeToggle, SideSelection, OpeningCard, OpeningGrid, CategoryBadge, Board, OpeningPage
- - `src/components/PlayBoard.js` – interactive board at `#/board`: free-form position setup, then Lock In to play legal moves (uses `chess.js`). Each opening card has a "Try" button linking to `#/board/<slug>`, which loads that opening's `fen` into Free Mode (side to move is derived from the move list); press Lock In to play.
  - Lock In enters a focus mode: the board zooms in (FLIP transform, so nothing jumps), the brightness flips (dark↔light; the board's greys stay as they are) and a "Switch to light/dark" button in the game panel flips it back. The change is temporary (not saved to localStorage) and is undone by "New setup". `setTheme(t, persist)` in `utils/theme.js` does the cross-fade.
  - Clock: before Lock In pick 1 / 5 / 10 min or None (no clock shown) and an increment (0–10 s). The side to move's clock starts at Lock In, each completed move charges the time used, adds the increment to the mover and starts the opponent's clock; a flag fall ends the game (draw if the opponent has no mating material). The clock is paused while the Board page isn't open. Timing logic lives in `utils/clock.js` (no DOM, unit-testable).
- Play Against Bots (`#/bots`, nav item "Bots"): `src/utils/bots.js` holds the bot list (`BOTS`) and each bot's move chooser; `components/Bots.js` is the selection page + bot avatar, `components/BotGame.js` the game board (`#/bots/<id>`), `components/BotPopup.js` the first-visit promo card (saved with `localStorage` key `rm-bots-promo`; clear it to see the popup again). To add a bot: add an entry to `BOTS` and a chooser to `CHOOSERS` in `utils/bots.js`.
  - **The Pawn** (ELO 100): scores each legal move on centre control, checks (without checking whether the piece can just be taken), captures and development, then picks with a lot of randomness. It only looks at whether its destination square is attacked about 1 move in 6, never reacts to threats against its own pieces, spots mate in one about half the time and plays a random legal move 1 time in 10.
- Opening pages live at `#/opening/<slug>` and are reached only by clicking a card.
- Board images are generated as inline SVG from FEN strings, so there are no external assets.
