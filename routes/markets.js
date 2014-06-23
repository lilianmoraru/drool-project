var express = require('express');
var router = express.Router();
var cradle = require('cradle');
var connect = new(cradle.Connection)('http://127.0.0.1', 5984, {
    cache: true,
    raw: false,
    forceSave: true
});

var db = connect.database('markets');
var dbExists = false;
db.exists(function(err, exists) {
    dbExists = exists;
    if (err) {
        console.log('Error: ', err);
    }
    if (!exists) {
        console.log('Invalid database name! Probably a wrong query.');
    }
});

///Returns all the available markets and their data while applying the filters passed by the user
exports.marketsData = router.get('/', function(req, res) {
    db.get('_design/public/_view/markets' + ((s = req._parsedUrl.search) ? s : '') , function (err, doc) {
        if (err) {
            res.send(null);
        }

        var result = [];
        if (doc) {
            (function (result) {
                for (var idx in doc) {
                    result.push({key: doc[idx].key, value: doc[idx].value});
                }
            })(result);
            res.set({'Allow': 'GET', 'Connection':'close'});
            res.send(result);
        } else {
            res.send(null);
        }
    });
});

exports.apiStatus = function(req, res) {
    res.set({'Allow': 'GET', 'Connection':'close'});
    if (dbExists) {
        res.send({status: 'available'});
    } else {
        res.send({status: 'offline'});
    }
}