import { Router, Request, Response, NextFunction } from 'express';
import {
    getEtiquetas,
    getEtiquetaById,
    createEtiqueta,
    updateEtiqueta,
    deleteEtiqueta,
} from '../controller/etiquetaController.js';

function asyncHandler(fn: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req.em, req, res)).catch(next);
    };
}

export const etiquetaRoutes = () => {
    const router = Router();
    router.get('/', asyncHandler(getEtiquetas));
    router.get('/:id', asyncHandler(getEtiquetaById));
    router.post('/', asyncHandler(createEtiqueta));
    router.put('/:id', asyncHandler(updateEtiqueta));
    router.delete('/:id', asyncHandler(deleteEtiqueta));
    return router;
};
