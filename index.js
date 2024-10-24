import express from 'express';
import bodyParser from 'body-parser';
import mascotasRoutes from './routes/mascotas.js';
import { logRequest } from './src/middleware.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(logRequest); // Middleware 
app.use('/mascotas', mascotasRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});