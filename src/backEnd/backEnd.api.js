const express = require('express');
const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const cors = require('cors')

const app = express();
app.use(cors())

const mongoURI = 'mongodb://127.0.0.1:27017/url-shortner';
let collection;
let client;
const mongoConnection = async () => {
    client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    collection = client.db().collection('url-shortner-mapping');
    console.log("connected to db")
}
mongoConnection();
app.post('/api/shorten', async (req, res) => {
    try {
        const { longURL } = req.query;

        if (!longURL) {
            return res.status(400).json({ error: 'Missing longUrl in the request body' });
        }
        else if (longURL.length <= 8) {
            return res.status(400).json({ error: 'Invalid URL' })
        }
        else {
            const existingURL = await collection.findOne({ longURL: longURL });
            if (existingURL) {
                res.json({ shortURL: `http://localhost:5000/${existingURL.shortURL}` });
                return res;
            }
            const shortURL = uuid.v4().toString().split('-', 1).toString();
            collection.insertOne({ longURL: longURL, shortURL: shortURL });
            res.json({ shortURL: `http://localhost:5000/${shortURL}` });
            return res;
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ success: false, message: 'ERR_BAD_REQUEST' });
    }
});

app.get('/:shortURL', async (req, res) => {
    try {
        console.log('Received request for /:shortURL:', req.params.shortURL);
        const { shortURL } = req.params;
        const url = await collection.findOne({ shortURL: shortURL });

        if (url) {
            return res.redirect(url.longURL);
        } else {
            return res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});