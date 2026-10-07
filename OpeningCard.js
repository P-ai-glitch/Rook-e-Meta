import { Board } from "./Board.js";
import { CategoryBadge } from "./CategoryBadge.js";
import { svgIcon } from "../utils/icons.js";
// The whole card links to the opening page via a stretched .cardlink; the Try button is a separate
// link layered above it (interactive elements can't be nested inside one <a>).
export const OpeningCard = o => `<div class="card"><a class="cardlink" href="#/opening/${o.slug}" aria-label="${o.n} – open opening page"></a>
${Board(o.fen, o.n)}
<div class="body"><h3>${o.n}</h3>${CategoryBadge(o.c)}<p class="desc">${o.d}</p>
<div class="meta"><span><b>ECO</b> ${o.eco}</span><span class="mv">${o.m}</span><span class="idea"><b>Idea</b> ${o.i}</span></div>
<a class="try" href="#/board/${o.slug}" aria-label="Try ${o.n} on the interactive board">${svgIcon('<path d="m7 4 13 8-13 8z"/>')}<span>Try ${o.n}</span></a></div></div>`;
