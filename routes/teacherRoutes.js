const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

router.post("/", teacherController.addTeacher);
router.get("/", teacherController.getTeachers);
router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;
