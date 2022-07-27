import loadStringsSync from "../../helpers/loadStringsSync.js";
import createLocalizeFilter from "./localizeFilter.js";

describe("createLocalizeFilter(site, stringsByLanguage)", () => {
  const site = { name: "cy" };
  const stringsByLanguage = loadStringsSync("tests/examples/strings");
  const localizeFilter = createLocalizeFilter(site, stringsByLanguage);

  describe("localizeFilter(text, context)", () => {
    it.each([
      [ "main", "This text is not inside a strings file." ],
      [ "panel", "This text is not inside the panels file." ],
      [ "does-not-exist", "This text is not inside the non-existent context file." ],
    ])("returns input text when entry is not defined in strings table (%s, %s)", (context, text) => {
      const string = localizeFilter(text, context);
      
      expect(string).toBe(text);
    });
    
    it.each([
      [ "main", "exampleWithKey", "Mae allweddi yn dda ar gyfer sefyllfaoedd lle mae llawer iawn o destun..." ],
      [ "panel", "Hide panel", "Cuddio'r panel" ],
      [ "panel", "Show panel", "Dangos panel" ],
    ])("returns expected text when entry is defined in strings table (%s, %s)", (context, text, expectedString) => {
      const string = localizeFilter(text, context);
      
      expect(string).toBe(expectedString);
    });
  });
});
