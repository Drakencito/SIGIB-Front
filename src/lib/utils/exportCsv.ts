import type { ItemInventario } from '../types/types'

export function exportarCSV(items: ItemInventario[], nombre = 'inventario') {
    const headers = [
        'No. Serie', 'Marca', 'Modelo', 'Categoría',
        'Departamento', 'CLUES', 'Estado', 'Descripción',
    ]

    const rows = items.map(i => [
        i.noSerie,
        i.marca,
        i.modelo,
        i.categoria,
        i.departamento,
        i.clues,
        i.estado,
        i.descripcion ?? '',
    ])

    const csv = [headers, ...rows]
        .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
        .join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${nombre}_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
}
