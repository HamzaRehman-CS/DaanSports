import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { Edit3, Trash2, Search, CheckCircle2, AlertCircle, RefreshCw, Plus, X, UploadCloud, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';
import {
  loadCatalogProducts,
  saveCatalogProducts,
  loadCategories,
  saveCategories,
  fetchCloudProducts,
  fetchCloudCategories,
  updateCloudProduct,
  deleteCloudProduct,
  uploadCloudImage
} from '../../defaultCatalog';

const ProductList = () => {
  const [allProducts, setAllProducts] = useState(() => loadCatalogProducts());
  const [categories, setCategories] = useState(() => loadCategories());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Non-blocking Toast Notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchAllProducts = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const [prods, cats] = await Promise.all([
        fetchCloudProducts(),
        fetchCloudCategories()
      ]);
      if (Array.isArray(prods) && prods.length > 0) {
        setAllProducts(prods);
      }
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
      if (manual) showToast("Wholesale inventory re-synchronized with live server", "success");
    } catch (err) {
      const stored = loadCatalogProducts();
      if (stored && stored.length > 0) setAllProducts(stored);
    } finally {
      if (manual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    const interval = setInterval(fetchAllProducts, 5000);
    const handleFocus = () => fetchAllProducts();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const removeProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from wholesale inventory?`)) {
      return;
    }
    try {
      const updated = await deleteCloudProduct(id);
      setAllProducts(updated);
      showToast(`Product "${name}" removed. Live storefront updated!`, 'success');
    } catch (err) {
      showToast(`Error removing product: ${err.message}`, 'error');
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
    setSavingEdit(true);
    try {
      const colorsArr = Array.isArray(editFormData.colors)
        ? editFormData.colors
        : (typeof editFormData.colors === 'string' ? editFormData.colors.split(',') : []);
      
      const sizesArr = Array.isArray(editFormData.sizes)
        ? editFormData.sizes
        : (typeof editFormData.sizes === 'string' ? editFormData.sizes.split(',') : []);

      const payload = {
        ...editFormData,
        colors: colorsArr.map(c => typeof c === 'string' ? c.trim() : c).filter(Boolean),
        sizes: sizesArr.map(s => typeof s === 'string' ? s.trim() : s).filter(Boolean)
      };

      // Direct local backend update + cross-tab broadcast
      const updated = await updateCloudProduct(payload);
      setAllProducts(updated);
      setEditingProduct(null);

      showToast(`"${payload.name}" updated! Changes live on storefront.`, 'success');
    } catch (err) {
      showToast(`Save failed: ${err.message}`, 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || (p.category || '').toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className='product-list-b2b'>
      {/* Toast Banner */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '13px',
          fontWeight: '600',
          animation: 'slideInRight 0.25s ease-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="product-list-header">
        <div>
          <h2>Wholesale Products Catalog</h2>
          <p>Live inventory specifications, wholesale tiers, fabric formulations, and instant storefront synchronization.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => fetchAllProducts(true)}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1e293b',
              color: '#94a3b8',
              border: '1px solid #334155',
              padding: '8px 14px',
              borderRadius: '7px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} className={refreshing ? 'spin-icon' : ''} />
            {refreshing ? 'Syncing...' : 'Sync Live'}
          </button>
          <Link
            to="/add-product"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '7px',
              fontSize: '12px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            <Plus size={14} /> Add Product
          </Link>
          <div className="product-count-badge">
            Showing: <span>{filteredProducts.length} / {allProducts.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
          <input 
            type="text"
            placeholder="Search wholesale product catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '9px 16px 9px 36px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
            padding: '9px 16px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">All Categories ({allProducts.length})</option>
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
          <Link to="/add-product" className="add-first-btn">
            <Plus size={14} /> Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="product-table-wrapper">
          <div className="products-table-header">
            <p>Product</p>
            <p>Title & Specs</p>
            <p>Category</p>
            <p>MOQ</p>
            <p>Bulk Price</p>
            <p style={{ textAlign: 'center' }}>Edit</p>
            <p style={{ textAlign: 'center' }}>Remove</p>
          </div>

          <div className="products-table-rows">
            {filteredProducts.map((product) => {
              return (
                <div key={product.id} className="products-table-row">
                  <div className="product-thumb-cell">
                    <img className='product-list-producticon' src={product.image} alt={product.name} />
                  </div>
                  <div className="product-title-cell">
                    <strong style={{ color: '#f8fafc', fontSize: '14px' }}>{product.name}</strong>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '3px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        ID #{product.id} • {product.gsm || '330 GSM'} • {product.material ? product.material.substring(0, 24) : 'Combed Fleece'}
                      </span>
                    </div>
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
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => openEditModal(product)}
                      className="edit-action-btn"
                      style={{
                        backgroundColor: '#1e293b',
                        color: '#38bdf8',
                        border: '1px solid #334155',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => removeProduct(product.id, product.name)}
                      className="delete-action-btn"
                      title="Remove Product"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '7px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={15} />
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
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px',
            width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '26px', color: '#fff',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                  Edit Wholesale Product Specifications
                </h3>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>ID #{editFormData.id} • Updates sync live to store</span>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>Product Title *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: '6px', fontSize: '13px' }}
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
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>Bulk Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editFormData.new_price}
                    onChange={(e) => setEditFormData({ ...editFormData, new_price: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>MOQ (Pcs)</label>
                  <input
                    type="number"
                    value={editFormData.moq}
                    onChange={(e) => setEditFormData({ ...editFormData, moq: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>Material Composition</label>
                  <input
                    type="text"
                    value={editFormData.material}
                    onChange={(e) => setEditFormData({ ...editFormData, material: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>GSM Weight</label>
                  <input
                    type="text"
                    value={editFormData.gsm}
                    onChange={(e) => setEditFormData({ ...editFormData, gsm: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>Colors (Comma Separated)</label>
                  <input
                    type="text"
                    value={editFormData.colors}
                    onChange={(e) => setEditFormData({ ...editFormData, colors: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>Sizes (Comma Separated)</label>
                  <input
                    type="text"
                    value={editFormData.sizes}
                    onChange={(e) => setEditFormData({ ...editFormData, sizes: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>Product Image URL</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={editFormData.image}
                    onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                    style={{ flex: 1, background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '9px 12px', borderRadius: '6px', fontSize: '13px' }}
                  />
                  <label style={{ background: '#334155', color: '#fff', padding: '9px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UploadCloud size={14} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={async (e) => {
                        if (!e.target.files?.[0]) return;
                        try {
                          const publicUrl = await uploadCloudImage(e.target.files[0]);
                          setEditFormData(prev => ({ ...prev, image: publicUrl }));
                          showToast("Product image uploaded successfully!", "success");
                        } catch (err) {
                          showToast("Upload notice: " + err.message, "error");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="submit"
                  disabled={savingEdit}
                  style={{
                    flex: 1,
                    backgroundColor: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '7px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  {savingEdit ? 'Saving Changes...' : 'Save & Sync Live 💾'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  style={{
                    backgroundColor: '#334155',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '7px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
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
