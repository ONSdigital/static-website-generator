import escape from "./escapeStringForRegExp.js";

export default function getInternalUrlRegex(site) {
  const patterns = [
    escape("/"),
    escape("#"),
    escape(site.baseUrl ?? "").replace(/\\[/]$/, "($|[/])"),
    escape(site.absoluteBaseUrl ?? "").replace(/\\[/]$/, "($|[/])"),
    escape(site.craftBaseUrl ?? "").replace(/\\[/]$/, "($|[/])"),
  ];
  return new RegExp(`^(${patterns.filter(url => url !== "").join("|")})`);
}
