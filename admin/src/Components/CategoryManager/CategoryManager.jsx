import React, { useEffect, useState } from 'react';
import './CategoryManager.css';
import { API_URL } from '../../config';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCatId, setEditingCatId] = useState(null);

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
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const res = await fetch(`${API_URL}/add-category`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        alert(`🎉 Category "${data.category.name}" created successfully!`);
        setFormData({ name: '', description: '', subcategories: '', banner: '' });
        fetchCategories();
      } else {
        alert("Error: " + (data.error || "Failed to create category"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
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
    try {
      const res = await fetch(`${API_URL}/edit-category`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (data.success) {
        alert(`✏️ Category "${data.category.name}" updated successfully!`);
        setEditingCatId(null);
        fetchCategories();
      } else {
        alert("Error updating category: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/delete-category`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🗑️ Category "${name}" deleted.`);
        fetchCategories();
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="category-manager-b2b">
      <div className="category-manager-header">
        <div>
          <h2>Category & Banner Manager</h2>
          <p>Create, edit, or remove product categories and upload full-width banners for the main website.</p>
        </div>
        <div className="cat-count-badge">
          Total Categories: <span>{categories.length}</span>
        </div>
      </div>

      {/* Add New Category Form */}
      <div className="add-cat-card">
        <h3>➕ Add New Category & Stretched Banner</h3>
        <form onSubmit={handleAddCategory} className="add-cat-form">
          <div className="form-row-2">
            <div>
              <label>Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Trousers, Jackets, Compression"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label>Full-Width Banner Image URL *</label>
              <input
                type="text"
                required
                placeholder="https://images.unsplash.com/..."
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
              />
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
            Create Category & Add Stretched Banner ➔
          </button>
        </form>
      </div>

      {/* Categories List & Inline Editor */}
      <div className="categories-list-section">
        <h3>Existing Product Categories</h3>

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
                    <span className="cat-slug-badge">{cat.slug}</span>
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

                      <label>Banner Image URL</label>
                      <input
                        type="text"
                        value={editFormData.banner}
                        onChange={(e) => setEditFormData({ ...editFormData, banner: e.target.value })}
                        required
                      />

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

                      <div className="cat-actions-row">
                        <button
                          onClick={() => startEditCategory(cat)}
                          className="edit-cat-btn"
                        >
                          Edit Category ✏️
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
