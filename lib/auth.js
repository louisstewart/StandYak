/**
 * Created by LS99.
 */

var db = require('../lib/db').db;

exports.checkUserExists = function(req,res) {
    var email = req.params.email || "";
    console.log("--Checking for email: "+email);
    db.query(
        'SELECT *' +
        'FROM user ' +
        'WHERE email = ' + db.escape(email),
        function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).json(err);
            }
            console.log("-- Fetched "+rows.length+ " rows");
            if(rows.length === 1)
                return res.status(200).json({exists:true});
            else return res.status(200).json({exists:false});
        });
};

exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.sendStatus(401);
};