import fs from "fs-extra";

export default function loadStringsSync(stringsPath) {
  const strings = {};
  for (let language of discoverAvailableLanguagesSync(stringsPath)) {
    strings[language] = {};
    for (let name of discoverStringFilesForLanguageSync(stringsPath, language)) {
      const context = name.replace(/\.[^\.]+$/, "");
      strings[language][context] = fs.readJsonSync(`${stringsPath}/${language}/${name}`, { encoding: "utf8" });
    }
  }
  return strings;
}

function discoverAvailableLanguagesSync(stringsPath) {
  return (fs.readdirSync(stringsPath, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

function discoverStringFilesForLanguageSync(stringsPath, language) {
  return (fs.readdirSync(`${stringsPath}/${language}`))
    .filter(name => name.endsWith(".json"));
}
