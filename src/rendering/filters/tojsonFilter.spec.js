import tojsonFilter from './tojsonFilter';

describe('tojsonFilter', () => {
    it('converts data to JSON', () => {
        expect(tojsonFilter({ foo: 1 }).toString()).toBe('{"foo":1}');
    });
    it('escapes complex data', () => {
        expect(tojsonFilter('"ba&r\'').toString()).toBe('"\\"ba\\u0026r\\u0027"');
        expect(tojsonFilter('<bar>').toString()).toBe('"\\u003cbar\\u003e"');
        expect(tojsonFilter("'''").toString()).toBe('"\\u0027\\u0027\\u0027"');
    });
});
