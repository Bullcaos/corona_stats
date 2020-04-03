const DB_NAME = './history.db';
var sqlite = require('sqlite3').verbose();

function insertData(country, dead, recovered, infected, date) {
    let db = new sqlite.Database(DB_NAME);
    db.run('CREATE TABLE IF NOT EXISTS covid(_id INTEGER NOT NULL, country VARCHAR(125) NOT NULL, dead INTEGER, recovered INTEGER, infected INTEGER, date TIMESTAMP NOT NULL, PRIMARY KEY(_id));', (err) => {
        if(err) console.log(err.message);
        db.run('INSERT INTO covid (country,dead,recovered,infected,date) VALUES (?,?,?,?,?);', [country, dead, recovered, infected, date], (err) => {
            if(err) console.log(err.message);
            else console.log('Added');
            db.close();
        });
    });
}

module.exports.insertData = insertData;