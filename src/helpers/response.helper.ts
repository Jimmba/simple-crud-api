import { IncomingMessage, ServerResponse } from "http";
import { STATUS_CODES } from "../constants";
import { BadRequestException, HttpException } from "../exceptions";
import { IUser } from "../interfaces";

type Response = {
  data: IUser | IUser[] | Error | null;
  error: string | null;
};

export const sendResponse = (
  res: ServerResponse,
  statusCode: STATUS_CODES,
  data?: IUser | IUser[] | Error //! replace
) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = statusCode;

  if (!data) {
    res.end();
    return;
  }

  let response: Response = {
    data: null,
    error: null,
  };
  if (data instanceof Error) {
    response.data = null;
    response.error = data.message;
  } else {
    response.data = data;
    response.error = null;
  }

  res.end(JSON.stringify(response));
};

export const getBodyFromRequest = async (req: IncomingMessage) => {
  let body = "";
  return new Promise((res, rej) => {
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        res(JSON.parse(body));
      } catch (e) {
        rej(new BadRequestException("Error parsing JSON"));
      }
    });
    req.on("error", (e) => {
      rej(e);
    });
  });
};
