import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, PlusCircle, ArrowLeft, UploadCloud } from 'lucide-react';
import { API_URL } from '../../config';
import {
  loadCatalogProducts,
  loadCategories,
  fetchCloudCategories,
  addCloudProduct,
  uploadCloudImage
} from '../../defaultCatalog';

const AddProduct = () => {
  const navigate = useNavigate();
  const [primaryImage, setPrimaryImage] = useState(null);
  const [categories, setCategories] = useState(() => loadCategories());
  const [colorsInput, setColorsInput] = useState("Black, Navy Blue, Heather Gray, Crimson Red");
  const [submitting, setSubmitting] = useState(false);
  const [showCustomCat, setShowCustomCat] = useState(false);
  const [customCatInput, setCustomCatInput] = useState("");

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "Tracksuits",
    old_price: "",
    new_price: "",
    moq: 50,
    description: "High-grade combed fleece fabric. Moisture-wicking, anti-pilling, reinforced stitching. Custom OEM/ODM logo printing and private labeling available.",
    material: "80% Combed Cotton / 20% Polyester",
    gsm: "330 GSM Heavyweight",
    stitching: "Double-Needle Flatlock Seams",
    customization: "3D Embroidery, Screen Print, Woven Damask Tags",
    leadTime: "12 - 15 Business Days",
    stock: 5000
  });

  useEffect(() => {
    fetchCloudCategories().then(cats => {
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
        setProductDetails(prev => ({ ...prev, category: cats[0].name }));
      }
    });
  }, []);

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const primaryImageHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPrimaryImage(e.target.files[0]);
      showToast("Cover image selected: " + e.target.files[0].name, "success");
    }
  };

  const Add_Product = async () => {
    if (!productDetails.name || !productDetails.new_price) {
      showToast("Please provide both Product Title and Bulk Unit Price.", "error");
      return;
    }

    setSubmitting(true);
    try {
      let primaryUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
      
      if (primaryImage) {
        try {
          primaryUrl = await uploadCloudImage(primaryImage);
        } catch (e) {
          console.warn("Primary image upload notice:", e);
        }
      }

      const colorsArray = colorsInput
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const currentList = loadCatalogProducts();
      const maxId = currentList.reduce((max, p) => (p.id > max ? p.id : max), 0);
      const newId = maxId + 1;

      const resolvedCategory = showCustomCat && customCatInput.trim()
        ? customCatInput.trim()
        : productDetails.category;

      const newProductObj = {
        id: newId,
        name: productDetails.name.trim(),
        category: resolvedCategory,
        old_price: Number(productDetails.old_price) || Number(productDetails.new_price) * 1.3,
        new_price: Number(productDetails.new_price),
        moq: Number(productDetails.moq) || 50,
        description: productDetails.description,
        material: productDetails.material,
        gsm: productDetails.gsm,
        stitching: productDetails.stitching,
        customization: productDetails.customization,
        leadTime: productDetails.leadTime,
        stock: Number(productDetails.stock) || 1000,
        colors: colorsArray.length > 0 ? colorsArray : ["Black", "Navy Blue"],
        sizes: ["S", "M", "L", "XL", "2XL"],
        image: primaryUrl,
        images: [primaryUrl],
        available: true,
        date: new Date().toISOString()
      };

      // 1. Authoritative Backend save + broadcast across tabs
      await addCloudProduct(newProductObj);

      showToast(`🎉 Product "${newProductObj.name}" added and synced live to Storefront!`, "success");

      setTimeout(() => {
        navigate('/list-product');
      }, 1000);

    } catch (err) {
      console.error(err);
      showToast("Error adding product: " + err.message, "error");
      setSubmitting(false);
    }
  };

  return (
    <div className='add-product-b2b'>
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
          fontWeight: '600'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="add-product-header">
        <div>
          <h2>Add Bulk Sportswear Product</h2>
          <p>Configure wholesale parameters, pricing tiers, minimum order quantities (MOQ), and instant storefront publishing.</p>
        </div>
      </div>

      <div className="add-product-form">
        <div className="add-product-itemfield">
          <label>Product Title / Design Name *</label>
          <input
            value={productDetails.name}
            onChange={changeHandler}
            type="text"
            name='name'
            placeholder='e.g., Performance Fleece Tracksuit Set'
          />
        </div>

        <div className="add-product-grid-3">
          <div className="add-product-itemfield">
            <label>Target Category *</label>
            {!showCustomCat ? (
              <select 
                value={productDetails.category} 
                onChange={(e) => {
                  if (e.target.value === "__NEW__") {
                    setShowCustomCat(true);
                  } else {
                    changeHandler(e);
                  }
                }} 
                name="category" 
                className='add-product-selector'
              >
                {Array.from(new Set([
                  ...categories.map(c => c.name),
                  "Tracksuits", "Sweatshirts", "Activewear", "T-Shirts", "Trousers", "Outerwear"
                ])).map((catName, idx) => (
                  <option key={idx} value={catName}>{catName}</option>
                ))}
                <option value="__NEW__">➕ Type Custom Category...</option>
              </select>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="New category name..."
                  value={customCatInput}
                  onChange={(e) => setCustomCatInput(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCustomCat(false)}
                  style={{
                    backgroundColor: '#334155',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="add-product-itemfield">
            <label>Bulk Unit Price ($) *</label>
            <input
              value={productDetails.new_price}
              onChange={changeHandler}
              type="number"
              step="0.01"
              name="new_price"
              placeholder='e.g., 24.50'
            />
          </div>

          <div className="add-product-itemfield">
            <label>Sample Single Price ($)</label>
            <input
              value={productDetails.old_price}
              onChange={changeHandler}
              type="number"
              step="0.01"
              name="old_price"
              placeholder='e.g., 45.00'
            />
          </div>
        </div>

        <div className="add-product-grid-2">
          <div className="add-product-itemfield">
            <label>Minimum Order Quantity (MOQ Pcs)</label>
            <input
              value={productDetails.moq}
              onChange={changeHandler}
              type="number"
              name="moq"
              placeholder='e.g., 50'
            />
          </div>

          <div className="add-product-itemfield">
            <label>Stock / Production Capacity (Pcs)</label>
            <input
              value={productDetails.stock}
              onChange={changeHandler}
              type="number"
              name="stock"
              placeholder='e.g., 5000'
            />
          </div>
        </div>

        <div className="specs-fields-box">
          <h4>Technical Fabric Specifications</h4>
          <div className="add-product-grid-2">
            <div className="add-product-itemfield">
              <label>Material Blend</label>
              <input
                value={productDetails.material}
                onChange={changeHandler}
                type="text"
                name="material"
                placeholder='e.g., 80% Combed Cotton / 20% Polyester'
              />
            </div>

            <div className="add-product-itemfield">
              <label>Fabric Weight (GSM)</label>
              <input
                value={productDetails.gsm}
                onChange={changeHandler}
                type="text"
                name="gsm"
                placeholder='e.g., 330 GSM Heavyweight'
              />
            </div>

            <div className="add-product-itemfield">
              <label>Stitching & Hardware</label>
              <input
                value={productDetails.stitching}
                onChange={changeHandler}
                type="text"
                name="stitching"
                placeholder='e.g., Double-Needle Flatlock Seams'
              />
            </div>

            <div className="add-product-itemfield">
              <label>Custom Branding Options</label>
              <input
                value={productDetails.customization}
                onChange={changeHandler}
                type="text"
                name="customization"
                placeholder='e.g., 3D Embroidery, Screen Print, Rubber Tags'
              />
            </div>
          </div>
        </div>

        <div className="add-product-itemfield">
          <label>Available Color Options (comma separated)</label>
          <input
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            type="text"
            placeholder='Black, Navy Blue, Heather Gray, Crimson Red'
          />
        </div>

        <div className="add-product-itemfield">
          <label>Product Overview & Wholesale Description *</label>
          <textarea
            rows="4"
            value={productDetails.description}
            onChange={changeHandler}
            name="description"
            placeholder='Provide comprehensive product description for B2B buyers...'
          />
        </div>

        <div className="add-product-images-section">
          <div className="add-product-image-box">
            <label className="image-label">Main Cover Image (Required) *</label>
            <label htmlFor="primary-file-input" className="file-preview-box">
              <img
                src={primaryImage ? URL.createObjectURL(primaryImage) : upload_area}
                className='thumbnail-img'
                alt="Primary Preview"
              />
              <span>{primaryImage ? primaryImage.name : "Click to Upload Main Cover"}</span>
            </label>
            <input onChange={primaryImageHandler} type="file" id='primary-file-input' hidden accept="image/*" />
            <div className="image-spec-guide-badge">
              📐 <strong>Recommended Dimensions:</strong> 800 × 800 px (1:1 Square) or 800 × 1000 px (4:5 Crop) | Max 5MB | WebP, JPG, PNG
              <span className="spec-subtip">💡 Tip: Use high-resolution product photography on solid or neutral studio backgrounds.</span>
            </div>
          </div>
        </div>

        <button
          onClick={Add_Product}
          disabled={submitting}
          className='add-product-submit-btn'
          style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
        >
          {submitting ? 'Publishing & Syncing to Live Storefront...' : 'Publish Wholesale Product ➔'}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
