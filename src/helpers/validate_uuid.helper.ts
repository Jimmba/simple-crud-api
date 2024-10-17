import { validate as isUuid } from "uuid";
import { BadRequestException } from "../exceptions";

export const validateUuid = (uuid: string) => {
  if (!isUuid(uuid))
    throw new BadRequestException(`userId '${uuid}' is invalid (not uuid)`);
};
