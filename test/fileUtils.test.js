import { jest } from "@jest/globals";

// 1. Mock Node built-in dependencies cleanly before importing modules
jest.unstable_mockModule("fs", () => ({
  default: {
    openSync: jest.fn(),
    readFileSync: jest.fn(),
    closeSync: jest.fn(),
    writeFileSync: jest.fn()
  }
}));

jest.unstable_mockModule("path", () => ({
  default: {
    resolve: jest.fn()
  }
}));

// 2. Dynamically import the mocked implementations of fs and path
const { default: fs } = await import("fs");
const { default: path } = await import("path");

// 3. Import the module under test as an object namespace to prevent variable collisions
const fileUtils = await import("../utils/fileUtils.js");

describe("File Utils", () => {
  let consoleLogSpy, consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    path.resolve.mockReturnValue("/mocked/path/services/contact.json");
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("convertJSONToArray", () => {
    test("should return parsed array when file exists and contains valid JSON", () => {
      fs.openSync.mockReturnValue(101);
      fs.readFileSync.mockReturnValue('[{"name":"John","email":"john@test.com"}]');

      const result = fileUtils.convertJSONToArray("test.json");

      expect(fs.openSync).toHaveBeenCalledWith("test.json", "r");
      expect(fs.readFileSync).toHaveBeenCalledWith(101, "utf8");
      expect(fs.closeSync).toHaveBeenCalledWith(101);
      expect(result).toEqual([{ name: "John", email: "john@test.com" }]);
    });

    test("should handle EISDIR error correctly when targeting a directory", () => {
      fs.openSync.mockReturnValue(102);
      const error = new Error("EISDIR");
      error.code = "EISDIR";
      fs.readFileSync.mockImplementation(() => { throw error; });

      const result = fileUtils.convertJSONToArray("directory_path");

      expect(consoleLogSpy).toHaveBeenCalledWith("Cannot Read Directory");
      expect(fs.closeSync).toHaveBeenCalledWith(102);
      expect(result).toBeNull();
    });

    test("should handle general generic reading errors", () => {
      fs.openSync.mockReturnValue(103);
      fs.readFileSync.mockImplementation(() => { throw new Error("Read failed"); });

      const result = fileUtils.convertJSONToArray("broken.json");

      expect(consoleLogSpy).toHaveBeenCalledWith("Cannot Read File: broken.json");
      expect(fs.closeSync).toHaveBeenCalledWith(103);
      expect(result).toBeNull();
    });

    test("should return null and print a missing list notice if the file cannot be opened", () => {
      fs.openSync.mockImplementation(() => { throw new Error("File not found"); });

      const result = fileUtils.convertJSONToArray("missing.json");

      expect(consoleLogSpy).toHaveBeenCalledWith("✗ File not found - creating new contact list");
      expect(result).toBeNull();
    });
  });

  describe("convertArrayToJSON", () => {
    test("should correctly write array data to file as JSON", () => {
      const contacts = [{ name: "Alice" }];
      fileUtils.convertArrayToJSON(contacts);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "/mocked/path/services/contact.json",
        JSON.stringify(contacts),
        "utf-8"
      );
    });

    test("should catch and log error if writing fails", () => {
      fs.writeFileSync.mockImplementation(() => { throw new Error("Disk Full"); });

      fileUtils.convertArrayToJSON([]);

      expect(consoleErrorSpy).toHaveBeenCalledWith("failed to write file:", "Disk Full");
    });
  });
});