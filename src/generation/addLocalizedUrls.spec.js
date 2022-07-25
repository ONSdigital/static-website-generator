import addLocalizedUrls from "./addLocalizedUrls.js";

describe("addLocalizedUrls(processedSites)", () => {
  it("interlinks matching pages between across linked sites", () => {
    const processedSites = {
      en: {
        name: "en",
        linkedSites: [ "cy" ],
        pages: [
          { id: "about", title: "About us", absoluteUrl: "https://en.example.com/about" },
          { id: "extra-en", title: "English only page", absoluteUrl: "https://en.example.com/english-only-page" },
        ],
      },
      cy: {
        name: "cy",
        linkedSites: [ "en" ],
        pages: [
          { id: "about", title: "Amdanom ni", absoluteUrl: "https://cy.example.com/amdanom-ni" },
          { id: "extra-cy", title: "tudalen uniaith Gymraeg", absoluteUrl: "https://cy.example.com/tudalen-uniaith-gymraeg" },
        ],
      },
      ni: {
        name: "ni",
        pages: [
          { id: "about", title: "About us", absoluteUrl: "https://en.example.com/ni/about" },
        ],
      },
    };

    addLocalizedUrls(processedSites);

    expect(processedSites.en.pages[0].localizedUrls).toEqual({
      en: "https://en.example.com/about",
      cy: "https://cy.example.com/amdanom-ni",
    });
    expect(processedSites.en.pages[1].localizedUrls).toEqual({
      en: "https://en.example.com/english-only-page",
      cy: undefined,
    });

    expect(processedSites.cy.pages[0].localizedUrls).toEqual({
      en: "https://en.example.com/about",
      cy: "https://cy.example.com/amdanom-ni",
    });
    expect(processedSites.cy.pages[1].localizedUrls).toEqual({
      en: undefined,
      cy: "https://cy.example.com/tudalen-uniaith-gymraeg",
    });

    expect(processedSites.ni.pages[0].localizedUrls).toBe(undefined);
  });
});
