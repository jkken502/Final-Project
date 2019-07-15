/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var url = __webpack_require__(1);
exports.start = function (req, res) {
  //entry point into api folder
  var Url = url.parse(req.url, true); //gets url
  var query = Url.query; //gets the queries in the url
  if (query["getTest"] != undefined) //if query getTest is not undefined it exists example: localhost/api?getTest=1 and the value is stored in the query[name_of_query]
    {
      console.log("test paramater value: " + query["getTest"]); //this is just a template so we just have a simple command for now.
      res.write("test paramater value: " + query["getTest"]); //we are simply displaying this to the screen but we can do more api things later.
    }
  res.end("api test page.");
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var url = __webpack_require__(1);
var twitch = __webpack_require__(10);
var cookie = __webpack_require__(6);
var mysql = __webpack_require__(13);
function getQuery(req, query, equals) {
    query = query.toLowerCase();
    var urlQuery;
    if (req.url != undefined) {
        urlQuery = url.parse(req.url, true).query;console.log(urlQuery);
    } else {
        urlQuery = req.query;
    }
    var searchQuery = JSON.parse(JSON.stringify(urlQuery).toLowerCase());
    if (searchQuery[query]) {
        var temp = "";
        for (var i = 0; i < query.length; i++) {
            temp += JSON.stringify(urlQuery)[JSON.stringify(searchQuery).search(query) + i];
        }
        if (equals) {
            return urlQuery[temp].toLowerCase() == equals.toLowerCase();
        }
        return urlQuery[temp];
    } else return false;
}
exports.start = function (req, res) {
    var Url = url.parse(req.url, true); //gets url
    var query = Url.query; //gets the queries in the url
    var request;
    var redirect_uri = "http://localhost/api/login";
    var client_id = process.env.client_id;
    var code;
    console.log(query);
    if (req.method == "GET") {
        if (request = getQuery(req, "request")) //if query getTest is not undefined it exists example: localhost/api?getTest=1 and the value is stored in the query[name_of_query]
            {
                request = request.toLowerCase();
                console.log("request");

                if (request == "twitchauthlink") {
                    if (getQuery(req, "redirect")) {
                        res.writeHead(302, { 'Location': 'https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&scope=user_read&force_verify=true' });
                        res.end();
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&scope=user_read&force_verify=true');
                    }
                } else if (request == "isloggedin") {
                    console.log("cookie: " + req.header("cookie"));
                    if (cookie.isCookie(req, "oauth") && cookie.isCookie(req, "nick")) {
                        username = cookie.getCookie(req, "nick");
                        console.log("request isloggedin stored in cookie user:" + username);
                        //twitch.validateOAuth
                        twitch.validateOAuth(cookie.getCookie(req, "oauth"), function (result, status) {
                            var json = JSON.parse(result);
                            if (status == 200 && json["login"].toLowerCase() == username.toLowerCase()) {
                                var user = getQuery(req, "user");
                                if (!user || user.toLowerCase() == username.toLowerCase()) {
                                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                                    res.write("true");
                                    res.end();
                                } else {
                                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                                    res.write("false");
                                    res.end();
                                }
                            } else if (status == 401) {
                                if (result.message != undefined) {
                                    if (result.message == "invalid access token") {
                                        cookie.removeCookie(req, "nick");
                                        cookie.removeCookie(req, "oauth");
                                        cookie.endSession();
                                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                                        res.write("false");
                                        res.end();
                                    }
                                }
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.write("false");
                                console.log("no cookie");
                                res.end();
                            }
                        });
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.write("false");
                        res.end();
                    }
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.write("error 404");
                    res.end();
                }
            } else if ((code = query["code"]) != undefined && typeof code == "string") {
            var client_secret = process.env.client_secret;
            var OAuth;
            var json;
            var username;
            var data = JSON.stringify({ client_id: client_id, client_secret: client_secret, grant_type: 'authorization_code', redirect_uri: redirect_uri, code: code });
            var sentResponse = false;
            twitch.postSSL("https://api.twitch.tv/kraken/oauth2/token", data, function (result, status) {
                if (status == 200) {
                    json = JSON.parse(result);
                    OAuth = json['access_token'];
                    console.log("OAuth:" + OAuth);

                    twitch.validateOAuth(OAuth, function (result, status) {
                        if (status == 200) {
                            json = JSON.parse(result);
                            username = json["login"];
                            if (cookie.isCookie(req, "oauth")) cookie.updateCookie(req, "oauth", OAuth);else cookie.addCookie(req, "oauth", OAuth);
                            if (cookie.isCookie(req, "nick")) cookie.updateCookie(req, "nick", username);else cookie.addCookie(req, "nick", username);
                            cookie.save(req);
                            console.log("OAuth:" + cookie.getCookie(req, "oauth") + "\nNICK: " + cookie.getCookie(req, "nick"));
                            //todo invalidate previous oauth token
                            mysql.getOauth(username, function (old_auth) {
                                console.log("old_auth:" + old_auth);
                                data = JSON.stringify({ client_id: client_id, access_token: old_auth });
                                if (old_auth != undefined) {
                                    twitch.postSSL("https://id.twitch.tv/oauth2/revoke?client_id=" + client_id + "&token=" + old_auth, "", function (response) {
                                        console.log("revoke data:" + data);
                                        console.log(response);
                                    });
                                }

                                if (old_auth == undefined) {
                                    //todo insert into database
                                    console.log("attempting to insert oauth");
                                    mysql.insertIntoTable("oauth", "auth,nick", OAuth + "," + username);
                                } else {
                                    console.log("attempting to update oauth");
                                    mysql.updateTable("oauth", "auth", OAuth, "nick", username);
                                }
                            });
                            //end insert into database

                            res.writeHead(302, { "Location": "/songlist" });
                            res.end();
                            sentResponse = true;
                            return false;
                        }
                    });
                    if (sentResponse) {
                        return false;
                    }
                } else {
                    if (sentResponse) {
                        return false;
                    }
                    if (status == 404 && process.env.serverSecondaryMethod != "true") {
                        res.write("Twitch responded with page not found.\nReattempting");
                        process.env.serverSecondaryMethod = "true";
                        exports.start(req, res);
                    } else {
                        sentResponse = true;
                        res.write("Error server responded with " + status);
                        res.end();
                        return false;
                    }
                }
            });
        } else {
            res.write("error 404");
            res.end();
        }
    } else if (req.method == "POST") {
        if (req.header("Content-Type") != "application/json") {
            req.headers["Content-Type"] = "application/json";
            //req.method="POST";
        }
        if (getQuery(req, "request", "getloggedinuser") && req.body["session"]) {
            var nick;
            var oauth;
            var _sessionID2 = void 0;
            console.log("request body: " + JSON.stringify(req.body));
            console.log("cookie: " + req.header("cookie"));
            console.log("session set");
            _sessionID2 = req.body["session"].slice(4).split(".")[0];
            cookie.getSession(_sessionID2, function (err, session) {
                nick = session.nick;
                oauth = session.oauth;
                console.log(nick);
                console.log(oauth);

                if (nick && oauth) {
                    twitch.validateOAuth(oauth, function (_result, status) {
                        if (status == 200) {
                            res.writeHead(200, { "Content-Type": "text/plain" });
                            res.end(nick);
                        } else if (status == 401 && _result.message == "invalid access token") {
                            cookie.removeCookie(req, "nick");
                            cookie.removeCookie(req, "oauth");
                            cookie.save();
                            cookie.endSession();
                            res.writeHead(403, { "Content-Type": "text/plain" });
                            res.end("User not logged in.");
                        } else {
                            res.writeHead(403, { "Content-Type": "text/plain" });
                            res.end("User not logged in.");
                        }
                    });
                } else {
                    res.writeHead(403, { "Content-Type": "text/plain" });
                    res.end("User not logged in.");
                }
            });
        } else if (getQuery(req, "request", "getloggedinuser")) {
            if (cookie.isCookie(req, "nick") && cookie.isCookie(req, "oauth")) {
                twitch.validateOAuth(cookie.getCookie(req, "oauth"), function (_result, status) {
                    if (status == 200) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end(cookie.getCookie(req, "nick"));
                    } else if (status == 401 && _result.message == "invalid access token") {
                        cookie.removeCookie(req, "nick");
                        cookie.removeCookie(req, "oauth");
                        cookie.save();
                        cookie.endSession();
                        res.writeHead(403, { "Content-Type": "text/plain" });
                        res.end("User not logged in.");
                    } else {
                        res.writeHead(403, { "Content-Type": "text/plain" });
                        res.end("User not logged in.");
                    }
                });
            } else {
                res.writeHead(403, { "Content-Type": "text/plain" });
                res.end("User not logged in.");
            }
        } else if (getQuery(req, "request", "isloggedin")) {
            var json;
            console.log("Method: " + req.method);
            console.log("request headers: " + JSON.stringify(req.headers));
            console.log("request=isloggedin");
            console.log("request body: " + JSON.stringify(req.body));
            if (req.body["session"]) {
                _sessionID = req.body["session"].slice(4).split(".")[0];
                cookie.getSession(_sessionID, function (err, session) {
                    console.log(JSON.stringify(session));
                    if (session && session.oauth && session.nick) {
                        username = session.nick;
                        console.log("request isloggedin stored in cookie user:" + username);
                        //twitch.validateOAuth
                        twitch.validateOAuth(session.oauth, function (result, status) {
                            json = JSON.parse(result);
                            if (status == 200 && json["login"].toLowerCase() == username.toLowerCase()) {
                                var user = getQuery(req, "user");
                                if (!user || user.toLowerCase() == username.toLowerCase()) {
                                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                                    res.write("true");
                                    console.log("true");
                                    res.end();
                                } else {
                                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                                    res.write("false");
                                    console.log("false");
                                    res.end();
                                }
                            } else if (status == 401) {
                                console.log("staus 401");
                                console.log("result: " + result);
                                if (json.message != undefined) {
                                    console.log("result.message");
                                    if (json.message == "invalid access token") {
                                        res.writeHead(401, { 'Content-Type': 'text/plain' });
                                        res.write("invalid access token");
                                        res.end();
                                        console.log("invalid access token");
                                        cookie.removeCookie(req, "nick");
                                        cookie.removeCookie(req, "oauth");
                                        //cookie.endSession();
                                    }
                                }
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.write("false");
                                console.log("false");
                                res.end();
                            }
                        });
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.write("false");
                        res.end();
                    }
                });
            } else {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.write("Request missing session");
                console.log("request missing session");
                res.end();
            }
        } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("page not found");
            console.log("404 #1");
            res.end();
        }
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("page not found.");
        console.log("404 #2");
        console.log("method: " + req.method);
        res.end();
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var url = __webpack_require__(1);
var mysqljs = __webpack_require__(13);
var mysql = __webpack_require__(14);
var cookie = __webpack_require__(6);
var youtube = __webpack_require__(39);
var disableprotection = process.env.disable_protection == "true";
function insertSong(res, req, _songqueueData, _youtubeData) {
    //youtubeData will have id, titile, length, views, likeCount, dislikeCount

    /*
    songqueueData will have requestedBy, channel
    todo list add other fields:
    length
    views
    likeCount
    dislikeCount
    */
    var channel = _songqueueData.channel;
    var requestedBy = _songqueueData.requestedBy;
    var songURL = "https://www.youtube.com/watch?v=" + _youtubeData.id;
    var title = _youtubeData.title;
    var length = _youtubeData.length;
    var views = _youtubeData.views;
    var likeCount = _youtubeData.likeCount;
    var dislikeCount = _youtubeData.dislikeCount;
    console.log("Id" + _youtubeData.id);
    console.log(_songqueueData);
    console.log(_youtubeData);

    mysqljs.tableExists(channel + "_songList", function (_tableExists) {
        if (_tableExists) {
            console.log("table exists");
            console.log("requestedBy: " + requestedBy);
            console.log("title " + title);
            console.log("url " + songURL);
            if (requestedBy && title && songURL) {
                var URL = url.parse(songURL);
                if (URL.host == "youtube.com" || URL.host == "www.youtube.com") {
                    if (requestedBy == cookie.getCookie(req, "nick") || disableprotection) {
                        if (requestedBy != cookie.getCookie(req, "nick") && disableprotection) {
                            console.warn("User permissions override setting allowed " + cookie.getCookie(req, "nick") + " access to a restricted function that would have otherwise been denied.");
                        }
                        console.log("attempting to insert data");
                        var channel = getQuery(req, "channel");
                        mysqljs.getQueue(channel, function (_queue) {
                            console.log("queue,requestedBy,title,songURL");
                            console.log(_queue + "," + requestedBy + "," + title + "," + songURL);
                            mysqljs.insertIntoTable(channel + "_songList", "queue,requestedBy,title,length,views,likeCount,dislikeCount,songURL", [[_queue, requestedBy, title, length, views, likeCount, dislikeCount, songURL]], function (_success) {
                                if (_success) {
                                    res.writeHead(200, { "Content-Type": "text/plain" });
                                    res.write("Song added.");
                                    res.end();
                                } else {
                                    res.writeHead(500, { "Content-Type": "text/plain" });
                                    res.write("server error");
                                    res.end();
                                }
                            });
                        });
                    } else {
                        console.log("Return forbidden 403, not authorized.");
                        res.writeHead(403, { "Content-Type": "text/plain" });
                        res.write("Forbidden user not authorized.");
                        res.end();
                    }
                } else {
                    console.log("Host: '" + songURL.host + "' is not supported");
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.write("Host: '" + songURL.host + "' is not supported.");
                    res.end();
                }
            } else {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.write("Error: Your request is malformed.");
                res.end();
            }
        } else {
            console.log("table does not exist");
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.write("Error: the songlist for this channel could not be found. Please double check your request, or contact the site administrator.");
            res.end();
        }
    }); // */

}
function getQuery(req, query, equals) {
    query = query.toLowerCase();
    var urlQuery = url.parse(req.url, true).query;
    var searchQuery = JSON.parse(JSON.stringify(urlQuery).toLowerCase());
    if (searchQuery[query]) {
        var temp = "";
        for (var i = 0; i < query.length; i++) {
            temp += JSON.stringify(urlQuery)[JSON.stringify(searchQuery).search(query) + i];
        }
        if (equals) {
            return urlQuery[temp].toLowerCase() == equals.toLowerCase();
        }
        return urlQuery[temp];
    } else return false;
}
exports.start = function (req, res) {
    console.log("songqueue");
    if (getQuery(req, "request", "addTable")) {
        if (getQuery(req, "user") == cookie.getCookie(req, "nick") || disableprotection) {
            if (getQuery(req, "user") != cookie.getCookie(req, "nick") && disableprotection) {
                console.warn("User permissions override setting allowed " + cookie.getCookie(req, "nick") + " access to a restricted function that would have otherwise been denied.");
            }
            mysqljs.createSongRequestTable(getQuery(req, "user"));
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.write("Table added");
            res.end();
        } else {
            res.writeHead(403, { "Content-Type": "text/plain" });
            res.write("Access forbidden: you are either not logged in or your request is malformed.");
            res.end();
        }
    } else if (getQuery(req, "request", "insertSong") && getQuery(req, "channel") && req.method == "POST") {

        console.log(req.body);
        if (req.body["requestedBy"] == cookie.getCookie(req, "nick") || disableprotection) {
            if (req.body["requestedBy"] != cookie.getCookie(req, "nick") && disableprotection) {
                console.warn("User permissions override setting allowed " + cookie.getCookie(req, "nick") + " access to a restricted function that would have otherwise been denied.");
            }
            if (req.body["url"]) {
                var _url = req.body["url"];
                youtube.getVideoDetails(_url, function (_data) {
                    var songdata = { "channel": getQuery(req, "channel"), "requestedBy": req.body["requestedBy"] };
                    insertSong(res, req, songdata, _data);
                });
            } else if (req.body["title"]) {
                youtube.getVideoURL(req.body["title"], function (url) {
                    youtube.getVideoDetails(url, function (_data) {
                        var songdata = { "channel": getQuery(req, "channel"), "requestedBy": req.body["requestedBy"] };
                        insertSong(res, req, songdata, _data);
                    });
                });
            }
        } else {
            res.writeHead(403, { "Content-Type": "text/plain" });
            res.write("Forbidden user not authorized.");
            res.end();
        }
    } else if (getQuery(req, "request", "popfromqueue") && getQuery(req, "channel") && req.method == "POST") {

        console.log(cookie.getCookie(req, "nick") + "==" + getQuery(req, "channel"));
        if (cookie.getCookie(req, "nick") == getQuery(req, "channel") || disableprotection) {
            if (getQuery(req, "channel") != cookie.getCookie(req, "nick") && disableprotection) {
                console.warn("User permissions override setting allowed " + cookie.getCookie(req, "nick") + " access to a restricted function that would have otherwise been denied.");
            }
            mysqljs.popFromQueue(getQuery(req, "channel"), function () {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.write("success");
                console.log("pop from queue successful.");
                res.end();
            });
        } else {
            res.writeHead(403, { "Content-Type": "text/plain" });
            res.write("Error: Request is forbidden");
            res.end();
        }
    } else if (getQuery(req, "request", "getSongs")) {
        if (getQuery(req, "channel")) {
            mysqljs.getSongs(getQuery(req, "channel"), function (songs) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(songs));
            });
            console.log("dummy function to get song list");
        } else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.write("Error: request is malformed.");
            res.end();
        }
    } else if (getQuery(req, "request", "deleteSong") && req.method == "POST") {
        if (req.body["requestedBy"] && req.body["queue"] && getQuery(req, "channel")) {
            var deleteInitiatedBy = req.body["requestedBy"];
            //initiated 
            var deleteQueue = req.body["queue"];
            var channel = getQuery(req, "channel");
            mysqljs.getQueue(channel, function (queue) {

                if (deleteQueue < queue && deleteQueue > 0) {
                    mysqljs.getRequesterFromQueue(channel, deleteQueue, function (requestedBy) {
                        if (deleteInitiatedBy == cookie.getCookie(req, "nick") && (deleteInitiatedBy == channel || deleteInitiatedBy == requestedBy) || disableprotection) {
                            if (disableprotection && (deleteInitiatedBy = cookie.getCookie(req, "nick") && (deleteInitiatedBy == channel || deleteInitiatedBy == requestedBy) == false)) {
                                console.warn("User permissions override setting allowed " + cookie.getCookie(req, "nick") + " access to a restricted function that would have otherwise been denied.");
                                deleteInitiatedBy = requestedBy;
                            }
                            mysqljs.deletefromQueue(channel, deleteInitiatedBy, deleteQueue, function (_success) {
                                if (_success) {
                                    res.writeHead(200, { "Content-Type": "text/plain" });
                                    res.write("success");
                                    res.end();
                                }
                            });
                        } else {
                            res.writeHead(403, { "Content-Type": "text/plain" });
                            res.write("Error: request is forbidden.");
                            res.end();
                        }
                    });
                } else {
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.write("Error: song in queue could not be deleted");
                    res.end();
                }
            });
        } else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.write("Error: request is malformed.");
            res.end();
        }
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("Error: page is not found.");
        res.end();
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(12);
//var cookieParser = require('cookie-parser');
var session = __webpack_require__(34);
var MySQLStore = __webpack_require__(35)(session);

