import { convertArrayToJSON, convertJSONToArray } from "../utils/fileUtils.js";
import { errorCodes, verifyEmail } from "../utils/validation.js";


export default class ContactManager {
  constructor() {
    this._contacts = convertJSONToArray("services/contact.json") ?? [];
  }


  add(name, email, phone) {
    let duplicateEmail = this._contacts.findIndex(
      (contact) => contact.email === email,
    );
    if (duplicateEmail !== -1) {
      return {
        code: errorCodes.EMAIL_ALREADY_EXIST,
      };
    } else {
      this._contacts.push({ name, email, phone });
      convertArrayToJSON(this._contacts);
      return {
        command: "add",
        name,
        contacts: this._contacts,
      };
    }
  }


  delete(email) {
    let foundIndex = this._contacts.findIndex(
      (contact) => contact.email === email,
    );
    if (foundIndex !== -1) {
      let deletedContact = this._contacts[foundIndex];
      let {
        name: deletedName,
        email: deletedEmail,
        phone: deletePhone,
      } = deletedContact;
      this._contacts.splice(foundIndex, 1);
      convertArrayToJSON(this._contacts);
      return {
        command: "delete",
        deletedName,
        contacts: this._contacts,
      };
    } else {
      return {
        code: errorCodes.EMAIL_NOT_FOUND,
        email,
      };
    }
  }


  list() {
    return { command: "list", contacts: this._contacts };
  }
  search(name_or_email) {
    let searchedContact;
    if (name_or_email.includes("@")) {
      searchedContact = this._contacts.filter(
        (contact) => contact.email === name_or_email,
      );
      return {
        command: "search",
        searchedContact,
        name_or_email,
        contacts: this._contacts,
      };
    } else {
      let words = name_or_email.split(" ");
      if (words.length == 2)
        searchedContact = this._contacts.filter(
          (contact) =>
            contact.name.toLowerCase() === name_or_email.toLowerCase(),
        );
      else {
        searchedContact = this._contacts.filter((contact) => {
          words = contact.name.split(" ");
          return (
            words[0].toLowerCase() === name_or_email.toLowerCase() ||
            words[1].toLowerCase() === name_or_email.toLowerCase()
          );
        });
      }
      return {
        command: "search",
        searchedContact,
        name_or_email,
        contacts: this._contacts,
      };
    }
  }
  getContacts() {
    return this._contacts;
  }
}



