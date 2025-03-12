require('dotenv').config();
const express = require('express');
const { connectDB, client } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

let db;
connectDB().then(database => {
    db = database;
});

app.get('/api/jobs', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ success: false, message: "Database not connected yet" });
        }

        const { company, jobTitle, location, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (company) filter.company = new RegExp(company, 'i');
        if (jobTitle) filter.jobTitle = new RegExp(jobTitle, 'i');
        if (location) filter.location = new RegExp(location, 'i');

        const jobsCollection = db.collection('jobs');
        const jobs = await jobsCollection.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .toArray();

        res.json({ success: true, count: jobs.length, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
