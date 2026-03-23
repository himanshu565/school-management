const db = require("../config/db");

exports.addTeacher = (req, res) => {
  const { name, subject } = req.body;

  if (!name || !subject) {
    return res.status(400).json({ message: "name and subject are required" });
  }

  const query = "INSERT INTO teachers (name, subject) VALUES (?, ?)";

  db.query(query, [name, subject], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Teacher added successfully" });
  });
};

exports.getTeachers = (req, res) => {
  const query = "SELECT * FROM teachers";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

exports.updateTeacher = (req, res) => {
  const id = req.params.id;
  const { name, subject } = req.body;

  if (!name || !subject) {
    return res.status(400).json({ message: "name and subject are required" });
  }

  const query = "UPDATE teachers SET name = ?, subject = ? WHERE id = ?";

  db.query(query, [name, subject, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Teacher updated successfully" });
  });
};

exports.deleteTeacher = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM teachers WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Teacher deleted" });
  });
};
