const { response } = require('express')
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


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
            token,
            id: res.id,
            usuarioDB
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;
    
    try {

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email,
                password:'@@',
                img: picture,
                google: true
            })
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
    
        }

        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
           ok: true,
           token
        })

        
    } catch (error) {
        res.status(401).json({
            ok:false,
            msg: 'El token no es correcto'
        })   
    }


    
}
const renewToken = async (req, res= response) => {

    const uid = req.uid;


    const token = await generarJWT( uid );

    const usuario = await Usuario.findById( uid )
    
    
    
    res.json({
        ok: true,
        token,
        usuario
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}