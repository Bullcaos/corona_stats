var express = require('express');
var app = express();
var tracker = require('./tracker');

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/latest/:country', (req, res) => {
    tracker.downloadData(req.params.country).then((data) => {
        res.send(JSON.stringify(data));
    }).catch((err) => {
        res.send(err);
    });
});

app.listen(8081, () => {
    console.log('Server started');
    setInterval(() => {
        //TODO get countries from JSON file
        tracker.downloadData('Spain').then((data) => {
            console.log('henlo');
        }).catch((err) => {
            res.send(err);
        });
    }, 1200);
});