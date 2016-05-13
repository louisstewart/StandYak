/**
 * Created by ls99
 *
 * Exports the database connection in exports.connection
 *
 *
 */

var Maria = require('mysql');

var db = Maria.createConnection({
    host: '',
    user: '',
    password: '',
    database : ''
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

