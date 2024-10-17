import { ICreateUser, IUser } from "../interfaces";
import { v4 as uuidv4 } from "uuid";

type dbUser = {
  [key: string]: IUser;
};
export class Database {
  private users: dbUser;

  constructor() {
    this.users = {};
  }

  createUser(createUser: ICreateUser): IUser {
    const id = uuidv4();
    const user: IUser = {
      id,
      ...createUser,
    };

    this.users[id] = user;
    return user;
  }

  getAllUsers(): IUser[] {
    return Object.values(this.users);
  }

  getUserById(userId: string): IUser {
    return this.users[userId];
  }

  updateUser(userId: string, user: ICreateUser): IUser | null {
    if (this.users[userId]) {
      const { id } = this.users[userId];
      this.users[userId] = {
        id,
        ...user,
      };
      return this.users[userId];
    }
    return null;
  }

  removeUser(userId: string) {
    if (this.users[userId]) {
      delete this.users[userId];
      return true;
    }
    return false;
  }
}
