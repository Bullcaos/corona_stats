var express = require('express');
var app = express();
var tracker = require('./tracker');
var db = require('./database');
const fsys = require('fs');

app.use('/static', express.static('static'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    let data = fsys.readFileSync(tracker.COUNTRIES_FILE);
    res.render('website/index', {
        title: 'Estadísticas COVID-19',
        countries: JSON.parse(data)
    })
});

app.get('/list/countries', async (req, res) => {
    res.append('Content-Type', 'application/json');
    res.send(fsys.readFileSync(tracker.COUNTRIES_FILE));
});

app.get('/realtime/country/:country', async (req, res) => {
    tracker.downloadData(req.params.country).then((data) => {
        res.append('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    }).catch((err) => {
        console.log(err);
        res.send('Real-time data is not available');
    });
});

app.get('/history/country/:period/:country', async (req, res) => {
    let minDate = new Date(Date.now());
    switch(req.params.period) {
        case 'day':
            minDate.setUTCHours(minDate.getUTCHours() - 24);
            break;
        case 'week':
            minDate.setUTCHours(minDate.getUTCHours() - (7 * 24));
            break;
        case 'month':
            minDate.setUTCMonth(minDate.getUTCMonth() - 1);
            break;
        default:
            res.send('Not a valid time');
            return;
    }
    try {
        let response = await db.queryData(req.params.country, minDate.toISOString());
        res.append('Content-Type', 'application/json');
        res.send(JSON.stringify(response));
    } catch(err) {
        console.log(err);
        res.send('Unable to retrieve the history');
    }
});

app.listen(8081, () => {
    console.log('Server started');
    tracker.updateDatabase();
    setInterval(() => {
        tracker.updateDatabase();
    }, 1.2E6);
});