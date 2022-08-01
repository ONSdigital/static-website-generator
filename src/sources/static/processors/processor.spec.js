import StaticProcessor from "./processor.js";

describe("StaticProcessor", () => {
  describe("get extensions()", () => {
    it("returns the expected array", () => {
      const staticProcessor = new StaticProcessor();

      expect(staticProcessor.extensions).toEqual([]);
    });
  });

  describe("canProcess(content)", () => {
    it("returns `false` for other content type", () => {
      const staticProcessor = new StaticProcessor();

      const result = staticProcessor.canProcess({
        path: "fake/content.html",
      });

      expect(result).toBe(false);
    });
  });

  describe("async process({ page, processedSite, renderer })", () => {
    it("always throws a 'not implemented' error", async () => {
      const staticProcessor = new StaticProcessor();

      await expect(staticProcessor.process({}))
        .rejects
        .toThrow("not implemented");
    });
  });
});
