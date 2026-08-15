import React, { useEffect, useState } from 'react';
import './ProductList.css';
import cross_icon from '../../assets/cross_icon.png';

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/all-products");
      const data = await res.json();
      setAllProducts(Array.isArray(data) ? data : []);

      const catRes = await fetch("http://localhost:4000/categories");
      const catData = await catRes.json();
      if (Array.isArray(catData)) setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const removeProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from wholesale inventory?`)) {
      return;
    }
    try {
      await fetch("http://localhost:4000/remove-product", {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, name: name })
      });
      await fetchAllProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      id: product.id,
      name: product.name || "",
      category: product.category || "Tracksuits",
      new_price: product.new_price || 0,
      old_price: product.old_price || 0,
      moq: product.moq || 50,
      description: product.description || "",
      material: product.material || "",
      gsm: product.gsm || "",
      stitching: product.stitching || "",
      customization: product.customization || "",
      leadTime: product.leadTime || "",
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ""),
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ""),
      stock: product.stock || 1000,
      image: product.image || ""
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editFormData,
        colors: editFormData.colors.split(',').map(c => c.trim()).filter(Boolean),
        sizes: editFormData.sizes.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await fetch("http://localhost:4000/edit-product", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        alert(`Product "${data.product.name}" updated successfully!`);
        setEditingProduct(null);
        fetchAllProducts();
      } else {
        alert("Edit Error: " + (data.error || "Failed to update product"));
      }
    } catch (err) {
      alert("Network Error: " + err.message);
    }
  };

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || (p.category || '').toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className='product-list-b2b'>
      <div className="product-list-header">
        <div>
          <h2>Wholesale Products Catalog</h2>
          <p>Manage DAAN Sports bulk apparel inventory, edit descriptions, pricing, and live site offerings.</p>
        </div>
        <div className="product-count-badge">
          Showing: <span>{filteredProducts.length} / {allProducts.length}</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text"
          placeholder="🔍 Search product by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '220px',
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading Wholesale Catalog...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-catalog-state">
          <p>No matching products found in catalog.</p>
          {allProducts.length === 0 && (
            <a href="/add-product" className="add-first-btn">Add Your First Product</a>
          )}
        </div>
      ) : (
        <div className="product-table-wrapper">
          <div className="products-table-header">
            <p>Product</p>
            <p>Title & Description</p>
            <p>Category</p>
            <p>MOQ (Pcs)</p>
            <p>Bulk Price</p>
            <p>Edit / Action</p>
            <p>Remove</p>
          </div>

          <div className="products-table-rows">
            {filteredProducts.map((product) => {
              return (
                <div key={product.id} className="products-table-row">
                  <div className="product-thumb-cell">
                    <img className='product-list-producticon' src={product.image} alt={product.name} />
                  </div>
                  <div className="product-title-cell">
                    <strong>{product.name}</strong>
                    {product.description && (
                      <span className="product-desc-preview">{product.description.substring(0, 60)}...</span>
                    )}
                  </div>
                  <div>
                    <span className="category-pill">{product.category}</span>
                  </div>
                  <div>
                    <span className="moq-badge">{product.moq || 50} Pcs</span>
                  </div>
                  <div>
                    <strong className="price-tag">${product.new_price}</strong>
                    {product.old_price && <span className="old-price-tag">${product.old_price}</span>}
                  </div>
                  <div>
                    <button
                      onClick={() => openEditModal(product)}
                      className="edit-action-btn"
                      style={{
                        backgroundColor: '#1e293b',
                        color: '#38bdf8',
                        border: '1px solid #334155',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ Edit Specs
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => removeProduct(product.id, product.name)}
                      className="delete-action-btn"
                      title="Remove Product"
                    >
                      <img src={cross_icon} alt="Delete" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-overlay-b2b" style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justify: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px',
            width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', color: '#fff'
          }}>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '12px', mb: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'serif', fontStyle: 'italic', fontSize: '20px' }}>Edit Wholesale Product Specs #{editFormData.id}</h3>
              <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa' }}>Product Title *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa' }}>Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
                  >
                    {Array.from(new Set([
                      ...categories.map(c => c.name),
                      "Tracksuits", "Sweatshirts", "Activewear", "T-Shirts", "Trousers", "Outerwear"
                    ])).map((catName, idx) => (
                      <option key={idx} value={catName}>{catName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa' }}>Bulk Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.new_price}
                    onChange={(e) => setEditFormData({ ...editFormData, new_price: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa' }}>MOQ (Pcs)</label>
                  <input
                    type="number"
                    value={editFormData.moq}
                    onChange={(e) => setEditFormData({ ...editFormData, moq: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa' }}>Full Description *</label>
                <textarea
                  rows={4}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa' }}>Material</label>
                  <input
                    type="text"
                    value={editFormData.material}
                    onChange={(e) => setEditFormData({ ...editFormData, material: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa' }}>GSM Weight</label>
                  <input
                    type="text"
                    value={editFormData.gsm}
                    onChange={(e) => setEditFormData({ ...editFormData, gsm: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa' }}>Colors (Comma Separated)</label>
                  <input
                    type="text"
                    value={editFormData.colors}
                    onChange={(e) => setEditFormData({ ...editFormData, colors: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa' }}>Sizes (Comma Separated)</label>
                  <input
                    type="text"
                    value={editFormData.sizes}
                    onChange={(e) => setEditFormData({ ...editFormData, sizes: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa' }}>Product Image URL</label>
                <input
                  type="text"
                  value={editFormData.image}
                  onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save Changes 💾
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  style={{ backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductList;
