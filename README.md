# Rook(e)Meta

Minimalist chess opening reference. Vanilla JS + Vite.

## Run locally
Requires Node.js 18+.

    npm install
    npm run dev        # http://localhost:5173

Production build: `npm run build` (output in `dist/`), preview with `npm run preview`.

## Structure
- `src/data/openings.js` – opening data (add new openings here); `details.js` – extra page text
- `src/components/` – Navbar, ThemeToggle, SideSelection, OpeningCard, OpeningGrid, CategoryBadge, Board, OpeningPage
- Opening pages live at `#/opening/<slug>` and are reached only by clicking a card.
- Board images are generated as inline SVG from FEN strings, so there are no external assets.
