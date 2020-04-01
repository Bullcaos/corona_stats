var sqlite = require('sqlite');
const DB_NAME = './history.db';

function insertData(country, dead, recovered, infected, date) {
    let db = sqlite.open(DB_NAME);
    db.run('CREATE TABLE IF NOT EXISTS covid(id INT AUTO_INCREMENT NOT NULL, country VARCHAR(125) NOT NULL, dead INT NOT NULL, recovered INT NOT NULL, infected INT NOT NULL, date TIMESTAMP NOT NULL, PRIMARY KEY(id));');
    db.run('INSERT INTO covid(country,dead,recovered,infected,date) VALUES (?,?,?,?,?);' [country, dead, recovered, infected, date]);
    db.close();
}