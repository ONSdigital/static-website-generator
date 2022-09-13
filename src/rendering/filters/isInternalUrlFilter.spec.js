import createIsInternalUrlFilter from "./isInternalUrlFilter.js";

describe("createIsInternalUrlFilter(site)", () => {
  const site = {
    baseUrl: "/en/",
    absoluteBaseUrl: "https://localhost/",
    craftBaseUrl: "https://craft.localhost/",
  };

  const isInternalUrlFilter = createIsInternalUrlFilter({ site });

  describe("isInternalUrlFilter(url)", () => {
    it.each([
      "/",
      "#",
      "/en/",
      "https://localhost/",
      "https://craft.localhost/",
    ])("returns true for internal urls (%s)", (url) => {
      const isInternalUrl = isInternalUrlFilter(url);

      expect(isInternalUrl).toBe(true);
    });

    it.each([
      "https://localhost:5000/",
      "https://craft.localhost:5000/",
    ])("returns false for external urls (%s)", (url) => {
      const isInternalUrl = isInternalUrlFilter(url);

      expect(isInternalUrl).toBe(false);
    });
  });
});
