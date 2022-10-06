import fs from "fs-extra";

import Generator from "./Generator.js";

const FAKE_CONTENT_SOURCES = [
  {
    name: "firstSource",
    fetchData: async (site) => ({ foo: site.title }),
    createPages: async (site, data) => ([
      {
        id: "contact",
        layout: "layouts/simple",
        uri: "contact",
        title: `Contact page (${site.name})`,
        body: "Body content.",
        pagination: {
          data: [ 1, 2, 3 ],
          size: 2,
        }
      },
    ]),
  },
  {
    name: "secondSource",
    fetchData: async (site) => ({ bar: 42 }),
    createPages: async (site, data) => ([
      {
        id: "home",
        layout: "layouts/simple",
        uri: "",
        title: `Home page (${site.name})`,
        body: "Body content.",
        _processor: {
          process: async ({ page }) => ({
            body: `Processed content: ${page.body}`,
          }),
        },
      },
    ]),
  },
];

function createExampleOptions(options = {}) {
  const { hooks } = options;
  return {
    sites: [
      {
        name: "en",
        title: "Example English Website",
        baseUrl: "/en/",
        absoluteBaseUrl: "https://localhost:1234/en/",
        sources: FAKE_CONTENT_SOURCES,
        templateSearchPaths: [ "tests/examples/templates" ],
        hooks,
      },
      {
        name: "cy",
        title: "Example Welsh Website",
        baseUrl: "/cy/",
        absoluteBaseUrl: "https://localhost:1234/cy/",
        sources: FAKE_CONTENT_SOURCES,
        templateSearchPaths: [ "tests/examples/templates" ],
        hooks,
      },
    ],

    stringsByLanguage: {
      en: {
        "main": {
          "exampleWithKey": "Keys are good for situations where there are large volumes of text...",
        },
      },
      cy: {
        "main": {
          "exampleWithKey": "Mae allweddi yn dda ar gyfer sefyllfaoedd lle mae llawer iawn o destun...",
        },
      },
    },

    writePage: options.writePage ?? (async () => {}),
  };
}

