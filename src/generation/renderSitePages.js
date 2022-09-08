import path from "path";

export default async function renderSitePages(siteOutputPath, processedSite, renderer, writePage) {
  for (let page of processedSite.pages) {
    const output = (!page.layout || page.layout === "")
      ? page.body
      : await renderer.render(page);

    const processedOutput = (!!processedSite.hooks?.postprocessPageOutput)
      ? await processedSite.hooks.postprocessPageOutput({ output, page, processedSite })
      : output;

    const outputPath = path.join(siteOutputPath, page.uri ?? "", "index.html");
    await writePage(outputPath, processedOutput);
  }
}
