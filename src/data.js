import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data.json'); 

const readData = () => {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : []; 
};

const writeData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export { readData, writeData };