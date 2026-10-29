import React from 'react';
import './Navbar.css';
import DsLogo from './DsLogo';
import { LogOut, ExternalLink, ShieldCheck, Menu, X } from 'lucide-react';

const Navbar = ({ user, onLogout, onToggleSidebar, sidebarOpen }) => {
  return (
    <header className='admin-navbar'>
      <div className="admin-nav-brand">
        <button
          type="button"
          className="admin-mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <DsLogo />
        <div className="brand-text">
          <h1>DAAN SPORTS B2B</h1>
          <span>ADMINISTRATION CONTROL CENTER</span>
        </div>
      </div>

      <div className="admin-nav-actions">
        <a 
          href="/" 
          className="nav-storefront-link"
          title="Open live customer storefront"
        >
          <span>Live Storefront</span>
          <ExternalLink size={14} />
        </a>

        <div className="online-indicator">
          <span className="pulse-dot"></span>
          <span>Live Sync Active</span>
        </div>

        <div className="admin-profile-chip">
          <ShieldCheck size={16} className="admin-chip-icon" />
          <div className="admin-chip-info">
            <span className="admin-name">{user?.name || 'Administrator'}</span>
            <span className="admin-email">{user?.email || 'admin'}</span>
          </div>
        </div>

        <button 
          type="button" 
          onClick={onLogout} 
          className="admin-logout-btn"
          title="Sign out from admin control portal"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