var options = {
  host: 'localhost',
  port: 3306,
  user: 'alpha_sessions',
  password: 'password',
  database: 'sessions'
};

var sessionStore = new MySQLStore(options);
exports.getSession = function (SID, callback) {
  sessionStore.get(SID, function (err, session) {
    if (typeof callback == "function") {
      callback(err, session);
    }
  });
};
exports.addCookie = function (req, name, value) {
  //adds a cookie if it does not exist
  if (req.session[name] == undefined) {
    //if it doesn't exist req.session["newCookie"] will equal undefined.
    req.session[name] = value; //so we will set the value
    return true; //...and return true
  }
  return false; //otherwise we will return false
};
exports.getCookie = function (req, name) {
  //this will return the value of the cookie
  return req.session[name]; //returns value.
};
exports.isCookie = function (req, name) {
  //has this cookie been set already, or does the cookie not exist.
  console.log(+"isSet? " + name + ":" + req.session[name] != undefined);
  return req.session[name] != undefined;
};
exports.updateCookie = function (req, name, value) {
  //updates the value of a cookie if it already exists
  if (req.session[name] != undefined) {
    //if the cookie has not yet been set before we would be adding a cookie.
    req.session[name] = value;
    return true;
  }
  return false;
};
exports.removeCookie = function (req, name) {
  //deletes cookie
  if (req.session[name] != undefined) {
    req.session[name] = undefined;
    return true;
  }
  return false;
};
exports.setCookie = function (req, name, value) {
  //this is a master function will create, or update the value of a cookie.
  req.session[name] = value;
  return true;
};
exports.endSession = function (req) {
  req.session.destroy(function (err) {
    if (error) {
      return false;
    }
    return true;
  });
};
exports.newSession = function (req) {
  req.session.regenerate(function (err) {
    if (error) {
      return false;
    }
    return true;
  });
};
exports.start = function (app) {
  //required code to use cookies takes the express object and tells express we are using session cookies
  app.use(session({
    secret: "cookie_secret",
    name: "session",
    proxy: true,
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: { httpOnly: false }
  }));
};
exports.save = function (req) {
  //in the event we need this for long connections and it might be useful to save a cookie manually, cookies are save automatically at the end of a request.
  req.session.save();
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Home = __webpack_require__(20);

var _Home2 = _interopRequireDefault(_Home);

var _Grid = __webpack_require__(22);

var _Grid2 = _interopRequireDefault(_Grid);

var _Redirect = __webpack_require__(23);

var _Redirect2 = _interopRequireDefault(_Redirect);

var _api = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = [{
  path: '/songlist',
  component: _Home2.default,
  fetchInitialData: function fetchInitialData(cookie, query) {
    return (0, _api.getUser)(cookie, query);
  }
}, {
  path: '/popular/:id',
  component: _Grid2.default,
  fetchInitialData: function fetchInitialData() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return (0, _api.fetchPopularRepos)(path.split('/').pop());
  }
}, {
  path: '/',
  component: _Redirect2.default,
  exact: true
}];

exports.default = routes;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchPopularRepos = fetchPopularRepos;
exports.isLoggedin = isLoggedin;
exports.getUser = getUser;

var _isomorphicFetch = __webpack_require__(21);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetchPopularRepos() {
  var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';

  var encodedURI = encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:' + language + '&sort=stars&order=desc&type=Repositories');

  return (0, _isomorphicFetch2.default)(encodedURI).then(function (data) {
    return data.json();
  }).then(function (repos) {
    return repos.items;
  }).catch(function (error) {
    console.warn(error);
    return null;
  });
}

function isLoggedin() {
  return (0, _isomorphicFetch2.default)("http://localhost/api/login?request=isloggedin", {
    credentials: "include"
  }).then(function (data) {
    return data.text();
  }).then(function (loggedin) {
    return loggedin;
  }).catch(function (error) {
    console.warn(error);
    return null;
  });
}
function getUser(cookie, query) {
  console.log("query in api.js function getUser: " + JSON.stringify(query));
  return (0, _isomorphicFetch2.default)("http://localhost/api/login?request=getloggedinuser", {
    headers: { cookie: cookie },
    method: "POST",
    credentials: "include"
  }).then(function (data) {
    return data.text();
  }).then(function (username) {
    return JSON.parse(JSON.stringify({ loggedin: username != "User not logged in.", username: username, channel: query["channel"] }));
  }).catch(function (res) {
    console.log(res);
    return null;
  });
}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("object-assign");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var http = __webpack_require__(32);
var url = __webpack_require__(1);
var https = __webpack_require__(11);

//this function will be used mostly for twitch api
//Makes a get request to the following url through https protocol.
exports.getSSL = function (Url) {
  var clientAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  //clientAdd is a boolean should we add our client_id at the end of the url.
  //the client_id is a requirement by twitch to identify who is making a request to their API

  Url = url.parse(Url, true);
  var qdata = Url.query;
  if (qdata.client_id == undefined && clientAdd == true) {
    if (Url.search == "") {
      Url.search = "?client_id=gxnsm64vnuninzu8f9whol09b82pqx";
    } else {
      Url.search += "&client_id=gxnsm64vnuninzu8f9whol09b82pqx";
    }
  }

  var options = {
    host: Url.host,
    port: 443,
    path: Url.pathname + Url.search,
    method: "GET"
  };
  console.log("requesting resource:" + Url.host + ":443");
  var req = https.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });
  req.end();
};

exports.postSSL = function (Url, data, callback) {
  Url = url.parse(Url, true);
  var options;
  if (process.env.serverSecondaryMethod == "true") {
    console.log("secondary round started.");
    Url.search = "?";
    var temp = void 0;
    properties = Object.getOwnPropertyNames(data);
    for (var i = 0; i < properties.length; i++) {
      temp = data[properties[i]];
      if ((typeof temp === 'undefined' ? 'undefined' : _typeof(temp)) == "object") {
        temp = encodeURIComponent(JSON.stringify(temp));
      }
      Url.search += temp[i] + "=" + temp;
      if (i != properties.length - 1) {
        Url.search += "&";
      }
    }
    console.log(Url.search);
    options = {
      host: Url.host,
      port: 443,
      path: Url.pathname + Url.search,
      method: 'POST'

    };
    console.log("requesting resource:" + Url.host + Url.pathname + Url.search + ":443");
  } else {
    options = {
      host: Url.host,
      port: 443,
      path: Url.pathname + Url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }

    };
    console.log("requesting resource:" + Url.host + Url.pathname + ":443");
  }
  var req = https.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log(chunk);
      if (typeof callback == "function") {
        var ret = callback(chunk, res.statusCode);
        if (ret != undefined) {
          return ret;
        }
      }
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });
  req.write(data);
  req.end();
};

