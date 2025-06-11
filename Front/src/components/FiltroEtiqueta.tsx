import React, { useEffect, useState, useRef } from 'react';
import '../styles/filtroEtiquetas.css';

interface Etiqueta {
    id: number;
    nombre: string;
}

interface FiltroEtiquetaProps {
    onEtiquetaSeleccionada: (etiqueta: Etiqueta | null) => void;
    etiquetaSeleccionada: Etiqueta | null;
}

export default function FiltroEtiqueta({ onEtiquetaSeleccionada, etiquetaSeleccionada }: FiltroEtiquetaProps) {
    const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [abierto, setAbierto] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/etiquetas')
            .then(res => res.json())
            .then(data => setEtiquetas(data))
            .catch(() => setEtiquetas([]));
    }, []);

    useEffect(() => {
        if (!abierto) setBusqueda('');
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setAbierto(false);
            }
        };
        if (abierto) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [abierto]);

    const etiquetasFiltradas = etiquetas.filter(e =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="filtro-etiqueta-container" ref={ref}>
            <button
                type="button"
                onClick={() => setAbierto(a => !a)}
                className={`filtro-etiqueta-boton${abierto ? ' abierto' : ''}`}
            >
                {etiquetaSeleccionada ? `Etiqueta: ${etiquetaSeleccionada.nombre}` : 'Filtrar por etiqueta'}
            </button>
            {abierto && (
                <div className="filtro-etiqueta-dropdown">
                    <input
                        type="text"
                        placeholder="Buscar etiqueta..."
                        value={busqueda}
                        autoFocus
                        onChange={e => setBusqueda(e.target.value)}
                        className="filtro-etiqueta-input"
                    />
                    <div className="filtro-etiqueta-lista">
                        <div
                            className={`filtro-etiqueta-item todas${etiquetaSeleccionada === null ? ' seleccionada' : ''}`}
                            onClick={() => {
                                onEtiquetaSeleccionada(null);
                                setAbierto(false);
                            }}
                        >
                            Todas las etiquetas
                        </div>
                        {etiquetasFiltradas.map(etiqueta => (
                            <div
                                key={etiqueta.id}
                                className={`filtro-etiqueta-item${etiquetaSeleccionada?.id === etiqueta.id ? ' seleccionada' : ''}`}
                                onClick={() => {
                                    onEtiquetaSeleccionada(etiqueta);
                                    setAbierto(false);
                                }}
                            >
                                {etiqueta.nombre}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
