import { useRef, useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../organisms/Header/Header'
import Footer from '../../organisms/Footer/Footer'
import Sidebar from '../../organisms/Sidebar/Sidebar'
import './DashboardLayout.css'

const HEADER_H = 60
const MARGIN = 12

function DashboardLayout() {
  const footerRef = useRef<HTMLElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const [topPx, setTopPx] = useState<number>(HEADER_H + MARGIN)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  useEffect(() => {
    const calcular = () => {
      const vh = window.innerHeight
      const footerTop = footerRef.current?.getBoundingClientRect().top ?? vh
      const limiteInferior = Math.min(footerTop, vh)
      const espacioDisp = limiteInferior - HEADER_H
      const sidebarH = sidebarRef.current?.offsetHeight ?? 0
      const centrado = HEADER_H + (espacioDisp - sidebarH) / 2
      setTopPx(Math.max(centrado, HEADER_H + MARGIN))
    }

    setTimeout(calcular, 50)
    window.addEventListener('scroll', calcular)
    window.addEventListener('resize', calcular)
    return () => {
      window.removeEventListener('scroll', calcular)
      window.removeEventListener('resize', calcular)
    }
  }, [])

  // Cierra sidebar al pasar a escritorio
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="layout-root">
      <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
      <div className="layout-body">
        {sidebarOpen && (
          <div
            className="layout-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar
          ref={sidebarRef}
          topPx={topPx}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
      <Footer ref={footerRef} />
    </div>
  )
}

export default DashboardLayout
