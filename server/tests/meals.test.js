const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let app; // don't import app yet

let mongoServer;
let token;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Import app AFTER connecting to DB
  app = require("../app");

  // Clear users collection in case of leftovers
  await mongoose.connection.db.collection("users").deleteMany({});

  // Register test user
  const registerRes = await request(app).post("/api/auth/register").send({
    name: "Meal Tester",
    email: "meal@test.com",
    password: "password123",
  });

  console.log("REGISTER RESPONSE STATUS:", registerRes.statusCode);
  console.log("REGISTER RESPONSE BODY:", registerRes.body);

  if (registerRes.statusCode !== 201) {
    throw new Error("Failed to register test user");
  }

  // Login test user
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "meal@test.com",
    password: "password123",
  });

  console.log("LOGIN RESPONSE STATUS:", loginRes.statusCode);
  console.log("LOGIN RESPONSE BODY:", loginRes.body);

  if (!loginRes.body.token) {
    throw new Error("Login failed, no token returned");
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
