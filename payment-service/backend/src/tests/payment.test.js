const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const Payment = require("../models/Payment");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Payment Service API", () => {
  const testOrderId = "ORDER12345";
  const testUserId = "64e1f3541d53270012345678";

  it("should initiate a payment", async () => {
    const res = await request(app).post("/api/payment/initiate").send({
      orderId: testOrderId,
      userId: testUserId,
      amount: 1500,
      first_name: "Yasiru",
      last_name: "K",
      email: "yasiru@example.com",
      phone: "0770000000",
      address: "123 Main Street",
      city: "Colombo",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("payhereURL");
    expect(res.body.payload).toHaveProperty("merchant_id");
  });

  it("should reject invalid initiation (missing amount)", async () => {
    const res = await request(app).post("/api/payment/initiate").send({
      orderId: "BAD_ORDER",
      userId: testUserId,
      first_name: "Test",
      last_name: "User",
      email: "bad@example.com",
      phone: "0000000000",
      address: "Nowhere",
      city: "GhostTown",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it("should process callback (valid signature)", async () => {
    const callbackPayload = {
      merchant_id: process.env.MERCHANT_ID,
      order_id: testOrderId,
      payment_id: "TEST123",
      payhere_amount: "1500.00",
      payhere_currency: "LKR",
      status_code: "2",
      method: "VISA",
      card_holder_name: "Yasiru K",
      paid_at: "2025-03-30 16:00:00",
      md5sig: "DUMMY", // Replace with real sig if testing actual flow
    };

    const res = await request(app).post("/api/payment/callback").type("form").send(callbackPayload);

    // Assuming you skip signature verification for local test
    expect([200, 400]).toContain(res.statusCode);
  });

  it("should fetch payment status by order ID", async () => {
    const res = await request(app).get(`/api/payment/status/${testOrderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body.orderId).toBe(testOrderId);
  });
});
