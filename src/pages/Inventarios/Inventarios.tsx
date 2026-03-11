import { useState, useMemo } from "react";
import { Search, Plus, Monitor, Wifi, Droplets, Wrench, Group } from "lucide-react";
import type { CategoriaInventario, EstadoInventario, ItemInventario } from "../../lib/types/types";
import { INVENTARIO } from "../../lib/constants/inventario";
import { UNIDADES } from "../../lib/constants/unidades";
import { categoriaLabel } from "../../lib/constants/categoriaUI";
import { estadoLabel } from "../../components/molecules/EstadoBar/EstadoBar";
import type { EstadoClave } from "../../components/molecules/EstadoBar/EstadoBar";
import { exportarCSV } from "../../lib/utils/exportCsv";
import Input from "../../components/atoms/Input/Input";
import Select from "../../components/atoms/Select/Select";
import Button from "../../components/atoms/Button/Button";
import SummaryCard from "../../components/molecules/SummaryCard/SummaryCard";
import Modal from "../../components/organisms/Modal/Modal";
import ConfirmDeleteModal from "../../components/organisms/ConfirmDeleteModal/ConfirmDeleteModal";
import InventoryForm from "../../components/organisms/InventoryForm/InventoryForm";
import InventoryDetail from "../../components/organisms/InventoryDetail/InventoryDetail";
import InventoryTable from "../../components/organisms/InventoryTable/InventoryTable";
import "./Inventarios.css";

type ModoFormulario = "crear" | "editar";

