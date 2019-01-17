const mongoose = require("mongoose");
const Cliente = require("./Clientes.js").schema;

const Curso =  new mongoose.Schema({
    año: {type: Number, default: new Date().getFullYear()},
    duracion: {type: String},
    tema: {type: String},
    alumnos: {type: [Cliente], default: []}
})

Curso.methods.getAlumnos = function () {
    return this.alumnos;
}

Curso.methods.getAlumnoDestacado = function () {
    return this.alumnos.sort((a,b) => a.nota < b.nota)[0];
}

Curso.statics.findByIdCurso = function (id) {
    return this.findOne({_id: id});
};

module.exports = mongoose.model("Curso", Curso);