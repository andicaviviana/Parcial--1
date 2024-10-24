import express from 'express';
import { readData, writeData } from '../src/data.js';
import Joi from 'joi';
import { addMetadata } from '../src/middleware.js';
import dayjs from 'dayjs';

const router = express.Router();

const mascotaSchema = Joi.object({
    id: Joi.number().integer().positive(), 
    nombre: Joi.string().min(1).required(), 
    especie: Joi.string().valid('perro', 'gato', 'otro').required(), 
    raza: Joi.string().min(1).required(), 
    edad: Joi.number().integer().min(0).required(), 
    dueño: Joi.string().min(1).required(), 
    telefono: Joi.string().pattern(/^[0-9]{10}$/).required(), 
    historial: Joi.array().items(Joi.string()).required(), 
    ip: Joi.string(), 
    created_at: Joi.string(), 
    updated_at: Joi.string() 
});

// Obtener todas las mascotas con filtros
router.get('/', (req, res) => {
    const data = readData();
    let filteredData = data;

    // Filtrado por clave
    const { key, value, limit } = req.query;
    if (key && value) {
        filteredData = data.filter(m => m[key] && m[key].toString() === value);
    }

    // Limitando resultados
    if (limit) {
        const limitNum = parseInt(limit);
        filteredData = filteredData.slice(0, limitNum);
    }

    res.json(filteredData);
});

// Obtener una mascota por ID
router.get('/:mascotaId', (req, res) => {
    const mascotaId = parseInt(req.params.mascotaId);
    if (isNaN(mascotaId)) {
        return res.status(400).send('ID de mascota inválido');
    }

    const data = readData();
    const mascota = data.find(m => m.id === mascotaId);

    if (mascota) {
        res.json(mascota);
    } else {
        res.status(404).send('Mascota no encontrada');
    }
});

// Agregar una nueva mascota
router.post('/', addMetadata, (req, res) => {
    const { error } = mascotaSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const data = readData();
    const nuevaMascota = req.body;

    // Asignar un nuevo ID
    nuevaMascota.id = data.length ? data[data.length - 1].id + 1 : 1;
    data.push(nuevaMascota);
    writeData(data);
    res.status(201).json(nuevaMascota);
});

// Actualizar una mascota
router.put('/:mascotaId', addMetadata, (req, res) => {
    const mascotaId = parseInt(req.params.mascotaId);
    if (isNaN(mascotaId)) {
        return res.status(400).send('ID de mascota inválido');
    }

    const { error } = mascotaSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const data = readData();
    const index = data.findIndex(m => m.id === mascotaId);

    if (index !== -1) {
        data[index] = { ...data[index], ...req.body };
        data[index].updated_at = dayjs().format('HH:mm DD-MM-YYYY'); // Actualizar fecha
        writeData(data);
        res.json(data[index]);
    } else {
        res.status(404).send('Mascota no encontrada');
    }
});

// Eliminar una mascota
router.delete('/:mascotaId', (req, res) => {
    const mascotaId = parseInt(req.params.mascotaId);
    if (isNaN(mascotaId)) {
        return res.status(400).send('ID de mascota inválido');
    }

    const data = readData();
    const index = data.findIndex(m => m.id === mascotaId);

    if (index !== -1) {
        data.splice(index, 1);
        writeData(data);
        res.status(204).send();
    } else {
        res.status(404).send('Mascota no encontrada');
    }
});

// Método PUT para actualizar un campo de todos los registros
router.put('/', addMetadata, (req, res) => {
    const { campo, valor } = req.body; 

    if (!campo || !valor) {
        return res.status(400).send('Campo y valor son requeridos para la actualización');
    }

    const data = readData();
    data.forEach(m => {
        m[campo] = valor;
        m.updated_at = dayjs().format('HH:mm DD-MM-YYYY'); // Actualizar fecha
    });
    writeData(data);
    res.json(data);
});

export default router;