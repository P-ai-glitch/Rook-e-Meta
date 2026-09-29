import { Board } from "./Board.js";
import { CategoryBadge } from "./CategoryBadge.js";
export const OpeningCard = o => `<a class="card" href="#/opening/${o.slug}" aria-label="${o.n} – open opening page">
${Board(o.fen, o.n)}
<div class="body"><h3>${o.n}</h3>${CategoryBadge(o.c)}<p class="desc">${o.d}</p>
<div class="meta"><span><b>ECO</b> ${o.eco}</span><span class="mv">${o.m}</span><span class="idea"><b>Idea</b> ${o.i}</span></div></div></a>`;
