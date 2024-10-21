import cluster, { Worker } from "cluster";
import { DatabaseInMemory } from "./database_in_memory";
import { MESSAGE_TYPES } from "../constants";
import { sendMessage } from "./ipc_database";
import { ICreateUser, IUpdateUser } from "../interfaces";

const db = new DatabaseInMemory();

const getResponseFromDB = <T>(type: MESSAGE_TYPES, payload: T) => {
  if (type === MESSAGE_TYPES.CREATE_USER)
    return db.createUser(payload as ICreateUser);
  if (type === MESSAGE_TYPES.GET_ALL_USERS) return db.getAllUsers();
  if (type === MESSAGE_TYPES.GET_USER_BY_ID)
    return db.getUserById(payload as string);
  if (type === MESSAGE_TYPES.UPDATE_USER)
    return db.updateUser(payload as IUpdateUser);
  if (type === MESSAGE_TYPES.REMOVE_USER)
    return db.removeUser(payload as string);
  throw new Error("Hanlder is not specified");
};

const handleRequest = async <T>(
  worker: Worker,
  processMessage: sendMessage<T>
) => {
  const { messageType, payload } = processMessage;
  try {
    const result = await getResponseFromDB<T>(messageType, payload);
    worker.send({
      messageType: messageType,
      payload: result,
    });
  } catch (e) {
    worker.send({
      messageType: messageType,
      payload: e,
    });
  }
};

export const listenWorkers = () => {
  cluster.on("message", handleRequest);
};
