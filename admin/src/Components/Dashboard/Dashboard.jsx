import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/all-products`).then(res => res.json()).catch(() => []),
      fetch(`${API_URL}/all-orders`).then(res => res.json()).catch(() => []),
      fetch(`${API_URL}/categories`).then(res => res.json()).catch(() => []),
      fetch(`${API_URL}/vouchers`).then(res => res.json()).catch(() => [])
    ]).then(([prods, ords, cats, vous]) => {
      if (Array.isArray(prods)) setProducts(prods);
      if (Array.isArray(ords)) setOrders(ords);
      if (Array.isArray(cats)) setCategories(cats);
      if (Array.isArray(vous)) setVouchers(vous);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingOrders = orders.filter(o => (o.status || '').toLowerCase().includes('pending')).length;
  const totalUnitsSold = orders.reduce((sum, o) => sum + (Number(o.totalUnits) || 0), 0);

  return (
    <div className="admin-dashboard-b2b">
      <div className="dashboard-header">
        <div>
          <h2>📊 Executive Business Analytics</h2>
          <p>Real-time performance summary for DAAN Sports B2B E-Commerce Platform.</p>
        </div>
        <div className="dashboard-status-badge">
          🟢 Live Sync Active
        </div>
      </div>

      {loading ? (
        <div className="dashboard-loading">Loading analytics metrics...</div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="dashboard-metrics-grid">
            <div className="metric-card gold border-glow">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <span className="metric-label">Total B2B Revenue</span>
                <h3 className="metric-value">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <span className="metric-sub font-mono">From {orders.length} Wholesale Orders</span>
              </div>
            </div>

            <div className="metric-card blue">
              <div className="metric-icon">🚚</div>
              <div className="metric-content">
                <span className="metric-label">Total Orders</span>
                <h3 className="metric-value">{orders.length}</h3>
                <span className="metric-sub font-mono">{pendingOrders} Pending Processing</span>
              </div>
            </div>

            <div className="metric-card green">
              <div className="metric-icon">📦</div>
              <div className="metric-content">
                <span className="metric-label">Active Catalog</span>
                <h3 className="metric-value">{products.length}</h3>
                <span className="metric-sub font-mono">Across {categories.length} Categories</span>
              </div>
            </div>

            <div className="metric-card purple">
              <div className="metric-icon">👕</div>
              <div className="metric-content">
                <span className="metric-label">Total Volume Sold</span>
                <h3 className="metric-value">{totalUnitsSold.toLocaleString()} Pcs</h3>
                <span className="metric-sub font-mono">{vouchers.length} Active Vouchers</span>
              </div>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="dashboard-shortcuts-section">
            <h3>⚡ Quick Management Shortcuts</h3>
            <div className="shortcuts-grid">
              <Link to="/orders" className="shortcut-card">
                <span className="shortcut-icon">🚚</span>
                <div>
                  <h4>Manage Orders ({pendingOrders} Pending)</h4>
                  <p>Update tracking numbers, review payment methods & order statuses.</p>
                </div>
              </Link>

              <Link to="/add-product" className="shortcut-card">
                <span className="shortcut-icon">➕</span>
                <div>
                  <h4>Add New Product</h4>
                  <p>Insert sportswear, set MOQ, GSM weight, images & wholesale pricing.</p>
                </div>
              </Link>

              <Link to="/vouchers" className="shortcut-card">
                <span className="shortcut-icon">🎫</span>
                <div>
                  <h4>Promo Vouchers ({vouchers.length} Active)</h4>
                  <p>Create discount codes or clear all vouchers for payment checkout.</p>
                </div>
              </Link>

              <Link to="/categories" className="shortcut-card">
                <span className="shortcut-icon">🏷️</span>
                <div>
                  <h4>Categories & Banners</h4>
                  <p>Add subcategories, dynamic stretched banners & collection descriptions.</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Orders Overview Table */}
          <div className="dashboard-recent-orders">
            <div className="section-title flex-between">
              <h3>📦 Recent Customer Orders</h3>
              <Link to="/orders" className="view-all-link">View All Orders ➔</Link>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state-box">No orders placed yet. Orders will appear here automatically.</div>
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
                        <td>{o.totalUnits} Pcs</td>
                        <td className="font-bold">${Number(o.totalAmount).toFixed(2)}</td>
                        <td>{o.paymentMethod || "Wire Transfer"}</td>
                        <td>
                          <span className={`status-tag ${o.status?.toLowerCase().replace(/\s/g, '-')}`}>
                            {o.status || "Pending Review"}
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
