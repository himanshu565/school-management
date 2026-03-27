const db = require("../config/db");

exports.addSubject = (req, res) => {
  const { name } = req.body;

  const query = "INSERT INTO subjects (subject_name) VALUES (?)";

  db.query(query, [name], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Subject added successfully" });
  });
};

exports.getSubjects = (req, res) => {
  const query = "SELECT id, subject_name as name FROM subjects";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

exports.updateSubject = (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  const query = "UPDATE subjects SET subject_name = ? WHERE id = ?";

  db.query(query, [name, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Subject updated successfully" });
  });
};

exports.deleteSubject = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM subjects WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Subject deleted" });
  });
};
