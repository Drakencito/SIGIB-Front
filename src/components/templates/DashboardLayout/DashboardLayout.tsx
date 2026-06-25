import { Outlet } from 'react-router-dom'
import Header from '../../organisms/Header/Header'
import Footer from '../../organisms/Footer/Footer'
import './DashboardLayout.css'

export default function DashboardLayout() {
  return (
    <div className="layout-root">
      <Header />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}