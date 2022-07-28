import NunjucksStaticProcessor from "./nunjucks.js";

const EXAMPLE_NUNJUCKS_PAGE = {
  body: "<p>Computed value: {{ 1 + 2 }}</p>",
};

class FakeRenderer {
  renderString(templateText, context) {
    this.templateText = templateText;
    this.context = context;
    return "FAKE OUTPUT";
  }
}

class FakeRendererWithError {
  renderString(templateText, context) {
    throw new Error();
  }
}

describe("NunjucksStaticProcessor", () => {
  describe("get extensions()", () => {
    it("returns the expected array", () => {
      const nunjucksStaticProcessor = new NunjucksStaticProcessor();

      expect(nunjucksStaticProcessor.extensions).toEqual([ ".njk" ]);
    });
  });

  describe("canProcess(content)", () => {
    it("returns `true` for nunjucks content type", () => {
      const nunjucksStaticProcessor = new NunjucksStaticProcessor();

      const result = nunjucksStaticProcessor.canProcess({
        path: "fake/content.njk",
      });

      expect(result).toBe(true);
    });

    it("returns `false` for other content type", () => {
      const nunjucksStaticProcessor = new NunjucksStaticProcessor();

      const result = nunjucksStaticProcessor.canProcess({
        path: "fake/content.html",
      });

      expect(result).toBe(false);
    });
  });

  describe("async process({ page, renderer })", () => {
    it("passes nunjucks encoded page body to the provided renderer", async () => {
      const nunjucksStaticProcessor = new NunjucksStaticProcessor();
      const fakeRenderer = new FakeRenderer();

      await nunjucksStaticProcessor.process({
        renderer: fakeRenderer,
        page: EXAMPLE_NUNJUCKS_PAGE,
      });

      expect(fakeRenderer.templateText).toBe(EXAMPLE_NUNJUCKS_PAGE.body);
    });

    it("provides page to rendering context", async () => {
      const nunjucksStaticProcessor = new NunjucksStaticProcessor();
      const fakeRenderer = new FakeRenderer();

      await nunjucksStaticProcessor.process({
        renderer: fakeRenderer,
        processedSite: { name: "en" },
        page: EXAMPLE_NUNJUCKS_PAGE,
      });

      expect(fakeRenderer.context.page).toBe(EXAMPLE_NUNJUCKS_PAGE);
    });

    it("returns renderer output as html body", async () => {
      const nunjucksStaticProcessor = new NunjucksStaticProcessor();
      const fakeRenderer = new FakeRenderer();

      const processedContent = await nunjucksStaticProcessor.process({
        renderer: fakeRenderer,
        processedSite: { name: "en" },
        page: EXAMPLE_NUNJUCKS_PAGE,
      });

      expect(processedContent).toEqual({
        body: "FAKE OUTPUT",
      });
    });

    it("provides context when an error occurs", async() => {
      const nunjucksStaticProcessor = new NunjucksStaticProcessor();
      const fakeRendererWithError = new FakeRendererWithError();

      const processedContentPromise = nunjucksStaticProcessor.process({
        renderer: fakeRendererWithError,
        processedSite: { name: "en" },
        page: EXAMPLE_NUNJUCKS_PAGE,
      });

      await expect(processedContentPromise)
        .rejects
        .toThrow("NunjucksStaticProcessor: An error occurred whilst rendering body of page 'undefined' from site 'en'");
    });
  });
});
