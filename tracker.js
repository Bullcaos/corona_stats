var http = require('https');

function downloadData(country) {
    return new Promise((success, reject) => {
        http.get('https://www.trackcorona.live/api/countries/', (resp) => {
            let data = '';
            resp.on('data', (buff) => {
                data += buff;
            });
            resp.on('end', () => {
                let json = JSON.parse(data);
                for(let i = 0; json.code == 200 && i < json.data.length; i++) {
                    if(json.data[i].location == country) {
                        success(json.data[i]);
                    }
                }
                reject('Not found');
            })
        });
    });
}

module.exports.downloadData = downloadData;