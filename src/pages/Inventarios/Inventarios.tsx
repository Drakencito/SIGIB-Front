import { useState, useMemo } from "react";
import { Search, Plus, Monitor, Wifi, Droplets, Wrench, Pencil, Trash2 } from "lucide-react";
import { INVENTARIO } from "../../lib/constants/inventario";
import { UNIDADES } from "../../lib/constants/unidades";
import type { CategoriaInventario, EstadoInventario } from "../../lib/types/types";
import { categoriaLabel, categoriaIcono } from "../../lib/constants/categoriaUI";
import { estadoLabel } from "../../components/molecules/EstadoBar/EstadoBar";
import type { EstadoClave } from "../../components/molecules/EstadoBar/EstadoBar";
import Input from "../../components/atoms/Input/Input";
import Select from "../../components/atoms/Select/Select";
import Button from "../../components/atoms/Button/Button";
import SummaryCard from "../../components/molecules/SummaryCard/SummaryCard";
import Modal from "../../components/organisms/Modal/Modal";
import ConfirmDeleteModal from "../../components/organisms/ConfirmDeleteModal/ConfirmDeleteModal";
import InventoryForm from "../../components/organisms/InventoryForm/InventoryForm";
import InventoryDetail from "../../components/organisms/InventoryDetail/InventoryDetail";
import "./Inventarios.css";

type ModoFormulario = "crear" | "editar";

const stats = [
  { id: "total", icono: <Monitor size={28} />, titulo: "Total", subtitulo: `${INVENTARIO.length} Unidades` },
  { id: "computo", icono: <Monitor size={28} />, titulo: "Cómputo", subtitulo: `${INVENTARIO.filter(i => i.categoria === "equipo_computo").length} Equipos` },
  { id: "red", icono: <Wifi size={28} />, titulo: "Red", subtitulo: `${INVENTARIO.filter(i => i.categoria === "equipo_red").length} Dispositivos` },
  { id: "consumibles", icono: <Droplets size={28} />, titulo: "Consumibles", subtitulo: `${INVENTARIO.filter(i => i.categoria === "consumible").length} Piezas` },
  { id: "refacciones", icono: <Wrench size={28} />, titulo: "Refacciones", subtitulo: `${INVENTARIO.filter(i => i.categoria === "refaccion").length} Piezas` },
];

function Inventarios() {
  const [busqueda, setBusqueda] = useState("");
  const [filtCat, setFiltCat] = useState<CategoriaInventario | "">("");
  const [filtEstado, setFiltEstado] = useState<EstadoInventario | "">("");
  const [filtClues, setFiltClues] = useState("");

  const [itemAEliminar, setItemAEliminar] = useState<number | null>(null);
  const [abiertoFormulario, setAbiertoFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<ModoFormulario>("crear");
  const [itemSeleccionado, setItemSeleccionado] = useState<number | null>(null);
  const [soloLectura, setSoloLectura] = useState(false);
  const [estadoForm, setEstadoForm] = useState<EstadoClave | null>(null);

  const datos = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return INVENTARIO.filter(item => {
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
  }, [busqueda, filtCat, filtEstado, filtClues]);

  const itemActual = itemSeleccionado !== null
    ? INVENTARIO.find(i => i.id === itemSeleccionado) ?? null
    : null;

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
    const item = INVENTARIO.find(i => i.id === id);
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
        <Button variant="primary" size="md" onClick={abrirCrear}>
          <Plus size={18} /> Agregar equipo
        </Button>
      </div>

      <div className="inv-stats">
        {stats.map(card => (
          <SummaryCard
            key={card.id}
            icono={card.icono}
            titulo={card.titulo}
            subtitulo={card.subtitulo}
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
          onChange={e => setFiltCat(e.target.value as CategoriaInventario | "")}
        >
          <option value="">Todas las categorías</option>
          {Object.entries(categoriaLabel).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>

        <Select
          value={filtEstado}
          onChange={e => setFiltEstado(e.target.value as EstadoInventario | "")}
        >
          <option value="">Todos los estados</option>
          {Object.entries(estadoLabel).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>

        <Select
          value={filtClues}
          onChange={e => setFiltClues(e.target.value)}
        >
          <option value="">Todas las unidades</option>
          {UNIDADES.filter(u => u.estatus === "activa").map(u => (
            <option key={u.clues} value={u.clues}>{u.nombre}</option>
          ))}
        </Select>
      </div>

      <div className="inv-tabla-wrap">
        <div className="inv-tabla-scroll">
          <table className="inv-tabla">
            <thead>
              <tr>
                <th>Marca / Modelo</th>
                <th>No. Serie</th>
                <th>Categoría</th>
                <th>Departamento</th>
                <th>Unidad médica</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="inv-empty">
                    Sin resultados para los filtros aplicados
                  </td>
                </tr>
              ) : (
                datos.map(item => {
                  const unidad = UNIDADES.find(u => u.clues === item.clues);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => abrirDetalle(item.id)}
                    >
                      <td>
                        <span className="inv-marca">{item.marca}</span>
                        <span className="inv-modelo">{item.modelo}</span>
                      </td>
                      <td className="inv-serie">{item.noSerie}</td>
                      <td>
                        <span className="inv-badge-cat">
                          {categoriaIcono[item.categoria]}
                          {categoriaLabel[item.categoria]}
                        </span>
                      </td>
                      <td>{item.departamento}</td>
                      <td>
                        <span className="inv-clues-nombre">{unidad?.nombre ?? item.clues}</span>
                        <span className="inv-clues-code">{item.clues}</span>
                      </td>
                      <td>
                        <div
                          className="inv-acciones"
                          onClick={e => e.stopPropagation()}
                        >
                          <Button
                            variant="icon-green"
                            aria-label="Editar"
                            onClick={() => abrirEditar(item.id)}
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button
                            variant="icon-red"
                            aria-label="Eliminar"
                            onClick={() => setItemAEliminar(item.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="inv-count">{datos.length} de {INVENTARIO.length} registros</p>

      {itemAEliminar !== null && (
        <Modal onBackdropClick={() => setItemAEliminar(null)}>
          <ConfirmDeleteModal
            onCancel={() => setItemAEliminar(null)}
            onConfirm={() => setItemAEliminar(null)}
          />
        </Modal>
      )}

      {abiertoFormulario && (
        <Modal onBackdropClick={cerrarFormulario}>
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
