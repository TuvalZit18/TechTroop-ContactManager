import { 
  verifyEmail, 
  isValidCommand, 
  verifyNumberofArguments, 
  errorCodes 
} from "../utils/validation.js";

describe("Validation Utils", () => {
  describe("verifyEmail", () => {
    test("should return VALID_EMAIL if email contains @", () => {
      expect(verifyEmail("test@example.com")).toEqual({ code: errorCodes.VALID_EMAIL });
    });

    test("should return INVALID_EMAIL if email does not contain @", () => {
      expect(verifyEmail("testexample.com")).toEqual({ code: errorCodes.INVALID_EMAIL });
    });
  });

  describe("isValidCommand", () => {
    test("should return true when code is VALID_COMMAND", () => {
      expect(isValidCommand("VALID_COMMAND")).toBe(true);
    });

    test("should return false when code is not VALID_COMMAND", () => {
      expect(isValidCommand("INVALID_COMMAND")).toBe(false);
    });
  });

  describe("verifyNumberofArguments", () => {
    test("should return MISSING_ARGUMENTS when provided args are fewer than required", () => {
      const result = verifyNumberofArguments("add", ["John"], 3);
      expect(result).toEqual({
        code: errorCodes.MISSING_ARGUMENTS,
        command: "add",
      });
    });

    test("should return TOO_MANY_ARGUMENTS when provided args are more than required", () => {
      const result = verifyNumberofArguments("list", ["extra"], 0);
      expect(result).toEqual({
        code: errorCodes.TOO_MANY_ARGUMENTS,
        command: "list",
      });
    });

    test("should return VALID_COMMAND when exact number of args are given", () => {
      const result = verifyNumberofArguments("delete", ["john@example.com"], 1);
      expect(result).toEqual({
        code: errorCodes.VALID_COMMAND,
        command: "delete",
      });
    });
  });
});