import createRenderer from "./createRenderer.js";

describe("createRenderer()", () => {
  it("returns an object with a nunjucks environment", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.nunjucksEnvironment.addFilter).toBeInstanceOf(Function);
  });

  it("calls the given setup function providing the nunjucks environment", async () => {
    let setupContext;

    const setupNunjucks = (context) => { setupContext = context };
    const renderer = await createRenderer("tests/examples/templates", {}, setupNunjucks);

    await expect(setupContext.nunjucksEnvironment).toBe(renderer.nunjucksEnvironment);
  });

  it("returns an object with render functions", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    expect(renderer.render).toBeInstanceOf(Function);
    expect(renderer.renderString).toBeInstanceOf(Function);
  });

  it("escapes html characters by default", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString('{{ "<b>Test</b>" }}'))
      .resolves
      .toBe("&lt;b&gt;Test&lt;/b&gt;");
  });

  it("does not escape html characters when `safe` filter is used", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString('{{ "<b>Test</b>" | safe }}'))
      .resolves
      .toBe("<b>Test</b>");
  });

  it("adds a global to get the design system version", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString("{{ designSystemVersion }}"))
      .resolves
      .toBe("53.1.0");
  });

  it("adds a global to get the design system cdn base URL", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString("{{ designSystemCdnBaseUrl }}"))
      .resolves
      .toBe("https://cdn.ons.gov.uk/sdc/design-system/");
  });

  it("adds a global to get the versioned design system cdn URL", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString("{{ designSystemCdnUrl }}"))
      .resolves
      .toBe("https://cdn.ons.gov.uk/sdc/design-system/53.1.0");
  });

  it("is able to load templates from the design system", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    const templateString = `
      {% from "components/panel/_macro.njk" import onsPanel %}
      {{
        onsPanel({
          body: "Example panel text."
        })
      }}
    `;

    await expect(renderer.renderString(templateString))
      .resolves
      .toContain("ons-panel");
  });

  it("throws when using an undefined filter", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString("{{ 2020-11-23 | nonExistentFilter }}"))
      .rejects
      .toThrow();
  });

  it("adds the custom 'date' filter", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString("{{ 2020-11-23 | date }}"))
      .resolves
      .not.toThrow();
  });

  it("adds the custom 'itemsList_from_navigation' filter", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString("{{ [] | itemsList_from_navigation }}"))
      .resolves
      .not.toThrow();
  });

  it("adds the custom 'itemsList_from_navigationItems' filter", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString("{{ [] | itemsList_from_navigationItems }}"))
      .resolves
      .not.toThrow();
  });

  it("adds the custom 'localize' filter", async () => {
    const renderer = await createRenderer("tests/examples/templates", {
      site: { name: "en" },
      stringsByLanguage: { },
    });

    await expect(renderer.renderString('{{ "Home" | localize }}'))
      .resolves
      .not.toThrow();
  });

  it("can use 'localize' filter inside a macro", async () => {
    const renderer = await createRenderer("tests/examples/templates", {
      site: { name: "en" },
      stringsByLanguage: {
        en: {
          "main": {
            "value": "Overridden value text",
          },
        },
      },
    });

    const templateString = `
      {% from "macros/macro-with-localize-filter.njk" import macroWithLocalizeFilter %}
      {{
        macroWithLocalizeFilter("value")
      }}
    `;

    await expect(renderer.renderString(templateString))
      .resolves
      .toContain("Overridden value text");
  });

  it("adds the custom 'setProperty' filter", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString('{{ {} | setProperty("someValue", 42) }}'))
      .resolves
      .not.toThrow();
  });

  it("adds the custom 'uniqueId' filter", async () => {
    const renderer = await createRenderer("tests/examples/templates", {});

    await expect(renderer.renderString('{{ "article" | uniqueId }}'))
      .resolves
      .not.toThrow();
  });

  describe("renderer.render(page, context)", () => {
    it("resolves page templates from the given templates directory", async () => {
      const renderer = await createRenderer("tests/examples/templates", {});
  
      const examplePage = {
        title: "Example page",
        layout: "layouts/simple",
      };

      await expect(renderer.render(examplePage))
        .resolves
        .toBe("Page title: Example page\n");
    });

    it("makes data object accessible from templates", async () => {
      const renderer = await createRenderer("tests/examples/templates", {
        someData: { number: 42 },
      });
  
      const examplePage = {
        title: "Example with data",
        layout: "layouts/example-with-data",
      };

      await expect(renderer.render(examplePage))
        .resolves
        .toBe("Some data: 42\n");
    });

    it("makes context object accessible from templates", async () => {
      const renderer = await createRenderer("tests/examples/templates", {});
  
      const examplePage = {
        title: "Example with data",
        layout: "layouts/example-with-data",
      };

      const templateContext = {
        someData: { number: 17 },
      };

      await expect(renderer.render(examplePage, templateContext))
        .resolves
        .toBe("Some data: 17\n");
    });

    it("provides context when an error occurs", async() => {
      const renderer = await createRenderer("tests/examples/templates", {
        site: { name: "en" },
      });
  
      const examplePage = {
        uri: "example-with-error",
        title: "Example with error",
        layout: "layouts/example-with-error",
      };

      await expect(renderer.render(examplePage, {}))
        .rejects
        .toThrow("An error occurred whilst rendering page 'example-with-error' from site 'en' with layout 'layouts/example-with-error'");
    });
  });

  describe("renderer.renderString(templateString, context)", () => {
    it("renders template string", async () => {
      const renderer = await createRenderer("tests/examples/templates", {});

      await expect(renderer.renderString("Test: {{ 3 + 5 }}"))
        .resolves
        .toBe("Test: 8");
    });

    it("makes data object accessible from templates", async () => {
      const renderer = await createRenderer("tests/examples/templates", {
        someData: { number: 123 },
      });

      await expect(renderer.renderString("Some number: {{ someData.number }}"))
        .resolves
        .toBe("Some number: 123");
    });

    it("makes data object accessible from templates", async () => {
      const renderer = await createRenderer("tests/examples/templates", {});

      const templateContext = {
        someData: { number: 96 },
      };

      await expect(renderer.renderString("Some number: {{ someData.number }}", templateContext))
        .resolves
        .toBe("Some number: 96");
    });
  });
});
