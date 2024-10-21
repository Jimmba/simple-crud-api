import { config } from "dotenv";
import { listenWorkers } from "./databases";
import { cpus } from "os";
import cluster from "cluster";
import { createServer, IncomingMessage, request, ServerResponse } from "http";
import { Router } from "./router";
import { HttpException } from "./exceptions";
import { sendResponse } from "./helpers";
import { STATUS_CODES } from "./constants";

config();

export const serverCallback = (port: number) => {
  const router = new Router();
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      console.log(`Processed request on port ${port}, pid: ${process.pid}`);
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
  const app = createServer(await serverCallback(workerPort));
  await app.listen(workerPort);
  console.log(`Server is started at port ${workerPort}`);
};

if (cluster.isPrimary) {
  const port = parseInt(process.env.PORT || "4000", 10);
  const clusterCount = cpus().length - 1;
  for (let i = 1; i <= clusterCount; i += 1) {
    cluster.fork({ PORT: port + i });
  }

  listenWorkers();

  let currentWorker = 1;
  const loadBalancer = createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      const workerPort = port + currentWorker;
      const options = {
        hostname: "localhost",
        port: workerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const proxy = request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode!, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });
      req.pipe(proxy, { end: true });
      currentWorker = (currentWorker % clusterCount) + 1;
    }
  );

  loadBalancer.listen(port, () => {
    console.log(`Load balancer is listening on port ${port}`);
  });

  cluster.on("exit", (worker) => {
    console.log(`Process id ${worker.process.pid} is dead`);
  });
} else {
  bootstrapMulti();
}
