import React, { useEffect, useState } from 'react';
import './OrderManager.css';
import { API_URL } from '../../config';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/all-orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus, currentTracking, currentNotes) => {
    try {
      const res = await fetch(`${API_URL}/update-order-status`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          trackingNumber: currentTracking,
          notes: currentNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Order ${orderId} status updated to "${newStatus}"!`);
        fetchOrders();
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to CANCEL order ${orderId}?`)) return;
    try {
      const res = await fetch(`${API_URL}/cancel-order`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Order ${orderId} has been CANCELLED.`);
        fetchOrders();
      }
    } catch (err) {
      alert("Error cancelling order: " + err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`⚠️ PERMANENT DELETE: Are you sure you want to delete order ${orderId} log to clear memory?`)) return;
    try {
      const res = await fetch(`${API_URL}/delete-order`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Order record ${orderId} permanently deleted from memory/DB.`);
        fetchOrders();
      }
    } catch (err) {
      alert("Error deleting order: " + err.message);
    }
  };

  const handleTrackingUpdate = async (orderId, currentStatus, newTracking, currentNotes) => {
    try {
      const res = await fetch(`${API_URL}/update-order-status`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: currentStatus,
          trackingNumber: newTracking,
          notes: currentNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Tracking & Notes saved for order ${orderId}!`);
        fetchOrders();
      }
    } catch (err) {
      alert("Error updating tracking: " + err.message);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return alert("No orders available to export.");
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
  };

  return (
    <div className="order-manager-b2b">
      <div className="order-manager-header">
        <div>
          <h2>Admin Order Control & Shipment Management</h2>
          <p>Update live designated word status, cancel orders, or clear order logs from memory.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={handleExportCSV}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            📥 Export Orders (CSV)
          </button>
          <div className="order-count-badge">
            Total Active Logs: <span>{orders.length}</span>
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
                    <label>Designated Word Status:</label>
                    <select
                      value={ord.status}
                      className={`status-select ${(ord.status || '').toLowerCase().replace(/\s+/g, '-')}`}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value, ord.trackingNumber, ord.notes)}
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="In Production">In Production</option>
                      <option value="Shipped">Shipped (In Transit)</option>
                      <option value="Delivered">Delivered (Now There)</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Admin Cancel & Purge Controls */}
                  <button 
                    className="admin-btn cancel-btn"
                    onClick={() => handleCancelOrder(ord.id)}
                    title="Cancel Order & Void Payment"
                  >
                    Cancel Order
                  </button>

                  <button 
                    className="admin-btn delete-btn"
                    onClick={() => handleDeleteOrder(ord.id)}
                    title="Delete Record to Clear Memory"
                  >
                    Delete Log 🗑️
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
