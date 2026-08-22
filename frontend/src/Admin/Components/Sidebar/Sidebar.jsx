import React from 'react';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className='admin-sidebar'>
      <div className="sidebar-menu">
        <Link to={'/dashboard'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : ''}`}>
            <span className="sidebar-icon">📊</span>
            <p>Dashboard & Metrics</p>
          </div>
        </Link>

        <Link to={'/list-product'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/list-product' ? 'active' : ''}`}>
            <span className="sidebar-icon">📦</span>
            <p>Products & Specs</p>
          </div>
        </Link>

        <Link to={'/add-product'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/add-product' ? 'active' : ''}`}>
            <span className="sidebar-icon">➕</span>
            <p>Add New Product</p>
          </div>
        </Link>
        
        <Link to={'/categories'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/categories' ? 'active' : ''}`}>
            <span className="sidebar-icon">🏷️</span>
            <p>Categories & Banners</p>
          </div>
        </Link>

        <Link to={'/banners'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/banners' ? 'active' : ''}`}>
            <span className="sidebar-icon">🖼️</span>
            <p>Top Sellers Banners</p>
          </div>
        </Link>

        <Link to={'/orders'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/orders' ? 'active' : ''}`}>
            <span className="sidebar-icon">🚚</span>
            <p>Customer Orders</p>
          </div>
        </Link>

        <Link to={'/vouchers'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/vouchers' ? 'active' : ''}`}>
            <span className="sidebar-icon">🎫</span>
            <p>Promo Vouchers</p>
          </div>
        </Link>

        <Link to={'/cms'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/cms' ? 'active' : ''}`}>
            <span className="sidebar-icon">🎨</span>
            <p>Site CMS</p>
          </div>
        </Link>
      </div>

      <div className="sidebar-info-card">
        <h4>DAAN B2B Engine</h4>
        <p>Live order sync, category banners & product editor active.</p>
      </div>
    </div>
  );
};

export default Sidebar;
