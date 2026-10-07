import * as ChessLib from "chess.js";
// chess.js 0.10.x is UMD/CJS; resolve the constructor whichever way the bundler exposes it.
const Chess = ChessLib.Chess || (ChessLib.default && ChessLib.default.Chess) || ChessLib.default;
import { currentTheme, setTheme } from "../utils/theme.js";
import { themeIcon } from "./ThemeToggle.js";
import { Clock, fmt, flagOutcome, TIME_OPTIONS, INC_OPTIONS } from "../utils/clock.js";
import { svg } from "../utils/pieces.js";   // piece art lives in utils/pieces.js (shared with the bot board)

const F = "abcdefgh";
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
const SUB_FREE = "Free mode — set up any position, then lock it in to play.";

// State lives at module level so it survives page re-renders (e.g. theme toggle) and navigation.
const S = { pcs: [], uid: 0, mode: "free", tool: null, sel: null, flip: false, turn: "w", game: null, last: [], promo: null, msg: "", opening: null, focus: false, prevTheme: null, tc: { base: 0, inc: 0 } };   // tc = chosen time control (seconds); base 0 = no clock
const clock = new Clock();
let els = {}, sqEl = {};
const q = id => document.getElementById("bd-" + id);
const at = s => S.pcs.find(p => p.sq === s);

function setup(fen) {
  S.pcs = [];
  fen.split("/").forEach((row, i) => {
    let f = 0;
    for (const ch of row) {
      if (+ch) f += +ch;
      else { S.pcs.push({ id: ++S.uid, t: ch.toLowerCase(), c: ch === ch.toUpperCase() ? "w" : "b", sq: F[f] + (8 - i) }); f++; }
    }
  });
}
setup(START);

// Text under the heading; mentions the loaded opening until the position is edited.
const subText = () => S.mode === "game"
  ? (S.opening ? `Game on — ${S.opening.n}.` : "Game on.")
  : (S.opening ? `${S.opening.n} loaded (${S.opening.m}). Press Lock In to play from here.` : SUB_FREE);
const updateSub = () => { const e = q("sub"); if (e) e.textContent = subText(); };
// Any manual edit means the board no longer matches the loaded opening.
const dirty = () => { if (S.opening) { S.opening = null; updateSub(); } };

// Put the board into Free Mode with an opening's position on it. Nothing is locked in: the usual
// Lock In -> Game Mode flow is unchanged. The data stores piece placement only, so side to move is
// derived from the move count (odd number of plies -> Black to move).
export function loadOpening(o) {
  setup(o.fen);
  clock.reset();
  if (S.prevTheme) { setTheme(S.prevTheme, false); S.prevTheme = null; }
  const plies = o.m.replace(/\d+\./g, " ").trim().split(/\s+/).length;
  Object.assign(S, { mode: "free", game: null, tool: null, sel: null, last: [], promo: null, msg: "",
    turn: plies % 2 ? "b" : "w", flip: o.side === "black", opening: { n: o.n, m: o.m }, focus: false });
}

export const PlayBoard = () => `<section class="bd${S.focus ? " focus" : ""}${S.tc.base ? " timed" : ""}">
<h2>Board</h2><p class="lead" id="bd-sub">${subText()}</p>
<div class="bd-wrap">
 <div class="bd-boardbox"><div class="bd-clock" id="bd-ck-top" role="timer" hidden><span class="n"></span><span class="t"></span></div><div class="bd-board"><div class="bd-sq" id="bd-sq"></div><div class="bd-pl" id="bd-pl"></div><div class="bd-promo" id="bd-promo"><div id="bd-pc"></div></div></div><div class="bd-clock" id="bd-ck-bot" role="timer" hidden><span class="n"></span><span class="t"></span></div></div>
 <div class="bd-panel">
  <div id="bd-free">
   <h3>Place pieces</h3><div class="bd-pal" id="bd-pal"></div>
   <div class="bd-row"><button id="bd-erase">Eraser</button><button id="bd-flipF">Flip board</button></div>
   <div class="bd-row"><button id="bd-reset">Reset</button><button id="bd-clear">Clear board</button></div>
   <h3 class="bd-gap">Side to move</h3>
   <div class="bd-row"><button id="bd-tw">White</button><button id="bd-tb">Black</button></div>
   <h3 class="bd-gap">Clock</h3><div class="bd-seg bd-seg2" id="bd-tc"></div>
   <h3 class="bd-gap">Increment <span>added after each move</span></h3><div class="bd-seg bd-seg3" id="bd-inc"></div>
   <button id="bd-lock">Lock In</button><div id="bd-msg" role="alert"></div>
   <p class="bd-hint">Pick a piece, then click squares to place it. With nothing picked, click a piece then a square to move it. Right-click removes. Any position is allowed here.</p>
  </div>
  <div id="bd-game" hidden>
   <h3>Game</h3><p id="bd-status"></p><p class="bd-hint" id="bd-det"></p><p class="bd-hint" id="bd-tcinfo"></p>
   <div class="bd-row"><button id="bd-flipG">Flip board</button><button id="bd-edit">New setup</button></div>
   <button id="bd-bright" class="bd-bright"></button>
  </div>
 </div>
</div></section>`;

