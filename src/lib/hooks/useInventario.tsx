import { useState, useMemo } from 'react'
import { INVENTARIO } from '../constants/inventario'
import type { CategoriaInventario, EstadoInventario, ItemInventario } from '../types/types'

export type ModoFormulario = 'crear' | 'editar'

export function useInventario() {
    const [items, setItems] = useState<ItemInventario[]>(INVENTARIO)
    const [busqueda, setBusquedaState] = useState(() => sessionStorage.getItem('inv_busqueda') ?? '')
    const [filtCat, setFiltCatState] = useState<CategoriaInventario | ''>(() => (sessionStorage.getItem('inv_cat') ?? '') as CategoriaInventario | '')
    const [filtEstado, setFiltEstadoState] = useState<EstadoInventario | ''>(() => (sessionStorage.getItem('inv_estado') ?? '') as EstadoInventario | '')
    const [filtClues, setFiltCluesState] = useState(() => sessionStorage.getItem('inv_clues') ?? '')
    const [itemAEliminar, setItemAEliminar] = useState<number | null>(null)
    const [abiertoFormulario, setAbiertoFormulario] = useState(false)
    const [modoFormulario, setModoFormulario] = useState<ModoFormulario>('crear')
    const [itemSeleccionado, setItemSeleccionado] = useState<number | null>(null)
    const [soloLectura, setSoloLectura] = useState(false)
    const [estadoForm, setEstadoForm] = useState<EstadoInventario | null>(null)

    const setBusqueda = (v: string) => { setBusquedaState(v); sessionStorage.setItem('inv_busqueda', v) }
    const setFiltCat = (v: CategoriaInventario | '') => { setFiltCatState(v); sessionStorage.setItem('inv_cat', v) }
    const setFiltEstado = (v: EstadoInventario | '') => { setFiltEstadoState(v); sessionStorage.setItem('inv_estado', v) }
    const setFiltClues = (v: string) => { setFiltCluesState(v); sessionStorage.setItem('inv_clues', v) }

    const datos = useMemo(() => {
        const texto = busqueda.toLowerCase()
        return items.filter(item => {
            const coincideTexto =
                !busqueda ||
                item.marca.toLowerCase().includes(texto) ||
                item.modelo.toLowerCase().includes(texto) ||
                item.noSerie.toLowerCase().includes(texto) ||
                item.descripcion.toLowerCase().includes(texto)
            const coincideCat = !filtCat || item.categoria === filtCat
            const coincideEstado = !filtEstado || item.estado === filtEstado
            const coincideClues = !filtClues || item.clues === filtClues
            return coincideTexto && coincideCat && coincideEstado && coincideClues
        })
    }, [items, busqueda, filtCat, filtEstado, filtClues])

    const itemActual = itemSeleccionado !== null
        ? items.find(i => i.id === itemSeleccionado) ?? null
        : null

    const handleStatClick = (cat: string) => {
        const nuevo = filtCat === cat ? '' : cat as CategoriaInventario | ''
        setFiltCat(nuevo)
    }

    const limpiarFiltros = () => {
        setBusqueda(''); setFiltCat(''); setFiltEstado(''); setFiltClues('')
        sessionStorage.removeItem('inv_busqueda')
        sessionStorage.removeItem('inv_cat')
        sessionStorage.removeItem('inv_estado')
        sessionStorage.removeItem('inv_clues')
    }

    const eliminar = (id: number) => setItems(prev => prev.filter(i => i.id !== id))

    const abrirCrear = () => {
        setItemSeleccionado(null)
        setModoFormulario('crear')
        setSoloLectura(false)
        setEstadoForm(null)
        setAbiertoFormulario(true)
    }

    const abrirDetalle = (id: number) => {
        setItemSeleccionado(id)
        setSoloLectura(true)
        setAbiertoFormulario(true)
    }

    const abrirEditar = (id: number) => {
        const item = items.find(i => i.id === id)
        setItemSeleccionado(id)
        setModoFormulario('editar')
        setSoloLectura(false)
        setEstadoForm(item?.estado ?? null)
        setAbiertoFormulario(true)
    }

    const cerrarFormulario = () => setAbiertoFormulario(false)

    const importarItems = (nuevos: Omit<ItemInventario, 'id'>[]) => {
        const maxId = items.reduce((m, i) => Math.max(m, i.id), 0)
        const conIds = nuevos.map((item, idx) => ({ ...item, id: maxId + idx + 1 }))
        setItems(prev => [...prev, ...conIds])
    }

    return {
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
        eliminar,
        abrirCrear, abrirDetalle, abrirEditar, cerrarFormulario,
        importarItems,
    }
}