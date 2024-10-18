import { ICreateUser, IUpdateUser, IUser } from "./user.interface";

export interface IDatabase {
  createUser(createUser: ICreateUser): Promise<IUser>;
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: string): Promise<IUser | undefined>;
  updateUser(updateUser: IUpdateUser): Promise<IUser | null>;
  removeUser(id: string): Promise<boolean>;
}
