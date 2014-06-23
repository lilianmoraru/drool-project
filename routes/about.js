var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.set({'Allow': 'GET', 'Connection':'close'});
    res.render('about');
});

module.exports = router;