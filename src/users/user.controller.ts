import { IncomingMessage, ServerResponse } from "http";
import { NotFoundException } from "../exceptions";
import { HTTP_METHODS, STATUS_CODES } from "../constants";
import { sendResponse } from "../helpers";
import { UserService } from "./user.service";

export class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  handleRequest(req: IncomingMessage, res: ServerResponse) {
    const { method } = req;
    if (method === HTTP_METHODS.GET) return this.handleGet(req, res);
    if (method === HTTP_METHODS.POST) return this.handlePost(req, res);
    if (method === HTTP_METHODS.PUT) return this.handlePut(req, res);
    if (method === HTTP_METHODS.DELETE) return this.handleDelete(req, res);
    throw new NotFoundException(); //! pass message?
  }

  handleGet(req: IncomingMessage, res: ServerResponse) {
    const users = this.userService.getAllUsers();
    return sendResponse(res, STATUS_CODES.OK, users);
  }

  handlePost(req: IncomingMessage, res: ServerResponse) {
    return sendResponse(res, STATUS_CODES.CREATED, []);
  }

  handlePut(req: IncomingMessage, res: ServerResponse) {
    const { method } = req;
    console.log(method);
    res.write("ok");
    res.end();
  }

  handleDelete(req: IncomingMessage, res: ServerResponse) {
    const { method } = req;
    console.log(method);
    res.write("ok");
    res.end();
  }
}
