import getInternalUrlRegex from "../../helpers/getInternalUrlRegex.js";

export default function createIsInternalUrlFilter(data) {
  const internalUrlRegex = getInternalUrlRegex(data.site);

  return function isInternalUrlFilter(url) {
    return internalUrlRegex.test(url);
  };
}
