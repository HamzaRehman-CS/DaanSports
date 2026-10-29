import React from 'react';
import './Navbar.css';
import DsLogo from './DsLogo';
import { LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <header className='admin-navbar'>
      <div className="admin-nav-brand">
        <DsLogo />
        <div className="brand-text">
          <h1>DAAN SPORTS B2B</h1>
          <span>ADMINISTRATION CONTROL CENTER</span>
        </div>
      </div>

      <div className="admin-nav-actions">
        <a 
          href="http://localhost:3001" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="nav-storefront-link"
          title="Open live customer storefront in new tab"
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
            <span className="admin-email">{user?.email || 'admin@daansports.com'}</span>
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
