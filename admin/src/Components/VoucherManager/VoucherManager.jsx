import React, { useEffect, useState } from 'react';
import './VoucherManager.css';

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState('percent'); // 'percent' or 'fixed'
  const [discount, setDiscount] = useState(10);
  const [minOrder, setMinOrder] = useState(0);
  const [description, setDescription] = useState('');

  const fetchVouchers = async () => {
    try {
      const res = await fetch("http://localhost:4000/vouchers");
      const data = await res.json();
      setVouchers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    if (!code.trim()) return alert("Please enter a voucher code.");

    try {
      const res = await fetch("http://localhost:4000/create-voucher", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.toUpperCase().trim(),
          type,
          discount: Number(discount),
          minOrder: Number(minOrder),
          description
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Voucher "${data.voucher.code}" created successfully!`);
        setCode('');
        setDescription('');
        fetchVouchers();
      }
    } catch (err) {
      alert("Error creating voucher: " + err.message);
    }
  };

  const handleDeleteVoucher = async (voucherCode) => {
    if (!window.confirm(`Delete voucher ${voucherCode}?`)) return;

    try {
      const res = await fetch("http://localhost:4000/delete-voucher", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Voucher ${voucherCode} deleted.`);
        fetchVouchers();
      }
    } catch (err) {
      alert("Error deleting voucher: " + err.message);
    }
  };

  return (
    <div className="voucher-manager-b2b">
      <div className="voucher-header">
        <h2>Discount Voucher & Coupon Manager</h2>
        <p>Issue promo discount codes for customers to apply during cart checkout.</p>
      </div>

      <div className="voucher-content-grid">
        
        {/* Create Voucher Form */}
        <form onSubmit={handleCreateVoucher} className="voucher-form-card">
          <h3>Issue New Promo Voucher</h3>

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
                    <button onClick={() => handleDeleteVoucher(v.code)} className="del-btn">✕</button>
                  </div>
                  <div className="voucher-details">
                    <p className="discount-heading">
                      {v.type === 'percent' ? `${v.discount}% OFF` : `$${v.discount} OFF`}
                    </p>
                    <p className="min-order-note">Min Order: ${v.minOrder}</p>
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
