import React from 'react'
import './Navbar.css'
import DsLogo from './DsLogo'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='admin-navbar'>
      <div className="admin-nav-brand">
        <DsLogo />
        <div className="brand-text">
          <span>B2B WHOLESALE ADMIN PORTAL</span>
        </div>
      </div>
      <div className="admin-nav-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Link 
          to="/" 
          style={{ 
            background: 'linear-gradient(135deg, #dc2626, #991b1b)', 
            color: '#fff', 
            padding: '8px 16px', 
            borderRadius: '6px', 
            textDecoration: 'none', 
            fontSize: '13px', 
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          👁️ View Live Storefront
        </Link>
        <span className="online-indicator">● Live Sync</span>
        <div className="user-badge">Wholesale Manager</div>
      </div>
    </div>
  )
}

export default Navbar

