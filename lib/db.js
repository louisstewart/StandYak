/**
 * Created by ls99
 *
 * Exports the database connection in exports.connection
 *
 *
 */

var Maria = require('mysql');

var db = Maria.createConnection({
    host: 'ls99.host.cs.st-andrews.ac.uk',
    user: 'ls99',
    password: 'MUNa.7vKB70vZi',
    database : 'ls99_CS3101_db'
});

db.connect(function(err) {
    if(err) {
        console.error("Error connecting to DB");
        throw new Error("Cannot connect to DB - shutting down");
    }
    else {
        console.log("Connected to DB");
    }
});

exports.db = db;

