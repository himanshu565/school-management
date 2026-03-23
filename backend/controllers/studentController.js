const db = require("../config/db");

exports.addStudent = (req, res) => {
  const { name, age, class_id, section_id } = req.body;

  const query = `INSERT INTO students (name, age, class_id, section_id)
                   VALUES (?, ?, ?, ?)`;

  db.query(query, [name, age, class_id, section_id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Student added successfully",
    });
  });
};

exports.getStudents = (req, res) => {
  const query = "SELECT * FROM students";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

exports.updateStudent = (req, res) => {
  const id = req.params.id;
  const { name, age, class_id, section_id } = req.body;

  const query = `UPDATE students
                 SET name = ?, age = ?, class_id = ?, section_id = ?
                 WHERE id = ?`;

  db.query(query, [name, age, class_id, section_id, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Student updated successfully",
    });
  });
};

exports.deleteStudent = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM students WHERE id=?", [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Student deleted",
    });
  });
};
