import paginate from "./paginate.js";

describe("paginate(page)", () => {
  describe("when there is no data", () => {
    it("returns an empty array", () => {
      const pages = paginate({
        title: "Test page",
        pagination: {
          data: [],
          size: 1,
        },
      });
  
      expect(pages.length).toBe(0);
    });

    it("returns a stub page when `generatePageOnEmptyData` is `true`", () => {
      const pages = paginate({
        title: "Test page",
        uri: "test-page",
        url: "/test-page",
        absoluteUrl: "https://example.com/test-page",

        pagination: {
          data: [],
          size: 1,
          generatePageOnEmptyData: true,
        },
      });
  
      expect(pages).toEqual([
        {
          parent: null,
          children: [],

          title: "Test page",

          id: undefined,
          uri: "test-page",
          url: "/test-page",
          absoluteUrl: "https://example.com/test-page",

          pagination: {
            data: [],
            size: 1,
            generatePageOnEmptyData: true,
            currentIndex: 0,
            pages: [
              {
                url: "/test-page",
                current: true,
              },
            ],
          },

          data: [],
        },
      ]);
    });
  });

  describe("when there is data", () => {
    it("returns one page when there is only one page of data", () => {
      const pages = paginate({
        title: "Test page",
        uri: "test-page",
        url: "/test-page",
        absoluteUrl: "https://example.com/test-page",

        pagination: {
          data: [ 1, 2, 3 ],
          size: 3,
        },
      });
  
      expect(pages).toEqual([
        {
          parent: null,
          children: [],

          title: "Test page",

          id: undefined,
          uri: "test-page",
          url: "/test-page",
          absoluteUrl: "https://example.com/test-page",

          pagination: {
            data: [ 1, 2, 3 ],
            size: 3,
            currentIndex: 0,
            pages: [
              {
                url: "/test-page",
                current: true,
              },
            ],
          },

          data: [ 1, 2, 3 ],
        },
      ]);
    });

    it("returns multiples pages when data overflows a single page", () => {
      const pages = paginate({
        title: "Test page",
        uri: "test-page",
        url: "/test-page",
        absoluteUrl: "https://example.com/test-page",

        pagination: {
          data: [ 1, 2, 3, 4 ],
          size: 3,
        },
      });
  
      expect(pages).toEqual([
        {
          parent: null,
          children: [],

          title: "Test page",

          id: undefined,
          uri: "test-page",
          url: "/test-page",
          absoluteUrl: "https://example.com/test-page",

          pagination: {
            data: [ 1, 2, 3, 4 ],
            size: 3,
            currentIndex: 0,
            pages: [
              {
                url: "/test-page",
                current: true,
              },
              {
                url: "/test-page/2",
                current: false,
              },
            ],
          },

          data: [ 1, 2, 3 ],
        },

        {
          parent: null,
          children: [],

          title: "Test page",

          id: undefined,
          uri: "test-page/2",
          url: "/test-page/2",
          absoluteUrl: "https://example.com/test-page/2",

          pagination: {
            data: [ 1, 2, 3, 4 ],
            size: 3,
            currentIndex: 1,
            pages: [
              {
                url: "/test-page",
                current: false,
              },
              {
                url: "/test-page/2",
                current: true,
              },
            ],
          },

          data: [ 4 ],
        },
      ]);
    });
  });

  describe("`pagination.dataAlias`", () => {
    it("does not output a `data` property when a `dataAlias` is provided", () => {
      const pages = paginate({
        title: "News listing",
        uri: "news",
        url: "/news",
        absoluteUrl: "https://example.com/news",

        pagination: {
          data: [ 1, 2, 3, 4 ],
          size: 3,
          dataAlias: "articles",
        },
      });

      expect(pages[0].data).toBeUndefined();
      expect(pages[1].data).toBeUndefined();
    });

    it("outputs page data as a property with the provided `dataAlias` key", () => {
      const pages = paginate({
        title: "News listing",
        uri: "news",
        url: "/news",
        absoluteUrl: "https://example.com/news",

        pagination: {
          data: [ 1, 2, 3, 4 ],
          size: 3,
          dataAlias: "articles",
        },
      });

      expect(pages[0].articles).toEqual([ 1, 2, 3 ]);
      expect(pages[1].articles).toEqual([ 4 ]);
    });
  });

  describe("substitution of `%PAGE_INDEX%` in `page.id`", () => {
    it("leaves `page.id` intact when `%PAGE_INDEX%` is not given", () => {
      const pages = paginate({
        id: "example-page",
        title: "Example page",
        uri: "example-page",
        url: "/example-page",
        absoluteUrl: "https://example.com/example-page",
  
        pagination: {
          data: [ 1, 2, 3, 4 ],
          size: 3,
        },
      });
  
      expect(pages[0].id).toBe("example-page");
      expect(pages[1].id).toBe("example-page");
    });
  
    it("substitutes `%PAGE_INDEX%` of `page.id` with the page index", () => {
      const pages = paginate({
        id: "[news/index]:%PAGE_INDEX%",
        title: "News listing",
        uri: "news",
        url: "/news",
        absoluteUrl: "https://example.com/news",
  
        pagination: {
          data: [ 1, 2, 3, 4 ],
          size: 3,
        },
      });
  
      expect(pages[0].id).toBe("[news/index]:0");
      expect(pages[1].id).toBe("[news/index]:1");
    });
  });
});
