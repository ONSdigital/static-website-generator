import loadStringsSync from "./loadStringsSync.js";

describe("loadStringsSync(stringsPath)", () => {
  it("discovers and loads strings from the specified directory", () => {
    const strings = loadStringsSync("tests/examples/strings");

    expect(strings).toEqual({
      en: {
        main: {
          "exampleWithKey": "Keys are good for situations where there are large volumes of text...",
        },
      },

      cy: {
        main: {
          "exampleWithKey": "Mae allweddi yn dda ar gyfer sefyllfaoedd lle mae llawer iawn o destun...",
        },

        panel: {
          "Hide panel": "Cuddio'r panel",
          "Show panel": "Dangos panel",
        },
      },
    });
  });
});
