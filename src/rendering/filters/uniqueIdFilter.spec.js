import createUniqueIdFilter from "./uniqueIdFilter.js";

describe("createUniqueIdFilter()", () => {
  const uniqueIdFilter = createUniqueIdFilter();

  describe("uniqueIdFilter(base, { scope: 'default', suffix: '.id.', skipFirst: false }?)", () => {
    it("returns a different id each time", () => {
      const ids = new Set();

      ids.add(uniqueIdFilter("article"));
      ids.add(uniqueIdFilter("article"));
      ids.add(uniqueIdFilter("article"));

      expect(ids.size).toBe(3);
    });

    it.each([
      [ "article", /^article\.id\.[0-9]+$/ ],
      [ "example-element", /^example-element\.id\.[0-9]+$/],
    ])("returns id with the expected format (%s, %s)", (base, expectedPattern) => {
      const id = uniqueIdFilter(base);

      expect(id).toMatch(expectedPattern);
    });

    it("uses given suffix for identifier", () => {
      const id = uniqueIdFilter("article", { suffix: ".foo" });

      expect(id).toMatch(/^article\.foo\.[0-9]+$/);
    });

    it("removes suffix when `suffix` is `null`", () => {
      const id = uniqueIdFilter("article", { suffix: null });

      expect(id).toMatch(/^article\.[0-9]+$/);
    });

    it("uses clean sequence of identifiers for each provided scope", () => {
      const idsWithScope1 = [
        uniqueIdFilter("article", {
          scope: "https://example.com/some-page",
        }),
        uniqueIdFilter("article", {
          scope: "https://example.com/some-page",
        }),
      ];
      const idsWithScope2 = [
        uniqueIdFilter("example-block", {
          scope: "https://example.com/a-different-page",
        }),
        uniqueIdFilter("example-block", {
          scope: "https://example.com/a-different-page",
        }),
      ];

      expect(idsWithScope1).toEqual([ "article.id.1", "article.id.2" ]);
      expect(idsWithScope2).toEqual([ "example-block.id.1", "example-block.id.2" ]);
    });

    it("omits id counter on first identifier when `skipFirst` is `true`", () => {
      const idsWithScope = [
        uniqueIdFilter("example", {
          scope: "https://example.com/skip-first",
          skipFirst: true,
        }),
        uniqueIdFilter("example", {
          scope: "https://example.com/skip-first",
          skipFirst: true,
        }),
      ];

      expect(idsWithScope).toEqual([ "example", "example.id.2" ]);
    });

    it("does not omit id counter on first identifier when `base` is empty", () => {
      const idsWithScope = [
        uniqueIdFilter(null, {
          scope: "https://example.com/skip-first",
          skipFirst: true,
        }),
        uniqueIdFilter(null, {
          scope: "https://example.com/skip-first",
          skipFirst: true,
        }),
      ];

      expect(idsWithScope).toEqual([ ".id.1", ".id.2" ]);
    });
  });
});
