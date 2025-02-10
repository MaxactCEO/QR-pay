const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';
const dbName = 'qrpay';
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
    console.log('Connected to database');
});

app.use(bodyParser.json());

app.post('/saveBill', (req, res) => {
    const { billId, billData } = req.body;
    db.collection('bills').updateOne({ billId }, { $set: { billData } }, { upsert: true }, (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

app.get('/loadBill', (req, res) => {
    const billId = req.query.billId;
    db.collection('bills').findOne({ billId }, (err, result) => {
        if (err) throw err;
        res.json(result ? result.billData : null);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
