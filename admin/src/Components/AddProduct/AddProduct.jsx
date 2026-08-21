import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import { API_URL } from '../../config';
import { loadCatalogProducts, saveCatalogProducts, loadCategories, saveCategories, fetchCloudCategories, addCloudProduct } from '../../defaultCatalog';

const AddProduct = () => {
  const [primaryImage, setPrimaryImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [categories, setCategories] = useState(() => loadCategories());
  const [colorsInput, setColorsInput] = useState("Black, Navy Blue, Heather Gray, Crimson Red");
  
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
    }
  };

  const galleryImagesHandler = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 4);
      setGalleryImages(selectedFiles);
    }
  };

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80");
      reader.readAsDataURL(file);
    });
  };

  const Add_Product = async () => {
    if (!productDetails.name || !productDetails.new_price) {
      alert("Please fill in the product title and bulk unit price.");
      return;
    }

    try {
      let primaryUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";
      
      if (primaryImage) {
        try {
          let primaryFormData = new FormData();
          primaryFormData.append('product', primaryImage);

          let uploadRes = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: primaryFormData
          });
          let uploadData = await uploadRes.json();
          if (uploadData && uploadData.success && uploadData.image_url) {
            primaryUrl = uploadData.image_url;
          } else {
            primaryUrl = await readFileAsDataUrl(primaryImage);
          }
        } catch (e) {
          primaryUrl = await readFileAsDataUrl(primaryImage);
        }
      }

      const colorsArray = colorsInput
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const currentList = loadCatalogProducts();
      const maxId = currentList.reduce((max, p) => (p.id > max ? p.id : max), 0);
      const newId = maxId + 1;

      const newProductObj = {
        id: newId,
        name: productDetails.name,
        category: productDetails.category,
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

      // 1. Save locally and to Supabase Cloud Database
      await addCloudProduct(newProductObj);

      // 2. Sync to Backend API if present
      try {
        await fetch(`${API_URL}/add-product`, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(newProductObj)
        });
      } catch (err) {}

      alert("🎉 DAAN Sports Product Added Successfully & Synced to Cloud Database!");
      window.location.replace('/list-product');

    } catch (err) {
      console.error(err);
      alert("Error adding product: " + err.message);
    }
  };

  return (
    <div className='add-product-b2b'>
      <div className="add-product-header">
        <h2>Add Bulk Sportswear Product</h2>
        <p>Configure wholesale parameters, pricing tiers, minimum order quantities (MOQ), fabric specs, and gallery media.</p>
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
            <select 
              value={productDetails.category} 
              onChange={(e) => {
                if (e.target.value === "__NEW__") {
                  const customName = prompt("Enter new category name:");
                  if (customName && customName.trim()) {
                    setProductDetails({ ...productDetails, category: customName.trim() });
                  }
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
          </div>

          <div className="add-product-itemfield">
            <label>Bulk Unit Price ($) *</label>
            <input
              value={productDetails.new_price}
              onChange={changeHandler}
              type="number"
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

        <button onClick={Add_Product} className='add-product-submit-btn'>
          Publish Wholesale Product ➔
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
