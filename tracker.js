const COUNTRIES_FILE = './countries.json';

var http = require('https');
var files = require('fs');
var db = require('./database.js');

function downloadData(country) {
    return new Promise((success, reject) => {
        http.get('https://www.trackcorona.live/api/countries/', (resp) => {
            let data = '';
            resp.on('data', (buff) => {
                data += buff;
            });
            resp.on('end', () => {
                if(resp.statusCode != 200) {
                    reject('Status ' + resp.statusCode + ': ' + resp.statusMessage);
                    return;
                }
                let json = null;
                try {
                    json = JSON.parse(data);
                } catch(error) {
                    reject(error);
                    return;
                }
                for(let i = 0; json.code == 200 && i < json.data.length; i++) {
                    if(json.data[i].location.localeCompare(country) == 0) {
                        success(json.data[i]);
                        return;
                    }
                }
                reject('Not found');
                return;
            })
        }).on('error', ()=>{console.log('Can\'t connect to server')});
    });
}

async function updateDatabase() {
    const fcontent = files.readFileSync(COUNTRIES_FILE);
    const countries = JSON.parse(fcontent);
    for(let i = 0; i < countries.length; i++) {
        try {
            let selection = await downloadData(countries[i]);
            db.insertData(selection.location, selection.dead, selection.recovered,
                selection.confirmed, selection.updated);
        } catch (error) {
            console.log('Cannot get data from TrackCorona');
        }
    }
}

module.exports.downloadData = downloadData;
module.exports.updateDatabase = updateDatabase;
module.exports.COUNTRIES_FILE = COUNTRIES_FILE;