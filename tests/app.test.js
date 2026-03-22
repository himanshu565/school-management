const request = require("supertest");

jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

const db = require("../config/db");
const app = require("../app");

describe("School management API routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /students returns student list", async () => {
    const students = [
      { id: 1, name: "Alice", age: 14, class_id: 8, section_id: 2 },
    ];

    db.query.mockImplementation((query, callback) => {
      callback(null, students);
    });

    const response = await request(app).get("/students");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(students);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM students",
      expect.any(Function),
    );
  });

  test("POST /teachers validates required fields", async () => {
    const response = await request(app)
      .post("/teachers")
      .send({ name: "Mr. Kumar" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "name and subject are required" });
    expect(db.query).not.toHaveBeenCalled();
  });

  test("POST /subjects creates a subject", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app)
      .post("/subjects")
      .send({ name: "Mathematics" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Subject added successfully" });
    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO subjects (name) VALUES (?)",
      ["Mathematics"],
      expect.any(Function),
    );
  });

  test("DELETE /teachers/:id returns 500 when database fails", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback({ message: "Database failure" });
    });

    const response = await request(app).delete("/teachers/2");

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("message", "Database failure");
  });
});
