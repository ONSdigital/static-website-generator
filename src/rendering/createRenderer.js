import fs from "fs-extra";
import nunjucks from "nunjucks";

import createHtmlContentFilter from "./filters/htmlContentFilter.js";
import createIsInternalUrlFilter from "./filters/isInternalUrlFilter.js";
import createLocalizeFilter from "./filters/localizeFilter.js";
import createUniqueIdFilter from "./filters/uniqueIdFilter.js";
import dateFilter from "./filters/dateFilter.js";
import itemsList_from_navigationFilter from "./filters/itemsList_from_navigationFilter.js";
import itemsList_from_navigationItemsFilter from "./filters/itemsList_from_navigationItemsFilter.js";
import setAttributeFilter from "./filters/setAttributeFilter.js";

const designSystemPath = `${ process.cwd() }/node_modules/@ons/design-system`;
const designSystemCdnBaseUrl = "https://cdn.ons.gov.uk/sdc/design-system/";

let designSystemVersion = fs.readJsonSync(`${designSystemPath}/package.json`).version;
if (designSystemVersion === "3.0.1") {
  const projectPackageJson = fs.readJsonSync(`${process.cwd()}/package.json`, { encoding: "utf8" });
  const designSystemDependency = projectPackageJson.dependencies["@ons/design-system"];
  designSystemVersion = designSystemDependency.match(/#(\d+\.\d+\.\d+)$/)[1];
}

nunjucks.configure(null, {
  watch: false,
  autoescape: true
});

export default async function createRenderer(data, setupNunjucks = null) {
  const searchPaths = [ ...data.site.templateSearchPaths, `${designSystemPath}`, `${designSystemPath}/src` ];

  const nunjucksLoader = new nunjucks.FileSystemLoader(searchPaths);
  const nunjucksEnvironment = new nunjucks.Environment(nunjucksLoader);

  nunjucksEnvironment.addGlobal("designSystemVersion", designSystemVersion);
  nunjucksEnvironment.addGlobal("designSystemCdnBaseUrl", designSystemCdnBaseUrl);
  nunjucksEnvironment.addGlobal("designSystemCdnUrl", designSystemCdnBaseUrl + designSystemVersion);

  nunjucksEnvironment.addFilter("date", dateFilter);
  nunjucksEnvironment.addFilter("htmlContent", createHtmlContentFilter(data));
  nunjucksEnvironment.addFilter("isInternalUrl", createIsInternalUrlFilter(data));
  nunjucksEnvironment.addFilter("itemsList_from_navigation", itemsList_from_navigationFilter);
  nunjucksEnvironment.addFilter("itemsList_from_navigationItems", itemsList_from_navigationItemsFilter);
  nunjucksEnvironment.addFilter("localize", createLocalizeFilter(data.site, data.stringsByLanguage));
  nunjucksEnvironment.addFilter("setAttribute", setAttributeFilter);
  nunjucksEnvironment.addFilter("uniqueId", createUniqueIdFilter());

  setupNunjucks?.call(null, { nunjucksEnvironment });

  return {
    nunjucksEnvironment,

    async render(page, context = {}) {
      try {
        const templateName = `${page.layout}.njk`;
        return nunjucksEnvironment.render(templateName, { ...data, page, ...context });
      }
      catch (err) {
        const renderError = new Error(`A problem occurred whilst rendering page '${data?.site?.baseUrl ?? "/"}${page.uri}'\n\nlayout: ${page.layout}\nsite: ${data?.site?.name ?? "(undefined)"}`);
        renderError.name = "RenderError";
        renderError.cause = err;
        throw renderError;
      }
    },

    async renderString(templateString, context = {}) {
      try {
        return nunjucksEnvironment.renderString(templateString, { ...data, ...context });
      }
      catch (err) {
        const renderError = new Error(`A problem occurred whilst rendering string for site '${data?.site?.name ?? "(undefined)"}'.`);
        renderError.name = "RenderError";
        renderError.cause = err;
        throw renderError;
      }
    },
  }
}
