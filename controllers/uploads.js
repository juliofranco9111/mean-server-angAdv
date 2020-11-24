const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {

        return res.status(400).json({
            ok: false,
            msg: 'El tipo especificado no es un hospital, medico o usuario'

        })
    }

    //Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha seleccionado un archivo'
        });
    }

    //Procesar la imagen..
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');

    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extension

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha seleccionado una extensión permitida'
        });
    }

    // Generar un nombre unico
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //Crear el path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //Mover el archivo

    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al subir el archivo'
            });
        }

    //Actualizar base de datos
    actualizarImagen( tipo, id, nombreArchivo );

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo

        })
    });



}

const retornaImagen = ( req, res=response) => {
    const { tipo, img } = req.params;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ img }` );

    // imagen por defecto
    if ( fs.existsSync(pathImg) ){
        res.sendFile( pathImg );
    }else{
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg` );
        res.sendFile( pathImg );
    }

}



module.exports = {
    fileUpload,
    retornaImagen
}