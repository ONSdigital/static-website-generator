import itemsList_from_navigationItemsFilter from "./itemsList_from_navigationItemsFilter.js";

const EXAMPLE_TEMPLATE_CONTEXT = {
  getVariables() {
    return {
      site: {
        baseUrl: "https://example.com/",
      },
    };
  },
};

const EXAMPLE_ENTRY_ITEM = {
  typeHandle: "entryNavigationItem",
  targetEntry: {
    url: "/data-security",
    navigationTitle: "Data security",
  },
};

const EXAMPLE_ENTRY_ITEM_WITH_MATCHING_TITLE = {
  typeHandle: "entryNavigationItem",
  targetEntry: {
    url: "/data-security",
    title: "Data security",
    navigationTitle: "Data security",
  },
};

const EXAMPLE_ENTRY_ITEM_WITH_DIFFERENT_TITLE = {
  typeHandle: "entryNavigationItem",
  targetEntry: {
    url: "/data-security",
    title: "Keeping data secure",
    navigationTitle: "Data security",
  },
};

const EXAMPLE_URL_ITEM = {
  typeHandle: "urlNavigationItem",
  labelText: "About us",
  targetUrl: "/about-us",
};

const EXAMPLE_URL_ITEM_WITH_RESOLVE_URL = {
  typeHandle: "urlNavigationItem",
  labelText: "About us",
  targetUrl: "/@root/about-us",
};

describe("itemsList_from_navigationItemsFilter(navigationItems)", () => {
  describe("entry item (`entryNavigationItem`)", () => {
    it("returns expected `itemsList` for entry item", () => {
      const itemsList = itemsList_from_navigationItemsFilter.call(EXAMPLE_TEMPLATE_CONTEXT, [
        EXAMPLE_ENTRY_ITEM,
      ]);

      expect(itemsList).toEqual([
        {
          text: "Data security",
          title: "Data security",
          url: "/data-security",
          ariaLabel: null,
        },
      ]);
    });

    it("returns expected `itemsList` for entry item where a `navigationTitle` is present and matches `title`", () => {
      const itemsList = itemsList_from_navigationItemsFilter.call(EXAMPLE_TEMPLATE_CONTEXT, [
        EXAMPLE_ENTRY_ITEM_WITH_MATCHING_TITLE,
      ]);

      expect(itemsList).toEqual([
        {
          text: "Data security",
          title: "Data security",
          url: "/data-security",
          ariaLabel: null,
        },
      ]);
    });

    it("returns expected `itemsList` for entry item where a `navigationTitle` is present and is different from `title`", () => {
      const itemsList = itemsList_from_navigationItemsFilter.call(EXAMPLE_TEMPLATE_CONTEXT, [
        EXAMPLE_ENTRY_ITEM_WITH_DIFFERENT_TITLE,
      ]);

      expect(itemsList).toEqual([
        {
          text: "Data security",
          title: "Data security",
          url: "/data-security",
          ariaLabel: "Keeping data secure",
        },
      ]);
    });
  });

  describe("url item (`urlNavigationItem`)", () => {
    it("returns expected `itemsList` for url item", () => {
      const itemsList = itemsList_from_navigationItemsFilter.call(EXAMPLE_TEMPLATE_CONTEXT, [
        EXAMPLE_URL_ITEM,
      ]);

      expect(itemsList).toEqual([
        {
          text: "About us",
          title: "About us",
          url: "/about-us",
        },
      ]);
    });

    it("resolves item URLs", () => {
      const itemsList = itemsList_from_navigationItemsFilter.call(EXAMPLE_TEMPLATE_CONTEXT, [
        EXAMPLE_URL_ITEM_WITH_RESOLVE_URL,
      ]);

      expect(itemsList).toEqual([
        {
          text: "About us",
          title: "About us",
          url: "https://example.com/about-us",
        },
      ]);
    });
  });
});
