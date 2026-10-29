import React, { useEffect, useState } from 'react';
import './VoucherManager.css';
import { Tag, Trash2, Plus, Ticket } from 'lucide-react';
import { API_URL } from '../../config';
import { loadVouchers, fetchCloudVouchers, saveCloudVoucher, deleteCloudVoucher } from '../../defaultCatalog';
import { Toast, useToast } from '../Toast/Toast';

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState(() => loadVouchers());
  const [code, setCode] = useState('');
  const [type, setType] = useState('percent'); // 'percent' or 'fixed'
  const [discount, setDiscount] = useState(10);
  const [minOrder, setMinOrder] = useState(0);
  const [description, setDescription] = useState('');
  const { toast, showToast, hideToast } = useToast();

  const fetchVouchers = async () => {
    try {
      const data = await fetchCloudVouchers();
      if (Array.isArray(data)) {
        setVouchers(data);
      }
    } catch (err) {
      setVouchers(loadVouchers());
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast("Please enter a voucher code.", "error");
      return;
    }

    const newVoucher = {
      code: code.toUpperCase().trim(),
      type,
      discount: Number(discount),
      min_order: Number(minOrder),
      description,
      date: new Date().toISOString()
    };

    try {
      const updated = await saveCloudVoucher(newVoucher);
      setVouchers(updated);

      try {
        await fetch(`${API_URL}/create-voucher`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(newVoucher)
        });
      } catch (err) {}

      showToast(`🎉 Voucher "${newVoucher.code}" created and synced live!`, "success");
      setCode('');
      setDescription('');
    } catch (err) {
      showToast("Error creating voucher: " + err.message, "error");
    }
  };

  const handleDeleteVoucher = async (voucherCode) => {
    if (!window.confirm(`Delete voucher ${voucherCode}?`)) return;

    try {
      const updated = await deleteCloudVoucher(voucherCode);
      setVouchers(updated);

      try {
        await fetch(`${API_URL}/delete-voucher`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ code: voucherCode })
        });
      } catch (err) {}

      showToast(`🗑️ Voucher "${voucherCode}" removed and synced live.`, "info");
    } catch (err) {
      showToast("Error deleting voucher: " + err.message, "error");
    }
  };

  return (
    <div className="voucher-manager-b2b">
      <Toast toast={toast} onClose={hideToast} />

      <div className="voucher-header">
        <div>
          <h2>Discount Voucher & Coupon Manager</h2>
          <p>Issue promo discount codes for customers to apply during cart checkout with instant storefront validation.</p>
        </div>
      </div>

      <div className="voucher-content-grid">
        
        {/* Create Voucher Form */}
        <form onSubmit={handleCreateVoucher} className="voucher-form-card">
          <h3><Ticket size={17} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Issue New Promo Voucher</h3>

          <div className="form-group">
            <label>Voucher Code (e.g. GOCART20)</label>
            <input 
              type="text" 
              placeholder="e.g., GOCART20 or SUMMER50" 
              value={code} 
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required 
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Discount Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="percent">Percentage (%) Off</option>
                <option value="fixed">Fixed Amount ($) Off</option>
              </select>
            </div>

            <div className="form-group">
              <label>Discount Value</label>
              <input 
                type="number" 
                min="1" 
                value={discount} 
                onChange={(e) => setDiscount(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Minimum Order Requirement ($)</label>
            <input 
              type="number" 
              min="0" 
              value={minOrder} 
              onChange={(e) => setMinOrder(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Description / Event Note</label>
            <input 
              type="text" 
              placeholder="e.g. 20% Off Launch Special" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <button type="submit" className="create-voucher-btn">
            Issue Voucher 🎫
          </button>
        </form>

        {/* Active Vouchers List */}
        <div className="vouchers-list-card">
          <h3>Active Issued Vouchers ({vouchers.length})</h3>

          {vouchers.length === 0 ? (
            <p className="no-vouchers">No vouchers active.</p>
          ) : (
            <div className="vouchers-grid">
              {vouchers.map((v, i) => (
                <div key={i} className="voucher-chip-card">
                  <div className="voucher-code-header">
                    <span className="code-tag">{v.code}</span>
                    <button onClick={() => handleDeleteVoucher(v.code)} className="del-btn" title="Delete Voucher">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="voucher-details">
                    <p className="discount-heading">
                      {v.type === 'percent' ? `${v.discount}% OFF` : `$${v.discount} OFF`}
                    </p>
                    <p className="min-order-note">Min Order: ${v.minOrder !== undefined ? v.minOrder : (v.min_order || 0)}</p>
                    {v.description && <p className="voucher-desc">"{v.description}"</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default VoucherManager;
