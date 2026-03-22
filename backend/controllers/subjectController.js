const db = require("../config/db");

exports.addSubject = (req, res) => {
  const { name } = req.body;

  const query = "INSERT INTO subjects (name) VALUES (?)";

  db.query(query, [name], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "Subject added successfully" });
  });
};

exports.getSubjects = (req, res) => {
  const query = "SELECT * FROM subjects";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
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
