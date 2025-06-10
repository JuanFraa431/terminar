import { Request, Response } from 'express';
import { Etiqueta } from '../entities/etiqueta.js';

export const getEtiquetas = async (em: any, req: Request, res: Response) => {
    try {
        const etiquetas = await em.find(Etiqueta, {});
        res.json(etiquetas);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener etiquetas' });
    }
};

export const getEtiquetaById = async (em: any, req: Request, res: Response) => {
    try {
        const etiqueta = await em.findOne(Etiqueta, { id: Number(req.params.id) });
        if (!etiqueta) return res.status(404).json({ error: 'Etiqueta no encontrada' });
        res.json(etiqueta);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener etiqueta' });
    }
};

export const createEtiqueta = async (em: any, req: Request, res: Response) => {
    try {
        const { nombre } = req.body;
        let etiqueta = await em.findOne(Etiqueta, { nombre });
        if (etiqueta) return res.status(400).json({ error: 'Etiqueta ya existe' });
        etiqueta = new Etiqueta();
        etiqueta.nombre = nombre;
        await em.persistAndFlush(etiqueta);
        res.status(201).json(etiqueta);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear etiqueta' });
    }
};

export const updateEtiqueta = async (em: any, req: Request, res: Response) => {
    try {
        const etiqueta = await em.findOne(Etiqueta, { id: Number(req.params.id) });
        if (!etiqueta) return res.status(404).json({ error: 'Etiqueta no encontrada' });
        const { nombre } = req.body;
        if (nombre !== undefined) etiqueta.nombre = nombre;
        await em.persistAndFlush(etiqueta);
        res.json(etiqueta);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar etiqueta' });
    }
};

export const deleteEtiqueta = async (em: any, req: Request, res: Response) => {
    try {
        const etiqueta = await em.findOne(Etiqueta, { id: Number(req.params.id) });
        if (!etiqueta) return res.status(404).json({ error: 'Etiqueta no encontrada' });
        await em.removeAndFlush(etiqueta);
        res.json({ message: 'Etiqueta eliminada' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar etiqueta' });
    }
};
