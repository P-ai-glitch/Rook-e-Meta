import { BOTS } from "../utils/bots.js";
import { svg } from "../utils/pieces.js";
import { svgIcon } from "../utils/icons.js";

// A bot's face: one white pawn and one black pawn, each on the square colour it shows up best on.
export const BotAvatar = (cls = "") => `<div class="bot-av ${cls}" role="img" aria-label="A black pawn and a white pawn"><span class="l">${svg("p", "b")}</span><span class="d">${svg("p", "w")}</span></div>`;

const BotCard = b => `<div class="card bot"><a class="cardlink" href="#/bots/${b.id}" aria-label="Play ${b.name}"></a>
<div class="bot-top">${BotAvatar()}</div>
<div class="body"><h3>${b.name}</h3><span class="badge" style="--c:var(--orange)">${svgIcon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')}ELO ${b.elo}</span>
<p class="desc">${b.tagline}</p>
<ul class="bot-traits">${b.traits.map(t => `<li>${t}</li>`).join("")}</ul>
<a class="try" href="#/bots/${b.id}" aria-label="Play against ${b.name}">${svgIcon('<path d="m7 4 13 8-13 8z"/>')}<span>Play ${b.name}</span></a></div></div>`;

export const BotsPage = () => `<section><h2>Play Against Bots</h2><p class="lead">Pick an opponent and play a full game. More bots are on the way.</p>
<div class="grid">${BOTS.map(BotCard).join("")}</div></section>`;
