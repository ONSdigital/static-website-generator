import escapeStringForRegExp from "./escapeStringForRegExp.js";

describe("escapeStringForRegExp(str)", () => {
  it.each([
    [ "--", "\\-\\-" ],
    [ "[[", "\\[\\[" ],
    [ "{{", "\\{\\{" ],
    [ "}}", "\\}\\}" ],
    [ "((", "\\(\\(" ],
    [ "))", "\\)\\)" ],
    [ "**", "\\*\\*" ],
    [ "++", "\\+\\+" ],
    [ "!!", "\\!\\!" ],
    [ "<<", "\\<\\<" ],
    [ "==", "\\=\\=" ],
    [ "::", "\\:\\:" ],
    [ "??", "\\?\\?" ],
    [ "..", "\\.\\." ],
    [ "//", "\\/\\/" ],
    [ "\\\\", "\\\\\\\\" ],
    [ "^^", "\\^\\^" ],
    [ "$$", "\\$\\$" ],
    [ "||", "\\|\\|" ],
    [ "##", "\\#\\#" ],
    [ "  ", "\\ \\ " ],
    [ ",,", "\\,\\," ],
  ])("escapes all special characters for use as plain text in a regular expression (%s -> %s)", (input, expectedOutput) => {
    const output = escapeStringForRegExp(input);

    expect(output).toBe(expectedOutput);
  });
});
