import StaticProcessor from "./processor.js";

export default class HtmlStaticProcessor extends StaticProcessor {
  get extensions() {
    return [ ".html" ];
  }

  async process({ page, processedSite, renderer }) {
    return {
      body: page.body,
    };
  }
}
