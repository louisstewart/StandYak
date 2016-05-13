/**
 * Created by ls99
 */
'use strict';

var passport = require('passport'),
    db = require('./db').db,
    LocalStrategy = require('passport-local').Strategy;

// Serialize sessions
passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function(email, done) {
    db.query("SELECT * FROM user WHERE email = ?",email,
    function(error,row) {
        if(error) {
            done(error);
        }
        else {

            done(error,{email:row[0].email,first_name:row[0].first_name,last_name:row[0].last_name});
        }
    });
});

// Use local strategy
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, passwd, done) {
        var em = db.escape(email);
        db.query("SELECT * FROM user WHERE email = "+em,
        function(error,row) {
            if(error) {
               return done(error);
            }
            var u = require("../lib/user");
            if(row.length == 0) {
                return done(null, false, {
                    errors: {
                        email : {type: "Email is not registered"}
                    }
                });
            }
            else{
                var user = row[0];
                if(!u.authenticate(user.password, passwd, user.salt)) {
                    return done(null, false, {
                        'errors': {
                            'password': { type: 'Password is incorrect.' }
                        }
                    });
                }
                return done(null, {email:user.email,first_name:user.first_name,last_name:user.last_name});
            }

        });
    }
));
