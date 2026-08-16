import React, { useEffect, useState } from 'react';
import './BannerManager.css';
import { API_URL } from '../../config';

const BannerManager = () => {
  const [categories, setCategories] = useState([]);
  const [uploadingSection, setUploadingSection] = useState(null);
  const [banners, setBanners] = useState({
    tallVertical: {
      category: 'Tracksuits',
      title: 'FLAGSHIP TEAM TRACKSUITS',
      subtitle: 'Custom 330 GSM combed fleece & interlock sets engineered for elite athletics.',
      badge: 'FLAGSHIP SPEC',
      ctaText: 'Explore Tracksuits',
      bgImage: 'https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=1200&auto=format&fit=crop'
    },
    wideFeature: {
      category: 'Sweatshirts',
      title: 'HEAVYWEIGHT 350 GSM HOODIES',
      subtitle: '100% French Terry pullovers & drop-shoulder streetwear cuts ready for 3D embroidery.',
      discountText: '15% BULK DISCOUNT',
      badge: 'HIGH-DENSITY EMBROIDERY',
      ctaText: 'View Hoodies',
      bgImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop'
    },
    compactA: {
      category: 'Trousers',
      title: 'Tri-Blend Athletic Joggers',
      subtitle: 'Reinforced zipper pockets & ribbed cuffs',
      discountText: '10% OFF',
      ctaText: 'Shop Joggers',
      bgImage: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000&auto=format&fit=crop'
    },
    compactB: {
      category: 'Activewear',
      title: 'Pro Compression Sets',
      subtitle: 'Sweat-wicking 4-way performance stretch',
      discountText: 'PRO SPEC',
      ctaText: 'Shop Activewear',
      bgImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop'
    },
    oemStrip: {
      title: 'DIRECT OEM / ODM PRIVATE LABEL MANUFACTURING',
      subtitle: 'Full custom labeling, silicone tags, custom GSM weaving, and express airway cargo delivery worldwide.',
      badge: 'ISO 9001 CERTIFIED',
      ctaText: 'Request Tech-Pack Quote',
      bgImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2000&auto=format&fit=crop'
    }
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bento');

  const fetchBannersAndCategories = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        fetch(`${API_URL}/promotional-banners`),
        fetch(`${API_URL}/categories`)
      ]);
      const bData = await bRes.json();
      const cData = await cRes.json();

      if (bData) {
        setBanners({
          tallVertical: bData.tallVertical || banners.tallVertical,
          wideFeature: bData.wideFeature || banners.wideFeature,
          compactA: bData.compactA || banners.compactA,
          compactB: bData.compactB || banners.compactB,
          oemStrip: bData.oemStrip || banners.oemStrip,
          ...bData
        });
      }
      if (Array.isArray(cData)) setCategories(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannersAndCategories();
  }, []);

  const handleFileUpload = async (sectionKey, file) => {
    if (!file) return;
    setUploadingSection(sectionKey);
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
        updateBannerSection(sectionKey, 'bgImage', data.image_url);
        alert(`📷 Banner image for "${sectionKey}" uploaded successfully!`);
      } else {
        alert("Upload error: " + (data.error || "Failed to upload"));
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setUploadingSection(null);
    }
  };

  const handleSaveBanners = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/update-promotional-banners`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(banners)
      });
      const data = await res.json();
      if (data.success) {
        alert("🎉 Bento-Style Promotional Banners Saved & Synced Live!");
        fetchBannersAndCategories();
      } else {
        alert("Error saving banners: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const updateBannerSection = (sectionKey, field, value) => {
    setBanners(prev => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [field]: value
      }
    }));
  };

  return (
    <div className="banner-manager-b2b">
      <div className="banner-manager-header">
        <div>
          <h2>Bento Grid Banner Studio</h2>
          <p>Configure the modern Bento-style promotional showcase and OEM banners displayed on the storefront.</p>
        </div>
        <div className="header-actions">
          <button 
            type="button" 
            onClick={() => setActiveTab(activeTab === 'bento' ? 'preview' : 'bento')}
            className="preview-toggle-btn"
          >
            {activeTab === 'bento' ? '👁️ View Live Bento Preview' : '✏️ Back to Editor'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-box">Loading Bento Grid Data...</div>
      ) : (
        <form onSubmit={handleSaveBanners} className="banner-sections-form">
          
          {/* LIVE BENTO GRID PREVIEW COMPONENT */}
          <div className="bento-live-preview-container">
            <div className="preview-heading">
              <span className="live-pill">LIVE BENTO PREVIEW</span>
              <h4>Storefront Bento Banner Architecture</h4>
            </div>

            <div className="bento-preview-grid">
              {/* Tile 1: Tall Vertical */}
              <div 
                className="bento-pv-tile bento-pv-tall"
                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), url(${banners.tallVertical?.bgImage})` }}
              >
                <div className="bento-pv-badge">{banners.tallVertical?.badge || "FLAGSHIP SPEC"}</div>
                <div className="bento-pv-content">
                  <h5>{banners.tallVertical?.title}</h5>
                  <p>{banners.tallVertical?.subtitle}</p>
                  <span className="bento-pv-btn">{banners.tallVertical?.ctaText || "Explore"}</span>
                </div>
              </div>

              {/* Stack Right */}
              <div className="bento-pv-stack">
                {/* Tile 2: Wide */}
                <div 
                  className="bento-pv-tile bento-pv-wide"
                  style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), url(${banners.wideFeature?.bgImage})` }}
                >
                  <div className="bento-pv-tag">{banners.wideFeature?.discountText || "15% BULK DISCOUNT"}</div>
                  <div className="bento-pv-content">
                    <h5>{banners.wideFeature?.title}</h5>
                    <p>{banners.wideFeature?.subtitle}</p>
                    <span className="bento-pv-link">{banners.wideFeature?.ctaText || "View Collection"} →</span>
                  </div>
                </div>

                {/* Dual Compact Cards */}
                <div className="bento-pv-compact-row">
                  <div 
                    className="bento-pv-tile bento-pv-compact"
                    style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), url(${banners.compactA?.bgImage})` }}
                  >
                    <div className="bento-pv-pill">{banners.compactA?.discountText || "10% OFF"}</div>
                    <div className="bento-pv-content">
                      <h6>{banners.compactA?.title}</h6>
                    </div>
                  </div>

                  <div 
                    className="bento-pv-tile bento-pv-compact"
                    style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), url(${banners.compactB?.bgImage})` }}
                  >
                    <div className="bento-pv-pill">{banners.compactB?.discountText || "PRO SPEC"}</div>
                    <div className="bento-pv-content">
                      <h6>{banners.compactB?.title}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 5: OEM Strip Preview */}
            <div 
              className="bento-pv-strip"
              style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.6)), url(${banners.oemStrip?.bgImage})` }}
            >
              <div>
                <span className="bento-pv-badge">{banners.oemStrip?.badge || "ISO 9001 CERTIFIED"}</span>
                <h5>{banners.oemStrip?.title}</h5>
                <p>{banners.oemStrip?.subtitle}</p>
              </div>
              <span className="bento-pv-btn">{banners.oemStrip?.ctaText || "Request Quote"}</span>
            </div>
          </div>

          {/* EDITORS FOR ALL BENTO TILES */}
          <div className="bento-editors-grid">
            
            {/* Tile 1 Editor */}
            <div className="banner-card">
              <h3>📐 1. Vertical Tall Feature Tile (Column 1)</h3>
              <div className="banner-inputs-grid">
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    value={banners.tallVertical?.title || ''}
                    onChange={(e) => updateBannerSection('tallVertical', 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label>Category Target</label>
                  <select
                    value={banners.tallVertical?.category || ''}
                    onChange={(e) => updateBannerSection('tallVertical', 'category', e.target.value)}
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label>Badge Text</label>
                  <input
                    type="text"
                    value={banners.tallVertical?.badge || ''}
                    onChange={(e) => updateBannerSection('tallVertical', 'badge', e.target.value)}
                  />
                </div>
                <div>
                  <label>CTA Button Text</label>
                  <input
                    type="text"
                    value={banners.tallVertical?.ctaText || ''}
                    onChange={(e) => updateBannerSection('tallVertical', 'ctaText', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Subtitle / Feature Specs</label>
                  <textarea
                    rows={2}
                    value={banners.tallVertical?.subtitle || ''}
                    onChange={(e) => updateBannerSection('tallVertical', 'subtitle', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Background Image</label>
                  <div className="upload-input-group">
                    <input
                      type="text"
                      value={banners.tallVertical?.bgImage || ''}
                      onChange={(e) => updateBannerSection('tallVertical', 'bgImage', e.target.value)}
                    />
                    <label className="file-upload-btn-custom">
                      {uploadingSection === 'tallVertical' ? "..." : "📷 Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleFileUpload('tallVertical', e.target.files[0])}
                      />
                    </label>
                  </div>
                  {/* IMAGE DIMENSION GUIDELINE NOTICE */}
                  <div className="image-spec-guide-badge">
                    📐 <strong>Recommended Size:</strong> 800 × 1200 px (2:3 Portrait Ratio) | Max 5MB | WebP, JPG, PNG
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 2 Editor */}
            <div className="banner-card">
              <h3>📦 2. Wide Horizontal Feature Tile (Column 2 Top)</h3>
              <div className="banner-inputs-grid">
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    value={banners.wideFeature?.title || ''}
                    onChange={(e) => updateBannerSection('wideFeature', 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label>Category Target</label>
                  <select
                    value={banners.wideFeature?.category || ''}
                    onChange={(e) => updateBannerSection('wideFeature', 'category', e.target.value)}
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label>Discount / Highlight Tag</label>
                  <input
                    type="text"
                    value={banners.wideFeature?.discountText || ''}
                    onChange={(e) => updateBannerSection('wideFeature', 'discountText', e.target.value)}
                  />
                </div>
                <div>
                  <label>Badge Text</label>
                  <input
                    type="text"
                    value={banners.wideFeature?.badge || ''}
                    onChange={(e) => updateBannerSection('wideFeature', 'badge', e.target.value)}
                  />
                </div>
                <div>
                  <label>CTA Link Text</label>
                  <input
                    type="text"
                    value={banners.wideFeature?.ctaText || ''}
                    onChange={(e) => updateBannerSection('wideFeature', 'ctaText', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={banners.wideFeature?.subtitle || ''}
                    onChange={(e) => updateBannerSection('wideFeature', 'subtitle', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Background Image</label>
                  <div className="upload-input-group">
                    <input
                      type="text"
                      value={banners.wideFeature?.bgImage || ''}
                      onChange={(e) => updateBannerSection('wideFeature', 'bgImage', e.target.value)}
                    />
                    <label className="file-upload-btn-custom">
                      {uploadingSection === 'wideFeature' ? "..." : "📷 Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleFileUpload('wideFeature', e.target.files[0])}
                      />
                    </label>
                  </div>
                  {/* IMAGE DIMENSION GUIDELINE NOTICE */}
                  <div className="image-spec-guide-badge">
                    📐 <strong>Recommended Size:</strong> 1600 × 800 px (2:1 Widescreen Ratio) | Max 5MB | WebP, JPG, PNG
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 3 Editor: Compact A */}
            <div className="banner-card">
              <h3>🏷️ 3. Compact Spotlight A (Column 2 Bottom-Left)</h3>
              <div className="banner-inputs-grid">
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    value={banners.compactA?.title || ''}
                    onChange={(e) => updateBannerSection('compactA', 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label>Category Target</label>
                  <select
                    value={banners.compactA?.category || ''}
                    onChange={(e) => updateBannerSection('compactA', 'category', e.target.value)}
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label>Discount Badge</label>
                  <input
                    type="text"
                    value={banners.compactA?.discountText || ''}
                    onChange={(e) => updateBannerSection('compactA', 'discountText', e.target.value)}
                  />
                </div>
                <div>
                  <label>CTA Text</label>
                  <input
                    type="text"
                    value={banners.compactA?.ctaText || ''}
                    onChange={(e) => updateBannerSection('compactA', 'ctaText', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={banners.compactA?.subtitle || ''}
                    onChange={(e) => updateBannerSection('compactA', 'subtitle', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Background Image</label>
                  <div className="upload-input-group">
                    <input
                      type="text"
                      value={banners.compactA?.bgImage || ''}
                      onChange={(e) => updateBannerSection('compactA', 'bgImage', e.target.value)}
                    />
                    <label className="file-upload-btn-custom">
                      {uploadingSection === 'compactA' ? "..." : "📷 Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleFileUpload('compactA', e.target.files[0])}
                      />
                    </label>
                  </div>
                  {/* IMAGE DIMENSION GUIDELINE NOTICE */}
                  <div className="image-spec-guide-badge">
                    📐 <strong>Recommended Size:</strong> 800 × 600 px (4:3 Aspect Ratio) | Max 5MB | WebP, JPG, PNG
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 4 Editor: Compact B */}
            <div className="banner-card">
              <h3>⚡ 4. Compact Spotlight B (Column 2 Bottom-Right)</h3>
              <div className="banner-inputs-grid">
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    value={banners.compactB?.title || ''}
                    onChange={(e) => updateBannerSection('compactB', 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label>Category Target</label>
                  <select
                    value={banners.compactB?.category || ''}
                    onChange={(e) => updateBannerSection('compactB', 'category', e.target.value)}
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label>Spec Badge</label>
                  <input
                    type="text"
                    value={banners.compactB?.discountText || ''}
                    onChange={(e) => updateBannerSection('compactB', 'discountText', e.target.value)}
                  />
                </div>
                <div>
                  <label>CTA Text</label>
                  <input
                    type="text"
                    value={banners.compactB?.ctaText || ''}
                    onChange={(e) => updateBannerSection('compactB', 'ctaText', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={banners.compactB?.subtitle || ''}
                    onChange={(e) => updateBannerSection('compactB', 'subtitle', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Background Image</label>
                  <div className="upload-input-group">
                    <input
                      type="text"
                      value={banners.compactB?.bgImage || ''}
                      onChange={(e) => updateBannerSection('compactB', 'bgImage', e.target.value)}
                    />
                    <label className="file-upload-btn-custom">
                      {uploadingSection === 'compactB' ? "..." : "📷 Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleFileUpload('compactB', e.target.files[0])}
                      />
                    </label>
                  </div>
                  {/* IMAGE DIMENSION GUIDELINE NOTICE */}
                  <div className="image-spec-guide-badge">
                    📐 <strong>Recommended Size:</strong> 800 × 600 px (4:3 Aspect Ratio) | Max 5MB | WebP, JPG, PNG
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 5 Editor: OEM Strip */}
            <div className="banner-card full-width">
              <h3>🏭 5. Direct Factory OEM / ODM Innovation Strip</h3>
              <div className="banner-inputs-grid">
                <div>
                  <label>Strip Title</label>
                  <input
                    type="text"
                    value={banners.oemStrip?.title || ''}
                    onChange={(e) => updateBannerSection('oemStrip', 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label>Certification Badge</label>
                  <input
                    type="text"
                    value={banners.oemStrip?.badge || ''}
                    onChange={(e) => updateBannerSection('oemStrip', 'badge', e.target.value)}
                  />
                </div>
                <div>
                  <label>CTA Button Text</label>
                  <input
                    type="text"
                    value={banners.oemStrip?.ctaText || ''}
                    onChange={(e) => updateBannerSection('oemStrip', 'ctaText', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Subtitle / Capabilities Summary</label>
                  <textarea
                    rows={2}
                    value={banners.oemStrip?.subtitle || ''}
                    onChange={(e) => updateBannerSection('oemStrip', 'subtitle', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Panoramic Background Image</label>
                  <div className="upload-input-group">
                    <input
                      type="text"
                      value={banners.oemStrip?.bgImage || ''}
                      onChange={(e) => updateBannerSection('oemStrip', 'bgImage', e.target.value)}
                    />
                    <label className="file-upload-btn-custom">
                      {uploadingSection === 'oemStrip' ? "..." : "📷 Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleFileUpload('oemStrip', e.target.files[0])}
                      />
                    </label>
                  </div>
                  {/* IMAGE DIMENSION GUIDELINE NOTICE */}
                  <div className="image-spec-guide-badge">
                    📐 <strong>Recommended Size:</strong> 1920 × 600 px (16:5 Panoramic Ratio) | Max 5MB | WebP, JPG, PNG
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="save-actions-bar">
            <button type="submit" className="save-banners-btn">
              💾 Save & Publish Bento Banners Live
            </button>
          </div>

        </form>
      )}
    </div>
  );
};

export default BannerManager;
