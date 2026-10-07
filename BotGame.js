import * as ChessLib from "chess.js";
// chess.js 0.10.x is UMD/CJS; resolve the constructor whichever way the bundler exposes it.
const Chess = ChessLib.Chess || (ChessLib.default && ChessLib.default.Chess) || ChessLib.default;
import { svg } from "../utils/pieces.js";
import { chooseMove } from "../utils/bots.js";
import { BotAvatar } from "./Bots.js";

// Play-vs-bot board (#/bots/<id>). Reuses the .bd-* board styles of the interactive board.
// State is kept at module level so a game in progress survives navigation and theme toggles.
const F = "abcdefgh";
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const S = { botId: null, pcs: [], uid: 0, game: null, started: false, over: false, result: "", side: "w", you: "w", flip: false,
  sel: null, last: [], promo: null, thinking: false, say: "", timer: 0 };
let bot = null, els = {}, sqEl = {};
const q = id => document.getElementById("bt-" + id);
const at = s => S.pcs.find(p => p.sq === s);
const pick = a => a[Math.floor(Math.random() * a.length)];
const youColor = () => (S.started ? S.you : S.side === "b" ? "b" : "w");   // before the game starts, "Random" previews as White

function setup() {
  S.pcs = [];
  START.split(" ")[0].split("/").forEach((row, i) => {
    let f = 0;
    for (const ch of row) {
      if (+ch) f += +ch;
      else { S.pcs.push({ id: ++S.uid, t: ch.toLowerCase(), c: ch === ch.toUpperCase() ? "w" : "b", sq: F[f] + (8 - i) }); f++; }
    }
  });
}

export const BotGame = b => `<section class="bd bt">
<h2>${b.name}</h2><p class="lead">ELO ${b.elo} · ${b.tagline}</p>
<div class="bd-wrap">
 <div class="bd-boardbox">
  <div class="bd-clock" id="bt-top"><span class="n"></span><span class="t"></span></div>
  <div class="bd-board"><div class="bd-sq" id="bt-sq"></div><div class="bd-pl" id="bt-pl"></div><div class="bd-promo" id="bt-promo"><div id="bt-pc"></div></div></div>
  <div class="bd-clock" id="bt-bot"><span class="n"></span><span class="t"></span></div>
 </div>
 <div class="bd-panel">
  <div id="bt-setup">
   <div class="bt-id">${BotAvatar("sm")}<div><b>${b.name}</b><span>ELO ${b.elo}</span></div></div>
   <ul class="bot-traits">${b.traits.map(t => `<li>${t}</li>`).join("")}</ul>
   <h3 class="bd-gap">Play as</h3><div class="bd-seg bd-seg3" id="bt-side"></div>
   <button id="bt-start" class="bt-main">Start game</button>
   <p class="bd-hint">Click one of your pieces, then the square to move it.</p>
  </div>
  <div id="bt-live" hidden>
   <h3>Game</h3><p id="bt-status"></p><p class="bd-hint" id="bt-det"></p>
   <p class="bt-say" id="bt-say"></p>
   <div class="bd-row"><button id="bt-flip">Flip board</button><button id="bt-resign">Resign</button></div>
   <button id="bt-new" class="bt-main">New game</button>
  </div>
 </div>
</div></section>`;

// ---- drawing ------------------------------------------------------------------------------------------
function pos(s) {
  const f = F.indexOf(s[0]), r = +s[1] - 1;
  return [(S.flip ? 7 - f : f) * 12.5, (S.flip ? r : 7 - r) * 12.5];
}
function mark(s, c) { const d = Object.values(sqEl).find(e => e.dataset.sq === s); if (d) d.classList.add(c); }

