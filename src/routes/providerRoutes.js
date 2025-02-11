const express = require('express');
const Provider = require('../models/provider');

const router = express.Router();
router.use(express.json()); // ✅ Middleware para JSON

// ✅ Endpoint para sincronizar creación de proveedores desde el microservicio de Crear
router.post('/sync-create', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-create:', req.body);
    const { id, name, address, email } = req.body;

    try {
        const existingProvider = await Provider.findByPk(id);
        if (!existingProvider) {
            await Provider.create({ id, name, address, email });
            console.log(`✅ Proveedor con ID ${id} sincronizado en la base de Leer`);
        } else {
            console.log(`⚠️ Proveedor con ID ${id} ya existe en la base de Leer`);
        }

        res.status(200).send({ message: `Proveedor con ID ${id} sincronizado correctamente en Leer` });
    } catch (error) {
        console.error('❌ Error sincronizando proveedor en Leer:', error);
        res.status(500).send({ error: 'Failed to sync provider creation' });
    }
});

// ✅ Endpoint para sincronizar actualización de proveedores desde el microservicio de Editar
router.post('/sync-update', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-update:', req.body);
    const { id, name, address, email } = req.body;

    try {
        const provider = await Provider.findByPk(id);
        if (provider) {
            await provider.update({ name, address, email });
            console.log(`✅ Proveedor con ID ${id} actualizado en la base de Leer`);
        } else {
            console.log(`⚠️ Proveedor con ID ${id} no encontrado en la base de Leer`);
        }

        res.status(200).send({ message: `Proveedor con ID ${id} actualizado correctamente en Leer` });
    } catch (error) {
        console.error('❌ Error sincronizando actualización de proveedor en Leer:', error);
        res.status(500).send({ error: 'Failed to sync provider update' });
    }
});




router.use(express.json()); // ✅ Middleware para JSON

// ✅ Endpoint para sincronizar eliminación de proveedores desde el microservicio de Eliminar
router.post('/sync-delete', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-delete:', req.body);
    const { id } = req.body;

    try {
        console.log('📌 Antes de eliminar:');
        const providersBefore = await Provider.findAll();
        console.table(providersBefore.map(p => ({ id: p.id, name: p.name }))); // ✅ Imprimir lista antes de eliminar

        const provider = await Provider.findByPk(id);
        if (provider) {
            await provider.destroy();
            console.log(`✅ Proveedor con ID ${id} eliminado en la base de Leer`);
        } else {
            console.log(`⚠️ Proveedor con ID ${id} no encontrado en la base de Leer`);
        }

        console.log('📌 Después de eliminar:');
        const providersAfter = await Provider.findAll();
        console.table(providersAfter.map(p => ({ id: p.id, name: p.name }))); // ✅ Imprimir lista después de eliminar

        res.status(200).send({ message: `Proveedor con ID ${id} eliminado correctamente en Leer` });
    } catch (error) {
        console.error('❌ Error sincronizando eliminación de proveedor en Leer:', error);
        res.status(500).send({ error: 'Failed to sync provider delete' });
    }
});

//---------------------------------------------Connect Product------------------------------
router.get('/providers/:id', async (req, res) => {
    try {
        const provider = await Provider.findByPk(req.params.id);
        if (!provider) {
            return res.status(404).json({ error: "Proveedor no encontrado" });
        }
        res.json(provider);
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
