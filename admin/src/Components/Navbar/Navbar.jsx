import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className='admin-navbar'>
      <div className="admin-nav-brand">
        <div className="brand-logo-badge">DAAN</div>
        <div className="brand-text">
          <h1>DAAN SPORTS</h1>
          <span>B2B WHOLESALE ADMIN PORTAL</span>
        </div>
      </div>
      <div className="admin-nav-user">
        <span className="online-indicator">● Live Sync</span>
        <div className="user-badge">Wholesale Manager</div>
      </div>
    </div>
  )
}

export default Navbar
