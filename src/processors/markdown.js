import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";

import StaticProcessor from "./processor.js";

const defaultOptions = {
  renderer: new marked.Renderer(),
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
};

marked.use(gfmHeadingId(false));
export default class MarkdownStaticProcessor extends StaticProcessor {
  constructor(options) {
    super();

    options = Object.assign({}, defaultOptions, options);
    marked.setOptions(options);
  }

  get extensions() {
    return [".md"];
  }

  process({ page, processedSite, renderer }) {
    return {
      body: marked.parse(page.body),
    };
  }
}
