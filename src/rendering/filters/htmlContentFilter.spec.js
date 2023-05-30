import createHtmlContentFilter from "./htmlContentFilter.js";

describe("createHtmlContentFilter(site)", () => {
  const site = {
    baseUrl: "/en/",
    absoluteBaseUrl: "https://localhost/",
    craftBaseUrl: "https://craft.localhost/",
  };

  const htmlContentFilter = createHtmlContentFilter({ site });

  describe("htmlContentFilter(htmlContent)", () => {
    it.each([
      [ `<a href="https://craft.localhost/cookies">Cookies</a>`, `<a href="/en/cookies">Cookies</a>` ],
      [ `<a class="foo" aria-label="Cookies page" href="https://craft.localhost/cookies">Cookies</a>`, `<a href="/en/cookies" class="foo" aria-label="Cookies page">Cookies</a>` ],
    ])("substitutes craft base url with the site base url in '%s'", (source, expectedString) => {
      const string = htmlContentFilter(source);

      expect(string).toBe(expectedString);
    });

    it.each([
      [ `<a href="/@root/cookies">Cookies</a>`, `<a href="/en/cookies">Cookies</a>` ],
      [ `<a class="foo" href="/@root/cookies" aria-label="Cookies page">Cookies</a>`, `<a href="/en/cookies" class="foo" aria-label="Cookies page">Cookies</a>` ],
    ])("substitutes '/@root/' with the site base url in '%s'", (source, expectedString) => {
      const string = htmlContentFilter(source);

      expect(string).toBe(expectedString);
    });

    it("decorates `<a>` elements when non-internal links", () => {
      const string = htmlContentFilter(`<a class="foo" href="https://external.localhost:1234/cookies" target="_blank">Some external cookies page</a>`);

      expect(string).toBe(`<a href="https://external.localhost:1234/cookies" class="ons-external-link foo" target="_blank" rel="noopener">
          <span class="ons-external-link__text">Some external cookies page</span><span class="ons-external-link__icon">&nbsp;<svg class="ons-svg-icon" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
            <path d="M13.5,9H13a.5.5,0,0,0-.5.5v3h-9v-9h3A.5.5,0,0,0,7,3V2.5A.5.5,0,0,0,6.5,2h-4a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,13.5,9Z" transform="translate(-2 -1.99)" />
            <path d="M8.83,7.88a.51.51,0,0,0,.71,0l2.31-2.32,1.28,1.28A.51.51,0,0,0,14,6.49v-4a.52.52,0,0,0-.5-.5h-4A.51.51,0,0,0,9,2.52a.58.58,0,0,0,.14.33l1.28,1.28L8.12,6.46a.51.51,0,0,0,0,.71Z" transform="translate(-2 -1.99)" />
          </svg></span><span class="ons-external-link__new-window-description ons-u-vh"> (opens in a new tab)</span></a>&nbsp;`);
    });

    it("decorates `<a>` elements when their `target` is '_blank'", () => {
      const string = htmlContentFilter(`<a class="foo" href="/@root/cookies" target="_blank">Cookies page</a>`);

      expect(string).toBe(`<a href="/en/cookies" class="ons-external-link foo" target="_blank" rel="noopener">
          <span class="ons-external-link__text">Cookies page</span><span class="ons-external-link__icon">&nbsp;<svg class="ons-svg-icon" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
            <path d="M13.5,9H13a.5.5,0,0,0-.5.5v3h-9v-9h3A.5.5,0,0,0,7,3V2.5A.5.5,0,0,0,6.5,2h-4a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,13.5,9Z" transform="translate(-2 -1.99)" />
            <path d="M8.83,7.88a.51.51,0,0,0,.71,0l2.31-2.32,1.28,1.28A.51.51,0,0,0,14,6.49v-4a.52.52,0,0,0-.5-.5h-4A.51.51,0,0,0,9,2.52a.58.58,0,0,0,.14.33l1.28,1.28L8.12,6.46a.51.51,0,0,0,0,.71Z" transform="translate(-2 -1.99)" />
          </svg></span><span class="ons-external-link__new-window-description ons-u-vh"> (opens in a new tab)</span></a>&nbsp;`);
    });

    it("does not decorate `<a>` elements when their `target` is '_self'", () => {
      const string = htmlContentFilter(`<a class="foo" href="/@root/cookies" target="_self">Cookies page</a>`);

      expect(string).toBe(`<a href="/en/cookies" class="foo" target="_self">Cookies page</a>`);
    });

    it("does not decorate `<a>` internal anchor links", () => {
      const string = htmlContentFilter(`<a class="foo" href="#feedback">Leave feedback</a>`);

      expect(string).toBe(`<a href="#feedback" class="foo">Leave feedback</a>`);
    });

    it("decorates `<table>` elements with the `ons-table` and `ons-table-scrollable`  classes", () => {
      const string = htmlContentFilter(`<table>`);

      expect(string).toBe(`<table class="ons-table ons-table-scrollable">`);
    });

    it("decorates `<thead>` elements with the `ons-table__head` class", () => {
      const string = htmlContentFilter(`<thead>`);

      expect(string).toBe(`<thead class="ons-table__head">`);
    });

    it("decorates `<tbody>` elements with the `ons-table__body` class", () => {
      const string = htmlContentFilter(`<tbody>`);

      expect(string).toBe(`<tbody class="ons-table__body">`);
    });

    it("decorates `<tr>` elements with the `ons-table__row` class", () => {
      const string = htmlContentFilter(`<tr>`);

      expect(string).toBe(`<tr class="ons-table__row">`);
    });

    it("decorates `<th>` elements with the `ons-table__header` class and with column scope", () => {
      const string = htmlContentFilter(`<th>`);

      expect(string).toBe(`<th class="ons-table__header" scope="col">`);
    });

    it("decorates `<td>` elements with the `ons-table__cell` class", () => {
      const string = htmlContentFilter(`<td>`);

      expect(string).toBe(`<td class="ons-table__cell">`);
    });
  });

  const htmlContentFilterWithCmsSource = createHtmlContentFilter({
    site,
    cms: {
      getEntryById: (id) => ({ url: `/en/${id}` }),
    },
  });

  describe("htmlContentFilter(htmlContent) with 'cms' source", () => {
    it.each([
      "http://localhost:3000/external-resource/42",
      "http://localhost/external-resource/42",
      "http://localhost/en/external-resource/42",
      "http://en.localhost/external-resource/42",

      "https://localhost:3000/external-resource/42",
      "https://localhost/external-resource/42",
      "https://localhost/en/external-resource/42",
      "https://en.localhost/external-resource/42",

      "//en/external-resource/42",
      "//external-resource/42",

      "/en/external-resource/42",
      "/external-resource/42",
    ])("resolves external urls of the format %s", (externalUrl) => {
      const string = htmlContentFilterWithCmsSource(`<a href="${externalUrl}">Some external resource</a>`);
      
      expect(string).toBe(`<a href="/en/42">Some external resource</a>`);
    });

    it("resolves external urls of the format and maintains other attributes", () => {
      const string = htmlContentFilterWithCmsSource(`<a class="foo" href="http://localhost:3000/external-resource/42">Some external resource</a>`);
      
      expect(string).toBe(`<a href="/en/42" class="foo">Some external resource</a>`);
    });
  });
});
