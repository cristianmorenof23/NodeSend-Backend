require('dotenv').config({ path: 'variables.env' })
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')

    // Se va a ejecutar si hay un token y esta validado
    if (authHeader) {
        // Obtener el token
        const token = authHeader.split(' ')[1]

        // comprobar el json-web-token
        try {
            const usuario = jwt.verify(token, process.env.SECRETA)
            req.usuario = usuario
        } catch (error) {
            console.log(error);
            console.log('JWT no valido');
        }

    }
    return next()
}