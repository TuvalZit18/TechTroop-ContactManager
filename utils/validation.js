export const errorCodes = {
  EMAIL_ALREADY_EXIST: "EMAIL_ALREADY_EXIST",
  INVALID_EMAIL: "INVALID_EMAIL",
  VALID_EMAIL: "VALID_EMAIL",
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  MISSING_ARGUMENTS: "MISSING_ARGUMENTS",
  TOO_MANY_ARGUMENTS: "TOO_MANY_ARGUMENTS",
  VALID_COMMAND: "VALID_COMMAND",
};
export const verifyEmail = (email) => {
  return email.includes("@")
    ? { code: errorCodes.VALID_EMAIL }
    : { code: errorCodes.INVALID_EMAIL };
};

export const isValidCommand = (verifyResult) => {
  return verifyResult === "VALID_COMMAND";
};

export const verifyNumberofArguments = (command, arg, numOfArguments) => {
  if (arg.length < numOfArguments) {
    return {
      code: errorCodes.MISSING_ARGUMENTS,
      command,
    };
  } else {
    if (arg.length > numOfArguments)
      return {
        code: errorCodes.TOO_MANY_ARGUMENTS,
        command,
      };
  }
  return {
    code: errorCodes.VALID_COMMAND,
    command,
  };
};
