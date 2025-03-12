const axios = require('axios');
const cheerio = require('cheerio');
const { connectDB, client } = require('./db');

const MAX_CONCURRENT_REQUESTS = 5;

async function fetchJobDetails(jobUrl) {
    try {
        const { data } = await axios.get(jobUrl);
        const $ = cheerio.load(data);

        return {
            jobUrl,
            jobTitle: $('.p1N2lc').text().trim(),
            company: 'Google',
            location: $('.r0wTof').text().trim(),
            jobDesc: $('.KwJkGe').text().trim() + $('.aG5W3').text().trim() + $('.BDNOWe').text().trim()
        };
    } catch (error) {
        console.error(`Error fetching job details: ${jobUrl} -`, error.message);
        return null;
    }
}

async function scrapeGoogleJobs() {
    const baseUrl = 'https://careers.google.com/jobs/results/';
    let page = 1;
    let hasMorePages = true;
    const db = await connectDB();
    const jobsCollection = db.collection('jobs');

    try {
        while (hasMorePages) {
            const url = `${baseUrl}?page=${page}`;
            console.log(`Fetching Page: ${page}`);

            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const jobsOnPage = $('.lLd3Je');

            if (jobsOnPage.length === 0) {
                hasMorePages = false;
                break;
            }

            const jobUrls = jobsOnPage.map((_, el) => 'https://careers.google.com/' + $(el).find('a').attr('href')).get();
            
            const existingJobs = await jobsCollection.find({ jobUrl: { $in: jobUrls } }).toArray();
            const existingJobUrls = new Set(existingJobs.map(job => job.jobUrl));

            const newJobUrls = jobUrls.filter(url => !existingJobUrls.has(url));

            console.log(`Found ${newJobUrls.length} new jobs on page ${page}`);

            const jobDetailsList = [];
            for (let i = 0; i < newJobUrls.length; i += MAX_CONCURRENT_REQUESTS) {
                const batch = newJobUrls.slice(i, i + MAX_CONCURRENT_REQUESTS);
                const results = await Promise.all(batch.map(fetchJobDetails));
                jobDetailsList.push(...results.filter(Boolean));
            }

            if (jobDetailsList.length > 0) {
                await jobsCollection.insertMany(jobDetailsList);
            }

            console.log(`Page ${page} completed!`);
            page++;
        }

        console.log(`Scraping Finished.`);
    } catch (error) {
        console.error('Error scraping jobs:', error);
    } finally {
        await client.close();
        console.log("MongoDB Connection Closed.");
    }
}

scrapeGoogleJobs();
