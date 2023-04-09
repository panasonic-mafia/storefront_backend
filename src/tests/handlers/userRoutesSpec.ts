// a unit tests for userRoutes api endpoints
import request from "supertest";
import app from "../../server";
import { UserStore } from "../../models/users";

let token: string;
let userId: string;

describe("User routes", () => {

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          username: "test2",
          password: "test",
          firstName: "test",
          lastName: "test",
        });
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBe("user is created successfully");
      expect(response.body.data.user.username).toBe("test2");
      expect(response.body.data.user.firstName).toBe("test");
      expect(response.body.data.user.lastName).toBe("test");

      userId = response.body.data.user.id;
    });
  });
  describe("POST /users/authenticate", () => {
    it("should authenticate a user", async () => {
      const response = await request(app)
        .post("/users/authenticate")
        .send({
          username: "test2",
          password: "test",
        });
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBe("Authenticated successfully");
      expect(response.body.data.token).toBeDefined();
      token = response.body.data.token;
    }
    );
  });

  describe("GET /users", () => {
    it("should return all users", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBe("users fetched successfully");
      expect(response.body.data).toBeDefined();
    });
  }
  );

  describe("GET /users/:id", () => {
    it("should return a user", async () => {
      const response = await request(app)
        .get(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBe("user is fetched successfully");
      expect(response.body.data.username).toBe("test2");
      expect(response.body.data.firstName).toBe("test");
      expect(response.body.data.lastName).toBe("test");
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete a user", async () => {
      const response = await request(app)
        .delete(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("user is deleted successfully");
    });
  }
  );
});
