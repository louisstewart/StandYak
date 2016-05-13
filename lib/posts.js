/**
 * Created by Louis on 28/03/2016.
 */

var db = require('../lib/db').db;

/**
 * Fetch all picture and text messages from database.
 *
 * Result is a union of 2 sets (message join textmessage) U (message join picture message)
 * So that all posts can be fetched with a single query.
 *
 * Could limit by some number in future.
 *
 * @param req
 * @param res
 */
exports.listAll = function(req,res) {
    // Fetch all the posts ordered by time.
    db.query(
        'SELECT * ' +
        'FROM ' +
        '(SELECT m.email, m.num, t.content , m.post_date, m.post_time , null as type, null as description ' +
        'FROM message m  ' +
        'NATURAL JOIN textmessage t ' +
        'UNION select m.email, m.num, url, m.post_date, m.post_time, p.type, p.description ' +
        'FROM message m ' +
        'NATURAL JOIN picturemessage p) ' +
        'AS dt ' +
        'ORDER BY post_date desc, post_time desc',
        function(err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).json(err);
            }
            console.log("-- Fetched "+rows.length+ " rows");
            return res.status(200).json({posts:rows});
        });
};

/**
 * Fetch posts for some given input parameter.
 *
 * Search is done using like instead of =
 *
 * @param req - contains search param
 * @param res - return posts
 */
exports.getUserPost = function(req,res) {
    var email = req.params.email || "";
    email = "%"+email+"%";
    var query = "SELECT * " +
        "FROM " +
        "(SELECT m.email, m.num, t.content , m.post_date, m.post_time , null as type, null as description " +
        "FROM message m  " +
        "NATURAL JOIN textmessage t " +
        "UNION select m.email, m.num, url, m.post_date, m.post_time, p.type, p.description " +
        "FROM message m " +
        "NATURAL JOIN picturemessage p) " +
        " AS dt " +
        "WHERE email LIKE ?" + // Must escape the email to cleanse against SQLI attacks.
        "ORDER BY post_date desc, post_time desc";
    db.query(query,[email],
        function (err, rows) {
            if (err) {
                console.log(err);
                return res.status(400).json(err);
            }
            console.log("-- Fetched " + rows.length + " rows");
            return res.status(200).json({posts: rows});
        });
};

/**
 * Get the content and number of likes of all liked messages - ordered by likes
 * @param req
 * @param res
 */
exports.getLikedMessages = function(req,res) {
    var query = "Select * From" +
        "(Select *, likeCount(l.poster_email) as likes " +
        "FROM message m " +
        "NATURAL JOIN likes l where m.email = l.poster_email AND m.num = l.post_number " +
        "GROUP BY l.poster_email order by likeCount(l.poster_email) desc) as ab " +
        "JOIN "+
        "(SELECT m.email, m.num, t.content , m.post_date, m.post_time , null as type, null as description " +
        "FROM message m  " +
        "NATURAL JOIN textmessage t " +
        "UNION select m.email, m.num, url, m.post_date, m.post_time, p.type, p.description " +
        "FROM message m " +
        "NATURAL JOIN picturemessage p) AS dt "+
        "on ab.poster_email = dt.email and ab.post_number = dt.num";
    db.query(query,
    function(err, rows) {
        if(err) {
            console.log(err);
            return res.status(400).json(err);
        }
        console.log("-- Fetched "+ rows.length + " rows");
        return res.status(200).json({posts: rows});
    });
};

/**
 * Get the location and content of all messages that are located.
 *
 * @param req
 * @param res
 */
