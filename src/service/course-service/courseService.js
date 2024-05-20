// courseService.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3002;

app.use(bodyParser.json());

let courses = [];

app.post('/courses', (req, res) => {
    const course = req.body;
    courses.push(course);
    res.status(201).send(course);
});

app.get('/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');
    res.send(course);
});

app.listen(port, () => {
    console.log(`Course Service listening at http://localhost:${port}`);
});
