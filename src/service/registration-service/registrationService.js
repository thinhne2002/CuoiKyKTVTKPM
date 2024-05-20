const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3003;

app.use(bodyParser.json());

let registrations = [];

// Register a course for a user
app.post('/register', async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        // Check user existence
        const userResponse = await axios.get(`http://user-service:3001/users/${userId}`);
        if (!userResponse.data) return res.status(404).send('User not found');

        // Check course existence
        const courseResponse = await axios.get(`http://course-service:3002/courses/${courseId}`);
        if (!courseResponse.data) return res.status(404).send('Course not found');

        // Check prerequisites
        const course = courseResponse.data;
        for (let prereq of course.prerequisites) {
            const prereqCourse = registrations.find(r => r.userId === userId && r.courseId === prereq);
            if (!prereqCourse) return res.status(400).send(`Prerequisite course ${prereq} not completed`);
        }

        registrations.push({ userId, courseId });
        res.status(201).send('Registered successfully');
    } catch (error) {
        res.status(500).send('An error occurred');
    }
});

// Get registrations for a user
app.get('/registrations/:userId', (req, res) => {
    const userRegistrations = registrations.filter(r => r.userId === parseInt(req.params.userId));
    res.send(userRegistrations);
});

app.listen(port, () => {
    console.log(`Registration Service listening at http://localhost:${port}`);
});
