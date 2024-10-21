import { VALIDATION_MESSAGES } from "../constants";
import { BadRequestException } from "../exceptions";
import { ICreateUser, IUser } from "../interfaces";
import { validateUuid } from "./index";

export const validateCreateUser = (user: ICreateUser) => {
  const { username, age, hobbies } = user;
  const messages = [];

  if (!username) messages.push(VALIDATION_MESSAGES.USERNAME_SHOULD_BE_PASSED);
  if (typeof username !== "string")
    messages.push(VALIDATION_MESSAGES.USERNAME_SHOULD_BE_A_STRING);

  if (age === undefined)
    messages.push(VALIDATION_MESSAGES.AGE_SHOULD_BE_PASSED);
  if (typeof age !== "number")
    messages.push(VALIDATION_MESSAGES.AGE_SHOULD_BE_A_NUMBER);
  if (age < 0 || age > 100)
    messages.push(VALIDATION_MESSAGES.AGE_LIMIT_MESSAGE);

  if (!hobbies) messages.push(VALIDATION_MESSAGES.HOBBIES_SHOULD_BE_PASSED);
  if (!Array.isArray(hobbies))
    messages.push(VALIDATION_MESSAGES.HOBBIES_SHOULD_BE_AN_ARRAY);
  if (
    Array.isArray(hobbies) &&
    hobbies.length &&
    hobbies.some((hobby) => typeof hobby !== "string")
  )
    messages.push(VALIDATION_MESSAGES.HOBBIES_SHOULD_BE_ARRAY_OF_STRINGS);
  if (messages.length) throw new BadRequestException(messages.join("; "));
};

export const validateUser = (user: IUser) => {
  const { id, ...rest } = user;
  validateUuid(id);
  validateCreateUser(rest);
};
