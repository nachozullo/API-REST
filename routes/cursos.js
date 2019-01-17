var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const { checkSchema, validationResult } = require('express-validator/check');

const jwt = require('jsonwebtoken');

const Curso = require('../models/Cursos');

router.use(bodyParser.urlencoded({ extended: true }));

function findOneCurso(req, res, onSuccess){
    Curso.findByIdCurso(req.params.id).then( function (curso) {

        if(curso == null){
            res.status(404).send();
            return;
        }

        res.json(onSuccess(curso));

    }).catch((err) => {
        console.error(err);
        res.status(500).send();
    });
}

function verificarToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');

        const bearerToken = bearer[1];

        req.token = bearerToken;

        next();
    } else {
        res.status(403).json({message:"No Token"});
    }
}

/* GET http://localhost:3000/api/cursos */
router.get('/', verificarToken, function(req, res, next) {
    jwt.verify(req.token, 'clavePrivada', (err, authData) => {
        if(err) {
            res.status(403).json({message:"Token Erroneo"});
        } else {
            if(req.query.hasOwnProperty("tema")){
                delete req.query.tema;
            }

            if(req.query.hasOwnProperty("alumnos")){
                delete req.query.alumnos;
            }

            Curso.find(req.query) .limit(10).then(
                (cursos) => {
                    if(cursos.length == 0) {
                        res.status(204).json({message: "No hay contenido"});
                        return;
                    }

                    res.json(cursos);

                }).catch( (err) => {
                console.error(err);
                res.status(500).send();
            });
            authData;
        }
    })
});

/* GET http://localhost:3000/api/cursos/:id */
router.get('/:id', verificarToken, function(req, res){
    jwt.verify(req.token, 'clavePrivada', (err, authData) => {
        if(err) {
            res.status(403).json({message:"Token Erroneo"});
        } else {
            findOneCurso(req, res, (curso) => curso);
            authData;
        }
    });
});

/* GET http://localhost:3000/api/cursos/:id/alumnos */
router.get('/:id/alumnos', verificarToken, function(req, res){
    jwt.verify(req.token, 'clavePrivada', (err, authData) => {
        if (err) {
            res.status(403).json({message: "Token Erroneo"});
        } else {
            findOneCurso(req, res, (curso) => {
                if(curso.getAlumnos().length == 0){
                    res.status(204).json({message: "No hay contenido"});
                    return;
                }
                curso.getAlumnos();
            });
            authData;
        }
    });
});

/* DELETE http://localhost:3000/api/cursos/:id */
router.delete('/:id', verificarToken, function(req, res){
    jwt.verify(req.token, 'clavePrivada', (err, authData) => {
        if (err) {
            res.status(403).json({message: "Token Erroneo"});
        } else {
            Curso.findOneAndRemove({_id: req.params.id}).then(function (curso) {
                if (curso == null) {
                    res.status(404).json({message: "No hay contenido"});
                    return;
                }

                res.json(curso);
            }).catch((err) => {
                console.error(err);
                res.status(500).send();
            })
            authData;
        }
    });
});

/* POST http://localhost:3000/api/cursos */
router.post('/', verificarToken, checkSchema({
    año:{
        in: ['body'],
        errorMessage: "El campo año del curso es erroneo",
        isNumber: true
    },
    duracion:{
        in: ['body'],
        errorMessage: "El campo duracion del curso es erroneo",
        isString: true
    },
    tema:{
        in: ['body'],
        errorMessage: "El campo tema del curso es erroneo",
        isString: true
    }
}), function(req, res) {
    jwt.verify(req.token, 'clavePrivada', (err, authData) => {
        if (err) {
            res.status(403).json({message: "Token Erroneo"});
        } else {

            let validation = validationResult(req).array();

            if (validation.length > 0) {
                res.status(400).json(validation);
                return;
            }

            var curso = new Curso({
                año: req.body.año,
                duracion: req.body.duracion,
                tema: req.body.tema
            });

            curso.save().then((doc) =>
                res.status(201).json(doc)
            ).catch((err) => {
                console.error(err);
                res.status(500).send();
            });
            authData;
        }
    });
});


/* GET http://localhost:3000/api/cursos/:id/alumnos/destacado */
router.get('/:id/alumnos/destacado', verificarToken, function(req,res) {
    jwt.verify(req.token, 'clavePrivada', (err, authData) => {
        if (err) {
            res.status(403).json({message: "Token Erroneo"});
        } else {
            findOneCurso(req, res, (curso) => curso.getAlumnoDestacado());
            authData;
        }
    });
});

module.exports = router;



