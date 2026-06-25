import { useState } from 'react'
import { Search, Plus, Monitor, Wifi, Droplets, Wrench, Group, FileUp } from 'lucide-react'
import type { CategoriaInventario, EstadoInventario, ItemInventario } from '../../lib/types/types'
import { UNIDADES } from '../../lib/constants/unidades'
import { exportarCSV } from '../../lib/utils/exportCsv'
import { useInventario } from '../../lib/hooks/useInventario'
import Input from '../../components/atoms/Input/Input'
import Select from '../../components/atoms/Select/Select'
import Button from '../../components/atoms/Button/Button'
import SummaryCard from '../../components/molecules/SummaryCard/SummaryCard'
import Modal from '../../components/organisms/Modal/Modal'
import ConfirmDeleteModal from '../../components/organisms/ConfirmDeleteModal/ConfirmDeleteModal'
import InventoryForm from '../../components/organisms/InventoryForm/InventoryForm'
import InventoryDetail from '../../components/organisms/InventoryDetail/InventoryDetail'
import InventoryTable from '../../components/organisms/InventoryTable/InventoryTable'
import ImportExcelModal from '../../components/organisms/ImportExcelModal/ImportExcelModal'
import './Inventarios.css'

function Inventarios() {
    const {
        items, datos, itemActual,
        busqueda, setBusqueda,
        filtCat, setFiltCat,
        filtEstado, setFiltEstado,
        filtClues, setFiltClues,
        handleStatClick, limpiarFiltros,
        itemAEliminar, setItemAEliminar,
        abiertoFormulario,
        modoFormulario,
        soloLectura,
        estadoForm, setEstadoForm,
        abrirCrear, abrirDetalle, abrirEditar, cerrarFormulario,
        importarItems,
    } = useInventario()

    const [abiertaImportacion, setAbiertaImportacion] = useState(false)

    const stats = [
        {
            id: '',
            icono: <Group size={28} />,
            titulo: 'Total',
            subtitulo: `${items.length} Unidades`,
            numero: items.length,
            cat: '' as CategoriaInventario | '',
        },
        {
            id: 'equipocomputo',
            icono: <Monitor size={28} />,
            titulo: 'Cómputo',
            subtitulo: `${items.filter(i => i.categoria === 'equipocomputo').length} Equipos`,
            numero: items.filter(i => i.categoria === 'equipocomputo').length,
            cat: 'equipocomputo' as CategoriaInventario,
        },
        {
            id: 'equipored',
            icono: <Wifi size={28} />,
            titulo: 'Red',
            subtitulo: `${items.filter(i => i.categoria === 'equipored').length} Dispositivos`,
            numero: items.filter(i => i.categoria === 'equipored').length,
            cat: 'equipored' as CategoriaInventario,
        },
        {
            id: 'consumible',
            icono: <Droplets size={28} />,
            titulo: 'Consumibles',
            subtitulo: `${items.filter(i => i.categoria === 'consumible').length} Piezas`,
            numero: items.filter(i => i.categoria === 'consumible').length,
            cat: 'consumible' as CategoriaInventario,
        },
        {
            id: 'refaccion',
            icono: <Wrench size={28} />,
            titulo: 'Refacciones',
            subtitulo: `${items.filter(i => i.categoria === 'refaccion').length} Piezas`,
            numero: items.filter(i => i.categoria === 'refaccion').length,
            cat: 'refaccion' as CategoriaInventario,
        },
    ]

    const handleImport = (nuevos: Omit<ItemInventario, 'id'>[]) => {
        importarItems(nuevos)
        setAbiertaImportacion(false)
    }

    return (
        <div className="inv-page">

            <div className="inv-header">
                <div>
                    <h1>Gestión de Inventarios</h1>
                    <p>Administra los equipos e insumos de las unidades médicas</p>
                </div>
                <div className="inv-header-actions">
                    <Button variant="secondary" size="md" onClick={() => exportarCSV(datos)}>
                        Exportar CSV
                    </Button>
                    <Button variant="secondary" size="md" onClick={() => setAbiertaImportacion(true)}>
                        <FileUp size={17} /> Importar Excel
                    </Button>
                    <Button variant="primary" size="md" onClick={abrirCrear}>
                        <Plus size={18} /> Agregar equipo
                    </Button>
                </div>
            </div>

            <div className="inv-stats">
                {stats.map(card => (
                    <SummaryCard
                        key={card.id}
                        icono={card.icono}
                        titulo={card.titulo}
                        subtitulo={card.subtitulo}
                        numero={card.numero}
                        activo={filtCat === card.cat}
                        onClick={() => handleStatClick(card.cat as CategoriaInventario | '')}
                    />
                ))}
            </div>

            <div className="inv-filtros">
                <div className="inv-search">
                    <Search size={16} className="inv-search-icon" />
                    <Input
                        placeholder="Buscar por marca, modelo, serie..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>
                <Select
                    value={filtCat}
                    onChange={e => setFiltCat(e.target.value as CategoriaInventario | '')}
                >
                    <option value="">Todas las categorías</option>
                    <option value="equipocomputo">Equipo de Cómputo</option>
                    <option value="equipored">Equipo de Red</option>
                    <option value="consumible">Consumible</option>
                    <option value="refaccion">Refacción</option>
                </Select>
                <Select
                    value={filtEstado}
                    onChange={e => setFiltEstado(e.target.value as EstadoInventario | '')}
                >
                    <option value="">Todos los estados</option>
                    <option value="F">Funcional</option>
                    <option value="B">Bueno</option>
                    <option value="R">Regular</option>
                    <option value="M">Malo</option>
                </Select>
                <Select
                    value={filtClues}
                    onChange={e => setFiltClues(e.target.value)}
                >
                    <option value="">Todas las unidades</option>
                    {UNIDADES.filter(u => u.estatus === 'activa').map(u => (
                        <option key={u.clues} value={u.clues}>{u.nombre}</option>
                    ))}
                </Select>
            </div>

            <InventoryTable
                items={datos}
                busqueda={busqueda}
                onRowClick={abrirDetalle}
                onEdit={abrirEditar}
                onDelete={setItemAEliminar}
                onClearFilters={limpiarFiltros}
            />
            <p className="inv-count">{datos.length} de {items.length} registros</p>

            {/* ── Modal: Confirmar eliminación ── */}
            {itemAEliminar !== null && (
                <Modal onClose={() => setItemAEliminar(null)}>
                    <ConfirmDeleteModal
                        onCancel={() => setItemAEliminar(null)}
                        onConfirm={() => setItemAEliminar(null)}
                    />
                </Modal>
            )}

            {/* ── Modal: Formulario / Detalle ── */}
            {abiertoFormulario && (
                <Modal onClose={cerrarFormulario}>
                    {soloLectura
                        ? <InventoryDetail item={itemActual!} onClose={cerrarFormulario} />
                        : <InventoryForm
                            modo={modoFormulario}
                            itemActual={itemActual}
                            estadoForm={estadoForm}
                            onEstadoChange={setEstadoForm}
                            onCancel={cerrarFormulario}
                            onSubmit={cerrarFormulario}
                        />
                    }
                </Modal>
            )}

            {/* ── Modal: Importar Excel ── */}
            {abiertaImportacion && (
                <Modal onClose={() => setAbiertaImportacion(false)}>
                    <ImportExcelModal
                        onCancel={() => setAbiertaImportacion(false)}
                        onImport={handleImport}
                    />
                </Modal>
            )}

        </div>
    )
}

export default Inventarios