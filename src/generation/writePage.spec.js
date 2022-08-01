import fs from "fs-extra";

import writePage from "./writePage.js";

describe("writePage(outputFilePath, pageContent)", () => {
  beforeAll(async () => {
    await fs.remove("dist/writePage");
  });

  it("writes page content to a file", async () => {
    const randomContent = "Random: " + Math.random();
    await writePage("dist/writePage/page.html", randomContent);

    const writtenContent = await fs.readFile("dist/writePage/page.html", { encoding: "utf8" });
    expect(writtenContent).toBe(randomContent);
  });

  it("throws when attempting to overwrite an existing file", async () => {
    const randomContent = "Random: " + Math.random();
    await writePage("dist/writePage/page-overwrite.html", randomContent);

    await expect(writePage("dist/writePage/page-overwrite.html", randomContent))
      .rejects
      .toThrow('Multiple pages are writing to the same path "dist/writePage/page-overwrite.html".');
  });
});
