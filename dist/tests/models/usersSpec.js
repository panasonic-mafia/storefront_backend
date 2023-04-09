"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../../models/users");
const store = new users_1.UserStore();
let userId;
describe("User Store model", () => {
    describe("Create User", () => {
        it("When hitting create method it returns username, first and last names corretly", async () => {
            const newUser = {
                username: "testuser",
                firstName: "John",
                lastName: "Doe",
                password: "testpassword",
            };
            const result = await store.create(newUser);
            const { username, firstName, lastName, id } = result;
            // @ts-ignore
            userId = id;
            const expected = {
                username: "testuser",
                firstName: "John",
                lastName: "Doe",
            };
            expect({ username, firstName, lastName }).toEqual(expected);
        });
    });
    describe("Show User", () => {
        it("Should return by it's id", async () => {
            const result = await store.show(String(userId));
            const { username, firstName, lastName } = result;
            const expected = {
                username: "testuser",
                firstName: "John",
                lastName: "Doe",
            };
            expect({ username, firstName, lastName }).toEqual(expected);
        });
    });
    describe("Index User", () => {
        it("Should return a non-empty array of users", async () => {
            const result = await store.index();
            expect(result.length).toBeGreaterThan(0);
        });
    });
    describe("Authenticate User", () => {
        it("Should return true if password is correct", async () => {
            const user = "testuser";
            const password = "testpassword";
            const result = await store.authenticate(user, password);
            expect(result?.username).toEqual(user);
        });
    });
    describe("Delete User", () => {
        it("Should delete user by id", async () => {
            const result = await store.delete(String(userId));
            // console.log(`User to delete ----> ${result}`);
            const { username, firstName, lastName } = result;
            const expected = {
                username: "testuser",
                firstName: "John",
                lastName: "Doe",
            };
            expect({ username, firstName, lastName }).toEqual(expected);
        });
    });
});
