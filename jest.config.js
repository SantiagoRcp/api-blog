/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  verbose: true,
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "js", "json"],
};
