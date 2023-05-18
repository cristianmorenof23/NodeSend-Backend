const express = require('express')
const conectarDB = require('./config/db')
const cors = require('cors')


// crear el servidor
const app = express()

// Conectar a la base de datos
conectarDB()

// Habilitar cors
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
app.use( cors(opcionesCors))

// Puerto de la APP
const port = process.env.PORT || 4001

// Habilitar leer los valores de un body
app.use(express.json())

// Habilitar carpeta publica
app.use( express.static('uploads'))

// Rutas de la APP
app.use('/api/usuarios', require('./routes/usuarios')) 
app.use('/api/auth', require('./routes/auth'))
app.use('/api/enlaces', require('./routes/enlaces'))
app.use('/api/archivos', require('./routes/archivos'))

// Arrancar la APP
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})


// Con req.params es lo que enviamos mediante una url
// Con POST enviamos datos al serivor y GET obtener datos del servidor
// En req se almacena lo que estas enviando y en res la respuesta que te manda node
// express-validator para validar los datos