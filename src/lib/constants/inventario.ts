import type { ItemInventario } from '../types/types'

export const INVENTARIO: ItemInventario[] = [
  {
    id: 1, marca: 'Dell', modelo: 'OptiPlex 3090', noSerie: 'DL3090-CHX-001', descripcion: 'PC escritorio para área administrativa', categoria: 'equipo_computo', departamento: 'Administración', estado: 'bueno', clues: 'CSIMB000035',
    noInventario: 'IMSS-00001', nombreGenerico: 'COMPUTADORA DE ESCRITORIO', clasImpr: '', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: 'Ninguna', resguardo: 'Carlos Mendoza'
  },
  {
    id: 2, marca: 'HP', modelo: 'ProBook 450 G9', noSerie: 'HP450G9-CHX-002', descripcion: 'Laptop para trabajo en campo', categoria: 'equipo_computo', departamento: 'Dirección', estado: 'bueno', clues: 'CSIMB000035',
    noInventario: 'IMSS-00002', nombreGenerico: 'LAPTOP', clasImpr: '', subrogado: 'SI', nombreEmpresa: 'HP Leasing SA', funcional: 'SI', motivoFuncionamiento: '', observaciones: '', resguardo: 'Dirección General'
  },
  {
    id: 3, marca: 'Lenovo', modelo: 'ThinkCentre M70s', noSerie: 'LNV70S-CHX-003', descripcion: 'PC escritorio recepción', categoria: 'equipo_computo', departamento: 'Enfermería', estado: 'malo', clues: 'CSIMB000303',
    noInventario: 'IMSS-00003', nombreGenerico: 'COMPUTADORA DE ESCRITORIO', clasImpr: '', subrogado: 'NO', nombreEmpresa: '', funcional: 'NO', motivoFuncionamiento: 'Disco duro dañado', observaciones: 'Requiere reparación urgente', resguardo: 'Jefe de Enfermería'
  },
  {
    id: 4, marca: 'HP', modelo: 'Pavilion 14', noSerie: 'HPPAV14-CHX-004', descripcion: 'Laptop consulta médica', categoria: 'equipo_computo', departamento: 'Medicina General', estado: 'bueno', clues: 'CSIMB000076',
    noInventario: 'IMSS-00004', nombreGenerico: 'LAPTOP', clasImpr: '', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: '', resguardo: 'Dr. Ruiz'
  },
  {
    id: 5, marca: 'Acer', modelo: 'Aspire TC-895', noSerie: 'ACRTC895-CHX-005', descripcion: 'PC escritorio laboratorio', categoria: 'equipo_computo', departamento: 'Laboratorio', estado: 'malo', clues: 'CSIMB000052',
    noInventario: 'IMSS-00005', nombreGenerico: 'COMPUTADORA DE ESCRITORIO', clasImpr: '', subrogado: 'NO', nombreEmpresa: '', funcional: 'NO', motivoFuncionamiento: 'No enciende', observaciones: 'Baja para desecho', resguardo: 'Laboratorio Central'
  },
  {
    id: 6, marca: 'Cisco', modelo: 'SG110-16', noSerie: 'CSC110-CHX-006', descripcion: 'Switch 16 puertos área administrativa', categoria: 'equipo_red', departamento: 'Soporte Técnico', estado: 'bueno', clues: 'CSIMB000035',
    noInventario: 'IMSS-00006', nombreGenerico: 'SWITCH DE RED', clasImpr: '', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: 'Instalado en rack', resguardo: 'Sistemas'
  },
  {
    id: 7, marca: 'TP-Link', modelo: 'TL-WR940N', noSerie: 'TPL940N-CHX-007', descripcion: 'Router inalámbrico sala espera', categoria: 'equipo_red', departamento: 'Soporte Técnico', estado: 'bueno', clues: 'CSIMB000303',
    noInventario: 'IMSS-00007', nombreGenerico: 'ROUTER', clasImpr: '', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: '', resguardo: 'Sistemas'
  },
  {
    id: 8, marca: 'Ubiquiti', modelo: 'UniFi AP AC Lite', noSerie: 'UBI-ACLITE-008', descripcion: 'Punto de acceso WiFi piso 2', categoria: 'equipo_red', departamento: 'Soporte Técnico', estado: 'bueno', clues: 'CSIMB000035',
    noInventario: 'IMSS-00008', nombreGenerico: 'ACCESS POINT', clasImpr: '', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: '', resguardo: 'Sistemas'
  },
  {
    id: 9, marca: 'HP', modelo: '664XL Negro', noSerie: 'NA', descripcion: 'Cartucho tinta negra alta capacidad', categoria: 'consumible', departamento: 'Administración', estado: 'bueno', clues: 'CSIMB000035',
    noInventario: 'NA', nombreGenerico: 'CARTUCHO DE TINTA', clasImpr: 'K', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: 'Consumible', resguardo: 'Almacén'
  },
  {
    id: 10, marca: 'Epson', modelo: 'T544 Cyan', noSerie: 'NA', descripcion: 'Cartucho tinta cian impresora L3210', categoria: 'consumible', departamento: 'Dirección', estado: 'bueno', clues: 'CSIMB000076',
    noInventario: 'NA', nombreGenerico: 'CARTUCHO DE TINTA', clasImpr: 'K', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: '', resguardo: 'Almacén'
  },
  {
    id: 11, marca: 'HP', modelo: 'CF283A', noSerie: 'NA', descripcion: 'Tóner LaserJet Pro M125', categoria: 'consumible', departamento: 'Administración', estado: 'bueno', clues: 'CSIMB000303',
    noInventario: 'NA', nombreGenerico: 'TONER', clasImpr: 'L', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: '', resguardo: 'Almacén'
  },
  {
    id: 12, marca: 'Brother', modelo: 'TN-1060', noSerie: 'NA', descripcion: 'Tóner impresora HL-1200', categoria: 'consumible', departamento: 'Enfermería', estado: 'malo', clues: 'CSIMB000052',
    noInventario: 'NA', nombreGenerico: 'TONER', clasImpr: 'L', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: 'Caja maltratada', resguardo: 'Almacén'
  },
  {
    id: 13, marca: 'Kingston', modelo: 'DDR4 8GB 3200MHz', noSerie: 'KNG-RAM-013', descripcion: 'Memoria RAM para actualización', categoria: 'refaccion', departamento: 'Soporte Técnico', estado: 'bueno', clues: 'CSIMB000035',
    noInventario: 'NA', nombreGenerico: 'MEMORIA RAM', clasImpr: '', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: '', resguardo: 'Sistemas'
  },
  {
    id: 14, marca: 'WD', modelo: 'Blue 1TB SSD', noSerie: 'WD1TBSSD-014', descripcion: 'Disco duro reemplazo laptop', categoria: 'refaccion', departamento: 'Soporte Técnico', estado: 'bueno', clues: 'CSIMB000204',
    noInventario: 'NA', nombreGenerico: 'DISCO DURO ESTADO SOLIDO', clasImpr: '', subrogado: 'NO', nombreEmpresa: '', funcional: 'SI', motivoFuncionamiento: '', observaciones: '', resguardo: 'Sistemas'
  }
]