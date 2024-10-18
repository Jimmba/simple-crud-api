import { IncomingMessage, ServerResponse } from "http";
import { UserController } from "../controllers";
import { BadRequestException, NotFoundException } from "../exceptions";
import { HTTP_METHODS } from "../constants";
import { getBodyFromRequest } from "../helpers";
import { ICreateUser } from "../interfaces";
import { Database } from "../database";

// const routesHandlers = { //! controller handler
//   users: UserController,
// };

export class Router {
  userController: UserController;

  constructor(db: Database) {
    this.userController = new UserController(db);
  }

  async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;
    if (!url) throw new BadRequestException("path is not passed");
    if (!method) throw new BadRequestException("method is not passed");
    // const handler = Object.entries(routesHandlers).filter(
    //   ({ route, controller }) => {
    //     return path;
    //   }
    // );

    if (!url.startsWith("/api")) throw new NotFoundException(`path '${url}'`);
    const replacedUrl = url.replace("/api", "");
    const [path, userId] = replacedUrl.split("/").filter((el) => el);

    if (path === "users") {
      return await this.handleUserRequest(req, res, method, userId);
    }
    throw new NotFoundException(`path '${url}'`);
  }

  async handleUserRequest(
    req: IncomingMessage,
    res: ServerResponse,
    method: string,
    userId: string | undefined
  ) {
    if (method === HTTP_METHODS.GET && userId)
      return this.userController.getUserById(res, userId);
    if (method === HTTP_METHODS.GET && !userId)
      return this.userController.getAllUsers(res);
    if (method === HTTP_METHODS.DELETE)
      return this.userController.removeUser(res, userId);

    const body = await getBodyFromRequest(req);

    if (method === HTTP_METHODS.POST)
      return this.userController.createUser(res, body as ICreateUser);
    if (method === HTTP_METHODS.PUT)
      return this.userController.updateUser(res, body as ICreateUser, userId);
    throw new BadRequestException(`method '${method}' not found`); //! more common message?
  }
}
