/**
 * Created by Louis on 28/03/2016.
 */

'use strict';

var path = require('path');


module.exports = function(app) {

    var auth = require('../lib/auth');
    var users = require('../lib/users');
    var session = require('../lib/session');
    var posts = require('../lib/posts');

    // User Routes
    app.post('/auth/users', users.create);
    app.get('/auth/check_username/:username', users.exists);

    // Admin Routes
    app.post('/auth/admin', admin.create);
    app.get('');

    // Session Routes
    app.get('/auth/session', auth.ensureAuthenticated, session.session);
    app.post('/auth/session', session.login);
    app.delete('/auth/session', session.logout);
    app.get('/auth/check_email/:email', auth.checkUserExists);

    // Post Routes
    app.get('/posts', posts.listAll); // Show most recent messages.
    app.get('/posts/:email', posts.getUserPost); // Get posts for user.
    app.post('/posts', auth.ensureAuthenticated, posts.postMessage); // Make a message.
    app.delete('/posts/:email/:num', auth.ensureAuthenticated, posts.deleteMessage); // Delete a message.
    app.put('/posts', auth.ensureAuthenticated, posts.updateMessage); // Update a message content.

    // Location Routes
    app.get('/location',posts.getLocatedPosts); // Return all messages with locations.

    // Likes Routes
    app.get('/likes',posts.getLikedMessages);
    app.delete('/likes/:liker/:poster/:number',posts.unlike);
    app.put('/likes/:liker/:poster/:number',posts.like);

    app.get('/*', function(req, res) {
        if(req.user) {
            res.cookie('user', JSON.stringify(req.user.email));
        }
        res.render('../public/index.html');
    });


    // Angular Routes
    app.get('/partials/*', function(req, res) {
        var requestedView = path.join('./', req.url);
        res.render(requestedView);
    });


}