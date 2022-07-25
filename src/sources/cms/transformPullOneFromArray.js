const PULL_SUFFIX = "__pull__";

export default function transformPullOneFromArray(sourceData) {
  const pull = (obj) => {
    if (!obj) { return; }
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        if (key.endsWith(PULL_SUFFIX)) {
          const resolvedKey = key.substr(0, key.length - PULL_SUFFIX.length);
          obj[resolvedKey] = (obj[key] && obj[key].length !== 0)
            ? (obj[key][0] ?? null)
            : null;
          delete obj[key];
          pull(obj[resolvedKey]);
        }
        else {
          pull(obj[key]);
        }
      }
    }
  };
  pull(sourceData);
}
