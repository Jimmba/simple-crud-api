import { STATUS_CODES } from "../constants";
import { HttpException } from "./http.exception";

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(`BAD REQUEST: ${message}`, STATUS_CODES.BAD_REQUEST);
  }
}
