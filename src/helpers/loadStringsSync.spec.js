import loadStringsSync from "./loadStringsSync.js";

describe("loadStringsSync(stringsPath)", () => {
  it("discovers and loads strings from the specified directory", () => {
    const strings = loadStringsSync("tests/examples/strings");

    expect(strings).toEqual({
      en: {
        "main": {
          "exampleWithKey": "Keys are good for situations where there are large volumes of text...",
          "exampleWithNullValue": null,
        },

        "nested/directory/example": {
          "exampleFromNestedDirectory": "An example string from a nested directory.",
        }
      },

      cy: {
        "main": {
          "exampleWithKey": "Mae allweddi yn dda ar gyfer sefyllfaoedd lle mae llawer iawn o destun...",
          "exampleWithNullValue": null,
        },

        "panel": {
          "Hide panel": "Cuddio'r panel",
          "Show panel": "Dangos panel",
        },

        "nested/directory/example": {
          "exampleFromNestedDirectory": "Llinyn enghreifftiol o gyfeiriadur nythu.",
        }
      },
    });
  });
});
