import transformPullOneFromArray from "./transformPullOneFromArray.js";

describe("transformPullOneFromArray(sourceData)", () => {
  it("pulls a value of `null` when property is empty or not an array", () => {
    const sourceData = {
      first__pull__: null,
      empty__pull__: [],
      object__pull__: { abc: 42 },
      notArray__pull__: { length: 2 },
      nested1: {
        first__pull__: null,
        empty__pull__: [],
        object__pull__: { abc: 42 },
        notArray__pull__: { length: 2 },
        deepNested: {
          first__pull__: null,
          empty__pull__: [],
          object__pull__: { abc: 42 },
          notArray__pull__: { length: 2 },
        },
      },
      nested2: {
        first__pull__: null,
        empty__pull__: [],
        object__pull__: { abc: 42 },
        notArray__pull__: { length: 2 },
      },
    };

    transformPullOneFromArray(sourceData);

    expect(sourceData).toEqual({
      first: null,
      empty: null,
      object: null,
      notArray: null,
      nested1: {
        first: null,
        empty: null,
        object: null,
        notArray: null,
        deepNested: {
          first: null,
          empty: null,
          object: null,
          notArray: null,
        },
      },
      nested2: {
        first: null,
        empty: null,
        object: null,
        notArray: null,
      },
    });
  });

  it("pulls first element from an array", () => {
    const sourceData = {
      first__pull__: [ 1, 2 ],
      nested1: {
        abc__pull__: [ 42 ],
      },
      nested2__pull__: [
        {
          abc__pull__: [ 72, 24 ],
          deepNested__pull__: [
            {
              first__pull__: [ true ],
              second: 72,
            },
          ],
        },
      ],
    };

    transformPullOneFromArray(sourceData);

    expect(sourceData).toEqual({
      first: 1,
      nested1: {
        abc: 42,
      },
      nested2: {
        abc: 72,
        deepNested: {
          first: true,
          second: 72,
        },
      },
    });
  });
});
