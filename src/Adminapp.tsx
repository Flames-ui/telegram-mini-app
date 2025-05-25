import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDashboard from './components/admin/Dashboard'
import AdminLogin from './components/admin/Login'

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
