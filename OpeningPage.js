import { DATA } from "../data/index.js";
import { Board } from "./Board.js";
import { CategoryBadge } from "./CategoryBadge.js";
const CHARACTER = {
  defensive: "Prioritises a solid structure and safety over early activity.",
  offensive: "Seeks the initiative, space and attacking chances early.",
  mixed: "Can shift between attacking and positional play depending on the middlegame."
};
export function OpeningPage(o){
  const list = DATA[o.side], i = list.indexOf(o);
  const prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
  const label = o.side === "white" ? "White" : "Black";
  return `<a class="crumb" href="#/${o.side}">← Back to ${label} openings</a>
<article class="detail">
<div class="boardwrap">${Board(o.fen, o.n)}</div>
<div><h2>${o.n}</h2>
<div class="facts">${CategoryBadge(o.c)}<span class="chip">ECO ${o.eco}</span><span class="chip">${label}</span></div>
<div class="block"><h4>Moves</h4><p class="mv">${o.m}</p></div>
<div class="block"><h4>The idea</h4><p>${o.d}</p></div>
<div class="block"><h4>Strategic focus</h4><p>${o.i}</p></div>
<div class="block"><h4>Typical plan</h4><p>${o.plan}</p></div>
<div class="block"><h4>Character</h4><p>${CHARACTER[o.c]}</p></div></div></article>
<div class="pager"><a href="#/opening/${prev.slug}">← ${prev.n}</a><a href="#/opening/${next.slug}">${next.n} →</a></div>`;
}
