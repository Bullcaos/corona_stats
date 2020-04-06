const DB_NAME = './history.db';
var sqlite = require('sqlite3').verbose();

function insertData(country, dead, recovered, infected, date) {
    let db = new sqlite.Database(DB_NAME);
    db.run('CREATE TABLE IF NOT EXISTS covid(_id INTEGER NOT NULL, country VARCHAR(125) NOT NULL, dead INTEGER, recovered INTEGER, infected INTEGER, date TIMESTAMP NOT NULL, PRIMARY KEY(_id));', (err) => {
        if(err) console.log(err.message);
        db.run('INSERT INTO covid (country,dead,recovered,infected,date) VALUES (?,?,?,?,?);', [country, dead, recovered, infected, date], (err) => {
            if(err) console.log(err.message);
            db.close();
        });
    });
}

function queryData(country, lastDate) {
    return new Promise((success, reject) => {
        let db = new sqlite.Database(DB_NAME);
        let retVal = [];
        db.all('SELECT country,dead,recovered,infected,date FROM covid WHERE country == ? AND date >= ? ORDER BY date DESC;',
            [country, lastDate], (err, rows) => {
                if(err) reject(err.message);
                else {
                    for(let i = 0; i < rows.length; i++) {
                        retVal.push({
                            country: rows[i].country,
                            dead: rows[i].dead,
                            recovered: rows[i].recovered,
                            confirmed: rows[i].infected,
                            date: rows[i].date
                        });
                    }
                    success(retVal);
                }
        });
    });
}

module.exports.insertData = insertData;
module.exports.queryData = queryData;