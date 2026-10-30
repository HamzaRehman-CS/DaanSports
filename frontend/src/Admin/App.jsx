import React, { useState, useEffect, Component } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import AdminLogin from './Components/Auth/AdminLogin';
import { API_URL } from './config';

class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin Portal Error Caught:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('daan_admin_token');
    localStorage.removeItem('daan_admin_user');
    window.location.href = '/admin';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#ffffff',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            background: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '36px',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: '#f87171' }}>
              Admin Portal Recovery
            </h2>
            <p style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '20px', lineHeight: 1.6 }}>
              A rendering error occurred in the control panel. Click below to refresh your session and reconnect.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    return (
      <AdminErrorBoundary>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="daan-admin-portal-root">
        <Navbar 
          user={adminUser} 
          onLogout={handleLogout} 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          sidebarOpen={sidebarOpen}
        />
        <Admin 
          sidebarOpen={sidebarOpen} 
          onCloseSidebar={() => setSidebarOpen(false)} 
        />
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminApp;
