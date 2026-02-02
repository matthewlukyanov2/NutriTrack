require("dotenv").config({ path: "../.env.test" });
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

let mongoServer;
let token;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Register user
  await request(app).post("/api/auth/register").send({
    email: "meal@test.com",
    password: "password123"
  });

  // Login user
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: "meal@test.com",
      password: "password123"
    });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Meals API", () => {
  it("should deny access without token", async () => {
    const res = await request(app).get("/api/meals");
    expect(res.statusCode).toBe(401);
  });

  it("should allow access with token", async () => {
    const res = await request(app)
      .get("/api/meals")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a meal", async () => {
    const res = await request(app)
      .post("/api/meals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Meal",
        calories: 500,
        protein: 40,
        carbs: 50,
        fats: 20
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Test Meal");
    expect(res.body.calories).toBe(500);
  });
});
