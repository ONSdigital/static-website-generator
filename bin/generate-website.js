#!/usr/bin/env node

import path from "path";

import Generator from "../src/Generator.js";
import loadStringsSync from "../src/helpers/loadStringsSync.js";

const PROJECT_PATH = process.cwd();
const PROJECT_CONFIG_SITES_PATH = path.resolve(PROJECT_PATH, "./config/sites.js");
const PROJECT_STRINGS_PATH = path.resolve(PROJECT_PATH, "./strings");
const PROJECT_DEFAULT_TEMPLATES_PATH = path.resolve(PROJECT_PATH, "./templates");
const PROJECT_DIST_PATH = path.resolve(PROJECT_PATH, "./dist");

(async () => {
  const sites = (await import(PROJECT_CONFIG_SITES_PATH)).default;
  const stringsByLanguage = loadStringsSync(PROJECT_STRINGS_PATH);
  
  const generator = new Generator({
    sites,
    stringsByLanguage,
    defaultTemplatesPath: PROJECT_DEFAULT_TEMPLATES_PATH,
  });

  console.time("generate website");
  await generator.generate(PROJECT_DIST_PATH);
  console.timeEnd("generate website");
})();