function Inventarios() {
  // ── Items como estado ──
  const [items, setItems] = useState<ItemInventario[]>(INVENTARIO);

  // ── Filtros persistentes ──
  const [busqueda, setBusqueda] = useState(() => sessionStorage.getItem('inv_busqueda') ?? '');
  const [filtCat, setFiltCat] = useState<CategoriaInventario | "">(() => (sessionStorage.getItem('inv_cat') ?? '') as CategoriaInventario | '');
  const [filtEstado, setFiltEstado] = useState<EstadoInventario | "">(() => (sessionStorage.getItem('inv_estado') ?? '') as EstadoInventario | '');
  const [filtClues, setFiltClues] = useState(() => sessionStorage.getItem('inv_clues') ?? '');

  // ── UI state ──
  const [itemAEliminar, setItemAEliminar] = useState<number | null>(null);
  const [abiertoFormulario, setAbiertoFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<ModoFormulario>("crear");
  const [itemSeleccionado, setItemSeleccionado] = useState<number | null>(null);
  const [soloLectura, setSoloLectura] = useState(false);
  const [estadoForm, setEstadoForm] = useState<EstadoClave | null>(null);

  // ── Stats dinámicos ──
  const stats = [
    { id: "", icono: <Group size={28} />, titulo: "Total", subtitulo: `${items.length} Unidades`, cat: "" },
    { id: "equipo_computo", icono: <Monitor size={28} />, titulo: "Cómputo", subtitulo: `${items.filter(i => i.categoria === "equipo_computo").length} Equipos`, cat: "equipo_computo" },
    { id: "equipo_red", icono: <Wifi size={28} />, titulo: "Red", subtitulo: `${items.filter(i => i.categoria === "equipo_red").length} Dispositivos`, cat: "equipo_red" },
    { id: "consumible", icono: <Droplets size={28} />, titulo: "Consumibles", subtitulo: `${items.filter(i => i.categoria === "consumible").length} Piezas`, cat: "consumible" },
    { id: "refaccion", icono: <Wrench size={28} />, titulo: "Refacciones", subtitulo: `${items.filter(i => i.categoria === "refaccion").length} Piezas`, cat: "refaccion" },
  ];

  // ── Filtrado ──
  const datos = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return items.filter(item => {
      const coincideTexto =
        !busqueda ||
        item.marca.toLowerCase().includes(texto) ||
        item.modelo.toLowerCase().includes(texto) ||
        item.noSerie.toLowerCase().includes(texto) ||
        item.descripcion.toLowerCase().includes(texto);
      const coincideCat = !filtCat || item.categoria === filtCat;
      const coincideEstado = !filtEstado || item.estado === filtEstado;
      const coincideClues = !filtClues || item.clues === filtClues;
      return coincideTexto && coincideCat && coincideEstado && coincideClues;
    });
  }, [items, busqueda, filtCat, filtEstado, filtClues]);

  const itemActual = itemSeleccionado !== null
    ? items.find(i => i.id === itemSeleccionado) ?? null
    : null;

  // ── Handlers filtros ──
  const handleStatClick = (cat: string) => {
    const nuevo = filtCat === cat ? "" : cat as CategoriaInventario | "";
    setFiltCat(nuevo);
    sessionStorage.setItem('inv_cat', nuevo);
  };

  const limpiarFiltros = () => {
    setBusqueda(''); sessionStorage.removeItem('inv_busqueda');
    setFiltCat(''); sessionStorage.removeItem('inv_cat');
    setFiltEstado(''); sessionStorage.removeItem('inv_estado');
    setFiltClues(''); sessionStorage.removeItem('inv_clues');
  };

  // ── Handlers CRUD ──
  const abrirCrear = () => {
    setItemSeleccionado(null);
    setModoFormulario("crear");
    setSoloLectura(false);
    setEstadoForm(null);
    setAbiertoFormulario(true);
  };

  const abrirDetalle = (id: number) => {
    setItemSeleccionado(id);
    setSoloLectura(true);
    setAbiertoFormulario(true);
  };

  const abrirEditar = (id: number) => {
    const item = items.find(i => i.id === id);
    setItemSeleccionado(id);
    setModoFormulario("editar");
    setSoloLectura(false);
    setEstadoForm(item ? (item.estado as EstadoClave) : null);
    setAbiertoFormulario(true);
  };

  const cerrarFormulario = () => setAbiertoFormulario(false);

  return (
    <div className="inv-page">

      <div className="inv-header">
        <div>
          <h1>Gestión de Inventarios</h1>
          <p>Administra los equipos e insumos de las unidades médicas</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" size="md" onClick={() => exportarCSV(datos)}>
            Exportar CSV
          </Button>
          <Button variant="primary" size="md" onClick={abrirCrear}>
            <Plus size={18} /> Agregar equipo
          </Button>
        </div>
      </div>

      {/* Stats clicables */}
      <div className="inv-stats">
        {stats.map(card => (
          <SummaryCard
            key={card.id}
            icono={card.icono}
            titulo={card.titulo}
            subtitulo={card.subtitulo}
            activo={filtCat === card.cat}
            onClick={() => handleStatClick(card.cat)}
          />
        ))}
      </div>

      {/* Filtros */}
      <div className="inv-filtros">
        <div className="inv-search">
          <Search size={16} className="inv-search-icon" />
          <Input
            placeholder="Buscar por marca, modelo, serie..."
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); sessionStorage.setItem('inv_busqueda', e.target.value) }}
          />
        </div>

        <Select
          value={filtCat}
          onChange={e => { setFiltCat(e.target.value as CategoriaInventario | ""); sessionStorage.setItem('inv_cat', e.target.value) }}
        >
          <option value="">Todas las categorías</option>
          {Object.entries(categoriaLabel).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>

        <Select
          value={filtEstado}
          onChange={e => { setFiltEstado(e.target.value as EstadoInventario | ""); sessionStorage.setItem('inv_estado', e.target.value) }}
        >
          <option value="">Todos los estados</option>
          {Object.entries(estadoLabel).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>

        <Select
          value={filtClues}
          onChange={e => { setFiltClues(e.target.value); sessionStorage.setItem('inv_clues', e.target.value) }}
        >
          <option value="">Todas las unidades</option>
          {UNIDADES.filter(u => u.estatus === "activa").map(u => (
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

      {itemAEliminar !== null && (
        <Modal onClose={() => setItemAEliminar(null)}>
          <ConfirmDeleteModal
            onCancel={() => setItemAEliminar(null)}
            onConfirm={() => {
              setItems(prev => prev.filter(i => i.id !== itemAEliminar));
              setItemAEliminar(null);
            }}
          />
        </Modal>
      )}

      {abiertoFormulario && (
        <Modal onClose={cerrarFormulario}>
          {soloLectura && itemActual
            ? <InventoryDetail item={itemActual} onClose={cerrarFormulario} />
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


    </div>
  );
}

export default Inventarios;
