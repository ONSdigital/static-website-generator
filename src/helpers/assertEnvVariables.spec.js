import assertEnvVariables from "./assertEnvVariables.js";

describe("assertEnvVariables(variableNames)", () => {
  beforeAll(() => {
    process.env.FAKE_ENV_VAR = "42";
  });

  it("throws when an environment variable is not defined", () => {
    expect(() => {
      assertEnvVariables([ "FAKE_ENV_VAR", "PRETEND_ENV_VAR" ]);
    }).toThrow("Missing environment variable 'PRETEND_ENV_VAR'!");
  });

  it("does not throw when an environment variable is defined", () => {
    expect(() => {
      assertEnvVariables([ "FAKE_ENV_VAR" ]);
    }).not.toThrow();
  });
});
