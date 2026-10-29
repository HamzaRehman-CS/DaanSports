import React, { useState } from 'react';
import './AdminLogin.css';
import { API_URL } from '../../config';
import DsLogo from '../Navbar/DsLogo';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId || !password) {
      setError('Please enter both Admin ID and password.');
      return;
    }

    setLoading(true);
    setError('');

    const cleanId = adminId.trim().toLowerCase();
    const cleanPw = password.trim();

    try {
      const res = await fetch(`${API_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanId, password: cleanPw })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('daan_admin_token', data.token);
        localStorage.setItem('daan_admin_user', JSON.stringify(data.user));
        if (onLoginSuccess) {
          onLoginSuccess(data.user, data.token);
        }
      } else {
        setError(data.error || 'Invalid administrator credentials.');
      }
    } catch (err) {
      // Local dev offline fallback
      if (
        (cleanId === 'admin' || cleanId === 'admin@daansports.com') &&
        (cleanPw === 'pass' || cleanPw === 'admin123')
      ) {
        const fallbackUser = {
          id: 'admin-01',
          email: 'admin',
          name: 'Administrator',
          role: 'admin'
        };
        localStorage.setItem('daan_admin_token', 'local_dev_admin_token');
        localStorage.setItem('daan_admin_user', JSON.stringify(fallbackUser));
        if (onLoginSuccess) {
          onLoginSuccess(fallbackUser, 'local_dev_admin_token');
        }
      } else {
        setError('Cannot reach authentication server. Please check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-backdrop-glow"></div>
      
      <div className="admin-login-card">
        <div className="login-header">
          <div className="logo-center">
            <DsLogo />
          </div>
          <div className="security-badge">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>SECURE WHOLESALE CONTROL</span>
          </div>
          <h2>Admin Control Portal</h2>
          <p>Sign in to manage catalog, wholesale specifications, banners & live orders.</p>
        </div>

        {error && (
          <div className="login-error-alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Admin ID</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input
                type="text"
                placeholder="admin"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-spinner">Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <span>Daan Sports B2B Manufacturing Engine • Local Sync 2026</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
