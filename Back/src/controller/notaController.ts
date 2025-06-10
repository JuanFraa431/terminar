import { Request, Response } from 'express';
import { Nota } from '../entities/nota.js';
import { Etiqueta } from '../entities/etiqueta.js';

export const getNotas = async (em: any, req: Request, res: Response) => {
    try {
        const notas = await em.find(Nota, {}, { populate: ['etiquetas'] });
        res.json(notas);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener notas' });
    }
};

export const getNotaById = async (em: any, req: Request, res: Response) => {
    try {
        const nota = await em.findOne(Nota, { id: Number(req.params.id) }, { populate: ['etiquetas'] });
        if (!nota) return res.status(404).json({ error: 'Nota no encontrada' });
        res.json(nota);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener nota' });
    }
};

export const createNota = async (em: any, req: Request, res: Response) => {
    try {
        const { titulo, contenido, archivada = false, etiquetas = [] } = req.body;
        const nota = new Nota();
        nota.titulo = titulo;
        nota.contenido = contenido;
        nota.archivada = archivada;
        for (const nombre of etiquetas) {
            let etiqueta = await em.findOne(Etiqueta, { nombre });
            if (!etiqueta) {
                etiqueta = new Etiqueta();
                etiqueta.nombre = nombre;
                await em.persist(etiqueta);
            }
            nota.etiquetas.add(etiqueta);
        }
        await em.persistAndFlush(nota);
        res.status(201).json(nota);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear nota' });
    }
};

export const updateNota = async (em: any, req: Request, res: Response) => {
    try {
        const nota = await em.findOne(Nota, { id: Number(req.params.id) }, { populate: ['etiquetas'] });
        if (!nota) return res.status(404).json({ error: 'Nota no encontrada' });
        const { titulo, contenido, archivada, etiquetas } = req.body;
        if (titulo !== undefined) nota.titulo = titulo;
        if (contenido !== undefined) nota.contenido = contenido;
        if (archivada !== undefined) nota.archivada = archivada;
        if (etiquetas) {
            nota.etiquetas.removeAll();
            for (const nombre of etiquetas) {
                let etiqueta = await em.findOne(Etiqueta, { nombre });
                if (!etiqueta) {
                    etiqueta = new Etiqueta();
                    etiqueta.nombre = nombre;
                    await em.persist(etiqueta);
                }
                nota.etiquetas.add(etiqueta);
            }
        }
        await em.persistAndFlush(nota);
        res.json(nota);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar nota' });
    }
};

export const deleteNota = async (em: any, req: Request, res: Response) => {
    try {
        const nota = await em.findOne(Nota, { id: Number(req.params.id) });
        if (!nota) return res.status(404).json({ error: 'Nota no encontrada' });
        await em.removeAndFlush(nota);
        res.json({ message: 'Nota eliminada' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar nota' });
    }
};
