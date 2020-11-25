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

//Lectura del body de la peticion
app.use( express.json() );

// Database
dbConnection();

// Directorio Publico
app.use( express.static('public') );


// Rutas
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/hospitales', require('./routes/hospitales') );
app.use( '/api/medicos', require('./routes/medicos') );
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/todo', require('./routes/busquedas') );
app.use( '/api/upload', require('./routes/uploads') );



app.listen( process.env.PORT , () => {
    console.log('servidor corriendo en puerto: '+ process.env.PORT);
})