function pos(s) {
  const f = F.indexOf(s[0]), r = +s[1] - 1;
  return [(S.flip ? 7 - f : f) * 12.5, (S.flip ? r : 7 - r) * 12.5];
}
function mark(s, c) { const d = Object.values(sqEl).find(e => e.dataset.sq === s); if (d) d.classList.add(c); }

function render() {
  const caps = new Set();
  for (let i = 0; i < 64; i++) {
    const x = i % 8, y = i >> 3, f = S.flip ? 7 - x : x, r = S.flip ? y : 7 - y, s = F[f] + (r + 1), d = sqEl[i];
    d.dataset.sq = s;
    d.className = "bd-s " + ((f + r) % 2 ? "l" : "d");
    d.innerHTML = "";
    if (x === 0) d.innerHTML += `<span class="c r">${r + 1}</span>`;
    if (y === 7) d.innerHTML += `<span class="c f">${F[f]}</span>`;
    if (S.sel === s) d.classList.add("sel");
    if (S.last.includes(s)) d.classList.add("last");
  }
  if (S.mode === "game") {
    const g = S.game;
    if (g.in_check()) {
      const k = g.board().flat().find(p => p && p.type === "k" && p.color === g.turn());
      if (k) mark(k.square, "chk");
    }
    if (S.sel) g.moves({ square: S.sel, verbose: true }).forEach(m => {
      if (g.get(m.to)) caps.add(m.to);          // ring is drawn on the captured piece itself
      else mark(m.to, m.flags.includes("e") ? "cap" : "mv");
    });
  }
  const ids = new Set(S.pcs.map(p => p.id));
  for (const id in els) if (!ids.has(+id)) { const e = els[id]; delete els[id]; e.style.opacity = 0; setTimeout(() => e.remove(), 170); }
  S.pcs.forEach(p => {
    let e = els[p.id];
    if (!e) { e = els[p.id] = document.createElement("div"); e.className = "bd-p"; q("pl").appendChild(e); }
    if (e.dataset.k !== p.t + p.c) { e.innerHTML = svg(p.t, p.c); e.dataset.k = p.t + p.c; }
    e.classList.toggle("cap", caps.has(p.sq));
    const [x, y] = pos(p.sq);
    e.style.left = x + "%"; e.style.top = y + "%";
  });
  updateClockUI();
}

function click(s) {
  if (S.mode === "free") {
    if (S.tool === "x") { dirty(); S.pcs = S.pcs.filter(p => p.sq !== s); }
    else if (S.tool) { dirty(); S.pcs = S.pcs.filter(p => p.sq !== s); S.pcs.push({ id: ++S.uid, t: S.tool[1], c: S.tool[0], sq: s }); }
    else if (S.sel) { if (S.sel !== s) { dirty(); S.pcs = S.pcs.filter(p => p.sq !== s); at(S.sel).sq = s; } S.sel = null; }
    else if (at(s)) S.sel = s;
    return render();
  }
  if (S.promo || S.game.game_over() || clock.out) return;
  if (S.sel) {
    const ms = S.game.moves({ square: S.sel, verbose: true }).filter(m => m.to === s);
    if (ms.length) return ms[0].promotion ? promo(ms[0]) : play(ms[0]);
  }
  const p = at(s);
  S.sel = p && p.c === S.game.turn() ? (S.sel === s ? null : s) : null;
  render();
}

