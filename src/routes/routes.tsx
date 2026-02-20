import { Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/Login/LoginPage'
import DashboardLayout from '../components/templates/DashboardLayout/DashboardLayout'
import Welcome from '../pages/Welcome/Welcome'
import Inventarios from '../pages/Inventarios/Inventarios'
import Solicitudes from '../pages/Solicitudes/Solicitudes'
import Tickets from '../pages/Tickets/Tickets'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"           element={<LoginPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="/inicio"       element={<Welcome />} />
        <Route path="/inventarios"  element={<Inventarios />} />
        <Route path="/solicitudes"  element={<Solicitudes />} />
        <Route path="/tickets"      element={<Tickets />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
