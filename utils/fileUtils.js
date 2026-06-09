import fs from "fs";
import path from "path";

export const convertJSONToArray = function (fileName) {
  let file;
  try {
    file = fs.openSync(fileName, "r");
    try {
      const data = fs.readFileSync(file, "utf8");
      let contacts = JSON.parse(data);
      return contacts;
    } catch (error) {
      if (error.code === "EISDIR") console.log(`Cannot Read Directory`);
      else console.log(`Cannot Read File: ${fileName}`);
      return null;
    } finally {
      if (file) fs.closeSync(file);
    }
  } catch (error) {
    console.log(`✗ File not found - creating new contact list`);
    return null;
  }
};

export const convertArrayToJSON = function (contacts) {
  let file;
  try {
    file = JSON.stringify(contacts);
    let filePath = path.resolve("services", "contact.json");
    fs.writeFileSync(filePath, file, "utf-8");
  } catch (error) {
    console.error("failed to write file:", error.message);
  }
};
