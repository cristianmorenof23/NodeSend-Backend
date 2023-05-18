const Enlaces = require('../models/Enlace')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

// Para generar un id dentro de la url 
const shortid = require('shortid')

exports.nuevoEnlace = async (req, res, next) => {

    //revisar si hay errores
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }


    // Crear un objeto de enlace
    const { nombre_original, nombre } = req.body

    const enlace = new Enlaces()
    enlace.url = shortid.generate()
    enlace.nombre = nombre
    enlace.nombre_original = nombre_original

    // Si el usuario esta autenticado
    if (req.usuario) {
        const { password, descargas } = req.body

        // Asignar a enlace el numero de descargas
        if (descargas) {
            enlace.descargas = descargas
        }

        // Asignar un password
        if (password) {
            const salt = await bcrypt.genSalt(10)
            enlace.password = await bcrypt.hash(password, salt)
        }

        // Asignar el autor
        enlace.autor = req.usuario.id
    }

    // Almacenar en la base de datos
    try {
        await enlace.save()
        res.json({ msg: `${enlace.url}` })
        return next()
    } catch (error) {
        console.log(error);
    }
}

// obtiene un listado de todos los enlaces
exports.todosEnlaces = async (req, res) => {
    try {
        const enlaces = await Enlaces.find({}).select('url -_id')
        res.json({ enlaces })
    } catch (error) {
        console.log(error);
    }
}

// Retorna si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {

    // Verificar si existe el enlace
    const { url } = req.params

    // Verificar si el enlace existe
    const enlace = await Enlaces.findOne({ url })

    // Si no hay un enlace
    if (!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe' })
        return next()
    }

    if (enlace.password) {
        return res.json({ password: true, enlace: enlace.url })
    }
    next()
}

// Verificar si el password es correcto
exports.verificarPassword = async (req, res, next) => {
    const {url} = req.params // extraemos la url del enlace con params
    const {password} = req.body // extramos el password con req.body


    // Consultar por el enlace
    const enlace = await Enlaces.findOne({url})

    // Verificar el password
    if(bcrypt.compareSync( password, enlace.password)){
        // Permitir al usuario descargar el archivo
        next()
    } else {
        return res.status(401).json({msg: 'Password Incorrecto'})
    }

}

// Obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {

    // Verificar si existe el enlace
    const { url } = req.params

    // Verificar si el enlace existe
    const enlace = await Enlaces.findOne({ url })

    // Si no hay un enlace
    if (!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe' })
        return next()
    }

    // Si el enlace existe
    res.json({ archivo: enlace.nombre, password: false})

    next()

}

