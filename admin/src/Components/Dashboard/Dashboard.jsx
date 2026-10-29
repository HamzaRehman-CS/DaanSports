import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';
import { loadCatalogProducts } from '../../defaultCatalog';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Layers, 
  Clock, 
  Plus, 
  Ticket, 
  Image as ImageIcon, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [products, setProducts] = useState(() => loadCatalogProducts());
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/data`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.products)) setProducts(data.products);
          if (Array.isArray(data.orders)) setOrders(data.orders);
          if (Array.isArray(data.categories)) setCategories(data.categories);
          if (Array.isArray(data.vouchers)) setVouchers(data.vouchers);
          if (data.stats) setStats(data.stats);
        }
      }
    } catch (e) {
      // Use fallback
      const localProds = loadCatalogProducts();
      if (Array.isArray(localProds)) setProducts(localProds);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = stats?.totalRevenue ?? orders.reduce((sum, o) => sum + (Number(o.totalAmount || o.total) || 0), 0);
  const pendingOrders = stats?.pendingOrders ?? orders.filter(o => (o.status || '').toLowerCase().includes('pending')).length;

  return (
    <div className="admin-dashboard-b2b">
      <div className="dashboard-header">
        <div>
          <h2>Executive Business Analytics</h2>
          <p>Real-time performance summary and control metrics for DAAN Sports wholesale store.</p>
        </div>
        <div className="dashboard-status-badge">
          <span className="pulse-circle"></span>
          <span>Live Sync Active</span>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="dash-spinner"></div>
          <p>Compiling live inventory and order metrics...</p>
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="dashboard-metrics-grid">
            <div className="metric-card gold border-glow">
              <div className="metric-icon-wrap gold-wrap">
                <DollarSign size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Total Wholesale Revenue</span>
                <h3 className="metric-value">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <span className="metric-sub font-mono">From {orders.length} Wholesale Orders</span>
              </div>
            </div>

            <div className="metric-card blue">
              <div className="metric-icon-wrap blue-wrap">
                <ShoppingBag size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Total Customer Orders</span>
                <h3 className="metric-value">{orders.length}</h3>
                <span className="metric-sub font-mono">{pendingOrders} Pending Fulfillment</span>
              </div>
            </div>

            <div className="metric-card green">
              <div className="metric-icon-wrap green-wrap">
                <Package size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Active Catalog Products</span>
                <h3 className="metric-value">{products.length}</h3>
                <span className="metric-sub font-mono">Across {categories.length} Categories</span>
              </div>
            </div>

            <div className="metric-card purple">
              <div className="metric-icon-wrap purple-wrap">
                <Layers size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Active Categories</span>
                <h3 className="metric-value">{categories.length}</h3>
                <span className="metric-sub font-mono">{vouchers.length} Promo Codes Active</span>
              </div>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="dashboard-shortcuts-section">
            <div className="shortcuts-title-row">
              <TrendingUp size={18} className="text-blue-400" />
              <h3>Direct Store Controls</h3>
            </div>
            <div className="shortcuts-grid">
              <Link to="/orders" className="shortcut-card">
                <div className="shortcut-icon-circle blue-circle">
                  <ShoppingBag size={20} />
                </div>
                <div className="shortcut-info">
                  <h4>Manage Orders ({pendingOrders} Pending)</h4>
                  <p>Review customer wholesale orders, update status, and track shipments.</p>
                </div>
                <ArrowRight size={18} className="shortcut-arrow" />
              </Link>

              <Link to="/add-product" className="shortcut-card">
                <div className="shortcut-icon-circle green-circle">
                  <Plus size={20} />
                </div>
                <div className="shortcut-info">
                  <h4>Add New Product</h4>
                  <p>Publish custom sportswear, configure MOQ, GSM textile specs & images.</p>
                </div>
                <ArrowRight size={18} className="shortcut-arrow" />
              </Link>

              <Link to="/banners" className="shortcut-card">
                <div className="shortcut-icon-circle amber-circle">
                  <ImageIcon size={20} />
                </div>
                <div className="shortcut-info">
                  <h4>Promotional Posters & Bento</h4>
                  <p>Update top bento grid tiles, promotional CTA banners & discounts.</p>
                </div>
                <ArrowRight size={18} className="shortcut-arrow" />
              </Link>

              <Link to="/vouchers" className="shortcut-card">
                <div className="shortcut-icon-circle purple-circle">
                  <Ticket size={20} />
                </div>
                <div className="shortcut-info">
                  <h4>Promo Vouchers ({vouchers.length} Active)</h4>
                  <p>Configure percentage & fixed discount voucher codes for buyers.</p>
                </div>
                <ArrowRight size={18} className="shortcut-arrow" />
              </Link>
            </div>
          </div>

          {/* Recent Orders Overview Table */}
          <div className="dashboard-recent-orders">
            <div className="section-title flex-between">
              <div className="orders-header-title">
                <Clock size={18} className="text-emerald-400" />
                <h3>Recent Wholesale Orders</h3>
              </div>
              <Link to="/orders" className="view-all-link">
                <span>View All Orders</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state-box">
                <AlertCircle size={20} className="text-slate-400 mb-2" />
                <p>No orders placed yet. Orders placed on the storefront will appear here live.</p>
              </div>
            ) : (
              <div className="orders-mini-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Units</th>
                      <th>Total Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id}>
                        <td className="font-mono font-bold text-red">{o.id}</td>
                        <td>
                          <strong>{o.customerName || "B2B Buyer"}</strong>
                          <span className="block-sub">{o.userEmail}</span>
                        </td>
                        <td>{o.totalUnits || (o.items ? o.items.length : 1)} Pcs</td>
                        <td className="font-bold">${Number(o.totalAmount || o.total || 0).toFixed(2)}</td>
                        <td>{o.paymentMethod || "Wire Transfer"}</td>
                        <td>
                          <span className={`status-tag ${String(o.status || 'Pending').toLowerCase().replace(/\s/g, '-')}`}>
                            {o.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
