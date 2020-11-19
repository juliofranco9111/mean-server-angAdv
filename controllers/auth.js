const { response } = require('express')
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        // verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if( !usuarioDB ){
            res.status(404).json({
                ok: false,
                msg: 'Contraseña o email no válidos'
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok:false,
                msg: 'Email o contraseña no válidos'
            })
        }

        // Generar token
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok:true,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    login
}