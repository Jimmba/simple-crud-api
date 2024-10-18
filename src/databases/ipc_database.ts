import cluster from "cluster";
import { MESSAGE_TYPES } from "../constants";
import { ICreateUser, IDatabase, IUser } from "../interfaces";

type dbUser = {
  [key: string]: IUser;
};

export type sendMessage<T> = {
  messageType: MESSAGE_TYPES;
  payload: T;
};

const sendRequestToDb = <T, P>(processMessage: sendMessage<T>): Promise<P> => {
  return new Promise((res, rej) => {
    if (!cluster.isWorker || !process.send) {
      rej(new Error("Cluster is not worker"));
      return;
    }
    process.send(processMessage);

    const { messageType } = processMessage;

    const messageHandler = (data: sendMessage<P>) => {
      if (data.messageType === messageType) {
        process.removeListener("message", messageHandler);
        const { payload } = data;
        res(payload);
      }
    };
    process.on("message", messageHandler);

    process.on("error", (e) => {
      process.removeListener("message", messageHandler);
      rej(e);
    });
  });
};

export class IPCDatabase implements IDatabase {
  async createUser(createUser: ICreateUser): Promise<IUser> {
    const user = await sendRequestToDb<ICreateUser, IUser>({
      messageType: MESSAGE_TYPES.CREATE_USER,
      payload: createUser,
    });
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    return await sendRequestToDb<{}, IUser[]>({
      messageType: MESSAGE_TYPES.GET_ALL_USERS,
      payload: {},
    });
  }

  async getUserById(userId: string): Promise<IUser> {
    return await sendRequestToDb<string, IUser>({
      messageType: MESSAGE_TYPES.GET_USER_BY_ID,
      payload: userId,
    });
  }

  async updateUser(options: {
    userId: string;
    user: ICreateUser;
  }): Promise<IUser | null> {
    const { userId, user } = options;
    return await sendRequestToDb<
      {
        userId: string;
        user: ICreateUser;
      },
      IUser
    >({
      messageType: MESSAGE_TYPES.UPDATE_USER,
      payload: {
        userId,
        user,
      },
    });
  }

  async removeUser(userId: string): Promise<boolean> {
    return await sendRequestToDb<string, boolean>({
      messageType: MESSAGE_TYPES.REMOVE_USER,
      payload: userId,
    });
  }
}
