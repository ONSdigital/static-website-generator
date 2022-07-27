export default function createLocalizeFilter(site, stringsByLanguage) {
  return function localizeFilter(text, context = "main") {
    const strings = stringsByLanguage[site.name] ?? {};
    return (strings && strings[context] && strings[context][text]) ?? text;
  };
}
