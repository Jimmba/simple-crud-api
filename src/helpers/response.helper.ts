import { ServerResponse } from "http";
import { STATUS_CODES } from "../constants";

type Response = {
  data: string | null;
  error: string | null;
};

export const sendResponse = (
  res: ServerResponse,
  statusCode: STATUS_CODES,
  data: any //! replace
) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = statusCode;

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
