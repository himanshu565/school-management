const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const ensureTeacherSchema = () => {
  const columnCheckQuery = `
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'teachers'
  `;

  db.query(columnCheckQuery, [process.env.DB_NAME], (checkErr, columns) => {
    if (checkErr) {
      console.log("Schema check failed:", checkErr.message);
      return;
    }

    const hasSubjectColumn = columns.some(
      (column) => column.COLUMN_NAME === "subject",
    );

    if (hasSubjectColumn) {
      return;
    }

    const addColumnQuery =
      "ALTER TABLE teachers ADD COLUMN subject VARCHAR(100) NOT NULL DEFAULT ''";

    db.query(addColumnQuery, (alterErr) => {
      if (alterErr) {
        console.log("Failed to add subject column:", alterErr.message);
        return;
      }

      console.log("Added missing subject column to teachers table");
    });
  });
};

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err.message);
  } else {
    console.log("Database connected");
    ensureTeacherSchema();
  }
});

module.exports = db;
// testing done
