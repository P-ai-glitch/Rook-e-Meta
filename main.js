import "./styles.css";
import { DATA, findOpening } from "./data/index.js";
import { initTheme, toggleTheme } from "./utils/theme.js";
import { Navbar } from "./components/Navbar.js";
import { SideSelection } from "./components/SideSelection.js";
import { OpeningGrid } from "./components/OpeningGrid.js";
import { OpeningPage } from "./components/OpeningPage.js";

const Section = (t, lead, list) => `<section><h2>${t}</h2><p class="lead">${lead}</p>${OpeningGrid(list)}</section>`;

function render(){
  const [r = "", arg] = location.hash.replace(/^#\/?/, "").split("/");
  let route = r, title = "Rook(e)Meta", page;
  if (r === "opening" && findOpening(arg)) {
    const o = findOpening(arg); page = OpeningPage(o); route = "opening"; title = o.n + " · Rook(e)Meta";
  } else if (r === "white") page = Section("Play as White", "Ten openings to seize the initiative from move one.", DATA.white);
  else if (r === "black") page = Section("Play as Black", "Ten defences and counter-systems for the second player.", DATA.black);
  else if (r === "openings") page = Section("Openings for White", "Ten reference openings.", DATA.white) + Section("Openings for Black", "Ten reference defences.", DATA.black);
  else { route = ""; page = SideSelection(); }
  document.title = title;
  document.getElementById("app").innerHTML = Navbar(route) + `<main>${page}</main>`;
  document.getElementById("tt").addEventListener("click", () => { toggleTheme(); render(); });
  window.scrollTo(0, 0);
}
initTheme();
addEventListener("hashchange", render);
render();
