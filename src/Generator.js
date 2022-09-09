import fs from "fs-extra";

import * as logger from "./helpers/logger.js";
import createRenderer from "./rendering/createRenderer.js";
import paginate from "./helpers/paginate.js";

import addLocalizedUrls from "./generation/addLocalizedUrls.js";
import addUrlAttributes from "./generation/addUrlAttributes.js";
import createPagesFromContentSources from "./generation/createPagesFromContentSources.js";
import fetchSiteData from "./generation/fetchSiteData.js";
import renderSitePages from "./generation/renderSitePages.js";

export default class Generator {
  constructor(options) {
    this.sites = options.sites;
    this.siteNames = this.sites.map(site => site.name);
    this.sitesByName = Object.fromEntries(this.sites.map(site => ([ site.name, site ])));
    this.stringsByLanguage = options.stringsByLanguage;
    this.defaultTemplatesPath = options.defaultTemplatesPath;
    this.writePage = options.writePage;
  }

  async generate(outputPath) {
    if (!outputPath || outputPath === "/") {
      throw new Error(`Invalid outputPath "${outputPath}"`);
    }

    try {
      const processedSites = Object.fromEntries(await Promise.all(this.sites.map(async site => {
        site.templatesPath = site.templatesPath ?? this.defaultTemplatesPath;

        logger.stage(`Fetching data for site "${site.name}"...`);
        const data = await fetchSiteData(site, this.sitesByName);

        logger.stage(`Adding strings for site "${site.name}"...`);
        data.stringsByLanguage = this.stringsByLanguage;

        logger.stage(`Pre-processing site data for site "${site.name}"...`);
        await site.hooks?.preprocessDataForSite?.call(null, { site, data });
  
        logger.stage(`Creating pages for site ${site.name}...`);
        let pages = await createPagesFromContentSources(site, data);
      
        logger.step("Applying default transforms to pages...");
        addUrlAttributes({ pages, site });
        logger.step("Applying transforms to pages...");
        await site.hooks?.applyTransformsToPages?.call(null, { pages, site, data });
      
        logger.step("Paginating listing pages...");
        pages = pages.map(paginate).flat();

        return [ site.name, { ...site, data, pages } ];
      })));
  
      logger.stage("Cross referencing pages for localization switcher...");
      addLocalizedUrls(processedSites);
  
      logger.stage("Removing previous output...");
      await fs.remove(outputPath);
  
      for (let processedSite of Object.values(processedSites)) {
        const renderer = await createRenderer(processedSite.data, processedSite.hooks?.setupNunjucks);

        logger.stage(`Pre-processing pages for site "${processedSite.name}"...`);
        for (let page of processedSite.pages) {
          if (!!page._processor) {
            const processedResult = await page._processor.process({ page, processedSite, renderer });
            page.body = processedResult.body;
          }
        }

        logger.stage(`Rendering and writing pages for site "${processedSite.name}"...`);
        const siteOutputPath = `${outputPath}/${processedSite.name}`;
        await renderSitePages(siteOutputPath, processedSite, renderer, this.writePage);

        logger.stage(`Post-processing site "${processedSite.name}"...`);
        await processedSite.hooks?.afterPagesWritten?.call(null, { siteOutputPath, processedSite });
      }
    }
    catch (err) {
      if (err.name === "RenderError") {
        console.log("\n-------------------------------------------------------------------------------------");
        console.error(err.message);
        console.log("");
        console.error(err.cause);
        console.log("-------------------------------------------------------------------------------------\n");
      }
      else {
        console.error(err);
      }
      process.exit(1);
    }
  }
}
