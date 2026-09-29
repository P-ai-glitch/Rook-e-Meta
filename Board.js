const G = { k:"♚", q:"♛", r:"♜", b:"♝", n:"♞", p:"♟" };
export function Board(fen, name){
  let sq = "", pcs = "";
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++)
    sq += `<rect x="${f*10}" y="${r*10}" width="10" height="10" fill="${(r+f)%2 ? "#7d7d7d" : "#c4c4c4"}"/>`;
  fen.split("/").forEach((row, r) => {
    let f = 0;
    for (const ch of row){
      if (/\d/.test(ch)) { f += +ch; continue; }
      const w = ch === ch.toUpperCase();
      pcs += `<text x="${f*10+5}" y="${r*10+8}" text-anchor="middle" font-size="9" font-family="'Segoe UI Symbol','DejaVu Sans',serif" fill="${w ? "#fff" : "#0a0a0a"}" stroke="${w ? "#0a0a0a" : "#fff"}" stroke-width=".35" paint-order="stroke">${G[ch.toLowerCase()]}\uFE0E</text>`;
      f++;
    }
  });
  return `<svg class="board" viewBox="0 0 80 80" role="img" aria-label="Board position for ${name}">${sq}${pcs}</svg>`;
}
