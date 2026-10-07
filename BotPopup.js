import { BotAvatar } from "./Bots.js";
import { BOTS } from "../utils/bots.js";
import { svgIcon } from "../utils/icons.js";

// Small card on the right edge that promotes #/bots to first-time visitors.
// It is shown once: the flag is saved the moment it appears, so reloading, returning later or dismissing
// it never brings it back. If the browser won't let us read storage we can't remember anything, so we
// don't show it at all rather than nag on every visit.
const KEY = "rm-bots-promo";
const seen = () => { try { return !!localStorage.getItem(KEY); } catch (e) { return true; } };
const markSeen = () => { try { localStorage.setItem(KEY, "1"); } catch (e) {} };
const onBots = () => /^#\/?bots/.test(location.hash);

export function initBotPopup() {
  if (seen()) return;
  markSeen();
  if (onBots()) return;                               // already looking at the bots: nothing to promote

  const bot = BOTS[0];
  const el = document.createElement("aside");
  el.className = "promo";
  el.setAttribute("aria-label", "New: Play Against Bots");
  el.innerHTML = `<button class="promo-x" type="button" aria-label="Dismiss">${svgIcon('<path d="M6 6l12 12M18 6 6 18"/>')}</button>
<a class="promo-go" href="#/bots">${BotAvatar("sm")}<span class="promo-t"><b>Play Against Bots</b><span>Meet ${bot.name} · ELO ${bot.elo}</span></span>${svgIcon('<path d="M5 12h14M13 6l6 6-6 6"/>')}</a>`;

  let gone = false;
  const close = () => {
    if (gone) return; gone = true;
    removeEventListener("hashchange", maybeClose);
    el.classList.add("out");
    setTimeout(() => el.remove(), 250);
  };
  const maybeClose = () => { if (onBots()) close(); };   // they found the section another way
  el.querySelector(".promo-x").addEventListener("click", close);
  el.querySelector(".promo-go").addEventListener("click", close);
  addEventListener("hashchange", maybeClose);
  setTimeout(() => { if (!gone) document.body.appendChild(el); }, 900);   // let the page settle first
}
