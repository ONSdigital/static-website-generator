import dateFilter from "./dateFilter.js";

describe("dateFilter(str, format, locale", () => {
  it.each([
    [ "2020-12-10", "DD MMMM YYYY", "10 December 2020" ],
    [ "2020-12-10", "MMM Do YYYY", "Dec 10th 2020" ],
    [ "2016-01-08T00:00:00-06:00", "LT DD MMMM YYYY", "06:00 08 January 2016" ],
  ])("formats text (%s) with the provided format (%s) with default locale of 'en-gb'", (str, format, expectedResult) => {
    const result = dateFilter(str, format);

    expect(result).toBe(expectedResult);
  });

  it.each([
    [ "2020-12-10", "DD MMMM YYYY", "10 Rhagfyr 2020" ],
    [ "2020-12-10", "MMM Do YYYY", "Rhag 10fed 2020" ],
    [ "2016-01-08T00:00:00-06:00", "LT DD MMMM YYYY", "06:00 08 Ionawr 2016" ],
  ])("formats text (%s) with the provided format (%s) with explicit locale of 'cy'", (str, format, expectedResult) => {
    const result = dateFilter(str, format, "cy");

    expect(result).toBe(expectedResult);
  });
});
