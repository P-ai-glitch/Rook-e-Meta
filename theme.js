export const currentTheme = () => document.documentElement.getAttribute("data-theme");
export function initTheme(){
  let t = null; try { t = localStorage.getItem("rm-theme"); } catch (e) {}
  if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
}

// Switches brightness with a short cross-fade (the `theme-fade` class enables the colour transitions in
// styles.css). `persist = false` is used for temporary changes (Lock In) so the saved preference is untouched.
let fadeTimer;
export function setTheme(t, persist = true){
  const root = document.documentElement;
  if (currentTheme() === t) return;
  root.classList.add("theme-fade");
  clearTimeout(fadeTimer);
  fadeTimer = setTimeout(() => root.classList.remove("theme-fade"), 900);
  root.setAttribute("data-theme", t);
  if (persist) try { localStorage.setItem("rm-theme", t); } catch (e) {}
  dispatchEvent(new Event("rm:theme"));   // lets toggles/buttons refresh their icon without a page re-render
}
export const toggleTheme = () => setTheme(currentTheme() === "dark" ? "light" : "dark");
