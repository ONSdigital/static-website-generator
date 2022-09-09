import MarkdownStaticProcessor from "./markdown.js";

describe("MarkdownStaticProcessor", () => {
  describe("get extensions()", () => {
    it("returns the expected array", () => {
      const markdownStaticProcessor = new MarkdownStaticProcessor();

      expect(markdownStaticProcessor.extensions).toEqual([ ".md" ]);
    });
  });

  describe("canProcess(content)", () => {
    it("returns `true` for markdown content type", () => {
      const markdownStaticProcessor = new MarkdownStaticProcessor();

      const result = markdownStaticProcessor.canProcess({
        path: "fake/content.md",
      });

      expect(result).toBe(true);
    });

    it("returns `false` for other content type", () => {
      const markdownStaticProcessor = new MarkdownStaticProcessor();

      const result = markdownStaticProcessor.canProcess({
        path: "fake/content.html",
      });

      expect(result).toBe(false);
    });
  });

  describe("async process({ page })", () => {
    it("processes markdown encoded text and returns as html body", async () => {
      const markdownStaticProcessor = new MarkdownStaticProcessor();

      const processedContent = await markdownStaticProcessor.process({
        page: {
          body: "Example page body.\nAnother line of text.",
        },
      });

      expect(processedContent).toEqual({
        body: "<p>Example page body.\nAnother line of text.</p>\n",
      });
    });

    it("uses marked option overrides when provided", async () => {
      const markdownStaticProcessor = new MarkdownStaticProcessor({
        breaks: true,
      });

      const processedContent = await markdownStaticProcessor.process({
        page: {
          body: "Example page body.\nAnother line of text.",
        },
      });

      expect(processedContent).toEqual({
        body: "<p>Example page body.<br>Another line of text.</p>\n",
      });
    });
  });
});
