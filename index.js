// dotenv sirve para crear facilmente variables de entorno,
// basta con definirlas en el archivo .env
require ('dotenv').config();

const express = require('express');

const cors = require('cors')

const { dbConnection } = require('./database/config');


//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

// Database
dbConnection();


// Rutas

app.get( '/', ( req, res ) => {
    
    res.json({
        ok: true,
        msg: 'Hola mundo'
    })

});

app.listen( process.env.PORT , () => {
    console.log('servidor corriendo en puerto: '+ process.env.PORT);
})