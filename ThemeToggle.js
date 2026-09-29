import { svgIcon } from "../utils/icons.js";
import { currentTheme } from "../utils/theme.js";
const SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
const MOON = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>';
export const ThemeToggle = () => `<button class="tt" id="tt" aria-label="Toggle light and dark mode" title="Toggle theme">${svgIcon(currentTheme() === "dark" ? SUN : MOON)}</button>`;
