// A jasmine unit tests for products model

import { Product, ProductStore } from "../../models/products";

const store = new ProductStore();

let productId: number;

describe("Product Model", () => {
  it("create - should have an id", async () => {
    const result = await store.create({
      name: "test",
      price: 100,
      category: "test",
    });

    const { name, price, category } = result;

    // @ts-ignore
    productId = result.id;

    const expected = {
      name: "test",
      price: 100,
      category: "test",
    };

    expect({ name, price, category }).toEqual(expected);
  });

  it("index - should return an array with one product", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: productId,
        name: "test",
        price: 100,
        category: "test",
      },
    ]);
  });

  it("show - should have a name of test", async () => {
    const result = await store.show(String(productId));
    expect(result.name).toEqual("test");
  });

  it("update - should update name from test to test2", async () => {
    const p: Product = {
      id: productId,
      name: "test2",
      price: 100,
      category: "test",
    };

    const result = await store.update(p);

    expect(result.name).toEqual("test2");
  });

  it("top - should return an array with one product", async () => {
    const result = await store.top();
    expect(result).toEqual([
      {
        id: productId,
        name: "test2",
        price: 100,
        category: "test",
      }]);
  });

  it("byCategory - should return an array with one product", async () => {
    const result = await store.byCategory("test");

    const expected = [
      {
        id: productId,
        name: "test2",
        price: 100,
        category: "test",
      },
    ];

    expect(result).toEqual(expected);
  });

  it("delete - should return a product", async () => {
    const result = await store.delete(String(productId));

    const expected = {
      id: productId,
      name: "test2",
      price: 100,
      category: "test",
    };

    expect(result).toEqual(expected);
  });


});
