import request from "supertest";
import { createServer, Server } from "http";
import { serverCallback } from "..";
import { ICreateUser, IUser } from "../interfaces";
import { STATUS_CODES } from "../constants";

const createUserBody: ICreateUser = {
  username: "user1",
  age: 22,
  hobbies: ["sleeping"],
};

describe("Testing /api/users", () => {
  let server: Server;
  let userId: string;

  beforeAll(async () => {
    server = createServer(await serverCallback());
    await new Promise((resolve) => server.listen(resolve));
  });

  afterAll(async () => {
    console.log("Closing the server...");
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          console.error("Error while closing the server:", err);
          return reject(err);
        }
        console.log("Server closed.");
        resolve(true);
      });
    });
  });

  it("should return an empty array when no users are present", async () => {
    const res = await request(server).get("/api/users");
    const expectedResult = {
      data: [],
      error: null,
    };

    expect(res.status).toBe(STATUS_CODES.OK);
    expect(res.body).toEqual(expectedResult);
  });

  it("should create a new user", async () => {
    const res = await request(server).post("/api/users").send(createUserBody);
    const body = res.body;
    const { id } = body.data as IUser;
    userId = id;
    expect(res.status).toBe(STATUS_CODES.CREATED);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.username).toBe(createUserBody.username);
    expect(res.body.data.age).toBe(createUserBody.age);
    expect(res.body.data.hobbies).toEqual(createUserBody.hobbies);
  });

  it("should get user by id", async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    const expectedResult = {
      data: {
        id: userId,
        ...createUserBody,
      },
      error: null,
    };

    expect(res.status).toBe(STATUS_CODES.OK);
    expect(res.body).toEqual(expectedResult);
  });

  it("should update user by id", async () => {
    const updateUserBody = {
      ...createUserBody,
      age: 14,
    };
    const res = await request(server)
      .put(`/api/users/${userId}`)
      .send(updateUserBody);
    const body = res.body;
    const { id } = body.data as IUser;
    userId = id;
    expect(res.status).toBe(STATUS_CODES.OK);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.age).toBe(updateUserBody.age);
  });

  it("should remove user by id", async () => {
    const res = await request(server).delete(`/api/users/${userId}`);
    expect(res.status).toBe(STATUS_CODES.NO_CONTENT);
  });

  it("should return 404 when trying to get the deleted user", async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    const expectedResult = {
      data: null,
      error: `NOT FOUND: userId '${userId}'`,
    };
    expect(res.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(res.body).toEqual(expectedResult);
  });
});
