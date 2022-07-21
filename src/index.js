import fs from "fs-extra";
import path from "path";

import paginate from "./helpers/paginate.js";
import * as logger from "./helpers/logger.js";
import createRenderer from "./rendering/createRenderer.js";

export default class Generator {
  constructor(options) {
    this.sites = options.sites;
    this.siteNames = this.sites.map(site => site.name);
    this.sitesByName = Object.fromEntries(this.sites.map(site => ([ site.name, site ])));
    this.stringsByLanguage = options.stringsByLanguage;
  }

  async generate(outputPath) {
    if (!outputPath || outputPath === "/") {
      throw new Error(`Invalid outputPath "${outputPath}"`);
    }

    try {
      const processedSites = Object.fromEntries(await Promise.all(this.sites.map(async site => {
        logger.stage(`Fetching data for site "${site.name}"...`);
        const data = await this.fetchSiteData(site);

        logger.stage(`Adding strings for site "${site.name}"...`);
        data.stringsByLanguage = this.stringsByLanguage;

        logger.stage(`Pre-processing site data for site "${site.name}"...`);
        site.hooks?.preprocessDataForSite?.call(null, { site, data });
  
        const pages = createPagesForSite(site, data);
        return [ site.name, { ...site, data, pages } ];
      })));
  
      logger.stage("Cross referencing pages for localization switcher...");
      addLocalizedUrls(processedSites);
  
      logger.stage("Removing previous output...");
      await fs.remove(outputPath);
  
      for (let processedSite of Object.values(processedSites)) {
        logger.stage(`Rendering and writing pages for site "${processedSite.name}"...`);
        const renderer = await createRenderer(processedSite.data, processedSite.hooks?.setupNunjucks);
        await renderSitePages(`${outputPath}/${processedSite.name}`, processedSite, renderer);
      }
    }
    catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  async fetchSiteData(site) {
    const data = {
      sites: this.sitesByName,
      site,
    };

    for (let source of site.sources) {
      data[source.name] = await source.fetchData(site);
    }

    return data;
  }
}

function createPagesForSite(site, data) {
  logger.stage(`Creating pages for site ${site.name}...`);
  let pages = createPagesFromContentSources(site, data);

  logger.step("Applying default transforms to pages...");
  addUrlAttributes({ pages, site });
  logger.step("Applying transforms to pages...");
  site.hooks?.applyTransformsToPages?.call(null, { pages, site, data });

  logger.step("Paginating listing pages...");
  pages = pages.map(paginate).flat();

  return pages;
}

function createPagesFromContentSources(site, data) {
  const clusters = [];

  for (let source of site.sources) {
    const sourceData = data[source.name];
    if (!!sourceData) {
      clusters.push(source.createPages(site, sourceData));
    }
  }

  const hookPages = site.hooks?.createPagesForSite?.call(null, { site, data });
  if (!!hookPages) {
    clusters.push(hookPages);
  }

  return clusters.flat();
}

function addUrlAttributes({ pages, site }) {
  for (let page of pages) {
    if (page.uri === "__home__") {
      page.uri = "";
    }
  
    page.absoluteUrl = site.absoluteBaseUrl + page.uri;
    page.url = site.baseUrl + page.uri;
  }
}

function addLocalizedUrls(processedSites) {
  for (let processedSite of Object.values(processedSites)) {
    // Skip if processed site isn't linked to any other sites.
    if (!processedSite.linkedSites || processedSite.linkedSites.length === 0) {
      continue;
    }

    const linkedSites = processedSite.linkedSites.map(linkedSiteName => processedSites[linkedSiteName]);
    const localizedSiteGroup = [ processedSite, ...linkedSites ];

    for (let page of processedSite.pages) {
      page.localizedUrls = Object.fromEntries(localizedSiteGroup.map(otherProcessedSite => 
        [
          otherProcessedSite.name,
          otherProcessedSite.pages.find(otherPage =>
            (page.handle === otherPage.handle && page.id !== undefined && page.id === otherPage.id)
          )?.absoluteUrl,
        ]
      ));
    }
  }
}

async function renderSitePages(siteOutputPath, processedSite, renderer) {
  for (let page of processedSite.pages) {
    // Process static content using markdown/nunjucks/etc.
    let processedResult = null;
    if (!!page._processor) {
      processedResult = await page._processor.process({ page, processedSite, renderer });
      page.body = processedResult.body;
    }

    const output = (page.layout === null)
      ? processedResult.body
      : await renderer.render(page);

    const processedOutput = await processedSite.hooks.postprocessPageOutput({ output, page, processedSite });
    const outputPath = path.join(siteOutputPath, page.uri ?? "", "index.html");
    await writePage(outputPath, processedOutput);
  }

  processedSite.hooks?.afterPagesWritten?.call(null, { siteOutputPath, processedSite });
}

async function writePage(outputFilePath, pageContent) {
  if (fs.existsSync(outputFilePath)) {
    throw new Error(`Multiple pages are writing to the same path "${outputFilePath}".`)
  }

  logger.step(`Writing ${outputFilePath}...`);
  await fs.ensureDir(path.dirname(outputFilePath));
  await fs.writeFile(outputFilePath, pageContent, { encoding: "utf8" });
}
