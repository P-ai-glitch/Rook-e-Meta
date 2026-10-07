// Playable bots. Add a new bot by adding an entry to BOTS and a chooser to CHOOSERS (same id).
// Engines work on a chess.js game object and never touch the DOM, so they can be tested on their own.
// `rnd` is injectable (defaults to Math.random) so tests can make the "randomness" repeatable.

export const BOTS = [
  {
    id: "pawn",
    name: "The Pawn",
    elo: 100,
    tagline: "Loves the centre. Forgets everything else.",
    blurb: "A very first opponent. It grabs the centre, loves giving checks, and rarely looks at what you are threatening.",
    traits: ["Fights hard for the centre", "Gives checks (even silly ones)", "Poor at defending its pieces"],
    // Little lines it "says" during a game (shown under the board). Keyed by what just happened.
    quips: {
      start: ["Let's fight for the centre!", "e4 or d4. Or maybe d4 or e4."],
      check: ["Check! ...is that good?", "Check! I think that's good.", "Boop. Check."],
      capture: ["Mine now!", "I took something!", "Nom."],
      lost: ["Oh. My king. Good game!", "Wow, you're good. I'll practise."],
      won: ["I won?! I won!", "Checkmate... I think?"],
      draw: ["A draw. I'll take it."]
    }
  }
];
export const findBot = id => BOTS.find(b => b.id === id);

// ---- The Pawn (about 100 ELO) --------------------------------------------------------------------------
// A move is scored by a few simple beginner ideas and then picked with a lot of randomness:
//  + centre: loves landing on / pushing pawns to d4 e4 d5 e5, and likes the squares around them
//  + loves checks. It does NOT look at whether the checking piece can just be captured.
//  + loves captures, but misses about a quarter of the ones on offer and never counts what it loses back
//  + develops knights/bishops, castles now and then, drags the queen out early
//  - only occasionally (1 move in 6) looks at whether the square it moves to is attacked
//  - never reacts to threats against its own pieces. It does not defend.
//  - notices a mate in one only about half the time; 1 move in 10 is just a random legal move.
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const CENTER = new Set(["d4", "e4", "d5", "e5"]);
const FILES = "abcdefgh";

// 0.5 on the four centre squares up to 3.5 in the corners
function fromCentre(sq) {
  const f = FILES.indexOf(sq[0]), r = +sq[1] - 1;
  return Math.max(Math.abs(f - 3.5), Math.abs(r - 3.5));
}

function scoreMove(g, m, ctx) {
  const { rnd, ply, careful, seesCapture, seesMate } = ctx;
  let s = rnd() * 2;                                    // wobble: it is never sure what it wants
  s += (3 - fromCentre(m.to)) * 0.6;                    // closer to the middle is better
  if (CENTER.has(m.to)) s += m.piece === "p" ? 3.4 : 2.2;
  else if (m.piece === "p" && "cdef".includes(m.to[0])) s += 0.6;   // central pawns over wing pawns

  if (m.captured && seesCapture) s += VAL[m.captured] * 1.1 + 0.8;
  if (m.san.includes("+")) s += m.piece === "q" ? 4.8 : 3.8;          // checks!! (never checks if it is safe)
  if (m.san.includes("#") && seesMate) s += 100;

  const homeRank = m.color === "w" ? "1" : "8";
  if ((m.piece === "n" || m.piece === "b") && m.from[1] === homeRank) s += 1.2;   // develop
  if (m.piece === "q" && ply < 12) s += 1.4;                                      // early queen sortie
  if (m.piece === "r" && ply < 16) s -= 1.2;
  if (m.piece === "k" && !m.flags.includes("k") && !m.flags.includes("q")) s -= 2;
  if (m.flags.includes("k") || m.flags.includes("q")) s += 1.5;                  // castling is nice
  if (m.promotion) s += m.promotion === "q" ? 6 : 0.5;

  if (careful) {                                       // the rare moment it looks before it leaps
    g.move({ from: m.from, to: m.to, promotion: m.promotion });
    const attacked = g.moves({ verbose: true }).some(o => o.to === m.to && o.captured);
    g.undo();
    if (attacked) s -= VAL[m.piece] * 1.2 + 1;
  }
  return s;
}

function pawnMove(g, rnd = Math.random) {
  const moves = g.moves({ verbose: true });
  if (!moves.length) return null;
  const pick = m => ({ from: m.from, to: m.to, promotion: m.promotion });
  if (rnd() < 0.1) return pick(moves[Math.floor(rnd() * moves.length)]);   // pure random move

  const ctx = { rnd, ply: g.history().length, careful: rnd() < 1 / 6, seesCapture: rnd() < 0.75, seesMate: rnd() < 0.5 };
  const scored = moves.map(m => ({ m, s: scoreMove(g, m, ctx) }));
  const top = Math.max(...scored.map(x => x.s));
  // soft-max: the best looking move is favoured, but others stay in the running
  let total = 0;
  scored.forEach(x => { x.w = Math.exp((x.s - top) / 1.1); total += x.w; });
  let r = rnd() * total;
  for (const x of scored) { r -= x.w; if (r <= 0) return pick(x.m); }
  return pick(scored[scored.length - 1].m);
}

const CHOOSERS = { pawn: pawnMove };

// Returns { from, to, promotion? } for the side to move, or null when there is no legal move.
export const chooseMove = (botId, g, rnd) => CHOOSERS[botId](g, rnd);
