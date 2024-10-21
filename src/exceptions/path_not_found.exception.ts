import { STATUS_CODES } from "../constants";
import { HttpException } from "./http.exception";

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(`NOT FOUND: ${message}`, STATUS_CODES.NOT_FOUND);
  }
}
