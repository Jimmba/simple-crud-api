import cluster from "cluster";
import { DatabaseInMemory, IPCDatabase } from "../databases";
import { NotFoundException } from "../exceptions";
import { ICreateUser, IUser } from "../interfaces";

export class UserService {
  database: DatabaseInMemory | IPCDatabase;

  constructor() {
    this.database = !cluster.isWorker
      ? new DatabaseInMemory()
      : new IPCDatabase();
  }

  async createUser(user: ICreateUser): Promise<IUser> {
    return this.database.createUser(user);
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.database.getAllUsers();
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await this.database.getUserById(userId);
    if (!user) throw new NotFoundException(`userId '${userId}'`);
    return user;
  }

  async updateUser(userId: string, user: ICreateUser): Promise<IUser> {
    const updatedUser = await this.database.updateUser({ userId, user });
    if (!updatedUser) throw new NotFoundException(`userId '${userId}'`);
    return updatedUser;
  }

  async removeUser(userId: string): Promise<void> {
    const result = await this.database.removeUser(userId);
    if (!result) throw new NotFoundException(`userId '${userId}'`);
  }
}
