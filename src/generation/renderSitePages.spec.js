import renderSitePages from "./renderSitePages.js";

const FAKE_RENDERER = {
  render: async (page, context) => `<section>${ page.body }</section>`,
};

const FAKE_WRITE_PAGE = async () => {};

describe("renderSitePages(siteOutputPath, processedSite, renderer, writePage)", () => {
  it("uses `_processor` to generate page body", async () => {
    let processedBody;
    const processedSite = {
      pages: [
        {
          title: "Fake page",
          layout: null,
          _processor: {
            process: (context) => ({
              body: "Processed content",
            }),
          },
        },
      ],
      hooks: {
        postprocessPageOutput: ({ output, page }) => {
          processedBody = page.body;
          return output;
        },
      }
    };

    await renderSitePages("dist", processedSite, FAKE_RENDERER, FAKE_WRITE_PAGE);

    expect(processedBody).toBe("Processed content");
  });

  it("wraps processed output with rendered template", async () => {
    let processedOutput;
    const processedSite = {
      pages: [
        {
          title: "Fake page",
          layout: "example",
          _processor: {
            process: (context) => ({
              body: "Processed content",
            }),
          },
        },
      ],
    };

    const fakeWritePage = async (outputPath, _processedOutput) => {
      processedOutput = _processedOutput;
    };

    await renderSitePages("dist", processedSite, FAKE_RENDERER, fakeWritePage);

    expect(processedOutput).toBe("<section>Processed content</section>");
  });

  it("does not wrap processed output with rendered template when layout is `null`", async () => {
    let processedOutput;
    const processedSite = {
      pages: [
        {
          title: "Fake page",
          layout: null,
          _processor: {
            process: (context) => ({
              body: "Processed content",
            }),
          },
        },
      ],
    };

    const fakeWritePage = async (outputPath, _processedOutput) => {
      processedOutput = _processedOutput;
    };

    await renderSitePages("dist", processedSite, FAKE_RENDERER, fakeWritePage);

    expect(processedOutput).toBe("Processed content");
  });

  it("uses renderer when layout is `null` and when there is no processor", async () => {
    const processedSite = {
      pages: [
        { layout: null, title: "Fake page", body: "Example body content..." },
      ],
    };

    let actualProcessedOutput;
    const fakeWritePage = async (outputPath, processedOutput) => {
      actualProcessedOutput = processedOutput;
    };

    await renderSitePages("dist", processedSite, FAKE_RENDERER, fakeWritePage);

    expect(actualProcessedOutput).toBe("<section>Example body content...</section>");
  });

  it("calls `postprocessPageOutput` hook with expected parameters", async () => {
    let actualHookContext;
    const processedSite = {
      pages: [
        { title: "Fake page", body: "Example body content..." },
      ],
      hooks: {
        postprocessPageOutput: (hookContext) => {
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
        { uri: "fake/page", title: "Fake page", body: "Example body content..." },
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
        { title: "Fake page", body: "Example body content..." },
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
