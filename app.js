import {
  printCommandResult,
  printCommandTemplate,
  printErrorMessage,
  printHelp,
  printInvalidCommand,
  printLoadedContacts,
  printLoading,
} from "./commands/commandHandler.js";
import ContactManager from "./services/contactService.js";
import {
  isValidCommand,
  verifyNumberofArguments,
  verifyEmail,
} from "./utils/validation.js";
//===================================================================================

let command = process.argv[2];
let verifyResult, verifyEmailResult, result;
let contactManager;
const args = [...process.argv.slice(3)];
switch (command) {
  case "add":
    verifyResult = verifyNumberofArguments("add", args, 3);
    if (isValidCommand(verifyResult.code)) {
      let [name, email, phone] = args;

      verifyEmailResult = verifyEmail(email);
      if (verifyEmailResult.code === "VALID_EMAIL") {
        printLoading();
        contactManager = new ContactManager();
        printLoadedContacts(contactManager.getContacts());
        result = contactManager.add(name, email, phone);
        if (!result.code) {
          printCommandResult(result);
        }
        //Command threw error
        else {
          printErrorMessage(result);
        }
      }
      //Invalid Email
      else {
        printErrorMessage(verifyEmailResult);
      }
    }
    //Invalid arguments
    else {
      printErrorMessage(verifyResult);
      printCommandTemplate(command);
    }
    break;

  case "delete":
    verifyResult = verifyNumberofArguments("delete", args, 1);
    if (isValidCommand(verifyResult.code)) {
      let email = args[0];
      verifyEmailResult = verifyEmail(email);
      if (verifyEmailResult.code === "VALID_EMAIL") {
        printLoading();
        contactManager = new ContactManager();
        printLoadedContacts(contactManager.getContacts());
        result = contactManager.delete(email);
        if (!result.code) {
          printCommandResult(result);
        }
        //Command threw error
        else {
          printErrorMessage(result);
        }
      }
      //Invalid Email
      else {
        printErrorMessage(verifyEmailResult);
      }
    }
    //Invalid arguments
    else {
      printErrorMessage(verifyResult);
      printCommandTemplate(command);
    }
    break;

  case "list":
    verifyResult = verifyNumberofArguments("list", args, 0);
    if (isValidCommand(verifyResult.code)) {
      printLoading();
      contactManager = new ContactManager();
      printLoadedContacts(contactManager.getContacts());
      result = contactManager.list();
      printCommandResult(result);
    }
    //Invalid arguments
    else {
      printErrorMessage(verifyResult);
      printCommandTemplate(command);
    }
    break;

  case "search":
    verifyResult = verifyNumberofArguments("search", args, 1);
    if (isValidCommand(verifyResult.code)) {
      printLoading();
      contactManager = new ContactManager();
      printLoadedContacts(contactManager.getContacts());
      let name_or_email = process.argv[3];
      result = contactManager.search(name_or_email);
      printCommandResult(result);
    }
    //Invalid arguments
    else {
      printErrorMessage(verifyResult);
      printCommandTemplate(command);
    }
    break;

  case "help":
    verifyResult = verifyNumberofArguments("help", args, 0);
    if (isValidCommand(verifyResult.code)) {
      printHelp();
    }
    //Invalid arguments
    else {
      printErrorMessage(verifyResult);
      printCommandTemplate(command);
    }
    break;

  default:
    printInvalidCommand(command);
    break;
}
