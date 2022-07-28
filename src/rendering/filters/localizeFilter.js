export default function createLocalizeFilter(site, stringsByLanguage) {
  return function localizeFilter(text, context = "main") {
    const strings = stringsByLanguage[site.name] ?? {};
    const value = strings && strings[context] && strings[context][text];
    return value !== undefined ? value : text;
  };
}
