import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Masonry from 'react-masonry-css';
import FiltroEtiqueta from './FiltroEtiqueta';

interface Etiqueta {
    id: number;
    nombre: string;
}

interface Nota {
    id: number;
    titulo: string;
    contenido: string;
    etiquetas: Etiqueta[];
    archivada?: boolean;
}

const MySwal = withReactContent(Swal);

export default function Home() {
    const [notas, setNotas] = useState<Nota[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarArchivadas, setMostrarArchivadas] = useState(false);
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState<Etiqueta | null>(null);

    useEffect(() => {
        fetch('/api/notas')
            .then(res => {
                if (!res.ok) throw new Error('Error al obtener notas');
                return res.json();
            })
            .then(data => {
                setNotas(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleCrearNota = async () => {
        const { value: formValues } = await MySwal.fire({
            title: 'Crear nueva nota',
            html:
                `
                    <div style="width:600px;">
                        <label for="swal-input-titulo" style="font-weight:600;">Título</label>
                        <input id="swal-input-titulo" class="swal2-input" placeholder="Título" style="width:100%;margin-top:0.3em;">
                    </div>
                    <div>
                        <label for="swal-input-contenido" style="font-weight:600;">Contenido</label>
                        <textarea id="swal-input-contenido" class="swal2-textarea" placeholder="Contenido" style="width:100%;margin-top:0.3em;height:120px;resize:vertical;"></textarea>
                    </div>
                    <div>
                        <label for="swal-input-etiquetas" style="font-weight:600;">Etiquetas (separadas por coma)</label>
                        <input id="swal-input-etiquetas" class="swal2-input" placeholder="Ej: trabajo, personal" style="width:100%;margin-top:0.3em;">
                    </div>
                    <div style="margin-top:0.5em;">
                        <input type="checkbox" id="swal-input-archivada" style="margin-right:0.5em;">
                        <label for="swal-input-archivada">Archivada</label>
                    </div>
                `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Crear',
            customClass: {
                popup: 'swal2-popup-custom',
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom',
            },
            preConfirm: () => {
                const titulo = (document.getElementById('swal-input-titulo') as HTMLInputElement)?.value;
                const contenido = (document.getElementById('swal-input-contenido') as HTMLTextAreaElement)?.value;
                const etiquetas = (document.getElementById('swal-input-etiquetas') as HTMLInputElement)?.value;
                const archivada = (document.getElementById('swal-input-archivada') as HTMLInputElement)?.checked;
                if (!titulo || !contenido) {
                    Swal.showValidationMessage('Título y contenido son obligatorios');
                    return;
                }
                return {
                    titulo,
                    contenido,
                    etiquetas: etiquetas ? etiquetas.split(',').map(e => e.trim()).filter(e => e.length > 0) : [],
                    archivada
                };
            }
        });
        if (formValues) {
            try {
                const res = await fetch('/api/notas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formValues)
                });
                if (!res.ok) throw new Error('Error al crear nota');
                const nuevaNota = await res.json();
                setNotas(prev => [...prev, nuevaNota]);
                Swal.fire('¡Nota creada!', '', 'success');
            } catch (err) {
                Swal.fire('Error', 'No se pudo crear la nota', 'error');
            }
        }
    };

    const handleEditarNota = async (nota: Nota) => {
        const etiquetasString = nota.etiquetas.map(e => e.nombre).join(', ');
        const { value: formValues } = await MySwal.fire({
            title: 'Editar nota',
            html:
                `<div style="display:flex;flex-direction:column;gap:1rem;text-align:left;min-width:450px;max-width:600px;width:100%;">
                    <div>
                        <label for="swal-input-titulo" style="font-weight:600;">Título</label>
                        <input id="swal-input-titulo" class="swal2-input" placeholder="Título" value="${nota.titulo}" style="width:100%;margin-top:0.3em;">
                    </div>
                    <div>
                        <label for="swal-input-contenido" style="font-weight:600;">Contenido</label>
                        <textarea id="swal-input-contenido" class="swal2-textarea" placeholder="Contenido" style="width:100%;margin-top:0.3em;height:120px;resize:vertical;">${nota.contenido}</textarea>
                    </div>
                    <div>
                        <label for="swal-input-etiquetas" style="font-weight:600;">Etiquetas (separadas por coma)</label>
                        <input id="swal-input-etiquetas" class="swal2-input" placeholder="Ej: trabajo, personal" value="${etiquetasString}" style="width:100%;margin-top:0.3em;">
                    </div>
                    <div style="margin-top:0.5em;">
                        <input type="checkbox" id="swal-input-archivada" ${nota.archivada ? 'checked' : ''} style="margin-right:0.5em;">
                        <label for="swal-input-archivada">Archivada</label>
                    </div>
                </div>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            customClass: {
                popup: 'swal2-popup-custom',
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom',
            },
            preConfirm: () => {
                const titulo = (document.getElementById('swal-input-titulo') as HTMLInputElement)?.value;
                const contenido = (document.getElementById('swal-input-contenido') as HTMLTextAreaElement)?.value;
                const etiquetas = (document.getElementById('swal-input-etiquetas') as HTMLInputElement)?.value;
                const archivada = (document.getElementById('swal-input-archivada') as HTMLInputElement)?.checked;
                if (!titulo || !contenido) {
                    Swal.showValidationMessage('Título y contenido son obligatorios');
                    return;
                }
                return {
                    titulo,
                    contenido,
                    etiquetas: etiquetas ? etiquetas.split(',').map(e => e.trim()).filter(e => e.length > 0) : [],
                    archivada
                };
            }
        });
        if (formValues) {
            try {
                const res = await fetch(`/api/notas/${nota.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formValues)
                });
                if (!res.ok) throw new Error('Error al editar nota');
                const notaEditada = await res.json();
                setNotas(prev => prev.map(n => n.id === nota.id ? notaEditada : n));
                Swal.fire('¡Nota actualizada!', '', 'success');
            } catch (err) {
                Swal.fire('Error', 'No se pudo editar la nota', 'error');
            }
        }
    };

    const handleEliminarNota = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Eliminar nota?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom',
            },
        });
        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/notas/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Error al eliminar nota');
                setNotas(prev => prev.filter(n => n.id !== id));
                Swal.fire('Eliminada', 'La nota fue eliminada.', 'success');
            } catch {
                Swal.fire('Error', 'No se pudo eliminar la nota', 'error');
            }
        }
    };

    const notasFiltradas = (mostrarArchivadas
        ? notas.filter(n => n.archivada)
        : notas.filter(n => !n.archivada)
    ).filter(nota =>
        !etiquetaSeleccionada
            ? true
            : nota.etiquetas.some(e => e.id === etiquetaSeleccionada.id)
    );

    const breakpointColumnsObj = {
        default: 4,
        1400: 4,
        1200: 3,
        900: 2,
        600: 1
    };

    if (loading) return <div className="home-container"><p>Cargando notas...</p></div>;
    if (error) return <div className="home-container"><p>Error: {error}</p></div>;

    return (
        <div className="home-container">
            <header className="home-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <h1>📓 Mis Notas</h1>
                        <p>Organizá tus pensamientos y tareas.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <FiltroEtiqueta
                            onEtiquetaSeleccionada={setEtiquetaSeleccionada}
                            etiquetaSeleccionada={etiquetaSeleccionada}
                        />
                        <button className="crear-nota-btn" onClick={handleCrearNota}>+ Crear Nota</button>
                        <button
                            style={{
                                padding: '0.7rem 1.2rem',
                                background: mostrarArchivadas ? '#6c757d' : '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                                transition: 'background 0.3s',
                            }}
                            onClick={() => setMostrarArchivadas(a => !a)}
                        >
                            {mostrarArchivadas ? 'Ver activas' : 'Ver archivadas'}
                        </button>
                    </div>
                </div>
            </header>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="notes-masonry-grid"
                columnClassName="notes-masonry-grid_column"
            >
                {notasFiltradas.map((note) => (
                    <div key={note.id} className="note-card">
                        <button className="editar-nota-btn" onClick={() => handleEditarNota(note)} title="Editar nota">
                            ✏️
                        </button>
                        {note.archivada && (
                            <div className="archivada-badge">Archivada</div>
                        )}
                        <h2>{note.titulo}</h2>
                        <p>{note.contenido}</p>
                        <div className="note-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="etiquetas-list">
                                {note.etiquetas && note.etiquetas.length > 0 ? (
                                    note.etiquetas.map(etiqueta => (
                                        <span key={etiqueta.id} className="etiqueta-chip">{etiqueta.nombre}</span>
                                    ))
                                ) : (
                                    <span className="etiqueta-chip etiqueta-vacia">Sin etiquetas</span>
                                )}
                            </div>
                            <button className="eliminar-nota-btn" title="Eliminar nota" onClick={() => handleEliminarNota(note.id)}>
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </Masonry>
        </div>
    );
}
