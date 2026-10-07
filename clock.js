// Chess clock: timing logic only, no DOM (so it can be tested on its own). Times are in milliseconds.
export const TIME_OPTIONS = [["1 min", 60], ["5 min", 300], ["10 min", 600], ["None", 0]];   // [label, seconds]; 0 = no clock
export const INC_OPTIONS = [0, 1, 2, 3, 5, 10];                                              // seconds added after each move

const other = c => (c === "w" ? "b" : "w");

export class Clock {
  // `now` is injectable so tests can fake the passage of time.
  constructor(now = () => performance.now()) { this.now = now; this.reset(); }

  reset() { this.base = 0; this.inc = 0; this.left = { w: 0, b: 0 }; this.run = null; this.t0 = 0; this.out = null; this.held = null; }
  get enabled() { return this.base > 0; }

  // Both sides get the full time; the side to move starts burning it straight away (like a clock started by the arbiter).
  start(side, baseSec, incSec) {
    this.reset();
    if (!(baseSec > 0)) return;
    this.base = baseSec; this.inc = incSec || 0;
    this.left = { w: baseSec * 1000, b: baseSec * 1000 };
    this.run = side; this.t0 = this.now();
  }

  remaining(side) { return Math.max(0, this.left[side] - (this.run === side ? this.now() - this.t0 : 0)); }

  // Returns the side whose flag fell (and stops the clock), otherwise null. Call it before accepting a move.
  check() {
    if (this.run && this.remaining(this.run) <= 0) { this.out = this.run; this.left[this.out] = 0; this.run = null; }
    return this.out;
  }

  // `side` has just completed a move: charge the time it used, add the increment, then start the opponent's clock.
  // If that move ended the game (`over`), the clock just stops.
  press(side, over = false) {
    if (this.run !== side) return;
    const t = this.now();
    this.left[side] = Math.max(0, this.left[side] - (t - this.t0)) + this.inc * 1000;
    this.run = over ? null : other(side); this.t0 = t;
  }

  // Freeze / unfreeze (used while the board page is not on screen, so a game can't time out unseen).
  hold() { if (this.run) { this.left[this.run] = this.remaining(this.run); this.held = this.run; this.run = null; } }
  release() { if (this.held) { this.run = this.held; this.held = null; this.t0 = this.now(); } }
}

// 9:59 -> "9:59", under ten seconds -> "0:09.4", an hour or more -> "1:02:03". Rounds up, so "0:00.0" means the flag has fallen.
export function fmt(ms) {
  const t = Math.max(0, ms);
  if (t < 10000) { const d = Math.ceil(t / 100); return d >= 100 ? "0:10" : `0:0${Math.floor(d / 10)}.${d % 10}`; }
  const s = Math.ceil(t / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

// Result when a side runs out of time. Arguments are the piece types (no kings) each side still has.
// Losing on time becomes a draw if the opponent could never deliver mate: bare king, or a lone minor piece against a bare king.
export function flagOutcome(winnerTypes, loserTypes) {
  if (!winnerTypes.length) return "draw";
  if (winnerTypes.length === 1 && "nb".includes(winnerTypes[0]) && !loserTypes.length) return "draw";
  return "win";
}
