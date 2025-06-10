import React, { useEffect, useState, useRef } from 'react';

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
        <div style={{ position: 'relative', display: 'inline-block' }} ref={ref}>
            <button
                type="button"
                onClick={() => setAbierto(a => !a)}
                style={{
                    padding: '0.5em 1.2em',
                    borderRadius: 8,
                    border: '1px solid #007bff',
                    background: '#fff',
                    color: '#007bff',
                    fontWeight: 'bold',
                    fontSize: '1em',
                    cursor: 'pointer',
                    boxShadow: abierto ? '0 2px 8px rgba(0,0,0,0.10)' : 'none',
                    transition: 'box-shadow 0.2s'
                }}
            >
                {etiquetaSeleccionada ? `Etiqueta: ${etiquetaSeleccionada.nombre}` : 'Filtrar por etiqueta'}
            </button>
            {abierto && (
                <div
                    style={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        zIndex: 20,
                        minWidth: 220,
                        background: '#fff',
                        border: '1px solid #eee',
                        borderRadius: 10,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
                        padding: 12,
                        marginTop: 4
                    }}
                >
                    <input
                        type="text"
                        placeholder="Buscar etiqueta..."
                        value={busqueda}
                        autoFocus
                        onChange={e => setBusqueda(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.4em 0.7em',
                            borderRadius: 8,
                            border: '1px solid #ccc',
                            marginBottom: 8,
                            fontSize: '1em'
                        }}
                    />
                    <div style={{ maxHeight: 160, overflowY: 'auto' }}>
                        <div
                            style={{
                                padding: '0.3em 0.7em',
                                cursor: 'pointer',
                                background: etiquetaSeleccionada === null ? '#e9ecef' : 'transparent',
                                borderRadius: 6,
                                marginBottom: 2,
                                fontWeight: etiquetaSeleccionada === null ? 'bold' : 'normal'
                            }}
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
                                style={{
                                    padding: '0.3em 0.7em',
                                    cursor: 'pointer',
                                    background: etiquetaSeleccionada?.id === etiqueta.id ? '#007bff22' : 'transparent',
                                    borderRadius: 6,
                                    marginBottom: 2,
                                    fontWeight: etiquetaSeleccionada?.id === etiqueta.id ? 'bold' : 'normal'
                                }}
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
