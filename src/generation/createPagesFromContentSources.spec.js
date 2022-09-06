import createPagesFromContentSources from "./createPagesFromContentSources.js";

const EXAMPLE_SITE = {
  name: "en",
  sources: [
    {
      name: "first",
      createPages: async (site, sourceData) => ([
        { title: "Page from first content source" },
        { title: "Another page from first content source" },
      ]),
    },
    {
      name: "second",
      createPages: async (site, sourceData) => ([
        { title: "Page from second content source" },
        { title: "Another page from second content source" },
      ]),
    },
  ],
};

const EXAMPLE_SITE_DATA = {
  first: {
    someValue: 23,
  },
  second: {
    otherValue: 72,
  },
};

describe("async createPagesFromContentSources(site, data)", () => {
  describe("pages from content sources", () => {
    it("returns a flat array of pages from all content sources", async () => {
      const pages = await createPagesFromContentSources(EXAMPLE_SITE, EXAMPLE_SITE_DATA);

      expect(pages).toEqual([
        { title: "Page from first content source" },
        { title: "Another page from first content source" },
        { title: "Page from second content source" },
        { title: "Another page from second content source" },
      ]);
    });

    it("provides source data when creating pages", async () => {
      let providedSite, providedSourceData;

      const site = {
        name: "en",
        sources: [
          {
            name: "first",
            createPages: async (site, sourceData) => {
              providedSite = site;
              providedSourceData = sourceData;
              return [];
            },
          },
        ],
      };

      await createPagesFromContentSources(site, EXAMPLE_SITE_DATA);

      expect(providedSite).toBe(site);
      expect(providedSourceData).toBe(EXAMPLE_SITE_DATA.first);
    });
  });

  describe("pages from hook", () => {
    describe("pages from content sources", () => {
      it("returns a flat array of pages from all content sources", async () => {
        const site = {
          ...EXAMPLE_SITE,
          hooks: {
            createPagesForSite: async ({site, data}) => ([
              { title: "Page from hook" },
              { title: "Another page from hook" },
            ]),
          }
        }

        const pages = await createPagesFromContentSources(site, EXAMPLE_SITE_DATA);
  
        expect(pages).toEqual([
          { title: "Page from first content source" },
          { title: "Another page from first content source" },
          { title: "Page from second content source" },
          { title: "Another page from second content source" },
          { title: "Page from hook" },
          { title: "Another page from hook" },
        ]);
      });
  
      it("provides source data when creating pages", async () => {
        let providedSite, providedSourceData;
  
        const site = {
          name: "en",
          sources: [],
          hooks: {
            createPagesForSite: async ({site, data}) => {
              providedSite = site;
              providedSourceData = data;
              return [];
            },
          }
        };
  
        await createPagesFromContentSources(site, EXAMPLE_SITE_DATA);
  
        expect(providedSite).toBe(site);
        expect(providedSourceData).toBe(EXAMPLE_SITE_DATA);
      });
    });
  });
});
