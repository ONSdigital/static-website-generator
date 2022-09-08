import HtmlStaticProcessor from "./html.js";

describe("HtmlStaticProcessor", () => {
  describe("get extensions()", () => {
    it("returns the expected array", () => {
      const htmlStaticProcessor = new HtmlStaticProcessor();

      expect(htmlStaticProcessor.extensions).toEqual([ ".html" ]);
    });
  });

  describe("canProcess(content)", () => {
    it("returns `true` for html content type", () => {
      const htmlStaticProcessor = new HtmlStaticProcessor();

      const result = htmlStaticProcessor.canProcess({
        path: "fake/content.html",
      });

      expect(result).toBe(true);
    });

    it("returns `false` for other content type", () => {
      const htmlStaticProcessor = new HtmlStaticProcessor();

      const result = htmlStaticProcessor.canProcess({
        path: "fake/content.md",
      });

      expect(result).toBe(false);
    });
  });

  describe("async process({ page })", () => {
    it("returns unprocessed body text", async () => {
      const htmlStaticProcessor = new HtmlStaticProcessor();

      const processedContent = await htmlStaticProcessor.process({
        page: {
          body: "<p>Example page body.</p>",
        },
      });

      expect(processedContent).toEqual({
        body: "<p>Example page body.</p>",
      });
    });
  });
});
