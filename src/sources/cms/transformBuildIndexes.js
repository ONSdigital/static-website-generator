export default function transformBuildIndexes(sourceData) {
  const entryMap = new Map((sourceData.entries ?? []).map(item => [ item.id, item ]));
  sourceData.getEntryById = (id) => entryMap.get(id) ?? null;
  const categoryMap = new Map((sourceData.categories ?? []).map(item => [ item.id, item ]));
  sourceData.getCategoryById = (id) => categoryMap.get(id) ?? null;
  const assetMap = new Map((sourceData.assets ?? []).map(item => [ item.id, item ]));
  sourceData.getAssetById = (id) => assetMap.get(id) ?? null;
}
