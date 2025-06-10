import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initORM } from './db/index.js';
import { notaRoutes } from './routes/notaRoutes.js';
import { etiquetaRoutes } from './routes/etiquetaRoutes.js';
import type { EntityManager } from '@mikro-orm/core';

declare global {
    namespace Express {
        interface Request {
            em: EntityManager;
        }
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
    const orm = await initORM();
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use((req, res, next) => {
        req.em = orm.em.fork();
        next();
    });

    app.use('/api/notas', notaRoutes());
    app.use('/api/etiquetas', etiquetaRoutes());
    app.use(express.static(path.join(__dirname, 'dist')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
})();
