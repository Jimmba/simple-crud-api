import { ServerResponse } from "http";
import { STATUS_CODES } from "../constants";
import { sendResponse, validateCreateUser, validateUuid } from "../helpers";
import { BadRequestException } from "../exceptions";
import { ICreateUser } from "../interfaces";
import { UserService } from "../services";

export class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(res: ServerResponse, body: ICreateUser) {
    validateCreateUser(body);
    const user = await this.userService.createUser(body);
    return sendResponse(res, STATUS_CODES.CREATED, user);
  }

  async getAllUsers(res: ServerResponse) {
    const users = await this.userService.getAllUsers();
    return sendResponse(res, STATUS_CODES.OK, users);
  }

  async getUserById(res: ServerResponse, userId: string) {
    validateUuid(userId);
    const users = await this.userService.getUserById(userId);
    return sendResponse(res, STATUS_CODES.OK, users);
  }

  async updateUser(res: ServerResponse, body: ICreateUser, userId?: string) {
    if (!userId) throw new BadRequestException(`userId is not passed`);
    validateUuid(userId);
    validateCreateUser(body);
    const user = await this.userService.updateUser(userId, body);
    return sendResponse(res, STATUS_CODES.OK, user);
  }

  async removeUser(res: ServerResponse, userId: string | undefined) {
    if (!userId) throw new BadRequestException(`userId is not passed`);
    validateUuid(userId);
    await this.userService.removeUser(userId);
    return sendResponse(res, STATUS_CODES.NO_CONTENT);
  }
}
