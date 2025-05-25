import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLogin, AdminDashboard } from './components/Admin/index'; // Fixed import path

const AdminApp = () => {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AdminApp;
