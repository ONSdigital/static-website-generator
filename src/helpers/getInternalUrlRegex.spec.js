import getInternalUrlRegex from "./getInternalUrlRegex.js";

describe("getInternalUrlRegex(site)", () => {
  const site = {
    baseUrl: "https://localhost:3000/",
    absoluteBaseUrl: "https://localhost:3012/",
    craftBaseUrl: "https://localhost:3024/",
  };

  const internalUrlRegex = getInternalUrlRegex(site);

  it.each([
    "/",
    "/cookies",
    "#",
    "#cookies",
    "https://localhost:3000",
    "https://localhost:3000/",
    "https://localhost:3000/cookies",
    "https://localhost:3012",
    "https://localhost:3012/",
    "https://localhost:3012/cookies",
    "https://localhost:3024",
    "https://localhost:3024/",
    "https://localhost:3024/cookies",
  ])("returns a regular expression which matches internal urls (%s)", (url) => {
    const isInternalUrl = internalUrlRegex.test(url);

    expect(isInternalUrl).toBe(true);
  });

  it.each([
    "https://localhost:5000#",
    "https://localhost:5000#cookies",
    "https://localhost:5000",
    "https://localhost:5000/",
    "https://localhost:5000/cookies",
    "https://localhost:5012",
    "https://localhost:5012/",
    "https://localhost:5012/cookies",
    "https://localhost:5024",
    "https://localhost:5024/",
    "https://localhost:5024/cookies",
  ])("returns a regular expression which does not match external urls (%s)", (url) => {
    const isInternalUrl = internalUrlRegex.test(url);

    expect(isInternalUrl).toBe(false);
  });
});
