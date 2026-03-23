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

  test("PUT /students/:id updates a student", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).put("/students/1").send({
      name: "Alice Updated",
      age: 15,
      class_id: 9,
      section_id: 1,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Student updated successfully" });
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE students"),
      ["Alice Updated", 15, 9, 1, "1"],
      expect.any(Function),
    );
  });

  test("PUT /teachers/:id updates a teacher", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).put("/teachers/3").send({
      name: "Mr. Rao",
      subject: "Science",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Teacher updated successfully" });
    expect(db.query).toHaveBeenCalledWith(
      "UPDATE teachers SET name = ?, subject = ? WHERE id = ?",
      ["Mr. Rao", "Science", "3"],
      expect.any(Function),
    );
  });

  test("PUT /subjects/:id updates a subject", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).put("/subjects/4").send({
      name: "Chemistry",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Subject updated successfully" });
    expect(db.query).toHaveBeenCalledWith(
      "UPDATE subjects SET name = ? WHERE id = ?",
      ["Chemistry", "4"],
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
