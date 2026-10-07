import "./styles.css";
import { DATA, findOpening } from "./data/index.js";
import { initTheme, toggleTheme } from "./utils/theme.js";
import { Navbar } from "./components/Navbar.js";
import { SideSelection } from "./components/SideSelection.js";
import { OpeningGrid } from "./components/OpeningGrid.js";
import { OpeningPage } from "./components/OpeningPage.js";
import { PlayBoard, mountPlayBoard, loadOpening } from "./components/PlayBoard.js";
import { BotsPage } from "./components/Bots.js";
import { BotGame, mountBotGame } from "./components/BotGame.js";
import { initBotPopup } from "./components/BotPopup.js";
import { findBot } from "./utils/bots.js";

const Section = (t, lead, list) => `<section><h2>${t}</h2><p class="lead">${lead}</p>${OpeningGrid(list)}</section>`;

// nav = true only for real navigations (hashchange / first load), so an opening is only loaded onto the
// board by navigating to it. The theme toggle no longer re-renders the page at all (see below).
function render(nav){
  const [r = "", arg] = location.hash.replace(/^#\/?/, "").split("/");
  let route = r, title = "Rook(e)Meta", page, bot = null;
  if (r === "opening" && findOpening(arg)) {
    const o = findOpening(arg); page = OpeningPage(o); route = "opening"; title = o.n + " · Rook(e)Meta";
  } else if (r === "white") page = Section("Play as White", "Ten openings to seize the initiative from move one.", DATA.white);
  else if (r === "black") page = Section("Play as Black", "Ten defences and counter-systems for the second player.", DATA.black);
  else if (r === "openings") page = Section("Openings for White", "Ten reference openings.", DATA.white) + Section("Openings for Black", "Ten reference defences.", DATA.black);
  else if (r === "board") { const o = arg && findOpening(arg); if (nav && o) loadOpening(o); page = PlayBoard(); }
  else if (r === "bots") { bot = arg && findBot(arg); route = "bots"; page = bot ? BotGame(bot) : BotsPage(); title = (bot ? bot.name : "Play Against Bots") + " · Rook(e)Meta"; }
  else { route = ""; page = SideSelection(); }
  document.title = title;
  document.getElementById("app").innerHTML = Navbar(route) + `<main>${page}</main>`;
  if (route === "board") mountPlayBoard();
  if (bot) mountBotGame(bot);
  document.getElementById("tt").addEventListener("click", toggleTheme);   // no re-render: icon syncs via "rm:theme", board keeps its state and animates
  const cur = document.querySelector('.nav [aria-current="page"]'); if (cur) cur.scrollIntoView({ block: "nearest", inline: "nearest" });   // narrow screens: keep the active tab visible
  window.scrollTo(0, 0);
}
initTheme();
addEventListener("hashchange", () => render(true));
render(true);
initBotPopup();   // first visit only
