import addUrlAttributes from "./addUrlAttributes.js";

const EXAMPLE_SITE = {
  absoluteBaseUrl: "https://localhost:1234/en/",
  baseUrl: "/en/",
};

describe("addUrlAttributes({ pages, site })", () => {
  it("adds `absoluteUrl` attribute to each page object", () => {
    const pages = [
      { uri: "about" },
      { uri: "news/example-news-article" },
    ];

    addUrlAttributes({ pages, site: EXAMPLE_SITE });

    expect(pages[0].absoluteUrl).toBe("https://localhost:1234/en/about");
    expect(pages[1].absoluteUrl).toBe("https://localhost:1234/en/news/example-news-article");
  });

  it("adds `absoluteUrl` attribute for home/root page ('__home__')", () => {
    const pages = [
      { uri: "__home__" },
    ];

    addUrlAttributes({ pages, site: EXAMPLE_SITE });

    expect(pages[0].absoluteUrl).toBe("https://localhost:1234/en/");
  });

  it("adds `url` attribute to each page object", () => {
    const pages = [
      { uri: "about" },
      { uri: "news/example-news-article" },
    ];

    addUrlAttributes({ pages, site: EXAMPLE_SITE });

    expect(pages[0].url).toBe("/en/about");
    expect(pages[1].url).toBe("/en/news/example-news-article");
  });

  it("adds `url` attribute for home/root page ('__home__')", () => {
    const pages = [
      { uri: "__home__" },
    ];

    addUrlAttributes({ pages, site: EXAMPLE_SITE });

    expect(pages[0].url).toBe("/en/");
  });
});
