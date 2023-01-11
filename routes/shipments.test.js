"use strict";

const shipItApi = require('../shipItApi');
shipItApi.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValue(10);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 10 });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("invalid id", async function() {
    const resp = await request(app).post('/shipments').send({
      productId: 100,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance.productId must be greater than or equal to 1000"
    ]);
  });

  test("invalid id type", async function() {
    const resp = await request(app).post('/shipments').send({
      productId: '1000',
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance.productId is not of a type(s) integer"
    ]);
  });

  test("invalid name", async function() {
    const resp = await request(app).post('/shipments').send({
      productId: 1000,
      name: 10,
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance.name is not of a type(s) string"
    ]);
  });

  test("invalid addr", async function() {
    const resp = await request(app).post('/shipments').send({
      productId: 1000,
      name: "Test Tester",
      addr: 10,
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance.addr is not of a type(s) string"
    ]);
  });

  test("invalid zip", async function() {
    const resp = await request(app).post('/shipments').send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: 123456789,
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance.zip is not of a type(s) string"
    ]);
  });
});