//this function will verify the OAuth token is valid
exports.validateOAuth = function (oAuth, callback) {
  var options = {
    host: 'id.twitch.tv',
    port: 443,
    path: '/oauth2/validate',
    method: 'GET',
    headers: {
      'Authorization': 'OAuth ' + oAuth
    }
  };
  console.log("requesting resource:https://id.twitch.tv/oauth2/validate:443");
  var req = https.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log(chunk);
      if (typeof callback == "function") {

        var ret = callback(chunk, res.statusCode);
        if (ret != undefined) {
          return ret;
        }
      }
    });
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//to create user use this format
//CREATE USER 'alpha'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
//when reseting passwords use this format
//ALTER USER 'alpha'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
var mysql = __webpack_require__(14);
var con = mysql.createPool({
  host: "localhost",
  user: "alpha",
  password: "password",
  database: "songrequest"
});
function isCallback(callback, args) {
  if (typeof callback == "function") {
    callback(args);
  }
}
exports.test = function () {
  con.query("select * from test", function (err, result, fields) {
    console.log(result);
  });
};
exports.createOAuthTable = function (callback) {
  if (exports.tableExists("oAuth", function (_exists) {
    if (!_exists) {
      con.query("create table oAuth(auth varchar(80),nick varchar(25))", function (err, result, fields) {
        console.log(result);
        isCallback(callback);
      });
    }
  })) ;
};
exports.createSongRequestTable = function (channel, callback) {
  if (exports.tableExists(channel + "_songList", function (_exists) {
    if (!_exists) {
      var query = con.query("create table " + mysql.escapeId(channel + "_songList") + " (id int key AUTO_INCREMENT, queue int unique not null, requestedBy VARCHAR(25) NOT NULL, title varchar(100) NOT NULL, length int NOT NULL, views int NOT NULL, likeCount int not null, dislikeCount int not null, songURL VARCHAR(80) NOT NULL)", function (err, result, fields) {
        console.log(query.sql);
        isCallback(callback);
      });
    }
  })) ;
};
exports.getSongs = function (table, callback) {
  if (exports.tableExists(table + "_songList", function (_exists) {
    if (_exists) {
      con.query("select queue,title,length,views,likeCount,dislikeCount,songURL,requestedBy from " + mysql.escapeId(table + "_songList"), function (err, result) {
        if (err) throw err;
        isCallback(callback, result);
      });
    } else {
      isCallback(callback, JSON.parse(JSON.stringify([])));
    }
  })) ;
};
exports.getQueue = function (table, callback) {
  if (exports.tableExists(table + "_songList", function (_exists) {
    if (_exists) {
      con.query("select count(queue) as count from " + mysql.escapeId(table + "_songList") + "order by count desc limit 1", function (err, result) {
        if(result[0].count>0){
      con.query("select queue as count from " + mysql.escapeId(table + "_songList") + "order by count desc limit 1", function (err, result) {
        if (err) throw err;
        isCallback(callback, result[0].count + 1);
      });
    }
    else
    {
      isCallback(callback,0)
    }
    });
    }
  }));
};
exports.getRequesterFromQueue = function (table, queue, callback) {
  if (exports.tableExists(table + "_songList", function (_exists) {
    if (_exists) {
      con.query("select requestedBy from " + mysql.escapeId(table + "_songList") + " where queue=?", queue, function (err, result) {
        if (err) throw err;

        if (typeof result[0] != "undefined") isCallback(callback, result[0].requestedBy);else isCallback(callback);
        if (typeof result[0] != "undefined") console.log("mysql.js getRequesterFromQueue() requested by: " + result[0].requestedBy);else console.log();
      });
    }
  })) ;
};
exports.deletefromQueue = function (table, deleteInitiatedBy, deleteQueue, callback) {
  exports.getRequesterFromQueue(table, deleteQueue, function (requestedBy) {
    if (requestedBy == deleteInitiatedBy || table == deleteInitiatedBy) {
      con.query("delete from " + mysql.escapeId(table + "_songList") + " where queue=?", deleteQueue, function (err, result) {
        if (err) throw err;
        con.query("update " + mysql.escapeId(table + "_songList") + " set queue=queue-1 where queue>? order by queue asc", deleteQueue, function (error) {
          if (error) throw error;
          isCallback(callback, result.affectedRows == 1);
        });
      });
    } else {
      isCallback(callback);
    }
  });
};
exports.popFromQueue = function (table, callback) {
  con.query("delete from " + mysql.escapeId(table + "_songList") + " where queue=0", function (err) {
    if (err) throw err;
    con.query("update " + mysql.escapeId(table + "_songList") + " set queue=queue-1 order by queue asc", function (error) {
      if (error) throw error;
      isCallback(callback);
    });
  });
};
exports.tableExists = function (table, callback) {
  con.query("select count(*) as found from information_schema.tables where table_schema='songrequest' and table_name=?", [table], function (err, result, fields) {
    console.log(result[0].found == 1);

    isCallback(callback, result[0].found == 1);
  });
};
exports.getOauth = function (user, callback) {
  exports.tableExists("oauth", function (_exists) {
    if (_exists && user != undefined) {
      con.query("select auth from oauth where nick=?", [user], function (err, result, fields) {
        console.log(result);
        if (result[0] != undefined) isCallback(callback, result[0].auth);
      });
    } else if (!_exists) {
      exports.createOAuthTable(function () {
        isCallback(callback);
      });
    } else {
      isCallback(callback);
    }
  });
};
exports.updateTable = function (table, updateCol, newVal, columns, value) {
  if (typeof columns == "string" && typeof value == "string") {
    //console.log("mysql statement:");
    //console.log("update "+table +" set "+updateCol+"='"+newVal+"' where "+columns+"='"+value+"'");
    con.query("update ?? set ??=? where ??=?", [table, updateCol, newVal, columns, value], function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  }
};
exports.insertIntoTable = function (table, columns, value, callback) {
  var temp = "";
  if (typeof columns == "string" && typeof value == "string" && columns.split(",").length == value.split(",").length || (typeof value === "undefined" ? "undefined" : _typeof(value)) == "object" && (typeof value[0][0] == "string" || typeof value[0][0] == "number") && columns.split(",").length == value[0].length) {
    if (typeof value == "string" && typeof columns == "string") {

      for (var i = 0; i < value.length; i++) {
        if (value[i] != " " || i > 0 && value[i - 1] != "," && i < value.length && value[i + 1] != ",") {
          temp += value[i];
        }
      }
      temp = temp.split(",");
      value = [];
      value[0] = temp;
    } else {
      console.error("Error: number of columns and values do not match.");
    }

    temp = "";
    for (var _i = 0; _i < columns.length; _i++) {
      if (columns[_i] != " ") {
        temp += columns[_i];
      }
    }
    columns = [];
    columns[0] = temp.split(",");
    temp = "";
    console.log("columns: " + columns);
    console.log("value: " + value);
    exports.tableExists(table, function (_exists) {
      if (_exists) {
        con.query("insert into ??(??) values ?", [table, columns, value], function (err, result, fields) {
          if (err) throw err;
          if (result != undefined) isCallback(callback, result.affectedRows == 1);else isCallback(callback);
          console.log(result);
        });
      } else {
        console.error("Error: table '" + table + "' does not exist.");
        isCallback(callback, "Error: table '" + table + "' does not exist.");
      }
    });
  } else {
    console.log("error check that your columns and values match.");
    for (var _i2 = 0; _i2 < value[0].length; _i2++) {
      console.log(value[0][_i2]);
    }
  }
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("mysql");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cors = __webpack_require__(16);

var _cors2 = _interopRequireDefault(_cors);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _server = __webpack_require__(17);

var _reactRouterDom = __webpack_require__(2);

var _serializeJavascript = __webpack_require__(18);

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

var _App = __webpack_require__(19);

var _App2 = _interopRequireDefault(_App);

var _routes = __webpack_require__(7);

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// setting variable
var serverHost = "localhost";
var default_doc = ["index.html", "index.htm"]; //this is the default document example localhost/ should point to localhost/index.html
//require("./serverroot/api/login");
//require("./serverroot/api/songqueue");
//getting modules
__webpack_require__(31).config();
var url = __webpack_require__(1);
var twitch = __webpack_require__(10);
var fs = __webpack_require__(33);
var express = __webpack_require__(12);
var cookie = __webpack_require__(6);
var app = express();
var bodyParser = __webpack_require__(36);
app.use(bodyParser.json());
var path = __webpack_require__(37);
if (process.env.disable_protection == "true") {
  console.error("WARNING: environment variable disable_protection is enabled, this will grant all users full admin rights!!\nThis is not to be used in production.");
}
//end of modules
//react specific imports

//end of react imports
cookie.start(app); //initializes cookies functionality within express
//twitch.getSSL("https://api.twitch.tv/kraken/users/44322889"); // was an example of using twitch's api
//app.use(cors())
app.use(express.static("public"));
console.log("Server is running.");
app.all(/(^\/api$)|(^\/api\/.*)/, function (req, res) {
  //listens for requests to the website the odd looking "(/*)? is just a silly way of saying respond to every request
  // localhost/ as well as localhost/this/file/does/not/exist and everywhere in between regardless of what path is being requested.
  var q = url.parse(req.url, true); //silly way of saying this is a url, please split the different parts of the url so I can easily proccess it.
  //console.log(q.pathname);//pathname is just one of the many split up peices of a url.
  var filename = "./wwwroot/" + q.pathname;

  if (q.pathname[q.pathname.length - 1] != "/") {
    //we should already know what this does, if not refer to the previous times it is used.
    filename += "/";
  }
  //we are calling the function defined above we should already know what it does.
  var getdoc = void 0;
  //console.log("./serverroot"+q.pathname);
  try {
    //getdoc=require("./serverroot/api/login/index.js");
    getdoc = __webpack_require__(38)("./serverroot" + q.pathname); //this gets some file from what url was requested, we don't know if this exists or not.
    //console.log("./serverroot"+q.pathname);
  } catch (e) {
    console.log(e);
  }
  if (getdoc == undefined || getdoc.start == undefined) {
    //server files export the function start as an entry point for the file, if this doesn't function can't be found we have to assume the webpage doesn't exist
    res.writeHead(404, { 'Content-Type': 'text/html' }); //so we will give the commonly known error 404
    console.log("getdoc undefined");
    return res.end("404 Not Found getdoc undefined"); //and write this to the body.
  } else {
    //res.setHeader("Cache-Control","no-cache");
    //res.setHeader();
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method == "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }
    //console.log(getdoc.start.toString());
    getdoc.start(req, res); //the exported start function exists, so we are redirecting to the backend file for the location requested.
  }
}).listen(80); //binds to port 8080 and listens for incoming requests to the server.
app.get(/^((?!api\/?$)(?!\/index.html)((?!api\/)).)*/, function (req, res) {
  console.log(process.env.react);
  if (process.env.react == "true" || process.env.react == true) {
    console.log("this should run.");
    var activeRoute = _routes2.default.find(function (route) {
      return (0, _reactRouterDom.matchPath)(req.url, route);
    }) || {};
    var promise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req.header("Cookie"), req.query) : Promise.resolve();

    promise.then(function (data) {
      var context = { data: data };
      var markup = (0, _server.renderToString)(_react2.default.createElement(
        _reactRouterDom.StaticRouter,
        { location: req.url, context: context },
        _react2.default.createElement(_App2.default, null)
      ));

      res.send("\n      <!DOCTYPE html>\n      <html>\n        <head>\n          <meta charset=\"utf-8\">\n          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\n          <link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css\" integrity=\"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T\" crossorigin=\"anonymous\">\n          <title>SSR with RR</title>\n          <script src=\"/bundle.js\" defer></script>\n          <script>window.__INITIAL_DATA__ = " + (0, _serializeJavascript2.default)(data) + "</script>\n          \n        </head>\n\n        <body>\n          <div id=\"app\">" + markup + "</div>\n          <script src=\"https://code.jquery.com/jquery-3.3.1.slim.min.js\" integrity=\"sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo\" crossorigin=\"anonymous\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js\" integrity=\"sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1\" crossorigin=\"anonymous\"></script>\n    <script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js\" integrity=\"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM\" crossorigin=\"anonymous\"></script>\n        </body>\n      </html>\n    ");
    });
  } else {
    console.log("this is not supposted to run.");
    var q = url.parse(req.url, true);
    res.sendfile(path.join("./src", "/browser", q.pathname));
  }
});

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("serialize-javascript");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _routes = __webpack_require__(7);

var _routes2 = _interopRequireDefault(_routes);

var _reactRouterDom = __webpack_require__(2);

var _Navbar = __webpack_require__(29);

var _Navbar2 = _interopRequireDefault(_Navbar);

var _NoMatch = __webpack_require__(30);

var _NoMatch2 = _interopRequireDefault(_NoMatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _reactRouterDom.Switch,
          null,
          _routes2.default.map(function (_ref) {
            var path = _ref.path,
                exact = _ref.exact,
                Component = _ref.component,
                rest = _objectWithoutProperties(_ref, ['path', 'exact', 'component']);

            return _react2.default.createElement(_reactRouterDom.Route, { key: path, path: path, exact: exact, render: function render(props) {
                return _react2.default.createElement(Component, _extends({}, props, rest));
              } });
          }),
          _react2.default.createElement(_reactRouterDom.Route, { render: function render(props) {
              return _react2.default.createElement(_NoMatch2.default, props);
            } })
        )
      );
    }
  }]);

  return App;
}(_react.Component);

exports.default = App;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _api = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getCookie(cookie) {
  document.cookie.indexOf(cookie);
  var length = document.cookie.split("; ").length;
  for (var i = 0; i < length; i++) {
    if (document.cookie.split("; ")[i].split("=")[0] == cookie) return document.cookie.split("; ")[i].split("=")[1];
  }
}
function getUser() {
  fetch("http://localhost/api/login?request=getloggedinuser", {
    credentials: "include",
    method: "POST"
  }).then(function (res) {
    return res.text();
  }).then(function (result) {
    if (result != "User not logged in.") {
      console.log("user is logged in, setting cookie");
      console.log("display_name: " + result);
      document.cookie = "display_name=" + result;
    } else {
      console.log("if user is not logged in");
    }
    //result=result=="true"; 
    console.log(result);
  }).catch(function (res) {
    console.log(res);
  });
}

function requestSong(song, channel) {
  var display_name = getCookie("display_name");
  var body = undefined;
  if (!song.indexOf("youtube.com/watch?v=") == -1) {
    body = JSON.stringify({ "requestedBy": display_name, "title": song });
  } else {
    body = JSON.stringify({ "requestedBy": display_name, "url": "https://www." + song.slice(song.indexOf("youtube.com/watch?v="), song.indexOf("youtube.com/watch?v=") + 31) });
  }
  if (body) {
    fetch("http://localhost/api/songqueue?request=insertsong&channel=" + channel, {
      credentials: "include",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: body
    }).then(function (res) {
      return res.text();
    }).then(function (result) {
      //result=result=="true";
      console.log(result);
    }).catch(function (res) {
      console.log(res);
    });
  }
}
function displayLogin() {
  ReactDOM.render(_react2.default.createElement(Login, null), document.getElementById('root'));

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
}
function displayContent() {
  ReactDOM.render(_react2.default.createElement(Content, null), document.getElementById('root'));
  serviceWorker.unregister();
}

