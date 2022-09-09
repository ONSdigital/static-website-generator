import path from "path";

export default class StaticProcessor {
  get extensions() {
    return [];
  }

  canProcess(content) {
    const extension = path.extname(content.path);
    return this.extensions.includes(extension);
  }

  async process({ page, processedSite, renderer }) {
    throw new Error("not implemented");
  }
}
