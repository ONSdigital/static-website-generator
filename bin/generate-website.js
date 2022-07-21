#!/usr/bin/env node

import path from "path";

import Generator from "../src/index.js";
import loadStringsSync from "../src/helpers/loadStringsSync.js";

const PROJECT_PATH = process.cwd();
const PROJECT_CONFIG_SITES_PATH = path.resolve(PROJECT_PATH, "./config/sites.js");
const PROJECT_STRINGS_PATH = path.resolve(PROJECT_PATH, "./strings");
const PROJECT_DIST_PATH = path.resolve(PROJECT_PATH, "./dist");

(async () => {
  const sites = (await import(PROJECT_CONFIG_SITES_PATH)).default;
  const stringsByLanguage = loadStringsSync(PROJECT_STRINGS_PATH);
  
  const generator = new Generator({ sites, stringsByLanguage });

  console.time("generate website");
  await generator.generate(PROJECT_DIST_PATH);
  console.timeEnd("generate website");
})();