var Home = function (_Component) {
  _inherits(Home, _Component);

  function Home(props) {
    _classCallCheck(this, Home);

    var _this = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));

    var response = void 0;
    if (false) {
      response = window.__INITIAL_DATA__;
      delete window.__INITIAL_DATA__;
    } else {
      response = _this.props.staticContext.data;
    }

    _this.state = {
      response: response,
      loading: response ? false : true
    };

    _this.fetchRepos = _this.fetchRepos.bind(_this);
    return _this;
  }

  _createClass(Home, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.state.response) {
        this.fetchRepos(this.props.match.params.id);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.match.params.id !== this.props.match.params.id) {
        this.fetchRepos(this.props.match.params.id);
      }
    }
  }, {
    key: 'fetchRepos',
    value: function fetchRepos(lang) {
      var _this2 = this;

      this.setState(function () {
        return {
          loading: true
        };
      });

      this.props.fetchInitialData(lang).then(function (response) {
        return _this2.setState(function () {
          return {
            response: response,
            loading: false
          };
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          loading = _state.loading,
          response = _state.response;

      if (response) {
        var loggedin = response.loggedin;
        var username = response.username;
        var channel = response.channel;
        if (!channel) {
          channel = username;
        }
        if (loading === true) {
          return _react2.default.createElement(
            'p',
            null,
            'LOADING'
          );
        }
        console.log("loggedin: " + loggedin);
        console.log("username: " + username);
        if (loggedin) {

          if (username == channel) {
            return _react2.default.createElement(
              'div',
              { id: 'main' },
              _react2.default.createElement('link', { href: '/style.css', rel: 'stylesheet' }),
              _react2.default.createElement(
                'button',
                { id: 'requestButton' },
                'Request Song'
              ),
              _react2.default.createElement('input', { type: 'hidden', id: 'requestInputField' }),
              _react2.default.createElement('input', { type: 'hidden', id: 'submitRequestButton', value: 'Request' }),
              _react2.default.createElement('input', { type: 'hidden', id: 'user', value: username }),
              _react2.default.createElement('input', { type: 'hidden', id: 'channel', value: channel }),
              _react2.default.createElement(
                'div',
                { id: 'songInfo' },
                'Currently Playing:',
                _react2.default.createElement('div', { id: 'thumbNail' }),
                _react2.default.createElement('div', { id: 'currentSong' }),
                _react2.default.createElement('div', { id: 'timer' }),
                _react2.default.createElement(
                  'button',
                  { id: 'play' },
                  'Play'
                ),
                _react2.default.createElement(
                  'button',
                  { id: 'skip' },
                  'Skip Song'
                )
              ),
              _react2.default.createElement('div', { id: 'player' }),
              _react2.default.createElement(
                'table',
                null,
                _react2.default.createElement(
                  'thead',
                  null,
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'th',
                      null,
                      'Queue'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'title'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'length'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'views'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'likeCount'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'dislikeCount'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'songURL'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'requestedBy'
                    ),
                    _react2.default.createElement('th', null)
                  )
                ),
                _react2.default.createElement('tbody', null)
              ),
              _react2.default.createElement('script', { src: '/script.js', defer: true })
            );
          } else {
            if (channel == username) {
              return _react2.default.createElement('div', { id: 'main' });
            }
            return _react2.default.createElement(
              'div',
              { id: 'main' },
              _react2.default.createElement('link', { href: '/style.css', rel: 'stylesheet' }),
              _react2.default.createElement(
                'button',
                { id: 'requestButton' },
                'Request Song'
              ),
              _react2.default.createElement('input', { type: 'hidden', id: 'requestInputField' }),
              _react2.default.createElement('input', { type: 'hidden', id: 'submitRequestButton', value: 'Request' }),
              _react2.default.createElement('input', { type: 'hidden', id: 'user', value: username }),
              _react2.default.createElement('input', { type: 'hidden', id: 'channel', value: channel }),
              _react2.default.createElement(
                'div',
                { id: 'songInfo' },
                'Currently Playing:',
                _react2.default.createElement('div', { id: 'thumbNail' }),
                _react2.default.createElement('div', { id: 'currentSong' })
              ),
              _react2.default.createElement(
                'table',
                null,
                _react2.default.createElement(
                  'thead',
                  null,
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'th',
                      null,
                      'Queue'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'title'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'length'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'views'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'likeCount'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'dislikeCount'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'songURL'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'requestedBy'
                    ),
                    _react2.default.createElement('th', null)
                  )
                ),
                _react2.default.createElement('tbody', null)
              ),
              _react2.default.createElement('script', { src: '/script.js', defer: true })
            );
          }
        } else {
          return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'div',
              { id: 'main' },
              _react2.default.createElement('link', { href: '/style.css', rel: 'stylesheet' }),
              _react2.default.createElement('input', { type: 'hidden', id: 'user', value: '' }),
              _react2.default.createElement('input', { type: 'hidden', id: 'channel', value: channel }),
              _react2.default.createElement(
                'div',
                { id: 'login' },
                'You must be logged in to request songs ',
                _react2.default.createElement(
                  'button',
                  { id: 'loginButton' },
                  'Login with Twitch'
                )
              ),
              _react2.default.createElement(
                'div',
                { id: 'songInfo' },
                'Currently Playing:',
                _react2.default.createElement('div', { id: 'thumbNail' }),
                _react2.default.createElement('div', { id: 'currentSong' })
              ),
              _react2.default.createElement(
                'table',
                null,
                _react2.default.createElement(
                  'thead',
                  null,
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'th',
                      null,
                      'Queue'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'title'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'length'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'views'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'likeCount'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'dislikeCount'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'songURL'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      'requestedBy'
                    ),
                    _react2.default.createElement('th', null)
                  )
                ),
                _react2.default.createElement('tbody', null)
              ),
              _react2.default.createElement('script', { src: '/script.js', defer: true })
            )
          );
        }
      } else {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'a',
            { href: '/songlist' },
            'Click here to continue'
          )
        );
      }
    }
  }]);

  return Home;
}(_react.Component);

exports.default = Home;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Grid = function (_Component) {
  _inherits(Grid, _Component);

  function Grid(props) {
    _classCallCheck(this, Grid);

    var _this = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, props));

    var repos = void 0;
    if (false) {
      repos = window.__INITIAL_DATA__;
      delete window.__INITIAL_DATA__;
    } else {
      repos = _this.props.staticContext.data;
    }

    _this.state = {
      repos: repos,
      loading: repos ? false : true
    };

    _this.fetchRepos = _this.fetchRepos.bind(_this);
    return _this;
  }

  _createClass(Grid, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.state.repos) {
        this.fetchRepos(this.props.match.params.id);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.match.params.id !== this.props.match.params.id) {
        this.fetchRepos(this.props.match.params.id);
      }
    }
  }, {
    key: 'fetchRepos',
    value: function fetchRepos(lang) {
      var _this2 = this;

      this.setState(function () {
        return {
          loading: true
        };
      });

      this.props.fetchInitialData(lang).then(function (repos) {
        return _this2.setState(function () {
          return {
            repos: repos,
            loading: false
          };
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          loading = _state.loading,
          repos = _state.repos;


      if (loading === true) {
        return _react2.default.createElement(
          'p',
          null,
          'LOADING'
        );
      }

      return _react2.default.createElement(
        'ul',
        { style: { display: 'flex', flexWrap: 'wrap' } },
        repos.map(function (_ref) {
          var name = _ref.name,
              owner = _ref.owner,
              stargazers_count = _ref.stargazers_count,
              html_url = _ref.html_url;
          return _react2.default.createElement(
            'li',
            { key: name, style: { margin: 30 } },
            _react2.default.createElement(
              'ul',
              null,
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'a',
                  { href: html_url },
                  name
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                '@',
                owner.login
              ),
              _react2.default.createElement(
                'li',
                null,
                stargazers_count,
                ' stars'
              )
            )
          );
        })
      );
    }
  }]);

  return Grid;
}(_react.Component);

exports.default = Grid;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _React = __webpack_require__(24);

var _React2 = _interopRequireDefault(_React);

var _reactRouter = __webpack_require__(28);

var _reactRouterDom = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//import {playPause,skipSong,getsongs,nextSong} from "../browser/script";


var Redirect = function (_React$Component) {
  _inherits(Redirect, _React$Component);

  function Redirect(props) {
    _classCallCheck(this, Redirect);

    var _this = _possibleConstructorReturn(this, (Redirect.__proto__ || Object.getPrototypeOf(Redirect)).call(this, props));

    if (false) {
      window.location.href = "/songlist/";
    } else {
      _this.props.history.push('/songlist/');
    }
    return _this;
  }

  _createClass(Redirect, [{
    key: 'render',
    value: function render() {

      return _React2.default.createElement(
        'div',
        null,
        _React2.default.createElement(
          'a',
          { href: '/songlist/' },
          'Check out the songlist'
        )
      );
    }
  }]);

  return Redirect;
}(_React2.default.Component);

exports.default = (0, _reactRouter.withRouter)(Redirect);

