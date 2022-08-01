import path from "path";

export default async function renderSitePages(siteOutputPath, processedSite, renderer, writePage) {
  for (let page of processedSite.pages) {
    // Process static content using markdown/nunjucks/etc.
    let processedResult = null;
    if (!!page._processor) {
      processedResult = await page._processor.process({ page, processedSite, renderer });
      page.body = processedResult.body;
    }

    const output = (processedResult !== null && page.layout === null)
      ? processedResult.body
      : await renderer.render(page);

    const processedOutput = (!!processedSite.hooks?.postprocessPageOutput)
      ? await processedSite.hooks.postprocessPageOutput({ output, page, processedSite })
      : output;

    const outputPath = path.join(siteOutputPath, page.uri ?? "", "index.html");
    await writePage(outputPath, processedOutput);
  }
}