describe("Generator", () => {
  describe("async generate(outputPath)", () => {
    it.each([
      [ "" ],
      [ null ],
    ])("throws error when output path is not provided (%s)", async (outputPath) => {
      const options = createExampleOptions();
      const generator = new Generator(options);

      await expect(generator.generate(outputPath))
        .rejects
        .toThrow("Invalid outputPath");
    });

    it("throws error when output path would be root of storage", async () => {
      const options = createExampleOptions();
      const generator = new Generator(options);

      await expect(generator.generate("/"))
        .rejects
        .toThrow("Invalid outputPath");
    });

    it("calls hook `preprocessDataForSite` to preprocess data", async () => {
      let hookCalledWithContext = [];
      const hooks = {
        preprocessDataForSite: async (context) => {
          hookCalledWithContext.push(context);
        },
      };

      const options = createExampleOptions({ hooks });
      const generator = new Generator(options);

      await generator.generate("dist/test/generate");

      expect(hookCalledWithContext[0].site.name).toBe("en");
      expect(hookCalledWithContext[1].site.name).toBe("cy");
    });

    it("adds source data to site data object", async () => {
      let hookCalledWithContext = [];
      const hooks = {
        preprocessDataForSite: async (context) => {
          hookCalledWithContext.push(context);
        },
      };

      const options = createExampleOptions({ hooks });
      const generator = new Generator(options);
      await generator.generate("dist/test/generate");

      expect(hookCalledWithContext[0].data.firstSource.foo).toEqual("Example English Website");
      expect(hookCalledWithContext[0].data.secondSource.bar).toEqual(42);
    });

    it("adds `stringsByLanguage` to site data object", async () => {
      let hookCalledWithContext = [];
      const hooks = {
        preprocessDataForSite: async (context) => {
          hookCalledWithContext.push(context);
        },
      };

      const options = createExampleOptions({ hooks });
      const generator = new Generator(options);

      await generator.generate("dist/test/generate");

      expect(hookCalledWithContext[0].data.stringsByLanguage).toEqual(options.stringsByLanguage);
    });

    it("emits the function `getPageByUri` on the site data object", async () => {
      let hookCalledWithContext = [];
      const hooks = {
        preprocessDataForSite: async (context) => {
          hookCalledWithContext.push(context);
        },
      };

      const options = createExampleOptions({ hooks });
      const generator = new Generator(options);

      await generator.generate("dist/test/generate");

      const homePage = hookCalledWithContext[0].data.getPageByUri("");
      expect(homePage.title).toEqual("Home page (en)");
      const contactPage = hookCalledWithContext[0].data.getPageByUri("contact");
      expect(contactPage.title).toEqual("Contact page (en)");
    });

    it("calls hook `applyTransformsToPages` to transform page objects", async () => {
      let hookCalledWithContext = [];
      const hooks = {
        applyTransformsToPages: async (context) => {
          hookCalledWithContext.push(context);
        },
      };

      const options = createExampleOptions({ hooks });
      const generator = new Generator(options);

      await generator.generate("dist/test/generate");

      expect(hookCalledWithContext[0].pages.length).toBe(2);
      expect(hookCalledWithContext[0].site.name).toBe("en");
      expect(hookCalledWithContext[0].data.secondSource.bar).toBe(42);
    });

    it("adds `url` and `absoluteUrl` attributes to page objects", async () => {
      let hookCalledWithContext = [];
      const hooks = {
        applyTransformsToPages: async (context) => {
          hookCalledWithContext.push(context);
        },
      };

      const options = createExampleOptions({ hooks });
      const generator = new Generator(options);

      await generator.generate("dist/test/generate");

      const homePage = hookCalledWithContext[0].pages.find(page => page.uri === "");
      expect(homePage.url).toBe("/en/");
      expect(homePage.absoluteUrl).toBe("https://localhost:1234/en/");

      const contactPage = hookCalledWithContext[0].pages.find(page => page.uri === "contact");
      expect(contactPage.url).toBe("/en/contact");
      expect(contactPage.absoluteUrl).toBe("https://localhost:1234/en/contact");
    });

    it("removes the previous output directory", async () => {
      await fs.ensureFile("dist/test/removes-output/test.txt");

      const options = createExampleOptions();
      const generator = new Generator(options);

      expect(fs.existsSync("dist/test/removes-output/test.txt")).toBe(true);
      await generator.generate("dist/test/removes-output");
      expect(fs.existsSync("dist/test/removes-output/test.txt")).toBe(false);
    });

    it("pre-process, render and write each page", async () => {
      let writtenPages = [];
      const writePage = async (path, content) => {
        writtenPages.push([ path, content.trim() ]);
      };

      const options = createExampleOptions({ writePage });
      const generator = new Generator(options);

      await generator.generate("dist/test/generate");

      expect(writtenPages).toContainEqual([
        "dist/test/generate/en/index.html",
        "Page title: Home page (en)\n\nProcessed content: Body content.",
      ]);
      expect(writtenPages).toContainEqual([
        "dist/test/generate/en/contact/index.html",
        "Page title: Contact page (en)\n\nBody content.",
      ]);
      expect(writtenPages).toContainEqual([
        "dist/test/generate/en/contact/2/index.html",
        "Page title: Contact page (en)\n\nBody content.",
      ]);

      expect(writtenPages).toContainEqual([
        "dist/test/generate/cy/index.html",
        "Page title: Home page (cy)\n\nProcessed content: Body content.",
      ]);
      expect(writtenPages).toContainEqual([
        "dist/test/generate/cy/contact/index.html",
        "Page title: Contact page (cy)\n\nBody content.",
      ]);
      expect(writtenPages).toContainEqual([
        "dist/test/generate/cy/contact/2/index.html",
        "Page title: Contact page (cy)\n\nBody content.",
      ]);
    });

    it("calls hook `afterPagesWritten` after all pages have been written", async () => {
      let hookCalledWithContext = [];
      const hooks = {
        afterPagesWritten: async (context) => {
          hookCalledWithContext.push(context);
        },
      };

      const options = createExampleOptions({ hooks });
      const generator = new Generator(options);

      await generator.generate("dist/test/generate");

      expect(hookCalledWithContext[0].siteOutputPath).toBe("dist/test/generate/en");
      expect(hookCalledWithContext[0].processedSite.name).toBe("en");
      expect(hookCalledWithContext[1].siteOutputPath).toBe("dist/test/generate/cy");
      expect(hookCalledWithContext[1].processedSite.name).toBe("cy");
    });
  });
});
