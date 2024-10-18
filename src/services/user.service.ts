import { Database } from "../database";
import { NotFoundException } from "../exceptions";
import { ICreateUser, IUser } from "../interfaces";

export class UserService {
  database: Database;

  constructor(db: Database) {
    this.database = db;
  }

  createUser(user: ICreateUser): IUser {
    return this.database.createUser(user);
  }

  getAllUsers(): IUser[] {
    return this.database.getAllUsers();
  }

  getUserById(userId: string): IUser {
    const user = this.database.getUserById(userId);
    if (!user) throw new NotFoundException(`userId '${userId}'`);
    return user;
  }

  updateUser(userId: string, user: ICreateUser): IUser {
    const updatedUser = this.database.updateUser(userId, user);
    if (!updatedUser) throw new NotFoundException(`userId '${userId}'`);
    return updatedUser;
  }

  removeUser(userId: string): void {
    const result = this.database.removeUser(userId);
    if (!result) throw new NotFoundException(`userId '${userId}'`);
  }
}
