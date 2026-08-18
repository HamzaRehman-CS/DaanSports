import React from 'react'
import './Navbar.css'
import DsLogo from './DsLogo'

const Navbar = () => {
  return (
    <div className='admin-navbar'>
      <div className="admin-nav-brand">
        <DsLogo className="h-7 w-auto" />
        <div className="brand-text">
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

