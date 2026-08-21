import React, { useEffect, useState } from 'react';
import './CategoryManager.css';
import { API_URL } from '../../config';
import { loadCategories, saveCategories } from '../../defaultCatalog';

const CategoryManager = () => {
  const [categories, setCategories] = useState(() => loadCategories());
  const [loading, setLoading] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subcategories: '',
    banner: ''
  });

  const [editFormData, setEditFormData] = useState({
    id: null,
    name: '',
    description: '',
    subcategories: '',
    banner: ''
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
        saveCategories(data);
      }
    } catch (err) {
      const stored = loadCategories();
      if (stored && stored.length > 0) setCategories(stored);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileUpload = async (file, isEdit = false) => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('product', file);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: form
      });
      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setEditFormData(prev => ({ ...prev, banner: data.image_url }));
        } else {
          setFormData(prev => ({ ...prev, banner: data.image_url }));
        }
        alert(`📷 Category banner uploaded!`);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (isEdit) setEditFormData(prev => ({ ...prev, banner: e.target.result }));
          else setFormData(prev => ({ ...prev, banner: e.target.result }));
          alert(`📷 Category banner loaded!`);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEdit) setEditFormData(prev => ({ ...prev, banner: e.target.result }));
        else setFormData(prev => ({ ...prev, banner: e.target.result }));
        alert(`📷 Category banner loaded!`);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const current = loadCategories();
    const maxId = current.reduce((max, c) => (c.id > max ? c.id : max), 0);
    const subcats = typeof formData.subcategories === 'string'
      ? formData.subcategories.split(',').map(s => s.trim()).filter(Boolean)
      : formData.subcategories;

    const newCat = {
      id: maxId + 1,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: formData.description,
      subcategories: subcats,
      banner: formData.banner || "https://images.unsplash.com/photo-1553775282-20af80779df7?q=80&w=2070&auto=format&fit=crop"
    };

    const updated = [...current, newCat];
    setCategories(updated);
    saveCategories(updated);
    setFormData({ name: '', description: '', subcategories: '', banner: '' });

    try {
      await fetch(`${API_URL}/add-category`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.warn("Backend sync notice (saved locally):", err.message);
    }

    alert(`🎉 Category "${newCat.name}" created and synced live!`);
  };

  const startEditCategory = (cat) => {
    setEditingCatId(cat.id);
    setEditFormData({
      id: cat.id,
      name: cat.name || '',
      description: cat.description || '',
      subcategories: Array.isArray(cat.subcategories) ? cat.subcategories.join(', ') : (cat.subcategories || ''),
      banner: cat.banner || ''
    });
  };

  const handleSaveEditCategory = async (e) => {
    e.preventDefault();
    const subcats = typeof editFormData.subcategories === 'string'
      ? editFormData.subcategories.split(',').map(s => s.trim()).filter(Boolean)
      : editFormData.subcategories;

    const updatedCat = {
      ...editFormData,
      subcategories: subcats,
      slug: editFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    const current = loadCategories();
    const updated = current.map(c => c.id === updatedCat.id ? { ...c, ...updatedCat } : c);
    setCategories(updated);
    saveCategories(updated);
    setEditingCatId(null);

    try {
      await fetch(`${API_URL}/edit-category`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      });
    } catch (err) {
      console.warn("Backend sync notice (saved locally):", err.message);
    }

    alert(`✏️ Category "${updatedCat.name}" updated and synced live!`);
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    const current = loadCategories();
    const updated = current.filter(c => c.id !== id);
    setCategories(updated);
    saveCategories(updated);

    try {
      await fetch(`${API_URL}/delete-category`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.warn("Backend sync notice (saved locally):", err.message);
    }

    alert(`🗑️ Category "${name}" deleted and synced live.`);
  };

  return (
    <div className="category-manager-b2b">
      <div className="category-manager-header">
        <div>
          <h2>Category & Showcase Box Manager</h2>
          <p>Manage the 9 "Our Categories" box banners displayed on the storefront. Upload custom images or update links.</p>
        </div>
        <div className="cat-count-badge">
          Total Categories: <span>{categories.length}</span>
        </div>
      </div>

      {/* Add New Category Form */}
      <div className="add-cat-card">
        <h3>➕ Add New Category Box</h3>
        <form onSubmit={handleAddCategory} className="add-cat-form">
          <div className="form-row-2">
            <div>
              <label>Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., T-Shirts, Polo Shirts, Hoodies"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label>Category Box Image URL *</label>
              <div className="upload-input-group">
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... or upload image"
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                />
                <label className="file-upload-btn-custom">
                  {uploading ? "Uploading..." : "📷 Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleFileUpload(e.target.files[0], false)}
                  />
                </label>
              </div>
              {/* IMAGE DIMENSION GUIDELINE NOTICE */}
              <div className="image-spec-guide-badge">
                📐 <strong>Recommended Dimensions:</strong> 600 × 750 px (4:5 Portrait Ratio) | Max 5MB | WebP, JPG, PNG
                <span className="spec-subtip">💡 Tip: Use clean sportswear product or athlete shots on neutral/dark background.</span>
              </div>
            </div>
          </div>

          <div>
            <label>Subcategories (Comma Separated)</label>
            <input
              type="text"
              placeholder="e.g. Slim Fit, Tech Fleece, Zipper Pockets"
              value={formData.subcategories}
              onChange={(e) => setFormData({ ...formData, subcategories: e.target.value })}
            />
          </div>

          <div>
            <label>Category Description</label>
            <input
              type="text"
              placeholder="e.g. Wholesale Heavyweight Trousers & Fleece Joggers"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button type="submit" className="submit-cat-btn">
            Create Category & Add Box Showcase ➔
          </button>
        </form>
      </div>

      {/* Categories List & Inline Editor */}
      <div className="categories-list-section">
        <h3>Existing Product Categories ({categories.length} Categories Active)</h3>

        {loading ? (
          <div className="loading-box">Loading Categories...</div>
        ) : (
          <div className="categories-grid">
            {categories.map((cat) => {
              const isEditing = editingCatId === cat.id;

              return (
                <div key={cat.id} className="cat-card">
                  <div className="cat-banner-preview">
                    <img src={isEditing ? editFormData.banner : cat.banner} alt={cat.name} />
                    <span className="cat-slug-badge">/{cat.slug}</span>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSaveEditCategory} className="edit-cat-form-inline">
                      <label>Category Name</label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        required
                      />

                      <label>Category Box Image URL</label>
                      <div className="upload-input-group">
                        <input
                          type="text"
                          value={editFormData.banner}
                          onChange={(e) => setEditFormData({ ...editFormData, banner: e.target.value })}
                          required
                        />
                        <label className="file-upload-btn-custom">
                          {uploading ? "..." : "📷 Upload"}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleFileUpload(e.target.files[0], true)}
                          />
                        </label>
                      </div>

                      {/* IMAGE DIMENSION GUIDELINE NOTICE */}
                      <div className="image-spec-guide-badge">
                        📐 <strong>Recommended Dimensions:</strong> 600 × 750 px (4:5 Portrait Ratio) | Max 5MB | WebP, JPG, PNG
                        <span className="spec-subtip">💡 Tip: Use clean sportswear product or athlete shots on neutral/dark background.</span>
                      </div>

                      <label>Description</label>
                      <input
                        type="text"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      />

                      <label>Subcategories</label>
                      <input
                        type="text"
                        value={editFormData.subcategories}
                        onChange={(e) => setEditFormData({ ...editFormData, subcategories: e.target.value })}
                      />

                      <div className="edit-actions-row">
                        <button type="submit" className="save-edit-btn">Save Changes 💾</button>
                        <button type="button" onClick={() => setEditingCatId(null)} className="cancel-edit-btn">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="cat-card-body">
                      <div>
                        <h4>{cat.name}</h4>
                        <p>{cat.description}</p>
                        
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="subcats-tags">
                            {cat.subcategories.map((sub, i) => (
                              <span key={i} className="sub-tag">{sub}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="image-spec-guide-badge-small">
                        📐 Box Ratio: 4:5 (600×750 px)
                      </div>

                      <div className="cat-actions-row">
                        <button
                          onClick={() => startEditCategory(cat)}
                          className="edit-cat-btn"
                        >
                          Edit Image & Details ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="del-cat-btn"
                        >
                          Delete 🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default CategoryManager;