function showPromo() {
  const m = S.promo, c = S.game.turn(), box = q("pc");
  box.innerHTML = "";
  ["q", "r", "b", "n"].forEach(t => {
    const b = document.createElement("button");
    b.innerHTML = svg(t, c);
    b.setAttribute("aria-label", "Promote to " + { q: "queen", r: "rook", b: "bishop", n: "knight" }[t]);
    b.onclick = () => { q("promo").style.display = "none"; S.promo = null; play({ from: m.from, to: m.to, promotion: t }); };
    box.appendChild(b);
  });
  q("promo").style.display = "flex";
}
function promo(m) { S.promo = { from: m.from, to: m.to }; showPromo(); }

function play(m) {
  if (clock.check()) return timeUp();            // flag already fell, so this move doesn't count
  const side = S.game.turn();
  const mv = S.game.move({ from: m.from, to: m.to, promotion: m.promotion });
  if (!mv) return;
  const mover = at(mv.from), cs = mv.flags.includes("e") ? mv.to[0] + mv.from[1] : mv.to;
  S.pcs = S.pcs.filter(p => p.sq !== cs || p === mover);
  mover.sq = mv.to;
  if (mv.promotion) mover.t = mv.promotion;
  if (mv.flags.includes("k")) at("h" + mv.from[1]).sq = "f" + mv.from[1];
  if (mv.flags.includes("q")) at("a" + mv.from[1]).sq = "d" + mv.from[1];
  S.last = [mv.from, mv.to]; S.sel = null;
  clock.press(side, S.game.game_over());         // clock switches here; the mover gets the increment
  render(); status();
}

function status() {
  const g = S.game, t = g.turn() === "w" ? "White" : "Black";
  let s = t + " to move", d = "";
  if (clock.out) {
    const win = clock.out === "w" ? "b" : "w", types = c => g.board().flat().filter(x => x && x.color === c && x.type !== "k").map(x => x.type);
    s = flagOutcome(types(win), types(clock.out)) === "draw" ? "Draw — time out, insufficient material" : "Time out — " + (win === "w" ? "White" : "Black") + " wins";
  }
  else if (g.in_checkmate()) s = "Checkmate — " + (t === "White" ? "Black" : "White") + " wins";
  else if (g.in_stalemate()) s = "Draw — stalemate";
  else if (g.insufficient_material()) s = "Draw — insufficient material";
  else if (g.in_threefold_repetition()) s = "Draw — threefold repetition";
  else if (g.in_draw()) s = "Draw — fifty-move rule";
  else if (g.in_check()) d = "Check";
  q("status").textContent = s; q("det").textContent = d;
}

