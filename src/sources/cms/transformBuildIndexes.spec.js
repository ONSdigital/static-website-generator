import transformBuildIndexes from "./transformBuildIndexes.js";

const EXAMPLE_SOURCE_DATA = {
  entries: [
    {
      id: 24,
      title: "Example entry",
    },
    {
      id: 72,
      title: "Another example entry",
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

  assets: [
    {
      id: 4,
      title: "Example asset",
    },
  ]
};

describe("transformBuildIndexes(sourceData)", () => {
  describe("getEntryById(id)", () => {
    it("doesn't fail when `sourceData.entries` is undefined", () => {
      const sourceData = {};
      transformBuildIndexes(sourceData);

      const result = sourceData.getEntryById(24);

      expect(result).toBe(null);
    });

    it("returns `null` when entry does not exist", () => {
      const sourceData = { ...EXAMPLE_SOURCE_DATA };
      transformBuildIndexes(sourceData);

      const result = sourceData.getEntryById(12345);

      expect(result).toBe(null);
    });

    it("returns the expected entry", () => {
      const sourceData = { ...EXAMPLE_SOURCE_DATA };
      transformBuildIndexes(sourceData);

      const result = sourceData.getEntryById(72);

      expect(result.title).toBe("Another example entry");
    });
  });

  describe("getCategoryById(id)", () => {
    it("doesn't fail when `sourceData.categories` is undefined", () => {
      const sourceData = {};
      transformBuildIndexes(sourceData);

      const result = sourceData.getCategoryById(24);

      expect(result).toBe(null);
    });

    it("returns `null` when category does not exist", () => {
      const sourceData = { ...EXAMPLE_SOURCE_DATA };
      transformBuildIndexes(sourceData);

      const result = sourceData.getCategoryById(12345);

      expect(result).toBe(null);
    });

    it("returns the expected category", () => {
      const sourceData = { ...EXAMPLE_SOURCE_DATA };
      transformBuildIndexes(sourceData);

      const result = sourceData.getCategoryById(4);

      expect(result.title).toBe("Example category B");
    });
  });

  describe("getAssetById(id)", () => {
    it("doesn't fail when `sourceData.assets` is undefined", () => {
      const sourceData = {};
      transformBuildIndexes(sourceData);

      const result = sourceData.getAssetById(24);

      expect(result).toBe(null);
    });

    it("returns `null` when asset does not exist", () => {
      const sourceData = { ...EXAMPLE_SOURCE_DATA };
      transformBuildIndexes(sourceData);

      const result = sourceData.getAssetById(12345);

      expect(result).toBe(null);
    });

    it("returns the expected asset", () => {
      const sourceData = { ...EXAMPLE_SOURCE_DATA };
      transformBuildIndexes(sourceData);

      const result = sourceData.getAssetById(4);

      expect(result.title).toBe("Example asset");
    });
  });
});
