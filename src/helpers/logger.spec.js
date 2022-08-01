import * as logger from "./logger.js";

const restoreConsole = global.console;

describe("logger", () => {
  afterAll(() => {
    global.console = restoreConsole;
  });

  describe("stage(text)", () => {
    it("outputs expected text to the console", () => {
      let loggedMessage = null;
      global.console = {
        log(message) { loggedMessage = message; },
      };

      logger.stage("Creating pages for site...");

      expect(loggedMessage).toBe("Creating pages for site...");
    });
  });

  describe("step(text)", () => {
    it("outputs expected text to the console", () => {
      let loggedMessage = null;
      global.console = {
        log(message) { loggedMessage = message; },
      };

      logger.step("Applying default transforms to pages...");

      expect(loggedMessage).toBe("  Applying default transforms to pages...");
    });
  });

  describe("error(err)", () => {
    it("outputs expected error to the console", () => {
      let loggedError = null;
      global.console = {
        error(err) { loggedError = err; },
      };

      const testError = new Error("Test error");
      logger.error(testError);

      expect(loggedError).toBe(testError);
    });
  });
});
