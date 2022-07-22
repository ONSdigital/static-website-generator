import resolveUrl from "./resolveUrl.js";

const EXAMPLE_CONTEXT = {
  site: {
    baseUrl: "https://example.com/",
  },
};

describe("resolveUrl(url, context)", () => {
  it("replaces `/@root/` with base URL of site", () => {
    const resolvedUrl = resolveUrl("/@root/about-us", EXAMPLE_CONTEXT);

    expect(resolvedUrl).toBe("https://example.com/about-us");
  });
});
