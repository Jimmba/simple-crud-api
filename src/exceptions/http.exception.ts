import { STATUS_CODES } from "../constants";

export class HttpException extends Error {
  statusCode: STATUS_CODES;

  constructor(message: string, statusCode: STATUS_CODES) {
    super(message);
    this.statusCode = statusCode;
  }
}
