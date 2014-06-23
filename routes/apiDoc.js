var express = require('express');
var router = express.Router();

router.get('/api', function (req, res) {
    res.set({'Allow': 'GET', 'Connection':'close'});
    res.render('docApi');
});

router.get('/project', function (req, res) {
    res.set({'Allow': 'GET', 'Connection':'close'});
    res.render('docProject');
});

module.exports = router;