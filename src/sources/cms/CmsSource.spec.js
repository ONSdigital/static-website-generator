import CmsSource from "./CmsSource.js";

const FAKE_SITE = {
  name: "cy",
};

describe("CmsSource", () => {
  describe("get name()", () => {
    it("returns 'cms'", () => {
      const cmsSource = new CmsSource();

      expect(cmsSource.name).toBe("cms");
    });
  });

  describe("async fetchData(site)", () => {
    it("creates a client with the expected parameters", async () => {
      let actualEndpoint, actualOptions;

      const cmsSource = new CmsSource({
        graphQL: {
          createClient: (endpoint, options) => {
            actualEndpoint = endpoint;
            actualOptions = options;
            return {
              request: async (query) => ({}),
            };
          },
          endpoint: "https://localhost:1234/api/data",
          headers: { "Authorization": "42" },
          queryFilePath: "tests/examples/graphql/content.gql",
        }
      });

      await cmsSource.fetchData(FAKE_SITE);

      expect(actualOptions).toEqual({
        headers: { "Authorization": "42" },
      });
    });

    it("initiates request with the expected query", async () => {
      let actualQuery, actualQueryParams;

      const cmsSource = new CmsSource({
        graphQL: {
          createClient: (endpoint, options) => ({
            request: async (query, params) => {
              actualQuery = query;
              actualQueryParams = params;
              return {};
            },
          }),
          endpoint: "https://localhost:1234/api/data",
          queryFilePath: "tests/examples/graphql/content.gql",
        }
      });

      await cmsSource.fetchData(FAKE_SITE);

      expect(actualQuery.trim()).toBe("query { }");
      expect(actualQueryParams).toEqual({ site: "cy" });
    });

    it("throws formatted error", async () => {
      const cmsSource = new CmsSource({
        graphQL: {
          createClient: (endpoint, options) => ({
            request: async (query, params) => {
              const err = new Error();
              err.response = {
                errors: [
                  { message: "Error with message." },
                  { debugMessage: "Error with debug message." },
                ],
              };
              throw err;
            },
          }),
          endpoint: "https://localhost:1234/api/data",
          queryFilePath: "tests/examples/graphql/content.gql",
        }
      });

      await expect(cmsSource.fetchData(FAKE_SITE))
        .rejects
        .toThrow("Failure whilst querying GraphQL endpoint:\n  - Error with message.\n  - Error with debug message.");
    });

    it("applies data transforms", async () => {
      const cmsSource = new CmsSource({
        graphQL: {
          createClient: (endpoint, options) => ({
            request: async (query, params) => {
              return {
                entries: [
                  {
                    id: "2",
                    title: "First entry",
                    other__pull__: [
                      { _entryRef: "11" }
                    ]
                  },
                  {
                    id: "11",
                    title: "Second entry",
                  },
                ],
              };
            },
          }),
          endpoint: "https://localhost:1234/api/data",
          queryFilePath: "tests/examples/graphql/content.gql",
        }
      });

      const data = await cmsSource.fetchData(FAKE_SITE);

      expect(data.entries[0].other.title).toBe("Second entry");
    });
  });

  describe("createPages(site, data)", () => {
    it("returns an empty array", () => {
      const cmsSource = new CmsSource();

      const pages = cmsSource.createPages(FAKE_SITE, {});

      expect(pages).toEqual([]);
    });
  });
});
