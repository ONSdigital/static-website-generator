import renderSitePages from "./renderSitePages.js";

const FAKE_RENDERER = {
  render: async (page, context) => `<section>${ page.body }</section>`,
};

const FAKE_WRITE_PAGE = async () => {};

describe("renderSitePages(siteOutputPath, processedSite, renderer, writePage)", () => {
  it("wraps processed output with rendered template", async () => {
    let processedOutput;
    const processedSite = {
      pages: [
        {
          title: "Fake page",
          layout: "example",
          body: "Body content",
        },
      ],
    };

    const fakeWritePage = async (outputPath, _processedOutput) => {
      processedOutput = _processedOutput;
    };

    await renderSitePages("dist", processedSite, FAKE_RENDERER, fakeWritePage);

    expect(processedOutput).toBe("<section>Body content</section>");
  });

  it.each([
    null,
    undefined,
    "",
  ])("does not wrap processed output with rendered template when layout is %s", async (layout) => {
    let processedOutput;
    const processedSite = {
      pages: [
        {
          title: "Fake page",
          layout,
          body: "Body content",
        },
      ],
    };

    const fakeWritePage = async (outputPath, _processedOutput) => {
      processedOutput = _processedOutput;
    };

    await renderSitePages("dist", processedSite, FAKE_RENDERER, fakeWritePage);

    expect(processedOutput).toBe("Body content");
  });

  it("calls `postprocessPageOutput` hook with expected parameters", async () => {
    let actualHookContext;
    const processedSite = {
      pages: [
        { layout: "example", title: "Fake page", body: "Example body content..." },
      ],
      hooks: {
        postprocessPageOutput: async (hookContext) => {
          actualHookContext = hookContext;
          return hookContext.output;
        },
      }
    };

    await renderSitePages("dist", processedSite, FAKE_RENDERER, FAKE_WRITE_PAGE);

    expect(actualHookContext.output).toBe("<section>Example body content...</section>");
    expect(actualHookContext.page.title).toBe("Fake page");
    expect(actualHookContext.processedSite).toBe(processedSite);
  });

  it("calls `writePage` with expected parameters when `uri` is defined for page", async () => {
    const processedSite = {
      pages: [
        { layout: "example", uri: "fake/page", title: "Fake page", body: "Example body content..." },
      ],
    };

    let actualOutputPath, actualProcessedOutput;
    const fakeWritePage = async (outputPath, processedOutput) => {
      actualOutputPath = outputPath;
      actualProcessedOutput = processedOutput;
    };

    await renderSitePages("dist", processedSite, FAKE_RENDERER, fakeWritePage);

    expect(actualOutputPath).toBe("dist/fake/page/index.html");
    expect(actualProcessedOutput).toBe("<section>Example body content...</section>");
  });

  it("calls `writePage` with a default output path of 'index.html' when no `uri` is defined for page", async () => {
    const processedSite = {
      pages: [
        { layout: "example", title: "Fake page", body: "Example body content..." },
      ],
    };

    let actualOutputPath, actualProcessedOutput;
    const fakeWritePage = async (outputPath, processedOutput) => {
      actualOutputPath = outputPath;
      actualProcessedOutput = processedOutput;
    };

    await renderSitePages("dist", processedSite, FAKE_RENDERER, fakeWritePage);

    expect(actualOutputPath).toBe("dist/index.html");
    expect(actualProcessedOutput).toBe("<section>Example body content...</section>");
  });
});
