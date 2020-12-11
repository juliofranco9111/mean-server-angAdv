const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const fs = require('fs');


const borrarImagen = ( path ) => {
    if ( fs.existsSync( path ) ) {
                
        fs.unlinkSync( path );

    }

}



const actualizarImagen = async ( tipo, id, nombreArchivo ) => {

    // console.log('Vamos bien');
    let pathViejo = '';
    
    switch (tipo) {
        
        case 'medicos':
            const medico = await Medico.findById(id);
            if( !medico ){
                console.log('No se encontraron medicos por id');
                return false;
            }

            pathViejo = `./uploads/medicos/${ medico.img }`; 

            //Borrar la imagen anterior (si existe)
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;

            await medico.save();

            return true;
            
        break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if( !hospital ){
                console.log('No se encontraron hospitales por id');
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`; 

            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;

            await hospital.save();
            
            return true;
            
        break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if( !usuario ){
                console.log('No se encontraron usuarios por id');
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`; 

            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;

            await usuario.save();
            
            return true;
            
        break;
    
    }

}



module.exports = {
    actualizarImagen
}