import { Monitor, Wifi, Droplets, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import type { CategoriaInventario } from "../types/types";

export const categoriaLabel: Record<CategoriaInventario, string> = {
    equipo_computo: "Equipo de cómputo",
    equipo_red: "Equipo de red",
    consumible: "Consumible",
    refaccion: "Refacción",
};

export const categoriaIcono: Record<CategoriaInventario, ReactNode> = {
    equipo_computo: <Monitor size={16} />,
    equipo_red: <Wifi size={16} />,
    consumible: <Droplets size={16} />,
    refaccion: <Wrench size={16} />,
};
