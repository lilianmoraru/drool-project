var express = require('express');
var router = express.Router();
var cradle = require('cradle');
var async = require('async');

var connect = new(cradle.Connection)('http://127.0.0.1', 5984, {
    cache: true,
    raw: false,
    forceSave: true
});

var currency = connect.database('currency');
var marketsDB = connect.database('markets');

///We load the types of conversions(ex: USD, GBP, RON) when the server starts because we need to load them only once
var currencies = [];
currency.get('_design/private/_view/getCurrencies', function(err, doc) {
    if (err) {
        console.log("Couldn't load getCurrencies");
    }

    if (!currencies.length) {
        for (var idx in doc) {
            currencies.push(doc[idx].key);
        }
        //currencies.push("LTC");
    }
    //exchangeValue = 1;
});

///Loading the available markets
var markets = [];
marketsDB.get('_design/public/_view/markets', function(err, doc) {
    if (err) {
        console.log("Couldn't load markets data");
    }

    for (var idx in doc) {
        markets.push(doc[idx].key);
    }
});

/* GET home page. */
router.get('/', function(req, res) {
    res.set({'Allow': 'GET', 'Connection':'close'});
    res.render('index');
});

///We pass to the server the type of currency we are interested in and it sends back the conversion rate from USD(ex: USD->RON)
///{"exchangeValue": 3.24 } - ex in the case of USD -> RON(~3.24)
router.param('currency', function(req, res, next, key) {
    if (key.length == 3) {
        currency.get('_design/private/_view/getCurrencies?key="' + key + '"', function(err, doc) {
            if (err) {
                console.log("Couldn't load getCurrencies with the passed key");
            }

            res.set({'Allow': 'GET', 'Connection':'close'});
            res.send({exchangeValue: doc[0].value});
        });
    } else {
        next(new Error('An attempt to pass a false key to /data/:currency was detected'));
    }
    next();
});

///We have the implementation in router.param('currency', ...);
router.get('/data/:currency', function(req, res, next) {});

///"Data" will send to the client all the types of currencies available to convert to
///{"currencies": ["USD", "MDL", "RON", ...]}
router.get('/data', function(req, res) {
    res.set({'Allow': 'GET', 'Connection':'close'});
    res.send({currencies: currencies});
});

//
router.param('market', function(req, res, next, key) {
    if (key.length < 9) {
        marketsDB.get('_design/private/_view/markets_filtered?key="' + key + '"', function(err, doc) {
            if (err) {
                console.log("Couldn't load markets data with the passed key");
            }

            res.set({'Allow': 'GET', 'Connection':'close'});
            res.send(doc[0].value);
        });
    } else {
        next(new Error('An attempt to pass a false key to /markets/:market was detected'));
    }
    next();
});

//We have the implementation in router.param('market', ...);
router.get('/markets/:market', function(req, res, next) {});

//Returns to the client all the available markets
router.get('/markets', function(req, res) {
    res.set({'Allow': 'GET', 'Connection':'close'});
    res.send({markets: markets});
});

module.exports = router;
