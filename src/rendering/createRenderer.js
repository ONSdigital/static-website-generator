import fs from "fs-extra";
import nunjucks from "nunjucks";

import dateFilter from "./filters/dateFilter.js";
import itemsList_from_navigationFilter from "./filters/itemsList_from_navigationFilter.js";
import itemsList_from_navigationItemsFilter from "./filters/itemsList_from_navigationItemsFilter.js";
import createLocalizeFilter from "./filters/localizeFilter.js";
import setPropertyFilter from "./filters/setPropertyFilter.js";
import uniqueIdFilter from "./filters/uniqueIdFilter.js";

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

export default async function createRenderer(templatesPath, data, setupNunjucks = null) {
  const searchPaths = [ templatesPath, `${designSystemPath}`, `${designSystemPath}/src` ];

  const nunjucksLoader = new nunjucks.FileSystemLoader(searchPaths);
  const nunjucksEnvironment = new nunjucks.Environment(nunjucksLoader);

  nunjucksEnvironment.addGlobal("designSystemVersion", designSystemVersion);
  nunjucksEnvironment.addGlobal("designSystemCdnBaseUrl", designSystemCdnBaseUrl);
  nunjucksEnvironment.addGlobal("designSystemCdnUrl", designSystemCdnBaseUrl + designSystemVersion);

  nunjucksEnvironment.addFilter("date", dateFilter);
  nunjucksEnvironment.addFilter("itemsList_from_navigation", itemsList_from_navigationFilter);
  nunjucksEnvironment.addFilter("itemsList_from_navigationItems", itemsList_from_navigationItemsFilter);
  nunjucksEnvironment.addFilter("localize", createLocalizeFilter(data.site, data.stringsByLanguage));
  nunjucksEnvironment.addFilter("setProperty", setPropertyFilter);
  nunjucksEnvironment.addFilter("uniqueId", uniqueIdFilter);

  setupNunjucks?.call(null, { nunjucksEnvironment });

  return {
    nunjucksEnvironment,

    async render(page, context = {}) {
      try {
        const templateName = `${page.layout}.njk`;
        return nunjucksEnvironment.render(templateName, { ...data, page, ...context });
      }
      catch (err) {
        const renderError = new Error(`An error occurred whilst rendering page '${page.uri}' from site '${data?.site?.name}' with layout '${page.layout}'`);
        renderError.cause = err;
        throw renderError;
      }
    },

    async renderString(templateString, context = {}) {
      return nunjucksEnvironment.renderString(templateString, { ...data, ...context });
    },
  }
}
