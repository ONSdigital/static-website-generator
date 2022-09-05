export default function transformLinkRefs(sourceData) {
  const stack = new Set();
  const link = (obj) => {
    stack.add(obj);
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        if (obj[key]._entryRef) {
          obj[key] = sourceData.getEntryById(obj[key]._entryRef);
        }
        else if (obj[key]._categoryRef) {
          obj[key] = sourceData.getCategoryById(obj[key]._categoryRef);
        }
        else if (obj[key]._tagRef) {
          obj[key] = sourceData.getTagById(obj[key]._tagRef);
        }
        else if (obj[key]._assetRef) {
          obj[key] = sourceData.getAssetById(obj[key]._assetRef);
        }
        else if (!stack.has(obj[key])) {
          link(obj[key]);
        }
      }
    }
    stack.delete(obj);
  };
  link(sourceData);
}