exports.getLocatedPosts = function(req,res) {
    var searchMessage = "SELECT dt.email, dt.num, dt.post_date, dt.post_time, longitude, latitude, content, type, description " +
        "FROM " +
        "(SELECT * " +
        "FROM message m " +
        "JOIN located_at la ON (m.email = la.post_email and m.num = la.post_num) " +
        "JOIN location l ON (la.locID = l.locationID)) AS ab " +
        "JOIN " +
        "(SELECT m.email, m.num, t.content , m.post_date, m.post_time , null as type, null as description " +
        "FROM message m  " +
        "NATURAL JOIN textmessage t " +
        "UNION " +
        "SELECT m.email, m.num, url, m.post_date, m.post_time, p.type, p.description " +
        "FROM message m " +
        "NATURAL JOIN picturemessage p) AS dt " +
        "ON ab.email = dt.email and ab.num = dt.num";
    db.query(searchMessage,
        function(err, rows) {
            if(err) {
                console.log(err);
                res.status(500).json(err);
            }
            else {
                res.status(200).json({posts:rows});
            }
        })
};

/**
 * Post a message (text or picture) on the system.
 *
 * If type and description are set, then it is a picture message.
 * If long and lat are set, then message is located.
 *
 * @param req - contains message info in body.
 * @param res - send status to user.
 */
exports.postMessage = function(req,res) {
    var email = req.body.email;
    var content = req.body.content;
    var description = req.body.description || null;
    var type = req.body.type || null;
    var long = req.body.longitude || null;
    var lat = req.body.latitude || null;
    var getNum = "Select num from message where email = ? order by num desc limit 1"; // Need to get new message number.
    db.query(getNum,[email],
        function(err,rows) {
            if(err) {
                console.log(err);
                return res.status(500).json(err);
            }
            else {
                var num = 1;
                if(rows.length > 0) {
                    num = rows[0].num+1
                }
                var insertMessage = "INSERT INTO message SET ?";
                var d = new Date();
                var details = {
                    email: email,
                    num: num,
                    post_date: d.getFullYear()+"-"+ d.getMonth()+"-"+ d.getDate(),
                    post_time: d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds()
                };
                db.query(insertMessage, details,
                function(err,rows) {
                    if(err) {
                        console.log(err);
                        return res.status(500).json(err);
                    }
                    else {
                        if(!type && !description) {
                            var insert = "INSERT INTO textmessage SET ?";
                             var message = {
                                email: email,
                                num: num,
                                content: content
                            };
                            db.query(insert, message,
                                function (err) {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json(err);
                                    }
                                    else {
                                        locateMessage(email, num, long, lat, res);
                                    }
                                });
                        }
                        else {
                            var insert = "INSERT INTO picturemessage SET ?";
                            var message = {
                                email: email,
                                num: num,
                                url: content,
                                type: type,
                                description: description

                            };
                            db.query(insert,message,
                                function (err) {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json(err);
                                    }
                                    else {
                                        locateMessage(email, num, long, lat, res);
                                    }
                                });
                        }
                    }
                })
            }
        });
};

/**
 * Function to optionally add a location to a message.
 *
 * @param email - poster email
 * @param num - post number
 * @param long - londitude
 * @param lat - latitude
 * @param res - send status to user
 * @returns status message
 */
