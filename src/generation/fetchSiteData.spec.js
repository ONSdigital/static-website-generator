import fetchSiteData from "./fetchSiteData.js";

const ALL_SITES_BY_NAME = {
  en: {
    name: "en",
    title: "Example English Website",
    sources: [
      {
        name: "first",
        fetchData: async (site) => ({ foo: site.title }),
      },
      {
        name: "second",
        fetchData: async (site) => ({ bar: 42 }),
      },
    ],
  },
};

describe("fetchSiteData(site, allSitesByName)", () => {
  it("includes all sites in resulting data", async () => {
    const data = await fetchSiteData(ALL_SITES_BY_NAME.en, ALL_SITES_BY_NAME);

    expect(data.sites).toBe(ALL_SITES_BY_NAME);
  });

  it("includes site in resulting data", async () => {
    const data = await fetchSiteData(ALL_SITES_BY_NAME.en, ALL_SITES_BY_NAME);

    expect(data.site).toBe(ALL_SITES_BY_NAME.en);
  });

  it("includes fetched data in resulting data", async () => {
    const data = await fetchSiteData(ALL_SITES_BY_NAME.en, ALL_SITES_BY_NAME);

    expect(data.first.foo).toBe("Example English Website");
    expect(data.second.bar).toBe(42);
  });
});
