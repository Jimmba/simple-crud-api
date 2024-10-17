import { IncomingMessage, ServerResponse } from "http";
import { STATUS_CODES } from "../constants";
import { sendResponse, validateCreateUser, validateUuid } from "../helpers";
import { UserService } from "./user.service";
import { BadRequestException } from "../exceptions";
import { ICreateUser } from "../interfaces";

export class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(res: ServerResponse, body: ICreateUser) {
    validateCreateUser(body);
    const user = this.userService.createUser(body);
    return sendResponse(res, STATUS_CODES.CREATED, user);
  }

  getAllUsers(res: ServerResponse): void {
    const users = this.userService.getAllUsers();
    return sendResponse(res, STATUS_CODES.OK, users);
  }

  getUserById(res: ServerResponse, userId: string): void {
    validateUuid(userId);
    const users = this.userService.getUserById(userId);
    return sendResponse(res, STATUS_CODES.OK, users);
  }

  updateUser(res: ServerResponse, body: ICreateUser, userId?: string): void {
    if (!userId) throw new BadRequestException(`userId is not passed`);
    validateUuid(userId);
    validateCreateUser(body);
    const user = this.userService.updateUser(userId, body);
    return sendResponse(res, STATUS_CODES.OK, user);
  }

  removeUser(res: ServerResponse, userId: string | undefined): void {
    if (!userId) throw new BadRequestException(`userId is not passed`);
    validateUuid(userId);
    this.userService.removeUser(userId);
    return sendResponse(res, STATUS_CODES.NO_CONTENT);
  }
}
