import React, { useEffect, useState } from 'react';
import './OrderManager.css';
import { Download, RefreshCw, Trash2, Ban, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../../config';
import { fetchCloudOrders, updateCloudOrderStatus, deleteCloudOrder } from '../../defaultCatalog';
import { Toast, useToast } from '../Toast/Toast';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const fetchOrders = async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);

    try {
      // 1. Authoritative Backend Fetch
      const res = await fetch(`${API_URL}/all-orders`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
          if (manual) showToast("Order records synchronized with live server", "success");
          return;
        }
      }

      // 2. Cloud Fallback
      const cloudOrders = await fetchCloudOrders();
      if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
        const mapped = cloudOrders.map(o => ({
          id: o.id,
          createdAt: o.created_at || o.createdAt,
          customerName: o.customer_name || o.customerName,
          discountAmount: o.discount_amount || o.discountAmount,
          items: o.items,
          notes: o.notes,
          paymentMethod: o.payment_method || o.paymentMethod,
          paymentStatus: o.payment_status || o.paymentStatus,
          phone: o.phone,
          status: o.status,
          totalAmount: o.total_amount || o.totalAmount,
          totalUnits: o.total_units || o.totalUnits,
          trackingNumber: o.tracking_number || o.trackingNumber,
          userEmail: o.user_email || o.userEmail,
          voucherCode: o.voucher_code || o.voucherCode
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus, currentTracking, currentNotes) => {
    try {
      await updateCloudOrderStatus(orderId, newStatus, currentTracking, currentNotes);
      showToast(`Order ${orderId} updated to "${newStatus}"`, 'success');
      fetchOrders();
    } catch (err) {
      showToast("Error updating status: " + err.message, 'error');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to CANCEL order ${orderId}?`)) return;
    try {
      await updateCloudOrderStatus(orderId, 'Cancelled', undefined, 'Order cancelled by Admin');
      showToast(`Order ${orderId} has been cancelled`, 'info');
      fetchOrders();
    } catch (err) {
      showToast("Error cancelling order: " + err.message, 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`⚠️ PERMANENT DELETE: Are you sure you want to delete order ${orderId} log to clear memory?`)) return;
    try {
      await deleteCloudOrder(orderId);
      showToast(`Order ${orderId} permanently removed`, 'success');
      fetchOrders();
    } catch (err) {
      showToast("Error deleting order: " + err.message, 'error');
    }
  };

  const handleTrackingUpdate = async (orderId, currentStatus, newTracking, currentNotes) => {
    try {
      await updateCloudOrderStatus(orderId, currentStatus, newTracking, currentNotes);
      showToast(`Tracking & Notes updated for ${orderId}`, 'success');
      fetchOrders();
    } catch (err) {
      showToast("Error saving tracking info: " + err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast("No orders available to export.", "info");
      return;
    }
    const headers = ["Order ID", "Customer Name", "Email", "Phone", "Total Units", "Total Amount ($)", "Payment Method", "Status", "Tracking", "Created At"];
    const rows = orders.map(o => [
      o.id,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      o.userEmail,
      `"${o.phone || ''}"`,
      o.totalUnits,
      o.totalAmount,
      `"${(o.paymentMethod || '').replace(/"/g, '""')}"`,
      o.status,
      `"${(o.trackingNumber || '').replace(/"/g, '""')}"`,
      o.createdAt || ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DAAN_B2B_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV export initiated!", "success");
  };

  return (
    <div className="order-manager-b2b">
      <Toast toast={toast} onClose={hideToast} />

      <div className="order-manager-header">
        <div>
          <h2>Wholesale Order Control & Shipment Management</h2>
          <p>Real-time order statuses, shipping tracking numbers, buyer production notes, and export logs.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#94a3b8',
              padding: '8px 14px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={13} className={refreshing ? 'spin-icon' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            onClick={handleExportCSV}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={14} /> Export CSV
          </button>
          <div className="order-count-badge">
            Total Orders: <span>{orders.length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-box">Loading Orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-orders-box">
          <p>No active order logs in database.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((ord) => (
            <div key={ord.id} className="order-card-b2b">
              <div className="order-card-top">
                <div className="order-id-group">
                  <span className="order-id">{ord.id}</span>
                  <span className="order-date">{new Date(ord.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="admin-order-actions-top">
                  <div className="status-selector-group">
                    <label>Status:</label>
                    <select
                      value={ord.status}
                      className={`status-select ${(ord.status || '').toLowerCase().replace(/\s+/g, '-')}`}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value, ord.trackingNumber, ord.notes)}
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="In Production">In Production</option>
                      <option value="Shipped">Shipped (In Transit)</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <button 
                    className="admin-btn cancel-btn"
                    onClick={() => handleCancelOrder(ord.id)}
                    title="Cancel Order"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Ban size={12} /> Cancel
                  </button>

                  <button 
                    className="admin-btn delete-btn"
                    onClick={() => handleDeleteOrder(ord.id)}
                    title="Delete Record"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              <div className="order-customer-info">
                <div><strong>Buyer:</strong> {ord.customerName} ({ord.userEmail})</div>
                <div><strong>Payment:</strong> {ord.paymentMethod || 'Card'} ({ord.paymentStatus || 'Paid'})</div>
                <div><strong>Quantity:</strong> <span className="highlight-text">{ord.totalUnits} Pcs</span></div>
                <div><strong>Total Amount:</strong> <span className="price-text">${Number(ord.totalAmount).toFixed(2)}</span></div>
              </div>

              {ord.items && ord.items.length > 0 && (
                <div className="order-items-preview">
                  <h5>Order Items:</h5>
                  <div className="items-row">
                    {ord.items.map((it, i) => (
                      <div key={i} className="item-mini-chip">
                        <span>{it.name || `Item ${it.id}`}</span>
                        <small>x{it.qty || 1}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="order-tracking-input-box">
                <div className="input-group">
                  <label>Airway Bill / Tracking #:</label>
                  <input
                    type="text"
                    defaultValue={ord.trackingNumber || ''}
                    placeholder="e.g., DHL-9823471029"
                    onBlur={(e) => handleTrackingUpdate(ord.id, ord.status, e.target.value, ord.notes)}
                  />
                </div>
                <div className="input-group">
                  <label>Production Notes for Buyer:</label>
                  <input
                    type="text"
                    defaultValue={ord.notes || ''}
                    placeholder="e.g., Quality check complete, dispatches today."
                    onBlur={(e) => handleTrackingUpdate(ord.id, ord.status, ord.trackingNumber, e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManager;
