import { BadRequestException } from "../exceptions";
import { ICreateUser, IUser } from "../interfaces";
import { validateUuid } from "./validate_uuid.helper";

export const validateCreateUser = (user: ICreateUser) => {
  //! add checking type ?
  const { username, age, hobbies } = user;
  const messages = [];

  if (!username) messages.push("username should be passed");
  if (!age) messages.push("age should be passed");
  if (!hobbies) messages.push("hobbies should be passed");
  if (messages.length) throw new BadRequestException(messages.join("; "));
};

export const validateUser = (user: IUser) => {
  const { id, ...rest } = user;
  validateUuid(id);
  validateCreateUser(rest);
};
