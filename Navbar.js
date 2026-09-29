import { svgIcon } from "../utils/icons.js";
import { ThemeToggle } from "./ThemeToggle.js";
// Opening pages are intentionally NOT listed here; they are reached only via cards.
const ITEMS = [
  ["", "Home", svgIcon('<path d="m3 11 9-8 9 8M5 10v10h14V10"/>')],
  ["white", "White", "♔"],
  ["black", "Black", "♚"],
  ["openings", "Openings", svgIcon('<path d="M4 5h16M4 12h16M4 19h10"/>')]
];
export const Navbar = route => `<nav class="nav" aria-label="Main"><a class="brand" href="#/">♜ Rook(e)Meta</a>${
  ITEMS.map(([r, l, i]) => `<a class="link" href="#/${r}" ${r === route ? 'aria-current="page"' : ""}>${i}<span>${l}</span></a>`).join("")}${ThemeToggle()}</nav>`;
