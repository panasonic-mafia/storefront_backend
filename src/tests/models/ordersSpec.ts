// A unit tests for Orders model

import { Order, OrderStore } from "../../models/orders";
import { User, UserStore } from "../../models/users";
import { Product, ProductStore } from "../../models/products";

const store = new OrderStore();
let newUser: User;
let newProduct: Product;
let userId: number;
let productId: number;
let orderId: number;
let orderProductId: number;

// A unit tests to test all the methods in the Orders model
describe("Orders Model", () => {
  beforeAll(async () => {
    // add new user to the users table
    const userStore = new UserStore();
    newUser = await userStore.create({
      username: 'test2',
      firstName: "John",
      lastName: "Doe",
      password: "password",
    });

    // @ts-ignore
    userId = newUser.id;

    // add a product to the products table
    const productStore = new ProductStore();
    newProduct = await productStore.create({
      name: "test product 1",
      price: 10,
      category: "test category 1",
    })

    // @ts-ignore
    productId = newProduct.id;

  });



  describe("create", () => {
    it("should have an add method", () => {
      expect(store.create).toBeDefined();
    });

    it("should add a new order", async () => {
      const result = await store.create({
        // @ts-ignore
        user_id: userId,
        status: "active",
      });


      // @ts-ignore
      orderId = result.id;

      const { user_id, status } = result;

      expect({ user_id, status }).toEqual({
        user_id: userId,
        status: "active",
      });
    });

  });

  describe("currentOrderByUser", () => {
    it("should have an currentOrderByUser method", () => {
      expect(store.currentOrderByUser).toBeDefined();
    }
    );
    it("should return a list of active orders by user", async () => {
      // Create a new order with active status
      await store.create({
        user_id: userId,
        status: "active",
      });

      const result = await store.currentOrderByUser(String(userId));
      expect(result).toEqual({
        id: orderId,
        user_id: userId,
        status: "active",
      });
    }
    );
  });

  describe("addProductToOrder", () => {
    it("should have an addProductToOrder method", () => {
      expect(store.addProductToOrder).toBeDefined();
    });

    it("should add a product to an order", async () => {
      const result = await store.addProductToOrder({
        orderId: orderId,
        productId: productId,
        quantity: 1,
      });

      // @ts-ignore
      orderProductId = result.id;

      expect(result).toEqual({
        id: orderProductId,
        orderId: orderId,
        productId: productId,
        quantity: 1,
      });
    });
  });

  describe("update", () => {
    it("should have an update method", () => {
      expect(store.update).toBeDefined();
    });
    it("should update an order", async () => {

      
      const result = await store.update({
        id: orderId,
        user_id: userId,
        status: "completed",
      });


      expect(result).toEqual({
        id: orderId,
        user_id: userId,
        status: "completed",
      });
    });
  });

  describe("completedOrdersByUser", () => {
    it("should have a completedOrdersByUser method", () => {
      expect(store.completedOrdersByUser).toBeDefined();
    }
    );
    it("should return a list of completed orders by user", async () => {
      const result = await store.completedOrdersByUser(String(userId));
      expect(result).toEqual([{
        id: orderId,
        user_id: userId,
        status: "completed",
      }]);
    }
    );
  });
  
  afterAll(async () => {
    // delete the user from the users table
    const userStore = new UserStore();
    await userStore.delete(String(userId));
    // delete the product from the products table
    const productStore = new ProductStore();
    await productStore.delete(String(productId));
  });
  


});


