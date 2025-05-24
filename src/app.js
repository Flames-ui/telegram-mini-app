import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { authStateListener } from './services/auth';
import {
  Login,
  Dashboard,
  Payments,
  Users,
  Notifications,
  Settings
} from './components';
import { Sidebar, Topbar } from './components/layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authStateListener((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {user ? (
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flexGrow: 1, padding: '20px' }}>
              <Topbar user={user} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/users" element={<Users />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
