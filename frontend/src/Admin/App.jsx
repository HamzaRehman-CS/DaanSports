import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import AdminLogin from './Components/Auth/AdminLogin';
import { API_URL } from './config';

const AdminApp = () => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('daan_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('daan_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'auth-token': token,
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setAdminUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLoginSuccess = (user, token) => {
    setAdminUser(user);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out from the Admin Portal?')) {
      localStorage.removeItem('daan_admin_token');
      localStorage.removeItem('daan_admin_user');
      setAdminUser(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#94a3b8',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(59, 130, 246, 0.2)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Connecting to Wholesale Control Engine...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="daan-admin-portal-root">
      <Navbar user={adminUser} onLogout={handleLogout} />
      <Admin />
    </div>
  );
};

export default AdminApp;
