import React from 'react';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Layers, 
  Image, 
  ShoppingBag, 
  Ticket, 
  Sliders,
  CheckCircle2
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const isAdminPrefix = location.pathname.startsWith('/admin');
  const base = isAdminPrefix ? '/admin' : '';

  const navItems = [
    { path: `${base}/dashboard`, altPath: base || '/', label: 'Dashboard & Metrics', icon: LayoutDashboard },
    { path: `${base}/list-product`, label: 'Products & Specs', icon: Package },
    { path: `${base}/add-product`, label: 'Add New Product', icon: PlusCircle },
    { path: `${base}/categories`, label: 'Categories & Banners', icon: Layers },
    { path: `${base}/banners`, label: 'Top Sellers Banners', icon: Image },
    { path: `${base}/orders`, label: 'Customer Orders', icon: ShoppingBag },
    { path: `${base}/vouchers`, label: 'Promo Vouchers', icon: Ticket },
    { path: `${base}/cms`, label: 'Site CMS & Carousel', icon: Sliders },
  ];

  return (
    <aside className='admin-sidebar'>
      <div className="sidebar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.altPath && (location.pathname === item.altPath || location.pathname === `${base}/` || (base && location.pathname === base)));

          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
              <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
                <Icon size={18} className="sidebar-icon-svg" />
                <p>{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="sidebar-info-card">
        <div className="sidebar-card-header">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <h4>Neon Live Engine</h4>
        </div>
        <p>Instant two-way sync: Changes update the storefront immediately.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
