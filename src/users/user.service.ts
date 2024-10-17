import { Database } from "../database";

export class UserService {
  database: Database;

  constructor() {
    this.database = new Database();
  }

  getAllUsers() {
    return this.database.getAllUsers();
  }
}
