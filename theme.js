export const currentTheme = () => document.documentElement.getAttribute("data-theme");
export function initTheme(){
  let t = null; try { t = localStorage.getItem("rm-theme"); } catch (e) {}
  if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
}
export function toggleTheme(){
  const t = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("rm-theme", t); } catch (e) {}
}
