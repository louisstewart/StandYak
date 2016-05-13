/**
 * Model of a user.
 */

'use strict';

var crypto = require('crypto');

exports.User = function User(details) {
    this.email = details.email;
    this.first_name = details.first_name;
    this.last_name = details.last_name;
    this.date_of_birth = details.date_of_birth;
    this.salt = makeSalt();
    this.password = encryptPassword(details.password,this.salt);
};

function makeSalt() {
    var salt = crypto.randomBytes(32).toString('hex');
    while(salt.length != 64) {
        salt = crypto.randomBytes(32).toString('hex');
    }
    return salt;
}

function encryptPassword(password,salt) {
    if (!password || !salt) return '';
    var salts = new Buffer(salt, 'hex');
    return crypto.pbkdf2Sync(password, salts, 10000, 32, 'sha256').toString('hex');
}

exports.authenticate = function(dbPass, userPass, salt) {
    var hashed = encryptPassword(userPass,salt);
    return hashed === dbPass;
};