function locateMessage(email, num, long, lat, res) {
    if(long && lat) {
        // Located message, need to insert into Located_at table and Locations table.
        // Try find if a location exists.
        var getLoc = "Select * from location where longitude = ? and latitude = ?";
        db.query(getLoc, [long,lat],
            function(err,rows) {
                if(err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
                else {
                    if(rows.length > 0) {
                        var id = rows[0].locationID || 0;
                        var insert = "INSERT INTO located_at SET ?";
                        var details = {
                            post_email: email,
                            post_num: num,
                            locID: id
                        };
                        if(id > 0) {
                            db.query(insert, details,
                                function(err,data){
                                    if(err) {
                                        console.log(err);
                                        return res.status(500).json(err);
                                    }
                                    else {
                                        return res.status(200).json({located:true});
                                    }
                                });
                        }
                    }
                    else {
                        var insertLoc = "INSERT INTO location (longitude, latitude) values (?,?)";
                        db.query(insertLoc, [long,lat],
                            function(err,data) {
                                if(err) {
                                    console.log(err);
                                    return res.status(500).json(err);
                                }
                                else {
                                    // Get new id then insert into located_at table.
                                    var getId = "SELECT locationID as id from location order by locationID desc limit 1";
                                    db.query(getId,
                                        function(err,data) {
                                            if(err) {
                                                console.log(err);
                                                return res.status(500).json(err);
                                            }
                                            else {
                                                var id = data[0].id;
                                                var insertNewLoc = "INSERT INTO located_at SET ?";
                                                var loc = {
                                                    post_email : email,
                                                    post_num: num,
                                                    locID: id
                                                };
                                                db.query(insertNewLoc, loc,
                                                    function(err,data) {
                                                        if(err) {
                                                            console.log(err);
                                                            return res.status(500).json(err);
                                                        }
                                                        else {
                                                            return res.status(200).json({located:true});
                                                        }
                                                    })
                                            }
                                        })
                                }
                            })

                    }
                }
            })
    }
    else {
        return res.status(200).json({accepted: true});
    }
}

/**
 * Remove a message from the system. As all foreign keys on message tables are - ON DELETE CASCADE,
 * the rows are removed from all other tables that reference Message table.
 *
 * @param req
 * @param res
 */
exports.deleteMessage = function(req,res) {
    var email = req.params.email || "";
    var num = req.params.num || 0;
    if(email !== "" && num > 0) {
        var deleteMsg = "DELETE FROM message WHERE email = ? AND num = ?";
        db.query(deleteMsg, [email,num],
        function(err) {
            if(err) {
                console.log(err);
                return res.status(500).json(err);
            }
            else {
                return res.status(200).json({deleted:true});
            }
        })
    }
};

/**
 * Update the content of a message of it is text message.
 *
 * @param req
 * @param res
 */
exports.updateMessage = function(req,res) {
    var email = req.body.email || "";
    var num = req.body.num || 0;
    var content = req.body.content || "";
    var type = req.body.type || "";
    var description = req.body.description || "";
    if(email !== "" && num > 0 && content !== "") {
        var updateMsg = "UPDATE textmessage SET content = ? WHERE email = ? AND num = ?";
        db.query(updateMsg,[content,email,num],
        function(err,data) {
            if(err) {
                console.log(err);
                return res.status(500).json(err);
            }
            else {
                return res.status(200).json({updated:true});
            }
        });
    }
};

/**
 * Accessory function to pad number to 2 digits.
 *
 * @param d - number to pad
 * @returns {*} - 2 digit padded number.
 */
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * Accessory function to generate MySQL style date time string.
 * @returns {string}
 */
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

/**
 * Insert a row into the likes table for a message.
 * @param req
 * @param res
 */
exports.like = function(req,res) {
    var liker = req.params.liker || "";
    var poster = req.params.poster || "";
    var number = req.params.number || 0;
    if( liker !== "" && poster !== "" && number > 0) {
        var insertMsg = "Insert into likes set ? on duplicate key update like_timestamp = ?";
        var details = {
            liker_email: liker,
            poster_email: poster,
            post_number: number,
            like_timestamp: new Date().toMysqlFormat()
        };
        db.query(insertMsg,[details,details.like_timestamp],
        function(err,data) {
            if(err) {
                console.log(err);
                return res.status(500).json(err);
            }
            else {
                return res.status(200).json({liked:true});
            }
        })
    }
};

/**
 * Remove row from likes table for a particular message and user.
 * @param req
 * @param res
 */
exports.unlike = function(req,res) {
    var liker = req.params.liker || "";
    var poster = req.params.poster || "";
    var number = req.params.number || 0;
    if( liker !== "" && poster !== "" && number > 0) {
        var insertMsg = "delete from likes where liker_email = ? and poster_email = ? and post_number = ?";
        db.query(insertMsg,[liker,poster,number],
            function(err,data) {
                if(err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
                else {
                    return res.status(200).json({liked:true});
                }
            });
    }
};