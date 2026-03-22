const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");

router.post("/", subjectController.addSubject);
router.get("/", subjectController.getSubjects);
router.delete("/:id", subjectController.deleteSubject);

module.exports = router;
