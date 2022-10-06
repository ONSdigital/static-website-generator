import setAttributesFilter from "./setAttributesFilter.js";

describe("setAttributesFilter(obj, attributes)", () => {
  it("returns an object with the newly set property", () => {
    const inputObject = {};

    const result = setAttributesFilter(inputObject, {
      someKey: "someValue",
    });

    expect(result).toHaveProperty("someKey", "someValue");
  });

  it("has properties from the original input object", () => {
    const inputObject = {
      originalKey: 42,
    };

    const result = setAttributesFilter(inputObject, {
      someKey: "someValue",
    });

    expect(result).toHaveProperty("originalKey", 42);
  });

  it("does not mutate input object", () => {
    const inputObject = {};

    const result = setAttributesFilter(inputObject, {
      someKey: "someValue",
    });

    expect(inputObject).not.toHaveProperty("someKey");
  });
});
