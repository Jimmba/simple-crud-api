import { IncomingMessage, ServerResponse } from "http";
import { UserController } from "../users";
import { NotFoundException } from "../exceptions";

// const routesHandlers = {
//   users: UserController,
// };

export class Router {
  userController: UserController;

  constructor() {
    this.userController = new UserController();
  }

  handleRequest(req: IncomingMessage, res: ServerResponse) {
    const path = req.url;
    if (!path) throw new NotFoundException();
    // const handler = Object.entries(routesHandlers).filter(
    //   ({ route, controller }) => {
    //     return path;
    //   }
    // );

    if (path.startsWith("/users"))
      return this.userController.handleRequest(req, res);
    throw new NotFoundException();
  }
}
