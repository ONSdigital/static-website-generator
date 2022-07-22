import uniqueIdFilter from "./uniqueIdFilter.js";

describe("uniqueIdFilter(base)", () => {
  it("returns a different id each time", () => {
    const ids = new Set();

    ids.add(uniqueIdFilter("article"));
    ids.add(uniqueIdFilter("article"));
    ids.add(uniqueIdFilter("article"));

    expect(ids.size).toBe(3);
  });

  it.each([
    [ "article", /^article\.id\.[0-9]+$/ ],
    [ "example-element", /^example-element\.id\.[0-9]+$/],
  ])("returns id with the expected format (%s, %s)", (base, expectedPattern) => {
    const id = uniqueIdFilter(base);

    expect(id).toMatch(expectedPattern);
  });
});
