import { jest } from "@jest/globals";

// 1. Establish the module mock structure using unstable_mockModule for ESM
jest.unstable_mockModule("../utils/fileUtils.js", () => ({
  convertJSONToArray: jest.fn(),
  convertArrayToJSON: jest.fn(),
}));

// 2. Statically import external modules/constants as usual
import { errorCodes } from "../utils/validation.js";

// 3. Dynamically import the mocked utilities and the service under test
const { convertJSONToArray, convertArrayToJSON } = await import("../utils/fileUtils.js");
const { default: ContactManager } = await import("../services/contactService.js");

describe("ContactManager Service", () => {
  let mockContacts;

  beforeEach(() => {
    jest.clearAllMocks();
    mockContacts = [
      { name: "John Doe", email: "john@example.com", phone: "1234" },
      { name: "Jane Smith", email: "jane@example.com", phone: "5678" }
    ];
    convertJSONToArray.mockReturnValue(mockContacts);
  });

  test("should initialize with items from fileUtils or fall back to an empty array", () => {
    const manager = new ContactManager();
    expect(manager.getContacts()).toEqual(mockContacts);

    convertJSONToArray.mockReturnValue(null);
    const emptyManager = new ContactManager();
    expect(emptyManager.getContacts()).toEqual([]);
  });

  describe("add", () => {
    test("should successfully add a new unique contact", () => {
      const manager = new ContactManager();
      const result = manager.add("Bob Ross", "bob@example.com", "9999");

      expect(result.command).toBe("add");
      expect(result.name).toBe("Bob Ross");
      expect(result.contacts).toContainEqual({ name: "Bob Ross", email: "bob@example.com", phone: "9999" });
      expect(convertArrayToJSON).toHaveBeenCalledWith(manager.getContacts());
    });

    test("should reject and return an error code if email already exists", () => {
      const manager = new ContactManager();
      const result = manager.add("John Fake", "john@example.com", "0000");

      expect(result).toEqual({ code: errorCodes.EMAIL_ALREADY_EXIST });
    });
  });

  describe("delete", () => {
    test("should successfully remove existing contact matching email", () => {
      const manager = new ContactManager();
      const result = manager.delete("john@example.com");

      expect(result.command).toBe("delete");
      expect(result.deletedName).toBe("John Doe");
      expect(manager.getContacts().length).toBe(1);
      expect(convertArrayToJSON).toHaveBeenCalledWith(manager.getContacts());
    });

    test("should return error details if email does not match any contact", () => {
      const manager = new ContactManager();
      const result = manager.delete("missing@example.com");

      expect(result).toEqual({
        code: errorCodes.EMAIL_NOT_FOUND,
        email: "missing@example.com"
      });
    });
  });

  describe("list", () => {
    test("should return list command packet along with current items array", () => {
      const manager = new ContactManager();
      const result = manager.list();
      expect(result).toEqual({ command: "list", contacts: mockContacts });
    });
  });

  describe("search", () => {
    test("should search by exact match if string contains @", () => {
      const manager = new ContactManager();
      const result = manager.search("jane@example.com");
      expect(result.searchedContact).toEqual([{ name: "Jane Smith", email: "jane@example.com", phone: "5678" }]);
    });

    test("should filter matching full name precisely if criteria includes spaces", () => {
      const manager = new ContactManager();
      const result = manager.search("John Doe");
      expect(result.searchedContact).toEqual([{ name: "John Doe", email: "john@example.com", phone: "1234" }]);
    });

    test("should search matches by individual first or last name segment when search string is single-word", () => {
      const manager = new ContactManager();
      
      const resultFirst = manager.search("Jane");
      expect(resultFirst.searchedContact).toEqual([{ name: "Jane Smith", email: "jane@example.com", phone: "5678" }]);

      const resultLast = manager.search("Doe");
      expect(resultLast.searchedContact).toEqual([{ name: "John Doe", email: "john@example.com", phone: "1234" }]);
    });
  });
});