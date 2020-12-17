const { response } = require("express")
const Medico = require('../models/medico');


const getMedicos = async (req, res = response) => {

    const medicos = await Medico
        .find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre');

    res.json({
        ok: true,
        medicos
    })

}

const getMedico = async (req, res = response) => {

    const id = req.params.id;

    try {
        const medico = await Medico
            .findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre');

        res.json({
            ok: true,
            medico
        })


    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const hospital = req.hospital;

    const medico = new Medico({
        usuario: uid,
        hospital,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}



const actualizarMedico = async (req, res = response) => {

    const idMedico = req.params.id;
    const uid = req.uid;


    try {

        const medico = await Medico.findById(idMedico)

        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el medico'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(
            idMedico, cambiosMedico, { new: true }
        );


        res.json({
            ok: true,
            medico: medicoActualizado
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }






}

const borrarMedico = async (req, res = response) => {

    const id = req.params.id;

    try {

        const medico = await Medico.findById(id)

        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el Medico'
            })
        }


        await Medico.findByIdAndDelete(id)

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}





module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedico
};