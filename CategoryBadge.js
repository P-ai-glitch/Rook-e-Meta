import { CATS } from "../data/index.js";
import { svgIcon } from "../utils/icons.js";
export const CategoryBadge = k => `<span class="badge" style="--c:${CATS[k].color}">${svgIcon(CATS[k].icon)}${CATS[k].label}</span>`;
