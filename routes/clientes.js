var express = require('express');
var router = express.Router();

const Curso = require('../models/Cursos');

/* GET /api/clientes */
router.get('/', function(req, res, next) {
   Curso.distinct("alumnos", null, function(err, clientes){
     if(err){
       console.error(err);
       res.status(500).send();
     } else {
       res.json(clientes);
     }
   })
});

module.exports = router;
