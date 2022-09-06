import transformBuildIndexes from "./transformBuildIndexes.js";
import transformLinkRefs from "./transformLinkRefs.js";

const EXAMPLE_SOURCE_DATA = {
  entries: [
    {
      id: 24,
      title: "Example entry",
      entry: { _entryRef: 72 },
      categories: [
        { _categoryRef: 2 },
        { _categoryRef: 4 },
      ],
      tags: [
        { _tagRef: 12 },
      ],
      asset: { _assetRef: 4 },
    },
    {
      id: 72,
      title: "Another example entry",
      entry: { _entryRef: 24 },
      categories: [
        { _categoryRef: 4 },
      ],
      tags: [
        { _tagRef: 14 },
        { _tagRef: 12 },
      ],
      asset: { _assetRef: 4 },
    },
  ],

  categories: [
    {
      id: 2,
      title: "Example category A",
    },
    {
      id: 4,
      title: "Example category B",
    },
  ],

  tags: [
    {
      id: 12,
      title: "Example tag A",
    },
    {
      id: 14,
      title: "Example tag B",
    },
  ],

  assets: [
    {
      id: 4,
      title: "Example asset",
    },
  ]
};

describe("transformLinkRefs(sourceData)", () => {
  it("replaces entry reference identifiers with actual entry reference", () => {
    const sourceData = { ...EXAMPLE_SOURCE_DATA };
    transformBuildIndexes(sourceData);

    transformLinkRefs(sourceData);

    expect(sourceData.entries[0].entry).toBe(sourceData.entries[1]);
    expect(sourceData.entries[1].entry).toBe(sourceData.entries[0]);
  });

  it("replaces category reference identifiers with actual category reference", () => {
    const sourceData = { ...EXAMPLE_SOURCE_DATA };
    transformBuildIndexes(sourceData);

    transformLinkRefs(sourceData);

    expect(sourceData.entries[0].categories[0]).toBe(sourceData.categories[0]);
    expect(sourceData.entries[0].categories[1]).toBe(sourceData.categories[1]);
    expect(sourceData.entries[1].categories[0]).toBe(sourceData.categories[1]);
  });

  it("replaces tag reference identifiers with actual tag reference", () => {
    const sourceData = { ...EXAMPLE_SOURCE_DATA };
    transformBuildIndexes(sourceData);

    transformLinkRefs(sourceData);

    expect(sourceData.entries[0].tags[0]).toBe(sourceData.tags[0]);
    expect(sourceData.entries[1].tags[0]).toBe(sourceData.tags[1]);
    expect(sourceData.entries[1].tags[1]).toBe(sourceData.tags[0]);
  });

  it("replaces asset reference identifiers with actual asset reference", () => {
    const sourceData = { ...EXAMPLE_SOURCE_DATA };
    transformBuildIndexes(sourceData);

    transformLinkRefs(sourceData);

    expect(sourceData.entries[0].asset).toBe(sourceData.assets[0]);
    expect(sourceData.entries[1].asset).toBe(sourceData.assets[0]);
  });
});
