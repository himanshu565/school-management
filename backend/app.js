const express = require('express');
const cors = require('cors');

const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const subjectRoutes = require('./routes/subjectRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);
app.use('/subjects', subjectRoutes);

module.exports = app;