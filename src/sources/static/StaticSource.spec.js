import StaticSource from "./StaticSource.js";

import MarkdownStaticProcessor from "../../processors/markdown.js";
import NunjucksStaticProcessor from "../../processors/nunjucks.js";
import HtmlStaticProcessor from "../../processors/html.js";

const EXAMPLE_OPTIONS = {
  sourceDirectory: "tests/examples/content",
};

const FAKE_SITE = {
  name: "en",
};

describe("StaticSource", () => {
  describe("get name()", () => {
    it("returns 'static'", () => {
      const staticSource = new StaticSource(EXAMPLE_OPTIONS);

      expect(staticSource.name).toBe("static");
    });
  });

  describe("async fetchData(site)", () => {
    it("discovers all pages for the given site", async () => {
      const staticSource = new StaticSource(EXAMPLE_OPTIONS);

      const data = await staticSource.fetchData(FAKE_SITE);

      const pages = data.pages.sort((a, b) => a.uri.localeCompare(b.uri));
      expect(pages.map(page => page.uri)).toEqual([
        "",
        "news/an-example-article",
        "some-html",
        "some-template",
      ]);
    });

    it("includes frontmatter data for each page", async () => {
      const staticSource = new StaticSource(EXAMPLE_OPTIONS);

      const data = await staticSource.fetchData(FAKE_SITE);

      const pages = data.pages.sort((a, b) => a.uri.localeCompare(b.uri));
      expect(pages.map(page => page.title)).toEqual([
        "Home page",
        "An example article",
        "Some HTML",
        "Some template",
      ]);
    });

    it("associates markdown pages with markdown processor", async () => {
      const staticSource = new StaticSource(EXAMPLE_OPTIONS);

      const data = await staticSource.fetchData(FAKE_SITE);

      const pageWithMarkdown = data.pages.find(page => page.uri === "news/an-example-article");
      expect(pageWithMarkdown._processor).toBeInstanceOf(MarkdownStaticProcessor);
    });

    it("associates nunjucks pages with nunjucks processor", async () => {
      const staticSource = new StaticSource(EXAMPLE_OPTIONS);

      const data = await staticSource.fetchData(FAKE_SITE);

      const pageWithNunjucks = data.pages.find(page => page.uri === "some-template");
      expect(pageWithNunjucks._processor).toBeInstanceOf(NunjucksStaticProcessor);
    });

    it("associates html pages with html processor", async () => {
      const staticSource = new StaticSource(EXAMPLE_OPTIONS);

      const data = await staticSource.fetchData(FAKE_SITE);

      const pageWithHtml = data.pages.find(page => page.uri === "some-html");
      expect(pageWithHtml._processor).toBeInstanceOf(HtmlStaticProcessor);
    });
  });

  describe("async createPages(site, data)", () => {
    it("returns all page objects", async () => {
      const staticSource = new StaticSource(EXAMPLE_OPTIONS);
      const data = await staticSource.fetchData(FAKE_SITE);

      const pages = await staticSource.createPages(FAKE_SITE, data);

      expect(pages).toBe(data.pages);
    });
  });
});
