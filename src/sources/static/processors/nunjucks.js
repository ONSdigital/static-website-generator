import StaticProcessor from "./processor.js";

export default class NunjucksStaticProcessor extends StaticProcessor {
  get extensions() {
    return [ ".njk" ];
  }

  async process({ page, processedSite, renderer }) {
    return {
      body: await renderer.renderString(page.body, { page }),
    };
  }
}
