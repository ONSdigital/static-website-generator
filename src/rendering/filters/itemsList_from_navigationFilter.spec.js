import itemsList_from_navigationFilter from "./itemsList_from_navigationFilter.js";

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
  url: "/data-security",
  navigationTitle: "Data security",
};

const EXAMPLE_ENTRY_ITEM_WITH_MATCHING_TITLE = {
  url: "/data-security",
  title: "Data security",
  navigationTitle: "Data security",
};

const EXAMPLE_ENTRY_ITEM_WITH_DIFFERENT_TITLE = {
  url: "/data-security",
  title: "Keeping data secure",
  navigationTitle: "Data security",
};

describe("itemsList_from_navigationFilter(navigationItems)", () => {
  it("returns expected `itemsList` for entry item", () => {
    const itemsList = itemsList_from_navigationFilter.call(EXAMPLE_TEMPLATE_CONTEXT, [
      EXAMPLE_ENTRY_ITEM,
    ]);

    expect(itemsList).toEqual([
      {
        text: "Data security",
        title: "Data security",
        url: "/data-security",
        ariaLabel: "Data security",
      },
    ]);
  });

  it("returns expected `itemsList` for entry item where a `navigationTitle` is present and matches `title`", () => {
    const itemsList = itemsList_from_navigationFilter.call(EXAMPLE_TEMPLATE_CONTEXT, [
      EXAMPLE_ENTRY_ITEM_WITH_MATCHING_TITLE,
    ]);

    expect(itemsList).toEqual([
      {
        text: "Data security",
        title: "Data security",
        url: "/data-security",
        ariaLabel: "Data security",
      },
    ]);
  });

  it("returns expected `itemsList` for entry item where a `navigationTitle` is present and is different from `title`", () => {
    const itemsList = itemsList_from_navigationFilter.call(EXAMPLE_TEMPLATE_CONTEXT, [
      EXAMPLE_ENTRY_ITEM_WITH_DIFFERENT_TITLE,
    ]);

    expect(itemsList).toEqual([
      {
        text: "Data security",
        title: "Data security",
        url: "/data-security",
        ariaLabel: "Data security",
      },
    ]);
  });
});
