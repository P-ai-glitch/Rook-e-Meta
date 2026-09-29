import { OPENINGS, CATS } from "./openings.js";
import { DETAILS } from "./details.js";
export { CATS };
export const slugify = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const build = side => OPENINGS[side].map(o => { const slug = slugify(o.n); return { ...o, slug, side, plan: DETAILS[slug] || o.i }; });
export const DATA = { white: build("white"), black: build("black") };
export const ALL = [...DATA.white, ...DATA.black];
export const findOpening = slug => ALL.find(o => o.slug === slug);
