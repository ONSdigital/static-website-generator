import createStringReplacer from "./createStringReplacer.js";

describe("createStringReplacer(replacements)", () => {
  it("returns a function that performs multiple replacements", () => {
    const replacer = createStringReplacer({
      "abc|def?": "foo",
      "\\d+": "bar",
    });

    const result = replacer("abcdef 1234 abc def");

    expect(result).toBe("foofoo bar foo foo");
  });

  it("uses a custom replacer function when one is provided", () => {
    const replacer = createStringReplacer({
      "example-(?<ref>\\d+)": (groups) => groups.ref,
      "\\d+": "bar",
    });

    const result = replacer("example-72 1234 example-14");

    expect(result).toBe("72 bar 14");
  });
});
