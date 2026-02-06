const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let app; 

let mongoServer;
let token;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Import app 
  app = require("../app");

  // Register test user
  const registerRes = await request(app).post("/api/auth/register").send({
    name: "Meal Tester",
    email: "meal@test.com",
    password: "password123",
  });

  if (registerRes.statusCode !== 201) {
    throw new Error("Failed to register test user");
  }

  // Login test user
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "meal@test.com",
    password: "password123",
  });

  if (loginRes.statusCode !== 200 || !loginRes.body.token) {
    throw new Error("Failed to login test user");
  }

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
        fats: 20,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Test Meal");
    expect(res.body.calories).toBe(500);
  });
});
