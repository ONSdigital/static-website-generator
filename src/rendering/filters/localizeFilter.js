export default function localizeFilter(text, context = "main") {
  const { site, stringsByLanguage } = this.getVariables();
  const strings = stringsByLanguage[site.name] ?? {};
  return (strings && strings[context] && strings[context][text]) ?? text;
}
