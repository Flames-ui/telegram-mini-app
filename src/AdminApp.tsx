import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLogin from './components/admin/Login'
import AdminDashboard from './components/admin/Dashboard'

export default function AdminApp() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
