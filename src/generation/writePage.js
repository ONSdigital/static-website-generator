import fs from "fs-extra";
import path from "path";

import * as logger from "../helpers/logger.js";

export default async function writePage(outputFilePath, pageContent) {
  if (fs.existsSync(outputFilePath)) {
    throw new Error(`Multiple pages are writing to the same path "${outputFilePath}".`)
  }

  logger.step(`Writing ${outputFilePath}...`);
  await fs.ensureDir(path.dirname(outputFilePath));
  await fs.writeFile(outputFilePath, pageContent, { encoding: "utf8" });
}