function render() {
  if (!q("sq")) return;
  const caps = new Set(), g = S.game;
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
  if (g && S.started) {
    if (g.in_check()) {
      const k = S.pcs.find(p => p.t === "k" && p.c === g.turn());
      if (k) mark(k.sq, "chk");
    }
    if (S.sel && !S.over) g.moves({ square: S.sel, verbose: true }).forEach(m => {
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
  bars();
}

// The bar above the board belongs to whoever sits at the top (flipping the board swaps them).
function bars() {
  const me = youColor(), turn = S.game && S.started && !S.over ? S.game.turn() : null;
  [["top", S.flip ? "w" : "b"], ["bot", S.flip ? "b" : "w"]].forEach(([where, c]) => {
    const e = q(where);
    if (!e) return;
    e.dataset.c = c;
    e.classList.toggle("run", turn === c);
    e.firstChild.textContent = c === me ? "You" : bot.name;
    e.lastChild.textContent = c === me ? "" : "ELO " + bot.elo;
  });
}

function status() {
  if (!q("status")) return;
  const g = S.game;
  let s = "Your move", d = "";
  if (S.over) s = S.result;
  else if (S.thinking) s = bot.name + " is thinking…";
  else if (g && g.in_check()) d = "Check";
  q("status").textContent = s;
  q("det").textContent = d;
}

function syncUI() {
  q("setup").hidden = S.started; q("live").hidden = !S.started;
  [...q("side").children].forEach(b => b.classList.toggle("on", b.dataset.v === S.side));
  q("say").textContent = S.say;
  q("say").hidden = !S.say;
  q("resign").disabled = S.over;
  status(); bars();
}

// ---- game flow ----------------------------------------------------------------------------------------
// Applies a move to the chess.js game and to the animated piece list (same bookkeeping as the main board).
function apply(m) {
  const mv = S.game.move({ from: m.from, to: m.to, promotion: m.promotion });
  if (!mv) return null;
  const mover = at(mv.from), cs = mv.flags.includes("e") ? mv.to[0] + mv.from[1] : mv.to;
  S.pcs = S.pcs.filter(p => p.sq !== cs || p === mover);
  mover.sq = mv.to;
  if (mv.promotion) mover.t = mv.promotion;
  if (mv.flags.includes("k")) at("h" + mv.from[1]).sq = "f" + mv.from[1];
  if (mv.flags.includes("q")) at("a" + mv.from[1]).sq = "d" + mv.from[1];
  S.last = [mv.from, mv.to]; S.sel = null;
  return mv;
}

// Sets S.over / S.result when the game has ended. Returns true if it has.
function checkEnd() {
  const g = S.game;
  if (!g.game_over()) return false;
  S.over = true;
  if (g.in_checkmate()) {
    const youWin = g.turn() !== S.you;                  // the side to move is the one that got mated
    S.result = youWin ? "Checkmate — you win!" : `Checkmate — ${bot.name} wins`;
    S.say = pick(youWin ? bot.quips.lost : bot.quips.won);
  } else {
    S.result = g.in_stalemate() ? "Draw — stalemate" : g.insufficient_material() ? "Draw — insufficient material"
      : g.in_threefold_repetition() ? "Draw — threefold repetition" : "Draw — fifty-move rule";
    S.say = pick(bot.quips.draw);
  }
  return true;
}

function botTurn() {
  clearTimeout(S.timer);
  S.thinking = true; status();
  S.timer = setTimeout(() => {
    S.timer = 0;
    if (!S.game || S.over || !S.started || S.game.turn() === S.you) { S.thinking = false; return; }
    const m = chooseMove(S.botId, S.game);
    if (!m) { S.thinking = false; checkEnd(); render(); syncUI(); return; }
    const mv = apply(m);
    S.thinking = false;
    if (!checkEnd()) {
      if (mv.san.includes("+")) S.say = pick(bot.quips.check);
      else if (mv.captured && Math.random() < 0.5) S.say = pick(bot.quips.capture);
      else S.say = "";
    }
    if (q("sq")) { render(); syncUI(); }                // the page may have been left while it was thinking
  }, 450 + Math.random() * 650);
}

function play(m) {
  apply(m);
  S.say = "";
  if (!checkEnd()) botTurn();
  render(); syncUI();
}

function click(s) {
  if (!S.started || S.over || S.thinking || S.promo || S.game.turn() !== S.you) return;
  if (S.sel) {
    const ms = S.game.moves({ square: S.sel, verbose: true }).filter(m => m.to === s);
    if (ms.length) return ms[0].promotion ? promote(ms[0]) : play(ms[0]);
  }
  const p = at(s);
  S.sel = p && p.c === S.you ? (S.sel === s ? null : s) : null;
  render();
}

function promote(m) {
  S.promo = { from: m.from, to: m.to };
  showPromo();
}
function showPromo() {
  const m = S.promo, box = q("pc");
  box.innerHTML = "";
  ["q", "r", "b", "n"].forEach(t => {
    const b = document.createElement("button");
    b.innerHTML = svg(t, S.you);
    b.setAttribute("aria-label", "Promote to " + { q: "queen", r: "rook", b: "bishop", n: "knight" }[t]);
    b.onclick = () => { q("promo").style.display = "none"; S.promo = null; play({ from: m.from, to: m.to, promotion: t }); };
    box.appendChild(b);
  });
  q("promo").style.display = "flex";
}

function start() {
  clearTimeout(S.timer);
  S.you = S.side === "r" ? (Math.random() < 0.5 ? "w" : "b") : S.side;
  S.flip = S.you === "b";
  S.game = new Chess(START);
  setup();
  Object.assign(S, { started: true, over: false, result: "", sel: null, last: [], promo: null, thinking: false, say: pick(bot.quips.start) });
  q("promo").style.display = "none";
  render(); syncUI();
  if (S.game.turn() !== S.you) botTurn();
}

function newGame() {
  clearTimeout(S.timer);
  setup();
  Object.assign(S, { game: null, started: false, over: false, result: "", sel: null, last: [], promo: null, thinking: false, say: "", timer: 0 });
  S.flip = S.side === "b";
  q("promo").style.display = "none";
  render(); syncUI();
}

function resign() {
  if (!S.started || S.over) return;
  clearTimeout(S.timer); S.timer = 0;
  Object.assign(S, { over: true, thinking: false, sel: null, promo: null, result: `You resigned — ${bot.name} wins`, say: pick(bot.quips.won) });
  q("promo").style.display = "none";
  render(); syncUI();
}

export function mountBotGame(b) {
  bot = b; els = {}; sqEl = {};
  if (S.botId !== b.id) { S.botId = b.id; clearTimeout(S.timer); S.timer = 0; S.game = null; S.started = false; S.over = false; S.thinking = false; S.say = ""; S.sel = null; S.last = []; S.promo = null; S.flip = S.side === "b"; setup(); }
  if (!S.pcs.length) setup();
  const sq = q("sq");
  for (let i = 0; i < 64; i++) {
    const d = document.createElement("div");
    d.className = "bd-s"; sq.appendChild(d); sqEl[i] = d;
    d.onclick = () => click(d.dataset.sq);
  }
  [["w", "White"], ["b", "Black"], ["r", "Random"]].forEach(([v, label]) => {
    const btn = document.createElement("button");
    btn.textContent = label; btn.dataset.v = v;
    btn.onclick = () => { S.side = v; S.flip = v === "b"; render(); syncUI(); };
    q("side").appendChild(btn);
  });
  q("start").onclick = start;
  q("new").onclick = newGame;
  q("resign").onclick = resign;
  q("flip").onclick = () => { S.flip = !S.flip; render(); };
  render(); syncUI();
  if (S.promo) showPromo();
  // Came back to a game whose bot move was still pending when the page was left
  if (S.started && !S.over && S.game.turn() !== S.you && !S.timer) botTurn();
}
