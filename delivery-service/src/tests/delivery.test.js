const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Delivery Management API - Full Coverage", () => {
  let deliveryId;
  let orderId = new mongoose.Types.ObjectId().toString();
  const mockDriverId = "64e1f3541d53270012345678";

  it("should fail to assign delivery with missing fields", async () => {
    const res = await request(app).post("/api/delivery/assign").send({}); // no body

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should assign a delivery successfully", async () => {
    const res = await request(app)
      .post("/api/delivery/assign")
      .send({
        orderId,
        customerLocation: {
          lat: 6.9271,
          lng: 79.8612,
        },
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.delivery).toHaveProperty("_id");
    deliveryId = res.body.delivery._id;
  });

  it("should update delivery status to 'picked'", async () => {
    const res = await request(app).patch(`/api/delivery/update/${deliveryId}`).send({ status: "picked" });

    expect(res.statusCode).toBe(200);
    expect(res.body.delivery.status).toBe("picked");
  });

  it("should fail to update status of non-existent delivery", async () => {
    const res = await request(app).patch("/api/delivery/update/660000000000000000000000").send({ status: "picked" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Delivery not found");
  });

  it("should update driver location successfully", async () => {
    const res = await request(app).patch(`/api/delivery/location/${deliveryId}`).send({ lat: 6.9055, lng: 79.8644 });

    expect(res.statusCode).toBe(200);
    expect(res.body.delivery.driverLocation.lat).toBe(6.9055);
  });

  it("should fail to update location for non-existent delivery", async () => {
    const res = await request(app).patch("/api/delivery/location/660000000000000000000000").send({ lat: 6.9, lng: 79.85 });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Delivery not found");
  });

  it("should get delivery status by order ID", async () => {
    const res = await request(app).get(`/api/delivery/status/${orderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
  });

  it("should return 404 for unknown order ID", async () => {
    const fakeOrderId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/delivery/status/${fakeOrderId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Delivery not found");
  });

  it("should get deliveries for a driver", async () => {
    const res = await request(app).get(`/api/delivery/driver/${mockDriverId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.deliveries)).toBe(true);
  });

  it("should return empty array for unknown driver ID", async () => {
    const fakeDriverId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/delivery/driver/${fakeDriverId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.deliveries.length).toBe(0);
  });
});