/*
class Redirect extends React.Component {

  render(){
  
    return (
      <div id="main">
      <div id="songInfo">
        Currently Playing:
      <div id="thumbNail"></div>
        <div id="currentSong"></div>
        <div id="timer"></div>
        <button id="play">Play</button>
        <button id="skip">Skip Song</button>
        </div>
      <div id="player"></div>
          <table><thead><tr><th>Queue</th><th>title</th><th>length</th><th>views</th><th>likeCount</th><th>dislikeCount</th><th>songURL</th><th>requestedBy</th><th>Delete</th></tr></thead><tbody></tbody></table>
      <script src="script.js" defer>
      </script>
      </div>
      
    )
  }
}
export default Redirect;*/

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (process.env.NODE_ENV === 'production') {
  module.exports = __webpack_require__(25);
} else {
  module.exports = __webpack_require__(26);
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.8.6
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var k = __webpack_require__(9),
    n = "function" === typeof Symbol && Symbol.for,
    p = n ? Symbol.for("react.element") : 60103,
    q = n ? Symbol.for("react.portal") : 60106,
    r = n ? Symbol.for("react.fragment") : 60107,
    t = n ? Symbol.for("react.strict_mode") : 60108,
    u = n ? Symbol.for("react.profiler") : 60114,
    v = n ? Symbol.for("react.provider") : 60109,
    w = n ? Symbol.for("react.context") : 60110,
    x = n ? Symbol.for("react.concurrent_mode") : 60111,
    y = n ? Symbol.for("react.forward_ref") : 60112,
    z = n ? Symbol.for("react.suspense") : 60113,
    aa = n ? Symbol.for("react.memo") : 60115,
    ba = n ? Symbol.for("react.lazy") : 60116,
    A = "function" === typeof Symbol && Symbol.iterator;function ca(a, b, d, c, e, g, h, f) {
  if (!a) {
    a = void 0;if (void 0 === b) a = Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else {
      var l = [d, c, e, g, h, f],
          m = 0;a = Error(b.replace(/%s/g, function () {
        return l[m++];
      }));a.name = "Invariant Violation";
    }a.framesToPop = 1;throw a;
  }
}
function B(a) {
  for (var b = arguments.length - 1, d = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 0; c < b; c++) {
    d += "&args[]=" + encodeURIComponent(arguments[c + 1]);
  }ca(!1, "Minified React error #" + a + "; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ", d);
}var C = { isMounted: function isMounted() {
    return !1;
  }, enqueueForceUpdate: function enqueueForceUpdate() {}, enqueueReplaceState: function enqueueReplaceState() {}, enqueueSetState: function enqueueSetState() {} },
    D = {};
function E(a, b, d) {
  this.props = a;this.context = b;this.refs = D;this.updater = d || C;
}E.prototype.isReactComponent = {};E.prototype.setState = function (a, b) {
  "object" !== (typeof a === "undefined" ? "undefined" : _typeof(a)) && "function" !== typeof a && null != a ? B("85") : void 0;this.updater.enqueueSetState(this, a, b, "setState");
};E.prototype.forceUpdate = function (a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};function F() {}F.prototype = E.prototype;function G(a, b, d) {
  this.props = a;this.context = b;this.refs = D;this.updater = d || C;
}var H = G.prototype = new F();
H.constructor = G;k(H, E.prototype);H.isPureReactComponent = !0;var I = { current: null },
    J = { current: null },
    K = Object.prototype.hasOwnProperty,
    L = { key: !0, ref: !0, __self: !0, __source: !0 };
function M(a, b, d) {
  var c = void 0,
      e = {},
      g = null,
      h = null;if (null != b) for (c in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (g = "" + b.key), b) {
    K.call(b, c) && !L.hasOwnProperty(c) && (e[c] = b[c]);
  }var f = arguments.length - 2;if (1 === f) e.children = d;else if (1 < f) {
    for (var l = Array(f), m = 0; m < f; m++) {
      l[m] = arguments[m + 2];
    }e.children = l;
  }if (a && a.defaultProps) for (c in f = a.defaultProps, f) {
    void 0 === e[c] && (e[c] = f[c]);
  }return { $$typeof: p, type: a, key: g, ref: h, props: e, _owner: J.current };
}
function da(a, b) {
  return { $$typeof: p, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}function N(a) {
  return "object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) && null !== a && a.$$typeof === p;
}function escape(a) {
  var b = { "=": "=0", ":": "=2" };return "$" + ("" + a).replace(/[=:]/g, function (a) {
    return b[a];
  });
}var O = /\/+/g,
    P = [];function Q(a, b, d, c) {
  if (P.length) {
    var e = P.pop();e.result = a;e.keyPrefix = b;e.func = d;e.context = c;e.count = 0;return e;
  }return { result: a, keyPrefix: b, func: d, context: c, count: 0 };
}
function R(a) {
  a.result = null;a.keyPrefix = null;a.func = null;a.context = null;a.count = 0;10 > P.length && P.push(a);
}
function S(a, b, d, c) {
  var e = typeof a === "undefined" ? "undefined" : _typeof(a);if ("undefined" === e || "boolean" === e) a = null;var g = !1;if (null === a) g = !0;else switch (e) {case "string":case "number":
      g = !0;break;case "object":
      switch (a.$$typeof) {case p:case q:
          g = !0;}}if (g) return d(c, a, "" === b ? "." + T(a, 0) : b), 1;g = 0;b = "" === b ? "." : b + ":";if (Array.isArray(a)) for (var h = 0; h < a.length; h++) {
    e = a[h];var f = b + T(e, h);g += S(e, f, d, c);
  } else if (null === a || "object" !== (typeof a === "undefined" ? "undefined" : _typeof(a)) ? f = null : (f = A && a[A] || a["@@iterator"], f = "function" === typeof f ? f : null), "function" === typeof f) for (a = f.call(a), h = 0; !(e = a.next()).done;) {
    e = e.value, f = b + T(e, h++), g += S(e, f, d, c);
  } else "object" === e && (d = "" + a, B("31", "[object Object]" === d ? "object with keys {" + Object.keys(a).join(", ") + "}" : d, ""));return g;
}function U(a, b, d) {
  return null == a ? 0 : S(a, "", b, d);
}function T(a, b) {
  return "object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) && null !== a && null != a.key ? escape(a.key) : b.toString(36);
}function ea(a, b) {
  a.func.call(a.context, b, a.count++);
}
function fa(a, b, d) {
  var c = a.result,
      e = a.keyPrefix;a = a.func.call(a.context, b, a.count++);Array.isArray(a) ? V(a, c, d, function (a) {
    return a;
  }) : null != a && (N(a) && (a = da(a, e + (!a.key || b && b.key === a.key ? "" : ("" + a.key).replace(O, "$&/") + "/") + d)), c.push(a));
}function V(a, b, d, c, e) {
  var g = "";null != d && (g = ("" + d).replace(O, "$&/") + "/");b = Q(b, g, c, e);U(a, fa, b);R(b);
}function W() {
  var a = I.current;null === a ? B("321") : void 0;return a;
}
var X = { Children: { map: function map(a, b, d) {
      if (null == a) return a;var c = [];V(a, c, null, b, d);return c;
    }, forEach: function forEach(a, b, d) {
      if (null == a) return a;b = Q(null, null, b, d);U(a, ea, b);R(b);
    }, count: function count(a) {
      return U(a, function () {
        return null;
      }, null);
    }, toArray: function toArray(a) {
      var b = [];V(a, b, null, function (a) {
        return a;
      });return b;
    }, only: function only(a) {
      N(a) ? void 0 : B("143");return a;
    } }, createRef: function createRef() {
    return { current: null };
  }, Component: E, PureComponent: G, createContext: function createContext(a, b) {
    void 0 === b && (b = null);a = { $$typeof: w, _calculateChangedBits: b,
      _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null };a.Provider = { $$typeof: v, _context: a };return a.Consumer = a;
  }, forwardRef: function forwardRef(a) {
    return { $$typeof: y, render: a };
  }, lazy: function lazy(a) {
    return { $$typeof: ba, _ctor: a, _status: -1, _result: null };
  }, memo: function memo(a, b) {
    return { $$typeof: aa, type: a, compare: void 0 === b ? null : b };
  }, useCallback: function useCallback(a, b) {
    return W().useCallback(a, b);
  }, useContext: function useContext(a, b) {
    return W().useContext(a, b);
  }, useEffect: function useEffect(a, b) {
    return W().useEffect(a, b);
  }, useImperativeHandle: function useImperativeHandle(a, b, d) {
    return W().useImperativeHandle(a, b, d);
  }, useDebugValue: function useDebugValue() {}, useLayoutEffect: function useLayoutEffect(a, b) {
    return W().useLayoutEffect(a, b);
  }, useMemo: function useMemo(a, b) {
    return W().useMemo(a, b);
  }, useReducer: function useReducer(a, b, d) {
    return W().useReducer(a, b, d);
  }, useRef: function useRef(a) {
    return W().useRef(a);
  }, useState: function useState(a) {
    return W().useState(a);
  }, Fragment: r, StrictMode: t, Suspense: z, createElement: M, cloneElement: function cloneElement(a, b, d) {
    null === a || void 0 === a ? B("267", a) : void 0;var c = void 0,
        e = k({}, a.props),
        g = a.key,
        h = a.ref,
        f = a._owner;if (null != b) {
      void 0 !== b.ref && (h = b.ref, f = J.current);void 0 !== b.key && (g = "" + b.key);var l = void 0;a.type && a.type.defaultProps && (l = a.type.defaultProps);for (c in b) {
        K.call(b, c) && !L.hasOwnProperty(c) && (e[c] = void 0 === b[c] && void 0 !== l ? l[c] : b[c]);
      }
    }c = arguments.length - 2;if (1 === c) e.children = d;else if (1 < c) {
      l = Array(c);for (var m = 0; m < c; m++) {
        l[m] = arguments[m + 2];
      }e.children = l;
    }return { $$typeof: p, type: a.type, key: g, ref: h, props: e, _owner: f };
  }, createFactory: function createFactory(a) {
    var b = M.bind(null, a);b.type = a;return b;
  }, isValidElement: N, version: "16.8.6",
  unstable_ConcurrentMode: x, unstable_Profiler: u, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: { ReactCurrentDispatcher: I, ReactCurrentOwner: J, assign: k } },
    Y = { default: X },
    Z = Y && X || Y;module.exports = Z.default || Z;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.8.6
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if (process.env.NODE_ENV !== "production") {
  (function () {
    'use strict';

    var _assign = __webpack_require__(9);
    var checkPropTypes = __webpack_require__(27);

    // TODO: this is special because it gets imported during build.

    var ReactVersion = '16.8.6';

    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var hasSymbol = typeof Symbol === 'function' && Symbol.for;

    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;

    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

    var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator';

    function getIteratorFn(maybeIterable) {
      if (maybeIterable === null || (typeof maybeIterable === 'undefined' ? 'undefined' : _typeof(maybeIterable)) !== 'object') {
        return null;
      }
      var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
      if (typeof maybeIterator === 'function') {
        return maybeIterator;
      }
      return null;
    }

    /**
     * Use invariant() to assert state which your program assumes to be true.
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    var validateFormat = function validateFormat() {};

    {
      validateFormat = function validateFormat(format) {
        if (format === undefined) {
          throw new Error('invariant requires an error message argument');
        }
      };
    }

    function invariant(condition, format, a, b, c, d, e, f) {
      validateFormat(format);

      if (!condition) {
        var error = void 0;
        if (format === undefined) {
          error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
        } else {
          var args = [a, b, c, d, e, f];
          var argIndex = 0;
          error = new Error(format.replace(/%s/g, function () {
            return args[argIndex++];
          }));
          error.name = 'Invariant Violation';
        }

        error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
      }
    }

    // Relying on the `invariant()` implementation lets us
    // preserve the format and params in the www builds.

    /**
     * Forked from fbjs/warning:
     * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
     *
     * Only change is we use console.warn instead of console.error,
     * and do nothing when 'console' is not supported.
     * This really simplifies the code.
     * ---
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var lowPriorityWarning = function lowPriorityWarning() {};

    {
      var printWarning = function printWarning(format) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        if (typeof console !== 'undefined') {
          console.warn(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };

      lowPriorityWarning = function lowPriorityWarning(condition, format) {
        if (format === undefined) {
          throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
        }
        if (!condition) {
          for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }

          printWarning.apply(undefined, [format].concat(args));
        }
      };
    }

    var lowPriorityWarning$1 = lowPriorityWarning;

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var warningWithoutStack = function warningWithoutStack() {};

    {
      warningWithoutStack = function warningWithoutStack(condition, format) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        if (format === undefined) {
          throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
        }
        if (args.length > 8) {
          // Check before the condition to catch violations early.
          throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
        }
        if (condition) {
          return;
        }
        if (typeof console !== 'undefined') {
          var argsWithFormat = args.map(function (item) {
            return '' + item;
          });
          argsWithFormat.unshift('Warning: ' + format);

          // We intentionally don't use spread (or .apply) directly because it
          // breaks IE9: https://github.com/facebook/react/issues/13610
          Function.prototype.apply.call(console.error, console, argsWithFormat);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          var argIndex = 0;
          var message = 'Warning: ' + format.replace(/%s/g, function () {
            return args[argIndex++];
          });
          throw new Error(message);
        } catch (x) {}
      };
    }

    var warningWithoutStack$1 = warningWithoutStack;

    var didWarnStateUpdateForUnmountedComponent = {};

    function warnNoop(publicInstance, callerName) {
      {
        var _constructor = publicInstance.constructor;
        var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
        var warningKey = componentName + '.' + callerName;
        if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
          return;
        }
        warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
        didWarnStateUpdateForUnmountedComponent[warningKey] = true;
      }
    }

    /**
     * This is the abstract API for an update queue.
     */
    var ReactNoopUpdateQueue = {
      /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */
      isMounted: function isMounted(publicInstance) {
        return false;
      },

      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {?function} callback Called after component is updated.
       * @param {?string} callerName name of the calling function in the public API.
       * @internal
       */
      enqueueForceUpdate: function enqueueForceUpdate(publicInstance, callback, callerName) {
        warnNoop(publicInstance, 'forceUpdate');
      },

      /**
       * Replaces all of the state. Always use this or `setState` to mutate state.
       * You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} completeState Next state.
       * @param {?function} callback Called after component is updated.
       * @param {?string} callerName name of the calling function in the public API.
       * @internal
       */
      enqueueReplaceState: function enqueueReplaceState(publicInstance, completeState, callback, callerName) {
        warnNoop(publicInstance, 'replaceState');
      },

      /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} partialState Next partial state to be merged with state.
       * @param {?function} callback Called after component is updated.
       * @param {?string} Name of the calling function in the public API.
       * @internal
       */
      enqueueSetState: function enqueueSetState(publicInstance, partialState, callback, callerName) {
        warnNoop(publicInstance, 'setState');
      }
    };

    var emptyObject = {};
    {
      Object.freeze(emptyObject);
    }

    /**
     * Base class helpers for the updating state of a component.
     */
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      // If a component has string refs, we will assign a different object later.
      this.refs = emptyObject;
      // We initialize the default updater but the real one gets injected by the
      // renderer.
      this.updater = updater || ReactNoopUpdateQueue;
    }

    Component.prototype.isReactComponent = {};

    /**
     * Sets a subset of the state. Always use this to mutate
     * state. You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * There is no guarantee that calls to `setState` will run synchronously,
     * as they may eventually be batched together.  You can provide an optional
     * callback that will be executed when the call to setState is actually
     * completed.
     *
     * When a function is provided to setState, it will be called at some point in
     * the future (not synchronously). It will be called with the up to date
     * component arguments (state, props, context). These values can be different
     * from this.* because your function may be called after receiveProps but before
     * shouldComponentUpdate, and this new state, props, and context will not yet be
     * assigned to this.
     *
     * @param {object|function} partialState Next partial state or function to
     *        produce next partial state to be merged with current state.
     * @param {?function} callback Called after state is updated.
     * @final
     * @protected
     */
    Component.prototype.setState = function (partialState, callback) {
      !((typeof partialState === 'undefined' ? 'undefined' : _typeof(partialState)) === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
      this.updater.enqueueSetState(this, partialState, callback, 'setState');
    };

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {?function} callback Called after update is complete.
     * @final
     * @protected
     */
    Component.prototype.forceUpdate = function (callback) {
      this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
    };

    /**
     * Deprecated APIs. These APIs used to exist on classic React classes but since
     * we would like to deprecate them, we're not going to move them over to this
     * modern base class. Instead, we define a getter that warns if it's accessed.
     */
    {
      var deprecatedAPIs = {
        isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
        replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
      };
      var defineDeprecationWarning = function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function get() {
            lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
            return undefined;
          }
        });
      };
      for (var fnName in deprecatedAPIs) {
        if (deprecatedAPIs.hasOwnProperty(fnName)) {
          defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        }
      }
    }

    function ComponentDummy() {}
    ComponentDummy.prototype = Component.prototype;

    /**
     * Convenience component with default shallow equality check for sCU.
     */
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      // If a component has string refs, we will assign a different object later.
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }

    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    // Avoid an extra prototype jump for these methods.
    _assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;

    // an immutable object with a single mutable value
    function createRef() {
      var refObject = {
        current: null
      };
      {
        Object.seal(refObject);
      }
      return refObject;
    }

    /**
     * Keeps track of the current dispatcher.
     */
    var ReactCurrentDispatcher = {
      /**
       * @internal
       * @type {ReactComponent}
       */
      current: null
    };

    /**
     * Keeps track of the current owner.
     *
     * The current owner is the component who should own any components that are
     * currently being constructed.
     */
    var ReactCurrentOwner = {
      /**
       * @internal
       * @type {ReactComponent}
       */
      current: null
    };

    var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

    var describeComponentFrame = function describeComponentFrame(name, source, ownerName) {
      var sourceInfo = '';
      if (source) {
        var path = source.fileName;
        var fileName = path.replace(BEFORE_SLASH_RE, '');
        {
          // In DEV, include code for a common special case:
          // prefer "folder/index.js" instead of just "index.js".
          if (/^index\./.test(fileName)) {
            var match = path.match(BEFORE_SLASH_RE);
            if (match) {
              var pathBeforeSlash = match[1];
              if (pathBeforeSlash) {
                var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
                fileName = folderName + '/' + fileName;
              }
            }
          }
        }
        sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
      } else if (ownerName) {
        sourceInfo = ' (created by ' + ownerName + ')';
      }
      return '\n    in ' + (name || 'Unknown') + sourceInfo;
    };

    var Resolved = 1;

    function refineResolvedLazyComponent(lazyComponent) {
      return lazyComponent._status === Resolved ? lazyComponent._result : null;
    }

    function getWrappedName(outerType, innerType, wrapperName) {
      var functionName = innerType.displayName || innerType.name || '';
      return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
    }

    function getComponentName(type) {
      if (type == null) {
        // Host root, text node or just invalid type.
        return null;
      }
      {
        if (typeof type.tag === 'number') {
          warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
        }
      }
      if (typeof type === 'function') {
        return type.displayName || type.name || null;
      }
      if (typeof type === 'string') {
        return type;
      }
      switch (type) {
        case REACT_CONCURRENT_MODE_TYPE:
          return 'ConcurrentMode';
        case REACT_FRAGMENT_TYPE:
          return 'Fragment';
        case REACT_PORTAL_TYPE:
          return 'Portal';
        case REACT_PROFILER_TYPE:
          return 'Profiler';
        case REACT_STRICT_MODE_TYPE:
          return 'StrictMode';
        case REACT_SUSPENSE_TYPE:
          return 'Suspense';
      }
      if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
        switch (type.$$typeof) {
          case REACT_CONTEXT_TYPE:
            return 'Context.Consumer';
          case REACT_PROVIDER_TYPE:
            return 'Context.Provider';
          case REACT_FORWARD_REF_TYPE:
            return getWrappedName(type, type.render, 'ForwardRef');
          case REACT_MEMO_TYPE:
            return getComponentName(type.type);
          case REACT_LAZY_TYPE:
            {
              var thenable = type;
              var resolvedThenable = refineResolvedLazyComponent(thenable);
              if (resolvedThenable) {
                return getComponentName(resolvedThenable);
              }
            }
        }
      }
      return null;
    }

    var ReactDebugCurrentFrame = {};

    var currentlyValidatingElement = null;

    function setCurrentlyValidatingElement(element) {
      {
        currentlyValidatingElement = element;
      }
    }

    {
      // Stack implementation injected by the current renderer.
      ReactDebugCurrentFrame.getCurrentStack = null;

      ReactDebugCurrentFrame.getStackAddendum = function () {
        var stack = '';

        // Add an extra top frame while an element is being validated
        if (currentlyValidatingElement) {
          var name = getComponentName(currentlyValidatingElement.type);
          var owner = currentlyValidatingElement._owner;
          stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
        }

        // Delegate to the injected renderer-specific implementation
        var impl = ReactDebugCurrentFrame.getCurrentStack;
        if (impl) {
          stack += impl() || '';
        }

        return stack;
      };
    }

    var ReactSharedInternals = {
      ReactCurrentDispatcher: ReactCurrentDispatcher,
      ReactCurrentOwner: ReactCurrentOwner,
      // Used by renderers to avoid bundling object-assign twice in UMD bundles:
      assign: _assign
    };

    {
      _assign(ReactSharedInternals, {
        // These should not be included in production.
        ReactDebugCurrentFrame: ReactDebugCurrentFrame,
        // Shim for React DOM 16.0.0 which still destructured (but not used) this.
        // TODO: remove in React 17.0.
        ReactComponentTreeHook: {}
      });
    }

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var warning = warningWithoutStack$1;

    {
      warning = function warning(condition, format) {
        if (condition) {
          return;
        }
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        var stack = ReactDebugCurrentFrame.getStackAddendum();
        // eslint-disable-next-line react-internal/warning-and-invariant-args

        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
      };
    }

    var warning$1 = warning;

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    var RESERVED_PROPS = {
      key: true,
      ref: true,
      __self: true,
      __source: true
    };

    var specialPropKeyWarningShown = void 0;
    var specialPropRefWarningShown = void 0;

    function hasValidRef(config) {
      {
        if (hasOwnProperty.call(config, 'ref')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }
      return config.ref !== undefined;
    }

    function hasValidKey(config) {
      {
        if (hasOwnProperty.call(config, 'key')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }
      return config.key !== undefined;
    }

    function defineKeyPropWarningGetter(props, displayName) {
      var warnAboutAccessingKey = function warnAboutAccessingKey() {
        if (!specialPropKeyWarningShown) {
          specialPropKeyWarningShown = true;
          warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
        }
      };
      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, 'key', {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }

    function defineRefPropWarningGetter(props, displayName) {
      var warnAboutAccessingRef = function warnAboutAccessingRef() {
        if (!specialPropRefWarningShown) {
          specialPropRefWarningShown = true;
          warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
        }
      };
      warnAboutAccessingRef.isReactWarning = true;
      Object.defineProperty(props, 'ref', {
        get: warnAboutAccessingRef,
        configurable: true
      });
    }

    /**
     * Factory method to create a new React element. This no longer adheres to
     * the class pattern, so do not use new to call it. Also, no instanceof check
     * will work. Instead test $$typeof field against Symbol.for('react.element') to check
     * if something is a React Element.
     *
     * @param {*} type
     * @param {*} key
     * @param {string|object} ref
     * @param {*} self A *temporary* helper to detect places where `this` is
     * different from the `owner` when React.createElement is called, so that we
     * can warn. We want to get rid of owner and replace string `ref`s with arrow
     * functions, and as long as `this` and owner are the same, there will be no
     * change in behavior.
     * @param {*} source An annotation object (added by a transpiler or otherwise)
     * indicating filename, line number, and/or other information.
     * @param {*} owner
     * @param {*} props
     * @internal
     */
    var ReactElement = function ReactElement(type, key, ref, self, source, owner, props) {
      var element = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,

        // Built-in properties that belong on the element
        type: type,
        key: key,
        ref: ref,
        props: props,

        // Record the component responsible for creating this element.
        _owner: owner
      };

      {
        // The validation flag is currently mutative. We put it on
        // an external backing store so that we can freeze the whole object.
        // This can be replaced with a WeakMap once they are implemented in
        // commonly used development environments.
        element._store = {};

        // To make comparing ReactElements easier for testing purposes, we make
        // the validation flag non-enumerable (where possible, which should
        // include every environment we run tests in), so the test framework
        // ignores it.
        Object.defineProperty(element._store, 'validated', {
          configurable: false,
          enumerable: false,
          writable: true,
          value: false
        });
        // self and source are DEV only properties.
        Object.defineProperty(element, '_self', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: self
        });
        // Two elements created in two different places should be considered
        // equal for testing purposes and therefore we hide it from enumeration.
        Object.defineProperty(element, '_source', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: source
        });
        if (Object.freeze) {
          Object.freeze(element.props);
          Object.freeze(element);
        }
      }

      return element;
    };

    /**
     * Create and return a new ReactElement of the given type.
     * See https://reactjs.org/docs/react-api.html#createelement
     */
    function createElement(type, config, children) {
      var propName = void 0;

      // Reserved names are extracted
      var props = {};

      var key = null;
      var ref = null;
      var self = null;
      var source = null;

      if (config != null) {
        if (hasValidRef(config)) {
          ref = config.ref;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;
        // Remaining properties are added to a new props object
        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            props[propName] = config[propName];
          }
        }
      }

      // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.
      var childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        {
          if (Object.freeze) {
            Object.freeze(childArray);
          }
        }
        props.children = childArray;
      }

      // Resolve default props
      if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;
        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
      }
      {
        if (key || ref) {
          var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
          if (key) {
            defineKeyPropWarningGetter(props, displayName);
          }
          if (ref) {
            defineRefPropWarningGetter(props, displayName);
          }
        }
      }
      return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
    }

    /**
     * Return a function that produces ReactElements of a given type.
     * See https://reactjs.org/docs/react-api.html#createfactory
     */

    function cloneAndReplaceKey(oldElement, newKey) {
      var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

      return newElement;
    }

    /**
     * Clone and return a new ReactElement using element as the starting point.
     * See https://reactjs.org/docs/react-api.html#cloneelement
     */
    function cloneElement(element, config, children) {
      !!(element === null || element === undefined) ? invariant(false, 'React.cloneElement(...): The argument must be a React element, but you passed %s.', element) : void 0;

      var propName = void 0;

      // Original props are copied
      var props = _assign({}, element.props);

      // Reserved names are extracted
      var key = element.key;
      var ref = element.ref;
      // Self is preserved since the owner is preserved.
      var self = element._self;
      // Source is preserved since cloneElement is unlikely to be targeted by a
      // transpiler, and the original source is probably a better indicator of the
      // true owner.
      var source = element._source;

      // Owner will be preserved, unless ref is overridden
      var owner = element._owner;

      if (config != null) {
        if (hasValidRef(config)) {
          // Silently steal the ref from the parent.
          ref = config.ref;
          owner = ReactCurrentOwner.current;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        // Remaining properties override existing props
        var defaultProps = void 0;
        if (element.type && element.type.defaultProps) {
          defaultProps = element.type.defaultProps;
        }
        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            if (config[propName] === undefined && defaultProps !== undefined) {
              // Resolve default props
              props[propName] = defaultProps[propName];
            } else {
              props[propName] = config[propName];
            }
          }
        }
      }

      // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.
      var childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
      }

      return ReactElement(element.type, key, ref, self, source, owner, props);
    }

    /**
     * Verifies the object is a ReactElement.
     * See https://reactjs.org/docs/react-api.html#isvalidelement
     * @param {?object} object
     * @return {boolean} True if `object` is a ReactElement.
     * @final
     */
    function isValidElement(object) {
      return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }

    var SEPARATOR = '.';
    var SUBSEPARATOR = ':';

    /**
     * Escape and wrap key so it is safe to use as a reactid
     *
     * @param {string} key to be escaped.
     * @return {string} the escaped key.
     */
    function escape(key) {
      var escapeRegex = /[=:]/g;
      var escaperLookup = {
        '=': '=0',
        ':': '=2'
      };
      var escapedString = ('' + key).replace(escapeRegex, function (match) {
        return escaperLookup[match];
      });

      return '$' + escapedString;
    }

    /**
     * TODO: Test that a single child and an array with one item have the same key
     * pattern.
     */

    var didWarnAboutMaps = false;

    var userProvidedKeyEscapeRegex = /\/+/g;
    function escapeUserProvidedKey(text) {
      return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
    }

    var POOL_SIZE = 10;
    var traverseContextPool = [];
    function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
      if (traverseContextPool.length) {
        var traverseContext = traverseContextPool.pop();
        traverseContext.result = mapResult;
        traverseContext.keyPrefix = keyPrefix;
        traverseContext.func = mapFunction;
        traverseContext.context = mapContext;
        traverseContext.count = 0;
        return traverseContext;
      } else {
        return {
          result: mapResult,
          keyPrefix: keyPrefix,
          func: mapFunction,
          context: mapContext,
          count: 0
        };
      }
    }

    function releaseTraverseContext(traverseContext) {
      traverseContext.result = null;
      traverseContext.keyPrefix = null;
      traverseContext.func = null;
      traverseContext.context = null;
      traverseContext.count = 0;
      if (traverseContextPool.length < POOL_SIZE) {
        traverseContextPool.push(traverseContext);
      }
    }

    /**
     * @param {?*} children Children tree container.
     * @param {!string} nameSoFar Name of the key path so far.
     * @param {!function} callback Callback to invoke with each child found.
     * @param {?*} traverseContext Used to pass information throughout the traversal
     * process.
     * @return {!number} The number of children in this subtree.
     */
    function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
      var type = typeof children === 'undefined' ? 'undefined' : _typeof(children);

      if (type === 'undefined' || type === 'boolean') {
        // All of the above are perceived as null.
        children = null;
      }

      var invokeCallback = false;

      if (children === null) {
        invokeCallback = true;
      } else {
        switch (type) {
          case 'string':
          case 'number':
            invokeCallback = true;
            break;
          case 'object':
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
            }
        }
      }

      if (invokeCallback) {
        callback(traverseContext, children,
        // If it's the only child, treat the name as if it was wrapped in an array
        // so that it's consistent if the number of children grows.
        nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
        return 1;
      }

      var child = void 0;
      var nextName = void 0;
      var subtreeCount = 0; // Count of children found in the current subtree.
      var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          child = children[i];
          nextName = nextNamePrefix + getComponentKey(child, i);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        var iteratorFn = getIteratorFn(children);
        if (typeof iteratorFn === 'function') {
          {
            // Warn about using Maps as children
            if (iteratorFn === children.entries) {
              !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
              didWarnAboutMaps = true;
            }
          }

          var iterator = iteratorFn.call(children);
          var step = void 0;
          var ii = 0;
          while (!(step = iterator.next()).done) {
            child = step.value;
            nextName = nextNamePrefix + getComponentKey(child, ii++);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        } else if (type === 'object') {
          var addendum = '';
          {
            addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
          }
          var childrenString = '' + children;
          invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
        }
      }

      return subtreeCount;
    }

    /**
     * Traverses children that are typically specified as `props.children`, but
     * might also be specified through attributes:
     *
     * - `traverseAllChildren(this.props.children, ...)`
     * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
     *
     * The `traverseContext` is an optional argument that is passed through the
     * entire traversal. It can be used to store accumulations or anything else that
     * the callback might find relevant.
     *
     * @param {?*} children Children tree object.
     * @param {!function} callback To invoke upon traversing each child.
     * @param {?*} traverseContext Context for traversal.
     * @return {!number} The number of children in this subtree.
     */
    function traverseAllChildren(children, callback, traverseContext) {
      if (children == null) {
        return 0;
      }

      return traverseAllChildrenImpl(children, '', callback, traverseContext);
    }

    /**
     * Generate a key string that identifies a component within a set.
     *
     * @param {*} component A component that could contain a manual key.
     * @param {number} index Index that is used if a manual key is not provided.
     * @return {string}
     */
    function getComponentKey(component, index) {
      // Do some typechecking here since we call this blindly. We want to ensure
      // that we don't block potential future ES APIs.
      if ((typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'object' && component !== null && component.key != null) {
        // Explicit key
        return escape(component.key);
      }
      // Implicit key determined by the index in the set
      return index.toString(36);
    }

    function forEachSingleChild(bookKeeping, child, name) {
      var func = bookKeeping.func,
          context = bookKeeping.context;

      func.call(context, child, bookKeeping.count++);
    }

    /**
     * Iterates through children that are typically specified as `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
     *
     * The provided forEachFunc(child, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} forEachFunc
     * @param {*} forEachContext Context for forEachContext.
     */
    function forEachChildren(children, forEachFunc, forEachContext) {
      if (children == null) {
        return children;
      }
      var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
      traverseAllChildren(children, forEachSingleChild, traverseContext);
      releaseTraverseContext(traverseContext);
    }

    function mapSingleChildIntoContext(bookKeeping, child, childKey) {
      var result = bookKeeping.result,
          keyPrefix = bookKeeping.keyPrefix,
          func = bookKeeping.func,
          context = bookKeeping.context;

      var mappedChild = func.call(context, child, bookKeeping.count++);
      if (Array.isArray(mappedChild)) {
        mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
          return c;
        });
      } else if (mappedChild != null) {
        if (isValidElement(mappedChild)) {
          mappedChild = cloneAndReplaceKey(mappedChild,
          // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
        }
        result.push(mappedChild);
      }
    }

    function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
      var escapedPrefix = '';
      if (prefix != null) {
        escapedPrefix = escapeUserProvidedKey(prefix) + '/';
      }
      var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
      traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
      releaseTraverseContext(traverseContext);
    }

    /**
     * Maps children that are typically specified as `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenmap
     *
     * The provided mapFunction(child, key, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} func The map function.
     * @param {*} context Context for mapFunction.
     * @return {object} Object containing the ordered map of results.
     */
    function mapChildren(children, func, context) {
      if (children == null) {
        return children;
      }
      var result = [];
      mapIntoWithKeyPrefixInternal(children, result, null, func, context);
      return result;
    }

    /**
     * Count the number of children that are typically specified as
     * `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrencount
     *
     * @param {?*} children Children tree container.
     * @return {number} The number of children.
     */
    function countChildren(children) {
      return traverseAllChildren(children, function () {
        return null;
      }, null);
    }

    /**
     * Flatten a children object (typically specified as `props.children`) and
     * return an array with appropriately re-keyed children.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
     */
    function toArray(children) {
      var result = [];
      mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
        return child;
      });
      return result;
    }

    /**
     * Returns the first child in a collection of children and verifies that there
     * is only one child in the collection.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenonly
     *
     * The current implementation of this function assumes that a single child gets
     * passed without a wrapper, but the purpose of this helper function is to
     * abstract away the particular structure of children.
     *
     * @param {?object} children Child collection structure.
     * @return {ReactElement} The first and only `ReactElement` contained in the
     * structure.
     */
    function onlyChild(children) {
      !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
      return children;
    }

    function createContext(defaultValue, calculateChangedBits) {
      if (calculateChangedBits === undefined) {
        calculateChangedBits = null;
      } else {
        {
          !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
        }
      }

      var context = {
        $$typeof: REACT_CONTEXT_TYPE,
        _calculateChangedBits: calculateChangedBits,
        // As a workaround to support multiple concurrent renderers, we categorize
        // some renderers as primary and others as secondary. We only expect
        // there to be two concurrent renderers at most: React Native (primary) and
        // Fabric (secondary); React DOM (primary) and React ART (secondary).
        // Secondary renderers store their context values on separate fields.
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        // Used to track how many concurrent renderers this context currently
        // supports within in a single renderer. Such as parallel server rendering.
        _threadCount: 0,
        // These are circular
        Provider: null,
        Consumer: null
      };

      context.Provider = {
        $$typeof: REACT_PROVIDER_TYPE,
        _context: context
      };

      var hasWarnedAboutUsingNestedContextConsumers = false;
      var hasWarnedAboutUsingConsumerProvider = false;

      {
        // A separate object, but proxies back to the original context object for
        // backwards compatibility. It has a different $$typeof, so we can properly
        // warn for the incorrect usage of Context as a Consumer.
        var Consumer = {
          $$typeof: REACT_CONTEXT_TYPE,
          _context: context,
          _calculateChangedBits: context._calculateChangedBits
        };
        // $FlowFixMe: Flow complains about not setting a value, which is intentional here
        Object.defineProperties(Consumer, {
          Provider: {
            get: function get() {
              if (!hasWarnedAboutUsingConsumerProvider) {
                hasWarnedAboutUsingConsumerProvider = true;
                warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
              }
              return context.Provider;
            },
            set: function set(_Provider) {
              context.Provider = _Provider;
            }
          },
          _currentValue: {
            get: function get() {
              return context._currentValue;
            },
            set: function set(_currentValue) {
              context._currentValue = _currentValue;
            }
          },
          _currentValue2: {
            get: function get() {
              return context._currentValue2;
            },
            set: function set(_currentValue2) {
              context._currentValue2 = _currentValue2;
            }
          },
          _threadCount: {
            get: function get() {
              return context._threadCount;
            },
            set: function set(_threadCount) {
              context._threadCount = _threadCount;
            }
          },
          Consumer: {
            get: function get() {
              if (!hasWarnedAboutUsingNestedContextConsumers) {
                hasWarnedAboutUsingNestedContextConsumers = true;
                warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
              }
              return context.Consumer;
            }
          }
        });
        // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
        context.Consumer = Consumer;
      }

      {
        context._currentRenderer = null;
        context._currentRenderer2 = null;
      }

      return context;
    }

    function lazy(ctor) {
      var lazyType = {
        $$typeof: REACT_LAZY_TYPE,
        _ctor: ctor,
        // React uses these fields to store the result.
        _status: -1,
        _result: null
      };

      {
        // In production, this would just set it on the object.
        var defaultProps = void 0;
        var propTypes = void 0;
        Object.defineProperties(lazyType, {
          defaultProps: {
            configurable: true,
            get: function get() {
              return defaultProps;
            },
            set: function set(newDefaultProps) {
              warning$1(false, 'React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
              defaultProps = newDefaultProps;
              // Match production behavior more closely:
              Object.defineProperty(lazyType, 'defaultProps', {
                enumerable: true
              });
            }
          },
          propTypes: {
            configurable: true,
            get: function get() {
              return propTypes;
            },
            set: function set(newPropTypes) {
              warning$1(false, 'React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
              propTypes = newPropTypes;
              // Match production behavior more closely:
              Object.defineProperty(lazyType, 'propTypes', {
                enumerable: true
              });
            }
          }
        });
      }

      return lazyType;
    }

    function forwardRef(render) {
      {
        if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
          warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
        } else if (typeof render !== 'function') {
          warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render === 'undefined' ? 'undefined' : _typeof(render));
        } else {
          !(
          // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
          render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
        }

        if (render != null) {
          !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
        }
      }

      return {
        $$typeof: REACT_FORWARD_REF_TYPE,
        render: render
      };
    }

    function isValidElementType(type) {
      return typeof type === 'string' || typeof type === 'function' ||
      // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
    }

    function memo(type, compare) {
      {
        if (!isValidElementType(type)) {
          warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type === 'undefined' ? 'undefined' : _typeof(type));
        }
      }
      return {
        $$typeof: REACT_MEMO_TYPE,
        type: type,
        compare: compare === undefined ? null : compare
      };
    }

    function resolveDispatcher() {
      var dispatcher = ReactCurrentDispatcher.current;
      !(dispatcher !== null) ? invariant(false, 'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.') : void 0;
      return dispatcher;
    }

    function useContext(Context, unstable_observedBits) {
      var dispatcher = resolveDispatcher();
      {
        !(unstable_observedBits === undefined) ? warning$1(false, 'useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '') : void 0;

        // TODO: add a more generic warning for invalid values.
        if (Context._context !== undefined) {
          var realContext = Context._context;
          // Don't deduplicate because this legitimately causes bugs
          // and nobody should be using this in existing code.
          if (realContext.Consumer === Context) {
            warning$1(false, 'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
          } else if (realContext.Provider === Context) {
            warning$1(false, 'Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
          }
        }
      }
      return dispatcher.useContext(Context, unstable_observedBits);
    }

    function useState(initialState) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useState(initialState);
    }

    function useReducer(reducer, initialArg, init) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useReducer(reducer, initialArg, init);
    }

    function useRef(initialValue) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useRef(initialValue);
    }

    function useEffect(create, inputs) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useEffect(create, inputs);
    }

    function useLayoutEffect(create, inputs) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useLayoutEffect(create, inputs);
    }

    function useCallback(callback, inputs) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useCallback(callback, inputs);
    }

    function useMemo(create, inputs) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useMemo(create, inputs);
    }

    function useImperativeHandle(ref, create, inputs) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useImperativeHandle(ref, create, inputs);
    }

    function useDebugValue(value, formatterFn) {
      {
        var dispatcher = resolveDispatcher();
        return dispatcher.useDebugValue(value, formatterFn);
      }
    }

    /**
     * ReactElementValidator provides a wrapper around a element factory
     * which validates the props passed to the element. This is intended to be
     * used only in DEV and could be replaced by a static type checker for languages
     * that support it.
     */

    var propTypesMisspellWarningShown = void 0;

    {
      propTypesMisspellWarningShown = false;
    }

    function getDeclarationErrorAddendum() {
      if (ReactCurrentOwner.current) {
        var name = getComponentName(ReactCurrentOwner.current.type);
        if (name) {
          return '\n\nCheck the render method of `' + name + '`.';
        }
      }
      return '';
    }

    function getSourceInfoErrorAddendum(elementProps) {
      if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
        var source = elementProps.__source;
        var fileName = source.fileName.replace(/^.*[\\\/]/, '');
        var lineNumber = source.lineNumber;
        return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
      }
      return '';
    }

    /**
     * Warn if there's no key explicitly set on dynamic arrays of children or
     * object keys are not valid. This allows us to keep track of children between
     * updates.
     */
    var ownerHasKeyUseWarning = {};

    function getCurrentComponentErrorInfo(parentType) {
      var info = getDeclarationErrorAddendum();

      if (!info) {
        var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
        if (parentName) {
          info = '\n\nCheck the top-level render call using <' + parentName + '>.';
        }
      }
      return info;
    }

    /**
     * Warn if the element doesn't have an explicit key assigned to it.
     * This element is in an array. The array could grow and shrink or be
     * reordered. All children that haven't already been validated are required to
     * have a "key" property assigned to it. Error statuses are cached so a warning
     * will only be shown once.
     *
     * @internal
     * @param {ReactElement} element Element that requires a key.
     * @param {*} parentType element's parent's type.
     */
    function validateExplicitKey(element, parentType) {
      if (!element._store || element._store.validated || element.key != null) {
        return;
      }
      element._store.validated = true;

      var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
      if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
        return;
      }
      ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

      // Usually the current owner is the offender, but if it accepts children as a
      // property, it may be the creator of the child that's responsible for
      // assigning it a key.
      var childOwner = '';
      if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
        // Give the component that originally created this child.
        childOwner = ' It was passed a child from ' + getComponentName(element._owner.type) + '.';
      }

      setCurrentlyValidatingElement(element);
      {
        warning$1(false, 'Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
      }
      setCurrentlyValidatingElement(null);
    }

    /**
     * Ensure that every element either is passed in a static location, in an
     * array with an explicit keys property defined, or in an object literal
     * with valid key property.
     *
     * @internal
     * @param {ReactNode} node Statically passed child of any type.
     * @param {*} parentType node's parent's type.
     */
    function validateChildKeys(node, parentType) {
      if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object') {
        return;
      }
      if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
          var child = node[i];
          if (isValidElement(child)) {
            validateExplicitKey(child, parentType);
          }
        }
      } else if (isValidElement(node)) {
        // This element was passed in a valid location.
        if (node._store) {
          node._store.validated = true;
        }
      } else if (node) {
        var iteratorFn = getIteratorFn(node);
        if (typeof iteratorFn === 'function') {
          // Entry iterators used to provide implicit keys,
          // but now we print a separate warning for them later.
          if (iteratorFn !== node.entries) {
            var iterator = iteratorFn.call(node);
            var step = void 0;
            while (!(step = iterator.next()).done) {
              if (isValidElement(step.value)) {
                validateExplicitKey(step.value, parentType);
              }
            }
          }
        }
      }
    }

    /**
     * Given an element, validate that its props follow the propTypes definition,
     * provided by the type.
     *
     * @param {ReactElement} element
     */
    function validatePropTypes(element) {
      var type = element.type;
      if (type === null || type === undefined || typeof type === 'string') {
        return;
      }
      var name = getComponentName(type);
      var propTypes = void 0;
      if (typeof type === 'function') {
        propTypes = type.propTypes;
      } else if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
      // Note: Memo only checks outer props here.
      // Inner props are checked in the reconciler.
      type.$$typeof === REACT_MEMO_TYPE)) {
        propTypes = type.propTypes;
      } else {
        return;
      }
      if (propTypes) {
        setCurrentlyValidatingElement(element);
        checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
        setCurrentlyValidatingElement(null);
      } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
        propTypesMisspellWarningShown = true;
        warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
      }
      if (typeof type.getDefaultProps === 'function') {
        !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
      }
    }

    /**
     * Given a fragment, validate that it can only be provided with fragment props
     * @param {ReactElement} fragment
     */
    function validateFragmentProps(fragment) {
      setCurrentlyValidatingElement(fragment);

      var keys = Object.keys(fragment.props);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key !== 'children' && key !== 'key') {
          warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
          break;
        }
      }

      if (fragment.ref !== null) {
        warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
      }

      setCurrentlyValidatingElement(null);
    }

    function createElementWithValidation(type, props, children) {
      var validType = isValidElementType(type);

      // We warn in this case but don't throw. We expect the element creation to
      // succeed and there will likely be errors in render.
      if (!validType) {
        var info = '';
        if (type === undefined || (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
        }

        var sourceInfo = getSourceInfoErrorAddendum(props);
        if (sourceInfo) {
          info += sourceInfo;
        } else {
          info += getDeclarationErrorAddendum();
        }

        var typeString = void 0;
        if (type === null) {
          typeString = 'null';
        } else if (Array.isArray(type)) {
          typeString = 'array';
        } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
          typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
          info = ' Did you accidentally export a JSX literal instead of a component?';
        } else {
          typeString = typeof type === 'undefined' ? 'undefined' : _typeof(type);
        }

        warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
      }

      var element = createElement.apply(this, arguments);

      // The result can be nullish if a mock or a custom function is used.
      // TODO: Drop this when these are no longer allowed as the type argument.
      if (element == null) {
        return element;
      }

      // Skip key warning if the type isn't valid since our key validation logic
      // doesn't expect a non-string/function type and can throw confusing errors.
      // We don't want exception behavior to differ between dev and prod.
      // (Rendering will throw with a helpful message and as soon as the type is
      // fixed, the key warnings will appear.)
      if (validType) {
        for (var i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], type);
        }
      }

      if (type === REACT_FRAGMENT_TYPE) {
        validateFragmentProps(element);
      } else {
        validatePropTypes(element);
      }

      return element;
    }

    function createFactoryWithValidation(type) {
      var validatedFactory = createElementWithValidation.bind(null, type);
      validatedFactory.type = type;
      // Legacy hook: remove it
      {
        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function get() {
            lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }

      return validatedFactory;
    }

    function cloneElementWithValidation(element, props, children) {
      var newElement = cloneElement.apply(this, arguments);
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], newElement.type);
      }
      validatePropTypes(newElement);
      return newElement;
    }

    // Helps identify side effects in begin-phase lifecycle hooks and setState reducers:


    // In some cases, StrictMode should also double-render lifecycles.
    // This can be confusing for tests though,
    // And it can be bad for performance in production.
    // This feature flag can be used to control the behavior:


    // To preserve the "Pause on caught exceptions" behavior of the debugger, we
    // replay the begin phase of a failed component inside invokeGuardedCallback.


    // Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:


    // Gather advanced timing metrics for Profiler subtrees.


    // Trace which interactions trigger each commit.


    // Only used in www builds.
    // TODO: true? Here it might just be false.

    // Only used in www builds.


    // Only used in www builds.


    // React Fire: prevent the value and checked attributes from syncing
    // with their related DOM properties


    // These APIs will no longer be "unstable" in the upcoming 16.7 release,
    // Control this behavior with a flag to support 16.6 minor releases in the meanwhile.
    var enableStableConcurrentModeAPIs = false;

    var React = {
      Children: {
        map: mapChildren,
        forEach: forEachChildren,
        count: countChildren,
        toArray: toArray,
        only: onlyChild
      },

      createRef: createRef,
      Component: Component,
      PureComponent: PureComponent,

      createContext: createContext,
      forwardRef: forwardRef,
      lazy: lazy,
      memo: memo,

      useCallback: useCallback,
      useContext: useContext,
      useEffect: useEffect,
      useImperativeHandle: useImperativeHandle,
      useDebugValue: useDebugValue,
      useLayoutEffect: useLayoutEffect,
      useMemo: useMemo,
      useReducer: useReducer,
      useRef: useRef,
      useState: useState,

      Fragment: REACT_FRAGMENT_TYPE,
      StrictMode: REACT_STRICT_MODE_TYPE,
      Suspense: REACT_SUSPENSE_TYPE,

      createElement: createElementWithValidation,
      cloneElement: cloneElementWithValidation,
      createFactory: createFactoryWithValidation,
      isValidElement: isValidElement,

      version: ReactVersion,

      unstable_ConcurrentMode: REACT_CONCURRENT_MODE_TYPE,
      unstable_Profiler: REACT_PROFILER_TYPE,

      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
    };

    // Note: some APIs are added with feature flags.
    // Make sure that stable builds for open source
    // don't modify the React object to avoid deopts.
    // Also let's not expose their names in stable builds.

    if (enableStableConcurrentModeAPIs) {
      React.ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
      React.Profiler = REACT_PROFILER_TYPE;
      React.unstable_ConcurrentMode = undefined;
      React.unstable_Profiler = undefined;
    }

    var React$2 = Object.freeze({
      default: React
    });

    var React$3 = React$2 && React || React$2;

    // TODO: decide on the top-level export form.
    // This is hacky but makes it work with both Rollup and Jest.
    var react = React$3.default || React$3;

    module.exports = react;
  })();
}

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("prop-types/checkPropTypes");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("react-router");

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Navbar;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Navbar() {
  var languages = [{
    name: 'All',
    param: 'all'
  }, {
    name: 'JavaScript',
    param: 'javascript'
  }, {
    name: 'Ruby',
    param: 'ruby'
  }, {
    name: 'Python',
    param: 'python'
  }, {
    name: 'Java',
    param: 'java'
  }];

  return _react2.default.createElement(
    'ul',
    null,
    languages.map(function (_ref) {
      var name = _ref.name,
          param = _ref.param;
      return _react2.default.createElement(
        'li',
        { key: param },
        _react2.default.createElement(
          _reactRouterDom.NavLink,
          { activeStyle: { fontWeight: 'bold' }, to: '/popular/' + param },
          name
        )
      );
    })
  );
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NoMatch;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NoMatch() {
  return _react2.default.createElement(
    'div',
    null,
    'Four Oh Four'
  );
}

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("express-mysql-session");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./serverroot/api": 3,
	"./serverroot/api/": 3,
	"./serverroot/api/index": 3,
	"./serverroot/api/index.js": 3,
	"./serverroot/api/login": 4,
	"./serverroot/api/login/": 4,
	"./serverroot/api/login/index": 4,
	"./serverroot/api/login/index.js": 4,
	"./serverroot/api/songqueue": 5,
	"./serverroot/api/songqueue/": 5,
	"./serverroot/api/songqueue/index": 5,
	"./serverroot/api/songqueue/index.js": 5
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 38;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var url = __webpack_require__(1);
var https = __webpack_require__(11);
var key1 = process.env.key1;
var engine = process.env.engine;
var key2 = process.env.key2;
var debug = process.env.debug == "true";
exports.getSSL = function (Url, callback) {
  Url = url.parse(Url, true);
  var qdata = Url.query;

  var options = {
    host: Url.host,
    port: 443,
    path: Url.pathname + Url.search,
    method: "GET"
  };
  console.log("requesting resource:" + Url.host + Url.path);
  var req = https.request(options, function (res) {
    res.setEncoding('utf8');
    var __data = "";
    res.on('data', function (chunk) {
      __data += chunk;
    });
    res.on('end', function () {
      if (typeof callback == "function") callback(__data);
    });
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });
  req.end();
};
exports.getVideoURL = function (search, callback) {
  // callback("https://www.youtube.com/watch?v=SRwrg0db_zY");

  var index = -1;
  if (debug == false) {
    exports.getSSL("https://www.googleapis.com/customsearch/v1?key=" + key1 + "&cx=" + engine + "&q=" + encodeURIComponent(search), function (data) {
      index = data.indexOf("https://www.youtube.com/watch?v=", index + 1);
      //console.log("index: "+index)
      if (index != -1) {
        var _url = data.slice(index, index + 43);
        //console.log(_url);
        if (typeof callback == "function") callback(_url);
      } else {
        console.log("song was not found.");
      }
    });
  } else {
    console.warn("debug mode forced url callback");
    callback("https://youtube.com/watch?v=SRwrg0db_zY");
  }
};
// example using getVideoURL():
/** /exports.getVideoURL("I wanna rock",function(songUrl){
console.log(songUrl);
});
//*/
exports.getVideoDetails = function (Url, callback) {
  Url = url.parse(Url, true);
  var qdata = Url.query;
  if ((Url.host == "youtube.com" || Url.host == "www.youtube.com") && qdata.v) {
    var videoId = qdata.v;
    if (debug == false || debug == "false") {
      exports.getSSL("https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatistics%2Csnippet&key=" + key2 + "&id=" + videoId, function (_data) {
        //_data={ "kind": "youtube#videoListResponse", "etag": "\"Bdx4f4ps3xCOOo1WZ91nTLkRZ_c/y0nEUuwIWmyaw1-QiApDdOI3oNg\"", "pageInfo": { "totalResults": 1, "resultsPerPage": 1 }, "items": [ { "kind": "youtube#video", "etag": "\"Bdx4f4ps3xCOOo1WZ91nTLkRZ_c/VtGjf2TnUCvZ6seY_uQd84MWOqE\"", "id": "SRwrg0db_zY", "snippet": { "publishedAt": "2010-08-04T00:57:48.000Z", "channelId": "UCRay0Axn67v8-nm6n91uBsg", "title": "Twisted Sister - I Wanna Rock (Official Video)", "description": "Watch the official video for Twisted Sister's \"I Wanna Rock\"\n\n\"I Wanna Rock\" is from the album Stay Hungry (1984). In 2009 it was named the 17th VH1 Greatest Hard Rock Songs by VH1. The song was recently featured on the Broadway musical \"Rock of Ages\"\n\nDownload the greatest hits at iTunes:\nhttps://itunes.apple.com/us/album/stay-hungry-25th-anniversary/id320268623\n\nFor more info, go to:\nhttp://www.twistedsister.com/", "thumbnails": { "default": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/default.jpg", "width": 120, "height": 90 }, "medium": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/mqdefault.jpg", "width": 320, "height": 180 }, "high": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/hqdefault.jpg", "width": 480, "height": 360 } }, "channelTitle": "Twisted Sister", "tags": [ "Twisted Sister", "I Wanna Rock", "Rock", "Glam Rock", "official", "music video", "music", "video", "French", "Eddie", "Fingers", "Ojeda", "Snider", "Mark", "The Animal", "Mendoza", "Pero", "Dee Snider", "Rock of Ages", "Jay Jay French", "Metal" ], "categoryId": "10", "liveBroadcastContent": "none", "localized": { "title": "Twisted Sister - I Wanna Rock (Official Video)", "description": "Watch the official video for Twisted Sister's \"I Wanna Rock\"\n\n\"I Wanna Rock\" is from the album Stay Hungry (1984). In 2009 it was named the 17th VH1 Greatest Hard Rock Songs by VH1. The song was recently featured on the Broadway musical \"Rock of Ages\"\n\nDownload the greatest hits at iTunes:\nhttps://itunes.apple.com/us/album/stay-hungry-25th-anniversary/id320268623\n\nFor more info, go to:\nhttp://www.twistedsister.com/" } }, "contentDetails": { "duration": "PT4M34S", "dimension": "2d", "definition": "sd", "caption": "false", "licensedContent": true, "projection": "rectangular" }, "statistics": { "viewCount": "58819620", "likeCount": "365976", "dislikeCount": "12501", "favoriteCount": "0", "commentCount": "22013" } } ] };_data=JSON.stringify(_data);
        _data = JSON.parse(_data);
        var id = _data.items[0].id;
        var title = _data.items[0].snippet.title;
        var length = _data.items[0].contentDetails.duration;
        var views = _data.items[0].statistics.viewCount;
        var likeCount = _data.items[0].statistics.likeCount;
        var dislikeCount = _data.items[0].statistics.dislikeCount;
        var seconds = 0;
        if (length.split("H").length != 1) {
          seconds = length.slice(2).split("H")[0] * 3600 + length.slice(2).split("H")[1].split("M")[0] * 60 + length.slice(2).split("H")[1].split("M")[1].split("S")[0] * 1;
        } else if (length.split("M").length != 1) {
          seconds = length.slice(2).split("M")[0] * 60 + length.slice(2).split("M")[1].split("S")[0] * 1;
        } else if (length.split("S").length != 1) {
          seconds = length.slice(2).split("S")[0] * 1;
        }
        var ret_data = { "id": id, "title": title, "length": seconds, "views": views, "likeCount": likeCount, "dislikeCount": dislikeCount };
        console.log(JSON.stringify(ret_data));
        if (typeof callback == "function") {

          callback(ret_data);
        }
      });
    } else {
      console.warn("debug mode forced discription");
      var _data = { "kind": "youtube#videoListResponse", "etag": "\"Bdx4f4ps3xCOOo1WZ91nTLkRZ_c/y0nEUuwIWmyaw1-QiApDdOI3oNg\"", "pageInfo": { "totalResults": 1, "resultsPerPage": 1 }, "items": [{ "kind": "youtube#video", "etag": "\"Bdx4f4ps3xCOOo1WZ91nTLkRZ_c/VtGjf2TnUCvZ6seY_uQd84MWOqE\"", "id": "SRwrg0db_zY", "snippet": { "publishedAt": "2010-08-04T00:57:48.000Z", "channelId": "UCRay0Axn67v8-nm6n91uBsg", "title": "Twisted Sister - I Wanna Rock (Official Video)", "description": "Watch the official video for Twisted Sister's \"I Wanna Rock\"\n\n\"I Wanna Rock\" is from the album Stay Hungry (1984). In 2009 it was named the 17th VH1 Greatest Hard Rock Songs by VH1. The song was recently featured on the Broadway musical \"Rock of Ages\"\n\nDownload the greatest hits at iTunes:\nhttps://itunes.apple.com/us/album/stay-hungry-25th-anniversary/id320268623\n\nFor more info, go to:\nhttp://www.twistedsister.com/", "thumbnails": { "default": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/default.jpg", "width": 120, "height": 90 }, "medium": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/mqdefault.jpg", "width": 320, "height": 180 }, "high": { "url": "https://i.ytimg.com/vi/SRwrg0db_zY/hqdefault.jpg", "width": 480, "height": 360 } }, "channelTitle": "Twisted Sister", "tags": ["Twisted Sister", "I Wanna Rock", "Rock", "Glam Rock", "official", "music video", "music", "video", "French", "Eddie", "Fingers", "Ojeda", "Snider", "Mark", "The Animal", "Mendoza", "Pero", "Dee Snider", "Rock of Ages", "Jay Jay French", "Metal"], "categoryId": "10", "liveBroadcastContent": "none", "localized": { "title": "Twisted Sister - I Wanna Rock (Official Video)", "description": "Watch the official video for Twisted Sister's \"I Wanna Rock\"\n\n\"I Wanna Rock\" is from the album Stay Hungry (1984). In 2009 it was named the 17th VH1 Greatest Hard Rock Songs by VH1. The song was recently featured on the Broadway musical \"Rock of Ages\"\n\nDownload the greatest hits at iTunes:\nhttps://itunes.apple.com/us/album/stay-hungry-25th-anniversary/id320268623\n\nFor more info, go to:\nhttp://www.twistedsister.com/" } }, "contentDetails": { "duration": "PT4M34S", "dimension": "2d", "definition": "sd", "caption": "false", "licensedContent": true, "projection": "rectangular" }, "statistics": { "viewCount": "58819620", "likeCount": "365976", "dislikeCount": "12501", "favoriteCount": "0", "commentCount": "22013" } }] };_data = JSON.stringify(_data);
      _data = JSON.parse(_data);
      var id = _data.items[0].id;
      var title = _data.items[0].snippet.title;
      var length = _data.items[0].contentDetails.duration;
      var views = _data.items[0].statistics.viewCount;
      var likeCount = _data.items[0].statistics.likeCount;
      var dislikeCount = _data.items[0].statistics.dislikeCount;
      var seconds = 0;
      if (length.split("H").length != 1) {
        seconds = length.slice(2).split("H")[0] * 3600 + length.slice(2).split("H")[1].split("M")[0] * 60 + length.slice(2).split("H")[1].split("M")[1].split("S")[0] * 1;
      } else if (length.split("M").length != 1) {
        seconds = length.slice(2).split("M")[0] * 60 + length.slice(2).split("M")[1].split("S")[0] * 1;
      } else if (length.split("S").length != 1) {
        seconds = length.slice(2).split("S")[0] * 1;
      }
      var ret_data = { "id": id, "title": title, "length": seconds, "views": views, "likeCount": likeCount, "dislikeCount": dislikeCount };
      console.log(JSON.stringify(ret_data));
      if (typeof callback == "function") {

        callback(ret_data);
      }
    }
  }
};
//exports.getVideoDetails("https://www.youtube.com/watch?v=SRwrg0db_zY");

/***/ })
/******/ ]);