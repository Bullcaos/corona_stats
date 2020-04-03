const COUNTRIES_FILE = './countries.json';

var http = require('https');
var files = require('fs');
var db = require('./database.js');

function downloadData(country) {
    console.log('Download ' + country);
    return new Promise((success, reject) => {
        http.get('https://www.trackcorona.live/api/countries/', (resp) => {
            let data = '';
            resp.on('data', (buff) => {
                data += buff;
            });
            resp.on('end', () => {
                let json = JSON.parse(data);
                for(let i = 0; json.code == 200 && i < json.data.length; i++) {
                    if(json.data[i].location.localeCompare(country) == 0) {
                        console.log('Saved');
                        success(json.data[i]);
                        return true;
                    }
                }
                reject('Not found');
                return true;
            })
        }).on('error', ()=>{console.log('error')});
    });
}
//country, dead, recovered, infected, date
async function updateDatabase() {
    const fcontent = files.readFileSync(COUNTRIES_FILE);
    const countries = JSON.parse(fcontent);
    for(let i = 0; i < countries.length; i++) {
        try {
            let selection = await downloadData(countries[i]);
            console.log('exited');
            db.insertData(selection.location, selection.dead, selection.recovered,
                selection.confirmed, selection.updated);
        } catch (error) {
            console.log('Cannot get data from TrackCorona');
        }
    }
}

module.exports.downloadData = downloadData;
module.exports.updateDatabase = updateDatabase;