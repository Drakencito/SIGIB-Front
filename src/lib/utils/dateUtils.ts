export function fechaRelativa(fechaISO: string): string {
    const fecha = new Date(fechaISO)
    const ahora = new Date()
    const diffMs = ahora.getTime() - fecha.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffH = Math.floor(diffMin / 60)
    const diffD = Math.floor(diffH / 24)

    if (diffMin < 1) return 'hace un momento'
    if (diffMin < 60) return `hace ${diffMin} min`
    if (diffH < 24) return `hace ${diffH} h`
    if (diffD === 1) return 'ayer'
    if (diffD < 7) return `hace ${diffD} días`
    if (diffD < 30) return `hace ${Math.floor(diffD / 7)} semanas`
    if (diffD < 365) return `hace ${Math.floor(diffD / 30)} meses`
    return `hace ${Math.floor(diffD / 365)} años`
}
