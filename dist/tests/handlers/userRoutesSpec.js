"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// a unit tests for userRoutes api endpoints
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
let token;
let userId;
describe("User routes", () => {
    describe("POST /users", () => {
        it("should create a new user", async () => {
            const response = await (0, supertest_1.default)(server_1.default)
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
            const response = await (0, supertest_1.default)(server_1.default)
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
        });
    });
    describe("GET /users", () => {
        it("should return all users", async () => {
            const response = await (0, supertest_1.default)(server_1.default)
                .get("/users")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.statusCode).toBe(200);
            expect(response.body.message).toBe("users fetched successfully");
            expect(response.body.data).toBeDefined();
        });
    });
    describe("GET /users/:id", () => {
        it("should return a user", async () => {
            const response = await (0, supertest_1.default)(server_1.default)
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
            const response = await (0, supertest_1.default)(server_1.default)
                .delete(`/users/${userId}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("user is deleted successfully");
        });
    });
});
