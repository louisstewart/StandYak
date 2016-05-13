'use strict';

var User = require('./user'),
    db = require('./db').db,
    passport = require('passport');

/**
 * Create user
 * requires: (email,password,first_name,last_name,dob}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
    console.log(req.body);
    var email = db.escape(req.body.email) || null;
    var password = db.escape(req.body.password) || null;
    var first_name = db.escape(req.body.first_name) || null;
    var last_name = db.escape(req.body.last_name) || null;
    var dob = db.escape(req.body.date_of_birth) || null;

    if(!email || !password || !first_name || !last_name || !dob) {
        return res.status(400).json({errors:{all:{type:"Details not formatted properly"}}});
    }

    var newUser = new User.User(req.body);
    newUser.provider = 'local';
    db.query('SELECT * ' +
             'FROM user ' +
             'WHERE email = '+email,
    function(error, rows) {
        if(error) {
            console.log("Error fetching users");
            return res.status(500).json(error);
        }
        else {
            if(rows.length == 1) {
                console.log("User email already exists");
                return res.status(400).json({errors: {email: {type: "Email in use"}}});
            }
            else {
                var details = {
                    email: newUser.email,
                    password: newUser.password,
                    salt: newUser.salt,
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    date_of_birth: newUser.date_of_birth
                };
                db.query("INSERT INTO user  " +
                         "SET ?",details,
                    function(error,rows) {
                        if(error) {
                            console.log("Could not create user");
                            return res.status(400).json({errors:{fatal:{type:error}}});
                        }
                        else {
                            console.log("User created "+newUser.email);

                            return res.status(200).json({created:true});
                        }
                    });
            }
        }
    });
};

/**
 * Check if an email already exists in the table.
 *
 * @param req - contains username to check
 * @param res - send exists:true if in user table, or false if not.
 */
exports.exists = function(req,res) {
    var email = db.escape(req.params.email);

    db.query("SELECT * FROM user WHERE email = "+email,
        function(error,rows) {
            if(error) {
                console.log("Error checking if email exists");
                return res.status(500).json(error);
            }
            else {
                if(rows.length == 1) {
                    console.log("-- Found email "+email);
                    return res.status(200).json({exists:true});
                }
                else {
                    return res.status(200).json({exists:false});
                }
            }
    });
};


