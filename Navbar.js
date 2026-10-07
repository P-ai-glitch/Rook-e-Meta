import { svgIcon } from "../utils/icons.js";
import { ThemeToggle } from "./ThemeToggle.js";
// Opening pages are intentionally NOT listed here; they are reached only via cards.
const ITEMS = [
  ["", "Home", svgIcon('<path d="m3 11 9-8 9 8M5 10v10h14V10"/>')],
  ["white", "White", "♔"],
  ["black", "Black", "♚"],
  ["openings", "Openings", svgIcon('<path d="M4 5h16M4 12h16M4 19h10"/>')],
  ["board", "Board", svgIcon('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v18"/>')],
  ["bots", "Bots", svgIcon('<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 14h.01M15 14h.01"/>')]
];
export const Navbar = route => `<nav class="nav" aria-label="Main"><a class="brand" href="#/">♜ Rook(e)Meta</a>${
  ITEMS.map(([r, l, i]) => `<a class="link" href="#/${r}" ${r === route ? 'aria-current="page"' : ""}>${i}<span>${l}</span></a>`).join("")}${ThemeToggle()}</nav>`;
