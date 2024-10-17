import { config } from "dotenv";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { Router } from "./router";
import { sendResponse } from "./helpers";
import { STATUS_CODES } from "./constants";
import { HttpException } from "./exceptions";
config();

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const router = new Router();
  const app = createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      try {
        return await router.handleRequest(req, res);
      } catch (e) {
        let statusCode;
        if (e instanceof HttpException) {
          statusCode = e.statusCode;
          sendResponse(res, statusCode, e);
          return;
        }
        const message = e instanceof Error ? e.message : "unknown error";
        sendResponse(
          res,
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          new Error(message)
        );
      }
    }
  );

  await app.listen(port);
  console.log(`Server is started at port ${port}`);
}

bootstrap();
