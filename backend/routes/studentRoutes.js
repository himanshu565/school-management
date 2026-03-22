const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/', studentController.addStudent);
router.get('/', studentController.getStudents);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;