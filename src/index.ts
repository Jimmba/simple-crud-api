import { config } from "dotenv";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { Router } from "./router";
import { sendResponse } from "./helpers";
import { STATUS_CODES } from "./constants";
config();

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const router = new Router();
  const app = createServer((req: IncomingMessage, res: ServerResponse) => {
    try {
      return router.handleRequest(req, res);
    } catch (e) {
      sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, e); // ! check status code it can be any exception
    }
  });

  await app.listen(port);
  console.log(`Server is started at port ${port}`);
}

bootstrap();
