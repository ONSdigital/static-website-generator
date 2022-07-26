// --experimental-vm-modules is required to disable babel in jest.

export default {
  testEnvironment: "jest-environment-node",
  transform: {},
  verbose: true,
  setupFilesAfterEnv: [ "./tests/setup.js" ],
};
