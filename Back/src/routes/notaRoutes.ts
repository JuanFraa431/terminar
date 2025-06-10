import { Router, Request, Response, NextFunction } from 'express';
import {
    getNotas,
    getNotaById,
    createNota,
    updateNota,
    deleteNota,
} from '../controller/notaController.js';

function asyncHandler(fn: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req.em, req, res)).catch(next);
    };
}

export const notaRoutes = () => {
    const router = Router();
    router.get('/', asyncHandler(getNotas));
    router.get('/:id', asyncHandler(getNotaById));
    router.post('/', asyncHandler(createNota));
    router.put('/:id', asyncHandler(updateNota));
    router.delete('/:id', asyncHandler(deleteNota));
    return router;
};
