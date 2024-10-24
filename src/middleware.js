import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

const logFilePath = path.join(process.cwd(), 'access_log.txt');

export const logRequest = (req, res, next) => {
    const now = dayjs().format('DD-MM-YYYY HH:mm:ss');
    const logEntry = `${now} [${req.method}] [${req.path}] ${JSON.stringify(req.headers)}\n`;
    
    fs.appendFileSync(logFilePath, logEntry);
    next();
};

export const addMetadata = (req, res, next) => {
    const now = dayjs().format('HH:mm DD-MM-YYYY');
    req.body.ip = req.ip;
    req.body.created_at = now; // Para POST
    req.body.updated_at = now; // Para PUT
    next();
};