// ---- Focus mode (Lock In) -------------------------------------------------------------------------
// Entering focus changes the board's layout size (and position). To zoom smoothly without any jump we use
// FLIP: measure the board, apply the new layout, then animate a transform from the old box to the new one.
// The pieces are positioned in % inside the board, so they scale with it and never move relative to it.
const brightHTML = () => `${themeIcon()}<span>Switch to ${currentTheme() === "dark" ? "light" : "dark"}</span>`;
addEventListener("rm:theme", () => { const b = q("bright"); if (b) b.innerHTML = brightHTML(); });

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function flipBoard(mutate, reveal) {
  const box = document.querySelector(".bd-boardbox");
  if (!box) return mutate();
  const a = box.getBoundingClientRect();                 // includes any transform still running
  box.getAnimations().forEach(x => x.cancel());
  mutate();
  if (reveal) {                                           // make sure the zoomed board is on screen
    const nav = document.querySelector(".nav"), top = (nav ? nav.getBoundingClientRect().bottom : 0) + 8, r = box.getBoundingClientRect();
    if (r.top < top || r.bottom > innerHeight) scrollBy(0, r.top - top);
  }
  const b = box.getBoundingClientRect();
  if (reduceMotion() || !a.width || !b.width) return;
  box.animate(
    [{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width})` }, { transform: "none" }],
    { duration: 800, easing: "cubic-bezier(.4,0,.2,1)" });
}
let enterTimer;
function enterFocus() {
  const root = document.querySelector(".bd");
  S.prevTheme = currentTheme();
  flipBoard(() => { S.focus = true; root.classList.add("focus", "entering"); syncUI(); render(); }, true);
  setTheme(S.prevTheme === "dark" ? "light" : "dark", false);   // temporary: the saved preference is untouched
  clearTimeout(enterTimer); enterTimer = setTimeout(() => root.classList.remove("entering"), 1000);
}
function exitFocus() {
  const root = document.querySelector(".bd");
  flipBoard(() => {
    clock.reset(); S.mode = "free"; S.game = null; S.sel = null; S.last = []; S.promo = null; S.focus = false;
    q("promo").style.display = "none"; root.classList.remove("focus", "entering");
    syncUI(); render();
  });
  if (S.prevTheme) { setTheme(S.prevTheme, false); S.prevTheme = null; }   // back to the brightness they had before Lock In
}

// ---- Clock display ---------------------------------------------------------------------------------
// Two bars (above and below the board, reserved even before Lock In so the zoom never shifts the board).
// The bar on top belongs to whichever colour is at the top of the board, so flipping the board swaps them.
function updateClockUI() {
  const on = S.tc.base > 0, bd = document.querySelector(".bd");
  if (bd) bd.classList.toggle("timed", on);
  [["top", S.flip ? "w" : "b"], ["bot", S.flip ? "b" : "w"]].forEach(([where, c]) => {
    const e = q("ck-" + where);
    if (!e) return;
    e.hidden = !on;                                        // None selected: no clock at all
    if (!on) return;
    const live = S.mode === "game", ms = live ? clock.remaining(c) : S.tc.base * 1000;
    e.dataset.c = c;
    e.classList.toggle("run", clock.run === c);
    e.classList.toggle("low", live && ms < 10000);
    e.classList.toggle("out", clock.out === c);
    e.firstChild.textContent = c === "w" ? "White" : "Black";
    const t = fmt(ms); if (e.lastChild.textContent !== t) e.lastChild.textContent = t;
  });
}
let tick = 0;
const ensureTick = () => { if (!tick) tick = setInterval(onTick, 100); };
function onTick() {
  if (!q("sq")) clock.hold();                              // board page isn't on screen: freeze until it is back
  if (!clock.run) { clearInterval(tick); tick = 0; return; }
  if (clock.check()) return timeUp();
  updateClockUI();
}
function timeUp() {
  S.promo = null; S.sel = null;
  if (!q("sq")) return;
  q("promo").style.display = "none"; render(); status();
}

// Reflect module state into the freshly rendered DOM.
function syncUI() {
  const game = S.mode === "game";
  q("free").hidden = game; q("game").hidden = !game;
  updateSub();
  q("msg").textContent = S.msg;
  q("tw").classList.toggle("on", S.turn === "w"); q("tb").classList.toggle("on", S.turn === "b");
  [...q("pal").children].forEach(b => b.classList.toggle("on", b.dataset.t === S.tool));
  q("erase").classList.toggle("on", S.tool === "x");
  q("bright").innerHTML = brightHTML();
  [...q("tc").children].forEach(b => b.classList.toggle("on", +b.dataset.v === S.tc.base));
  [...q("inc").children].forEach(b => { b.classList.toggle("on", +b.dataset.v === S.tc.inc); b.disabled = !S.tc.base; });
  q("tcinfo").textContent = S.tc.base ? `Clock: ${S.tc.base / 60} min${S.tc.inc ? ` + ${S.tc.inc} s per move` : ""}` : "";
  updateClockUI();
  if (game) status();
  if (S.promo) showPromo();
}
function pickTool(t) { S.tool = t; S.sel = null; syncUI(); render(); }

function lockIn() {
  const err = m => (q("msg").textContent = S.msg = m), K = c => S.pcs.filter(p => p.t === "k" && p.c === c).length;
  if (K("w") !== 1 || K("b") !== 1) return err("To play, each side needs exactly one king.");
  if (S.pcs.some(p => p.t === "p" && /[18]/.test(p.sq[1]))) return err("Pawns can’t sit on the first or last rank.");
  let f = "";
  for (let r = 8; r >= 1; r--) {
    let e = 0;
    for (const c of F) { const p = at(c + r); if (p) { if (e) { f += e; e = 0; } f += p.c === "w" ? p.t.toUpperCase() : p.t; } else e++; }
    if (e) f += e;
    if (r > 1) f += "/";
  }
  const has = (s, t, c) => { const p = at(s); return p && p.t === t && p.c === c; };
  const cr = (has("e1", "k", "w") && has("h1", "r", "w") ? "K" : "") + (has("e1", "k", "w") && has("a1", "r", "w") ? "Q" : "") +
             (has("e8", "k", "b") && has("h8", "r", "b") ? "k" : "") + (has("e8", "k", "b") && has("a8", "r", "b") ? "q" : "");
  const g = new Chess();
  if (!g.load(`${f} ${S.turn} ${cr || "-"} - 0 1`)) return err("That position isn’t valid for play.");
  const o = new Chess();
  o.load(`${f} ${S.turn === "w" ? "b" : "w"} - - 0 1`);
  if (o.in_check()) return err("The side not to move can’t be in check.");
  S.game = g; S.mode = "game"; S.tool = null; S.sel = null; S.last = []; S.msg = "";
  clock.start(S.turn, S.tc.base, S.tc.inc);       // no-op when "None" is selected
  if (clock.run) ensureTick();
  enterFocus();
}

export function mountPlayBoard() {
  els = {}; sqEl = {};
  const sq = q("sq");
  for (let i = 0; i < 64; i++) {
    const d = document.createElement("div");
    d.className = "bd-s"; sq.appendChild(d); sqEl[i] = d;
    d.onclick = () => click(d.dataset.sq);
    d.oncontextmenu = e => { e.preventDefault(); if (S.mode === "free") { dirty(); S.pcs = S.pcs.filter(p => p.sq !== d.dataset.sq); S.sel = null; render(); } };
  }
  const pal = q("pal");
  ["w", "b"].forEach(c => "kqrbnp".split("").forEach(t => {
    const b = document.createElement("button");
    b.innerHTML = svg(t, c); b.dataset.t = c + t;
    b.setAttribute("aria-label", (c === "w" ? "White " : "Black ") + { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" }[t]);
    b.onclick = () => pickTool(S.tool === c + t ? null : c + t);
    pal.appendChild(b);
  }));
  TIME_OPTIONS.forEach(([label, sec]) => {
    const b = document.createElement("button");
    b.textContent = label; b.dataset.v = sec; b.onclick = () => { S.tc.base = sec; syncUI(); };
    q("tc").appendChild(b);
  });
  INC_OPTIONS.forEach(sec => {
    const b = document.createElement("button");
    b.textContent = sec + " s"; b.dataset.v = sec; b.onclick = () => { S.tc.inc = sec; syncUI(); };
    q("inc").appendChild(b);
  });
  clock.release(); if (clock.run) ensureTick();            // coming back to a game in progress
  q("erase").onclick = () => pickTool(S.tool === "x" ? null : "x");
  q("reset").onclick = () => { dirty(); setup(START); S.sel = null; S.msg = ""; q("msg").textContent = ""; render(); };
  q("clear").onclick = () => { dirty(); S.pcs = []; S.sel = null; S.msg = ""; q("msg").textContent = ""; render(); };
  q("flipF").onclick = q("flipG").onclick = () => { S.flip = !S.flip; render(); };
  q("tw").onclick = () => { dirty(); S.turn = "w"; syncUI(); };
  q("tb").onclick = () => { dirty(); S.turn = "b"; syncUI(); };
  q("lock").onclick = lockIn;
  q("edit").onclick = exitFocus;
  q("bright").onclick = () => setTheme(currentTheme() === "dark" ? "light" : "dark", false);
  syncUI(); render();
}
