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
});
