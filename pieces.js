// Piece art: original vector set. Swap any entry in P for an openly licensed set
// (e.g. Lichess "cburnett") without touching the rest of the code.
export const P = {
  p: '<circle cx="22.5" cy="13" r="5.5"/><path d="M14 36c0-9 5-11 8.5-15 3.5 4 8.5 6 8.5 15zM11 39h23v-3H11z"/>',
  r: '<path d="M11 39h23v-4H11zM13 35V18h19v17zM11 18v-8h4v3h4v-3h7v3h4v-3h4v8z"/>',
  n: '<path d="M12 36C12 31 14 28 18 25.5C15.5 26.500 13 28 11 28C9 28 7.800 26 8.300 23.800C9 21.500 12 17.500 15.500 12.500L17.500 5.500L21.500 8.500C30 9.500 36 20 33.500 36z"/><path d="M11 39h24v-3H11z"/><path d="M24.500 13.500c3.500 2.500 5 7.500 4.500 13M18.500 20.500c-.5 2.500-1 3.500-2.500 4.500" fill="none" stroke-width="1.2" stroke-linecap="round"/><circle cx="16.200" cy="17.500" r="1.500" fill="currentColor" stroke="none"/><circle cx="10.200" cy="24.300" r=".9" fill="currentColor" stroke="none"/>',
  b: '<circle cx="22.5" cy="8" r="2.8"/><path d="M22.5 11c7 5 9 11 6 17h-12c-3-6-1-12 6-17zM14 32h17l3 4H11zM11 39h23v-3H11z"/>',
  q: '<circle cx="8" cy="12" r="2.6"/><circle cx="15" cy="9" r="2.6"/><circle cx="22.5" cy="8" r="2.6"/><circle cx="30" cy="9" r="2.6"/><circle cx="37" cy="12" r="2.6"/><path d="M9 15l5 15h17l5-15-7 8-6-12-6 12zM12 30h21v5H12zM10 39h25v-4H10z"/>',
  k: '<path d="M21 3h3v3h3v3h-3v3h-3V9h-3V6h3z"/><path d="M12 33c-4-9 3-19 10.5-16 7.500-3 14.500 7 10.500 16zM10 39h25v-5H10z"/>'
};
// The art is drawn on a 45x45 grid but only occupies ~x 5-40, y 3-39. One shared, square viewBox cropped
// to that extent (king = tallest piece, queen = widest) makes every piece fill its square while keeping
// relative proportions intact. Changing it per piece would break those proportions.
const VB = "3.6 2.1 37.8 37.8";
export const svg = (t, c) => `<svg viewBox="${VB}"><g fill="${c === "w" ? "#f7f6f1" : "#2c2c2c"}" color="${c === "w" ? "#111" : "#f7f6f1"}" stroke="#111" stroke-width="1.6" stroke-linejoin="round">${P[t]}</g></svg>`;
