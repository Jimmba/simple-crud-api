import { IUser } from "../interfaces";

export class Database {
  users: IUser[];

  constructor() {
    this.users = [];
  }
  getAllUsers() {
    return this.users; //! check if error
  }
}
