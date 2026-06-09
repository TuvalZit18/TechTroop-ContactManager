export const printLoadedContacts = (contacts) => {
  if (contacts.length > 0)
    console.log(`✓ Loaded ${contacts.length} contacts\n`);
};
export const printLoading = () => {
  console.log(`Loading contacts from contact.json ...`);
};
export const printHelp = () => {
  console.log(`
Commands:
  add "name" "email" "phone"  - Add a new contact
  list                        - List all contacts
  search "query"              - Search contacts by name or email
  delete "email"              - Delete contact by email
  help                        - Show this help message


Examples:
  node contacts.js add "John Doe" "john@example.com" "555-123-4567"
  node contacts.js search "john"
  node contacts.js delete "john@example.com"
`);
};


export const printInvalidCommand = (command) => {
  console.log(`✗ Error: Unknown command '${command}'`);
  console.log(
    "Usage: node contacts.js [add|list|search|delete|help] [arguments]",
  );
};


export const printCommandTemplate = (command) => {
  switch (command) {
    case "add":
      console.log('Usage: node contacts.js add "name" "email" "phone"');
      break;
    case "delete":
      console.log('Usage: node contacts.js delete "email"');
      break;
    case "list":
      console.log("Usage: node contacts.js list");
      break;
    case "search":
      console.log('Usage: node contacts.js search ["name" || "email"]');
      break;
    case "help":
      console.log(`Usage: node contacts.js help`);
      break;
  }
};


export const printCommandResult = (result) => {
  if (result.command) {
    let command = result.command;
    let contacts = result.contacts;
    switch (result.command) {
      case "add":
        let name = result.name;
        console.log(`✓ Contact added: ${name}`);
        console.log(`✓ Contacts saved to contact.json`);
        break;
      case "delete":
        let deletedName = result.deletedName;
        console.log(`✓ Contact deleted: ${deletedName}`);
        console.log(`✓ Contacts saved to contact.json`);
        break;
      case "list":
        contacts = result.contacts;
        console.log("=== All Contacts===");
        if (contacts.length > 0)
          for (let i = 0; i < contacts.length; i++) {
            console.log(
              `${i + 1}. ${contacts[i].name} - ${contacts[i].email} - ${contacts[i].phone}`,
            );
          }
        else {
          console.log(`contacts.json is empty`);
        }


        break;
      case "search":
        let searchedContact = result.searchedContact;
        let name_or_email = result.name_or_email;
        console.log(`=== Search Results for "${name_or_email}" ===`);


        if (searchedContact.length === 0)
          console.log(`No contacts found matching "${name_or_email}"\n`);
        else
          for (let i = 0; i < searchedContact.length; i++) {
            console.log(
              `${i + 1}. ${searchedContact[i].name} - ${searchedContact[i].email} - ${searchedContact[i].phone}`,
            );
          }
        break;
    }
  }
};
export const printErrorMessage = (error) => {
  let errorCode = error.code;
  switch (errorCode) {
    case "EMAIL_ALREADY_EXIST":
      console.log("✗ Error: Contact with this email already exists");
      break;
    case "INVALID_EMAIL":
      console.log("✗ Error: Email must contain @ symbol");
      break;
    case "EMAIL_NOT_FOUND":
      console.log(`✗ Error: No contact found with email: ${error.email}`);
      break;
    case "MISSING_ARGUMENTS":
      console.log(`✗ Error: Missing arguments for ${error.command} command`);
      break;
    case "TOO_MANY_ARGUMENTS":
      console.log(`✗ Error: Too many arguments for ${error.command} command`);
      break;
  }
};



