import { OpeningCard } from "./OpeningCard.js";
export const OpeningGrid = list => `<div class="grid">${list.map(OpeningCard).join("")}</div>`;
