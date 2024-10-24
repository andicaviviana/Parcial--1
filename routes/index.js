import express from 'express';
import mascotasRouter from './mascotas.js';

const router = express.Router();

router.use('/mascotas', mascotasRouter);


export default router;