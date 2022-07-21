import fs from "fs-extra";
import path from "path";
import frontMatter from "front-matter";

import MarkdownStaticProcessor from "./processors/markdown.js";
import NunjucksStaticProcessor from "./processors/nunjucks.js";
import HtmlStaticProcessor from "./processors/html.js";

const defaultOptions = {
  processors: [
    new MarkdownStaticProcessor(),
    new NunjucksStaticProcessor(),
    new HtmlStaticProcessor(),
  ],
};

export default class StaticSource {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  get name() { return "static"; }

  async fetchData(site) {
    const discoveredSources = await this.#discoverContent(`${this.options.sourceDirectory}/${site.name}`);
    return {
      pages: discoveredSources.filter(content => content._processor !== null),
    };
  }

  createPages(site, data) {
    return data.pages;
  }

  async #discoverContent(directoryPath, sourceRelativeBasePath = '') {
    let results = [];
  
    for (let entry of await fs.readdir(directoryPath, { withFileTypes: true })) {
      const sourcePath = path.join(directoryPath, entry.name);
      const sourceRelativePath = path.join(sourceRelativeBasePath, entry.name);
  
      if (entry.isDirectory()) {
        const nestedResults = await this.#discoverContent(sourcePath, sourceRelativePath);
        results = [ ...results, ...nestedResults ];
      }
      else {
        const content = await this.#readContentFile(sourcePath);
        content.path = sourceRelativePath;

        const processor = this.#resolveProcessor(content);
        if (!processor) {
          continue;
        }
  
        results.push({
          uri: sourceRelativePath.replace(/(^index)?\.[^\.]+$/, ""),
          body: content.body,
          ...content.data,
          _processor: processor,
        });
      }
    }
  
    return results;
  }
  
  async #readContentFile(contentPath) {
    const fileContents = await fs.readFile(contentPath, { encoding: "utf8" });
    const content = frontMatter(fileContents);
    return {
      data: content.attributes,
      body: content.body,
    };
  }

  #resolveProcessor(content) {
    return this.options.processors.find(processor => processor.canProcess(content));
  }
}
