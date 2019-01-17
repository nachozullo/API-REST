var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET http://localhost:3000/api/validacion/ */
router.get('/', function(req, res){

    jwt.sign({user: "user", pass: "1234"}, 'clavePrivada', { expiresIn: '1h' },(err, token) => {
    if(err) { console.log(err) }
    res.json({token});
});
});

module.exports = router;