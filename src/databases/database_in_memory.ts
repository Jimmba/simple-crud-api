import { ICreateUser, IDatabase, IUpdateUser, IUser } from "../interfaces";
import { v4 as uuidv4 } from "uuid";

type dbUser = {
  [key: string]: IUser;
};

const promisify = <T>(data: T): Promise<T> => {
  return new Promise((res) => res(data));
};

export class DatabaseInMemory implements IDatabase {
  private users: dbUser;

  constructor() {
    this.users = {};
  }

  createUser(createUser: ICreateUser): Promise<IUser> {
    const id = uuidv4();
    const user: IUser = {
      id,
      ...createUser,
    };

    this.users[id] = user;
    return promisify(user);
  }

  getAllUsers(): Promise<IUser[]> {
    return promisify(Object.values(this.users));
  }

  getUserById(userId: string): Promise<IUser> {
    return promisify(this.users[userId]);
  }

  updateUser(options: IUpdateUser): Promise<IUser | null> {
    const { userId, user } = options;
    if (this.users[userId]) {
      const { id } = this.users[userId];
      this.users[userId] = {
        id,
        ...user,
      };
      return promisify(this.users[userId]);
    }
    return promisify(null);
  }

  removeUser(userId: string): Promise<boolean> {
    if (this.users[userId]) {
      delete this.users[userId];
      return promisify(true);
    }
    return promisify(false);
  }
}
