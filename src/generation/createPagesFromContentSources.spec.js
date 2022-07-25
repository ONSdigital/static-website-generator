import createPagesFromContentSources from "./createPagesFromContentSources.js";

const EXAMPLE_SITE = {
  name: "en",
  sources: [
    {
      name: "first",
      createPages: (site, sourceData) => ([
        { title: "Page from first content source" },
        { title: "Another page from first content source" },
      ]),
    },
    {
      name: "second",
      createPages: (site, sourceData) => ([
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

describe("createPagesFromContentSources(site, data)", () => {
  describe("pages from content sources", () => {
    it("returns a flat array of pages from all content sources", () => {
      const pages = createPagesFromContentSources(EXAMPLE_SITE, EXAMPLE_SITE_DATA);

      expect(pages).toEqual([
        { title: "Page from first content source" },
        { title: "Another page from first content source" },
        { title: "Page from second content source" },
        { title: "Another page from second content source" },
      ]);
    });

    it("provides source data when creating pages", () => {
      let providedSite, providedSourceData;

      const site = {
        name: "en",
        sources: [
          {
            name: "first",
            createPages: (site, sourceData) => {
              providedSite = site;
              providedSourceData = sourceData;
              return [];
            },
          },
        ],
      };

      createPagesFromContentSources(site, EXAMPLE_SITE_DATA);

      expect(providedSite).toBe(site);
      expect(providedSourceData).toBe(EXAMPLE_SITE_DATA.first);
    });
  });

  describe("pages from hook", () => {
    describe("pages from content sources", () => {
      it("returns a flat array of pages from all content sources", () => {
        const site = {
          ...EXAMPLE_SITE,
          hooks: {
            createPagesForSite: ({site, data}) => ([
              { title: "Page from hook" },
              { title: "Another page from hook" },
            ]),
          }
        }

        const pages = createPagesFromContentSources(site, EXAMPLE_SITE_DATA);
  
        expect(pages).toEqual([
          { title: "Page from first content source" },
          { title: "Another page from first content source" },
          { title: "Page from second content source" },
          { title: "Another page from second content source" },
          { title: "Page from hook" },
          { title: "Another page from hook" },
        ]);
      });
  
      it("provides source data when creating pages", () => {
        let providedSite, providedSourceData;
  
        const site = {
          name: "en",
          sources: [],
          hooks: {
            createPagesForSite: ({site, data}) => {
              providedSite = site;
              providedSourceData = data;
              return [];
            },
          }
        };
  
        createPagesFromContentSources(site, EXAMPLE_SITE_DATA);
  
        expect(providedSite).toBe(site);
        expect(providedSourceData).toBe(EXAMPLE_SITE_DATA);
      });
    });
  });
});
