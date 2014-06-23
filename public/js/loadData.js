var request = require('request');
var cradle = require('cradle');
var events = require('events');
var async = require('async');
var connect = new(cradle.Connection)('http://127.0.0.1', 5984, {
    cache: true,
    raw: false,
    forceSave: true
});

var db = connect.database('markets');

///Obtaining data from the database of the available market APIs and populating "markets" with it
// for later dynamic pulling of data from external APIs
var markets = [];
db.get('_design/private/_view/market_symbols', function(err, doc) {
    if (err) {
        console.log("Couldn't load market_symbols");
    }

    for (var idx in doc) {
        if (doc[idx].value.length > 0) {
            markets.push({market: doc[idx].key[0], symbols: doc[idx].value, streaming: doc[idx].key[1]});
        }
    }
});

///This function automatically will check if the links to the external APIs are published, then it will update the documents
var loadData = function() {
    for (var idx in markets) {
        (function (idx) {
            //symbolsDB and linksDB will be saved back into the documents
            //the save operation overwrites the document, so we have to collect the original fields back
            var symbolsDB = [];
            var linksDB = [];
            //buildJSON is used to build dynamically the data field with all the symbols in it
            var buildJSON = [];
            //tasks is used to collect the functions that have to be executed consecutively
            var tasks = [];

            for (var it in markets[idx].symbols) {
                var symbols = markets[idx].symbols[it];
                symbolsDB.push(symbols.symbol);
                linksDB.push(symbols.link);
                (function (symbols) {
                    tasks.push(function(callback) {
                        request.get(symbols.link, function(error, res, body) {
                            if (!error && res.statusCode == 200) {
                                var obj = {};
                                obj[symbols.symbol] = JSON.parse(body);
                                buildJSON = buildJSON.concat(obj);
                                callback();
                            }
                        });
                    });
                })(symbols);
            }

            //Each function depends on the data the previous function built, so we execute them consecutively with waterfall
            async.waterfall(tasks, function(err) {
                db.save(markets[idx].market, {data: buildJSON, links: linksDB, streaming: markets[idx].streaming, symbols: symbolsDB},
                    function (error, res, body) {
                        if (!error) {
                            console.log(new Date().toUTCString() + ": Data updated for the market: " + markets[idx].market);
                        }
                    });
            });
        })(idx);
    }
}

///Loads data from openexchangerates.org to be used later to convert USD -> to any other currency.
///This is needed because the digital currency markets offer us only conversions to USD
var loadExchangeData = function() {
    request.get('http://openexchangerates.org/api/latest.json?app_id=d48a40857f20411eaa58f17f17146c1c', function(error, res, body) {
        if (!error && res.statusCode == 200) {
            var currencyDB = connect.database('currency');
            var obj = JSON.parse(body);
            var length = Object.keys(obj.rates).length;
            for(var it = 0; it < length; ++it) {
                (function(it) {
                    var key = Object.keys(obj.rates)[it];
                    currencyDB.save(key, {value: obj.rates[key]}, function (error, res, body) {});
                })(it);
            }
        }
    });
}

//loadData();
//Refreshing the data every 10 minutes(limitation by the services in use, otherwise you get banned)
setInterval(loadData, 600000);
//Same here, the data is refreshed every 4 hours because we are allowed a maximum of 100 API calls per month
setInterval(loadExchangeData, 28800000);