const express = require('express');
const cors = require('cors');
const app = express();
const { buscarPatente } = require('./patenteBusqueda');

app.use(cors());

app.get('/:patente', async (req, res) => {
    const patente = req.params.patente;
    try {
        await buscarPatente(patente).then(resultado => {
            console.log(resultado); 
            res.json(resultado);
        });

    
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar la patente' });
        console.log(error);
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
