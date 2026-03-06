import type { FC } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { ItemInventario } from "../../../lib/types/types";
import { UNIDADES } from "../../../lib/constants/unidades";
import Badge from "../../atoms/Badge/Badge";
import IconButton from "../../atoms/IconButton/IconButton";
import "./InventoryTable.css";

export interface InventoryTableProps {
  items: ItemInventario[];
  onRowClick?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const InventoryTable: FC<InventoryTableProps> = ({
  items,
  onRowClick,
  onEdit,
  onDelete,
}) => {
  const getUnidadNombre = (clues: string) =>
    UNIDADES.find((u) => u.clues === clues)?.nombre ?? clues;

  return (
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
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="inv-empty">
                  Sin resultados para los filtros aplicados
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} onClick={() => onRowClick?.(item.id)}>
                  <td>
                    <span className="inv-marca">{item.marca}</span>
                    <span className="inv-modelo">{item.modelo}</span>
                  </td>
                  <td className="inv-serie">{item.noSerie}</td>
                  <td>
                    <Badge>{item.categoria}</Badge>
                  </td>
                  <td>{item.departamento}</td>
                  <td>
                    <span className="inv-clues-nombre">
                      {getUnidadNombre(item.clues)}
                    </span>
                    <span className="inv-clues-code">{item.clues}</span>
                  </td>
                  <td>
                    <div
                      className="inv-acciones"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onEdit && (
                        <IconButton
                          aria-label="Editar"
                          onClick={() => onEdit(item.id)}
                        >
                          <Pencil size={18} />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          variant="danger"
                          aria-label="Eliminar"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
