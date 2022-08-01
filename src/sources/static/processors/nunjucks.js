import StaticProcessor from "./processor.js";

export default class NunjucksStaticProcessor extends StaticProcessor {
  get extensions() {
    return [ ".njk" ];
  }

  async process({ page, processedSite, renderer }) {
    try {
      return {
        body: await renderer.renderString(page.body, { page }),
      };
    }
    catch (err) {
      const renderError = new Error(`NunjucksStaticProcessor: An error occurred whilst rendering body of page '${page.uri}' from site '${processedSite?.name}'`);
      renderError.cause = err;
      throw renderError;
    }
  }
}
