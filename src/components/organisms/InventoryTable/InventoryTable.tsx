import { useState, useMemo } from 'react'
import type { FC } from 'react'
import { Pencil, Trash2, PackageSearch, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { ItemInventario } from '../../../lib/types/types'
import { UNIDADES } from '../../../lib/constants/unidades'
import Badge from '../../atoms/Badge/Badge'
import IconButton from '../../atoms/IconButton/IconButton'
import Button from '../../atoms/Button/Button'
import './InventoryTable.css'

export interface InventoryTableProps {
    items: ItemInventario[]
    busqueda?: string         
    onRowClick?: (id: number) => void
    onEdit?: (id: number) => void
    onDelete?: (id: number) => void
    onClearFilters?: () => void
}

type SortKey = 'marca' | 'noSerie' | 'categoria' | 'departamento' | 'clues'
type SortDir = 'asc' | 'desc' | null

const getUnidadNombre = (clues: string) =>
    UNIDADES.find(u => u.clues === clues)?.nombre ?? clues

function Highlight({ text, query }: { text: string; query?: string }) {
    if (!query) return <>{text}</>
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return <>{text}</>
    return (
        <>
            {text.slice(0, idx)}
            <mark className="inv-highlight">{text.slice(idx, idx + query.length)}</mark>
            {text.slice(idx + query.length)}
        </>
    )
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
    if (sortKey !== col) return <ChevronsUpDown size={13} className="inv-sort-icon inv-sort-icon--idle" />
    if (sortDir === 'asc') return <ChevronUp size={13} className="inv-sort-icon inv-sort-icon--active" />
    return <ChevronDown size={13} className="inv-sort-icon inv-sort-icon--active" />
}

const InventoryTable: FC<InventoryTableProps> = ({
    items, busqueda, onRowClick, onEdit, onDelete, onClearFilters
}) => {
    const [sortKey, setSortKey] = useState<SortKey | null>(null)
    const [sortDir, setSortDir] = useState<SortDir>(null)

    const handleSort = (col: SortKey) => {
        if (sortKey !== col) { setSortKey(col); setSortDir('asc'); return }
        if (sortDir === 'asc') { setSortDir('desc'); return }
        setSortKey(null); setSortDir(null)
    }

    const sorted = useMemo(() => {
        if (!sortKey || !sortDir) return items
        return [...items].sort((a, b) => {
            const av = sortKey === 'clues' ? getUnidadNombre(a.clues) : a[sortKey]
            const bv = sortKey === 'clues' ? getUnidadNombre(b.clues) : b[sortKey]
            return sortDir === 'asc'
                ? av.localeCompare(bv, 'es')
                : bv.localeCompare(av, 'es')
        })
    }, [items, sortKey, sortDir])

    const th = (label: string, col: SortKey) => (
        <th className="inv-th-sort" onClick={() => handleSort(col)}>
            {label} <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
        </th>
    )

    if (items.length === 0) {
        return (
            <div className="inv-empty-state">
                <PackageSearch size={56} strokeWidth={1.3} className="inv-empty-icon" />
                <h3>Sin resultados</h3>
                <p>No se encontraron equipos con los filtros aplicados.</p>
                {onClearFilters && (
                    <Button variant="secondary" size="sm" onClick={onClearFilters}>
                        Limpiar filtros
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="inv-tabla-wrap">
            <div className="inv-tabla-scroll">
                <table className="inv-tabla">
                    <thead>
                        <tr>
                            {th('Marca / Modelo', 'marca')}
                            {th('No. Serie', 'noSerie')}
                            {th('Categoría', 'categoria')}
                            {th('Departamento', 'departamento')}
                            {th('Unidad médica', 'clues')}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map(item => (
                            <tr key={item.id} onClick={() => onRowClick?.(item.id)}>
                                <td data-label="Marca / Modelo">
                                    <span className="inv-marca">
                                        <Highlight text={item.marca} query={busqueda} />
                                    </span>
                                    <span className="inv-modelo">
                                        <Highlight text={item.modelo} query={busqueda} />
                                    </span>
                                </td>
                                <td data-label="No. Serie" className="inv-serie">
                                    <Highlight text={item.noSerie} query={busqueda} />
                                </td>
                                <td data-label="Categoría">
                                    <Badge>{item.categoria}</Badge>
                                </td>
                                <td data-label="Departamento">
                                    <Highlight text={item.departamento} query={busqueda} />
                                </td>
                                <td data-label="Unidad médica">
                                    <span className="inv-clues-nombre">
                                        <Highlight text={getUnidadNombre(item.clues)} query={busqueda} />
                                    </span>
                                    <span className="inv-clues-code">{item.clues}</span>
                                </td>
                                <td data-label="Acciones">
                                    <div className="inv-acciones" onClick={e => e.stopPropagation()}>
                                        <IconButton aria-label="Editar" onClick={() => onEdit?.(item.id)}>
                                            <Pencil size={18} />
                                        </IconButton>
                                        <IconButton variant="danger" aria-label="Eliminar" onClick={() => onDelete?.(item.id)}>
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default InventoryTable
