'use strict';

var db = require('./db').db,
    passport = require('passport');

/**
 * Session
 * returns info on authenticated user
 */
exports.session = function (req, res) {
    res.json({email:req.user.email});
};

/**
 * Logout
 * returns nothing
 */
exports.logout = function (req, res) {
    if(req.user) {
        req.session.destroy();
        res.send(200);
    } else {
        res.send(400, "Not logged in");
    }
};

/**
 *  Login
 *  requires: {email, password}
 */
exports.login = function (req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        var error = err || info;
        if (error) { return res.status(400).json(error); }

        req.logIn(user, function(err) {
            if (err) { return res.send(err); }
            return res.json({email:req.body.email});

        });
    })(req, res, next);
}