import React from 'react';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className='admin-sidebar'>
      <div className="sidebar-menu">
        <Link to={'/admin/dashboard'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/admin' || location.pathname === '/admin/' || location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
            <span className="sidebar-icon">📊</span>
            <p>Dashboard & Metrics</p>
          </div>
        </Link>

        <Link to={'/admin/list-product'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/admin/list-product' ? 'active' : ''}`}>
            <span className="sidebar-icon">📦</span>
            <p>Products & Specs</p>
          </div>
        </Link>

        <Link to={'/admin/add-product'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/admin/add-product' ? 'active' : ''}`}>
            <span className="sidebar-icon">➕</span>
            <p>Add New Product</p>
          </div>
        </Link>
        
        <Link to={'/admin/categories'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/admin/categories' ? 'active' : ''}`}>
            <span className="sidebar-icon">🏷️</span>
            <p>Categories & Banners</p>
          </div>
        </Link>

        <Link to={'/admin/banners'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/admin/banners' ? 'active' : ''}`}>
            <span className="sidebar-icon">🖼️</span>
            <p>Top Sellers Banners</p>
          </div>
        </Link>

        <Link to={'/admin/orders'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
            <span className="sidebar-icon">🚚</span>
            <p>Customer Orders</p>
          </div>
        </Link>

        <Link to={'/admin/vouchers'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/admin/vouchers' ? 'active' : ''}`}>
            <span className="sidebar-icon">🎫</span>
            <p>Promo Vouchers</p>
          </div>
        </Link>

        <Link to={'/admin/cms'} style={{ textDecoration: "none" }}>
          <div className={`sidebar-item ${location.pathname === '/admin/cms' ? 'active' : ''}`}>
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
