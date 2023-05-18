const express = require('express')
const { model } = require('mongoose')
const router = express.Router()
const usuarioControllers = require('../controllers/usuarioController')
const {check} = require('express-validator')


router.post('/',
    [
        // Revisa que el nombre no este facio
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({min: 6})
    ],
    usuarioControllers.nuevoUsuario
)


module.exports = router


