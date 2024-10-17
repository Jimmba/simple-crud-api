export interface IUser extends ICreateUser {
  id: string;
}

export interface ICreateUser {
  username: string;
  age: number;
  hobbies: string[];
}
