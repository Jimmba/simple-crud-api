import { config } from "dotenv";
import { Database } from "./database";
import { cpus } from "os";
import cluster from "cluster";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { Router } from "./router";
import { HttpException } from "./exceptions";
import { sendResponse } from "./helpers";
import { STATUS_CODES } from "./constants";

config();

const db = new Database();

export const serverCallback = (db: Database) => {
  const router = new Router(db);
  return async (req: IncomingMessage, res: ServerResponse) => {
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
      sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, new Error(message));
    }
  };
};

const bootstrapMulti = async () => {
  const workerPort = parseInt(process.env.PORT || "4001", 10);
  const app = createServer(await serverCallback(db));
  await app.listen(workerPort);
  console.log(`Server is started at port ${workerPort}`);
};

if (cluster.isPrimary) {
  const port = parseInt(process.env.PORT || "4000", 10);
  const clusterCount = cpus().length - 1;
  for (let i = 1; i <= clusterCount; i += 1) {
    cluster.fork({ PORT: port + i });
  }
  cluster.on("exit", (worker) => {
    console.log(`Process id ${worker.process.pid} is dead`);
  });
} else {
  bootstrapMulti();
}
