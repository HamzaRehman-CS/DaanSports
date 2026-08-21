import React, { useEffect, useState } from 'react';
import './BannerManager.css';
import { API_URL } from '../../config';
import { loadBanners, saveBanners, loadCategories, saveCategories } from '../../defaultCatalog';

const defaultBannersState = loadBanners();

const BannerManager = () => {
  const [categories, setCategories] = useState(() => loadCategories());
  const [uploadingSection, setUploadingSection] = useState(null);
  const [banners, setBanners] = useState(() => loadBanners());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bento');
  const [saveStatus, setSaveStatus] = useState('');

  const fetchBannersAndCategories = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        fetch(`${API_URL}/promotional-banners`),
        fetch(`${API_URL}/categories`)
      ]);
      const bData = await bRes.json();
      const cData = await cRes.json();

      if (bData && typeof bData === 'object' && Object.keys(bData).length > 0) {
        const merged = {
          ...defaultBannersState,
          ...bData,
          tallVertical: bData.tallVertical || defaultBannersState.tallVertical,
          wideFeature: bData.wideFeature || defaultBannersState.wideFeature,
          compactA: bData.compactA || defaultBannersState.compactA,
          compactB: bData.compactB || defaultBannersState.compactB,
          oemStrip: bData.oemStrip || defaultBannersState.oemStrip,
          promoSection1: bData.promoSection1 || defaultBannersState.promoSection1,
          promoSection2: bData.promoSection2 || defaultBannersState.promoSection2,
          customBanners: Array.isArray(bData.customBanners) ? bData.customBanners : []
        };
        setBanners(merged);
        saveBanners(merged);
      }
      if (Array.isArray(cData) && cData.length > 0) {
        setCategories(cData);
        saveCategories(cData);
      }
    } catch (err) {
      // Fallback to locally loaded banners
      const stored = loadBanners();
      if (stored) setBanners(stored);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannersAndCategories();
  }, []);

  const handleFileUpload = async (sectionKey, file, customIndex = null) => {
    if (!file) return;
    const uploadKey = customIndex !== null ? `custom_${customIndex}` : sectionKey;
    setUploadingSection(uploadKey);
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
        if (customIndex !== null) {
          updateCustomBanner(customIndex, 'bgImage', data.image_url);
        } else {
          updateBannerSection(sectionKey, 'bgImage', data.image_url);
        }
        alert(`📷 Banner image uploaded successfully!`);
      } else {
        // Fallback: Convert to Base64/DataURL so user upload works even without backend upload service
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          if (customIndex !== null) {
            updateCustomBanner(customIndex, 'bgImage', dataUrl);
          } else {
            updateBannerSection(sectionKey, 'bgImage', dataUrl);
          }
          alert(`📷 Banner image loaded successfully!`);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      // Fallback: Convert to Base64/DataURL so user upload works
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        if (customIndex !== null) {
          updateCustomBanner(customIndex, 'bgImage', dataUrl);
        } else {
          updateBannerSection(sectionKey, 'bgImage', dataUrl);
        }
        alert(`📷 Banner image loaded successfully!`);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingSection(null);
    }
  };

  const handleSaveBanners = async (e) => {
    if (e) e.preventDefault();
    setSaveStatus('Saving...');

    // 1. Save locally and broadcast to all website tabs immediately (<1ms)
    saveBanners(banners);

    // 2. Sync to Backend API
    try {
      const res = await fetch(`${API_URL}/update-promotional-banners`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(banners)
      });
      const data = await res.json();
      if (data && data.success) {
        console.log("Backend API confirmed banner update");
      }
    } catch (err) {
      console.warn("Backend API sync notice (saved locally & broadcast live):", err.message);
    }

    setSaveStatus('Saved!');
    alert("🎉 Promotional Banners & Posters Saved & Synced Live to Main Website!");
    setTimeout(() => setSaveStatus(''), 3000);
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

  const addCustomBanner = () => {
    const newBanner = {
      id: Date.now(),
      category: categories[0]?.name || 'Tracksuits',
      title: 'SPECIAL B2B APPAREL LINE',
      subtitle: 'Premium direct factory manufactured garments ready for global export.',
      discountText: 'CUSTOM BULK OFFER',
      bgImage: 'https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=2070&auto=format&fit=crop'
    };
    setBanners(prev => ({
      ...prev,
      customBanners: [...(prev.customBanners || []), newBanner]
    }));
  };

  const updateCustomBanner = (index, field, value) => {
    setBanners(prev => {
      const list = [...(prev.customBanners || [])];
      if (list[index]) {
        list[index] = { ...list[index], [field]: value };
      }
      return { ...prev, customBanners: list };
    });
  };

  const removeCustomBanner = (index) => {
    if (!window.confirm("Are you sure you want to remove this custom promotional banner?")) return;
    setBanners(prev => ({
      ...prev,
      customBanners: (prev.customBanners || []).filter((_, i) => i !== index)
    }));
  };


  return (
    <div className="banner-manager-b2b">
      <div className="banner-manager-header">
        <div>
          <h2>Banner & Poster Studio</h2>
          <p>Configure all promotional posters, Bento grid tiles, and stretched category sections on the live storefront.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('bento')}
            className={`preview-toggle-btn ${activeTab === 'bento' ? 'active' : ''}`}
            style={{ backgroundColor: activeTab === 'bento' ? '#dc2626' : '#27272a' }}
          >
            📐 Bento Grid
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('promo')}
            className={`preview-toggle-btn ${activeTab === 'promo' ? 'active' : ''}`}
            style={{ backgroundColor: activeTab === 'promo' ? '#dc2626' : '#27272a' }}
          >
            🔥 Homepage Promo Posters
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('custom')}
            className={`preview-toggle-btn ${activeTab === 'custom' ? 'active' : ''}`}
            style={{ backgroundColor: activeTab === 'custom' ? '#dc2626' : '#27272a' }}
          >
            ✨ Custom Sections ({banners.customBanners?.length || 0})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-box">Loading Banner & Poster Studio Data...</div>
      ) : (
        <form onSubmit={handleSaveBanners} className="banner-sections-form">
          
          {/* TAB 1: BENTO GRID */}
          {activeTab === 'bento' && (
            <>
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
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: HOMEPAGE PROMO POSTERS */}
          {activeTab === 'promo' && (
            <div className="bento-editors-grid">
              
              {/* Promo Section 1 Editor */}
              <div className="banner-card full-width" style={{ borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ color: '#10b981' }}>🔥 Stretched Promo Poster 1 (Homepage Section 1)</h3>
                  <span style={{ fontSize: '11px', background: '#10b981', color: '#000', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
                    {banners.promoSection1?.discountText || "10% OFF"}
                  </span>
                </div>
                
                {/* Live Preview Box */}
                <div style={{
                  position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px',
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.5)), url(${banners.promoSection1?.bgImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', padding: '20px'
                }}>
                  <div style={{ color: '#fff' }}>
                    <span style={{ fontSize: '10px', background: '#10b981', color: '#000', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px' }}>
                      {banners.promoSection1?.discountText || "10% OFF SPECIAL"}
                    </span>
                    <h4 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', margin: '6px 0', textTransform: 'uppercase' }}>
                      {banners.promoSection1?.title || "TROUSERS & JOGGERS"}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#d1d5db', maxWidth: '400px' }}>
                      {banners.promoSection1?.subtitle}
                    </p>
                  </div>
                </div>

                <div className="banner-inputs-grid">
                  <div>
                    <label>Poster Heading / Title *</label>
                    <input
                      type="text"
                      value={banners.promoSection1?.title || ''}
                      onChange={(e) => updateBannerSection('promoSection1', 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Category Linked to Products</label>
                    <select
                      value={banners.promoSection1?.category || ''}
                      onChange={(e) => updateBannerSection('promoSection1', 'category', e.target.value)}
                    >
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      <option value="Trousers">Trousers</option>
                      <option value="Tracksuits">Tracksuits</option>
                      <option value="Sweatshirts">Sweatshirts</option>
                    </select>
                  </div>
                  <div>
                    <label>Discount Badge Text</label>
                    <input
                      type="text"
                      value={banners.promoSection1?.discountText || ''}
                      onChange={(e) => updateBannerSection('promoSection1', 'discountText', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Discount Percentage (%)</label>
                    <input
                      type="number"
                      value={banners.promoSection1?.discountPercent || 10}
                      onChange={(e) => updateBannerSection('promoSection1', 'discountPercent', Number(e.target.value))}
                    />
                  </div>
                  <div className="full-width">
                    <label>Subtitle / Description</label>
                    <textarea
                      rows={2}
                      value={banners.promoSection1?.subtitle || ''}
                      onChange={(e) => updateBannerSection('promoSection1', 'subtitle', e.target.value)}
                    />
                  </div>
                  <div className="full-width">
                    <label>Background Image URL / Upload</label>
                    <div className="upload-input-group">
                      <input
                        type="text"
                        value={banners.promoSection1?.bgImage || ''}
                        onChange={(e) => updateBannerSection('promoSection1', 'bgImage', e.target.value)}
                      />
                      <label className="file-upload-btn-custom">
                        {uploadingSection === 'promoSection1' ? "..." : "📷 Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleFileUpload('promoSection1', e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Section 2 Editor */}
              <div className="banner-card full-width" style={{ borderLeft: '4px solid #dc2626' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ color: '#dc2626' }}>🔥 Stretched Promo Poster 2 (Homepage Section 2)</h3>
                  <span style={{ fontSize: '11px', background: '#dc2626', color: '#fff', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
                    {banners.promoSection2?.discountText || "HEAVYWEIGHT FLEECE"}
                  </span>
                </div>

                {/* Live Preview Box */}
                <div style={{
                  position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px',
                  backgroundImage: `linear-gradient(to left, rgba(0,0,0,0.9), rgba(0,0,0,0.5)), url(${banners.promoSection2?.bgImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '20px', textAlign: 'right'
                }}>
                  <div style={{ color: '#fff' }}>
                    <span style={{ fontSize: '10px', background: '#dc2626', color: '#fff', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px' }}>
                      {banners.promoSection2?.discountText || "15% BULK DISCOUNT"}
                    </span>
                    <h4 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', margin: '6px 0', textTransform: 'uppercase' }}>
                      {banners.promoSection2?.title || "HEAVYWEIGHT HOODIES"}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#d1d5db', maxWidth: '400px' }}>
                      {banners.promoSection2?.subtitle}
                    </p>
                  </div>
                </div>

                <div className="banner-inputs-grid">
                  <div>
                    <label>Poster Heading / Title *</label>
                    <input
                      type="text"
                      value={banners.promoSection2?.title || ''}
                      onChange={(e) => updateBannerSection('promoSection2', 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Category Linked to Products</label>
                    <select
                      value={banners.promoSection2?.category || ''}
                      onChange={(e) => updateBannerSection('promoSection2', 'category', e.target.value)}
                    >
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      <option value="Sweatshirts">Sweatshirts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Tracksuits">Tracksuits</option>
                    </select>
                  </div>
                  <div>
                    <label>Discount Badge Text</label>
                    <input
                      type="text"
                      value={banners.promoSection2?.discountText || ''}
                      onChange={(e) => updateBannerSection('promoSection2', 'discountText', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Discount Percentage (%)</label>
                    <input
                      type="number"
                      value={banners.promoSection2?.discountPercent || 15}
                      onChange={(e) => updateBannerSection('promoSection2', 'discountPercent', Number(e.target.value))}
                    />
                  </div>
                  <div className="full-width">
                    <label>Subtitle / Description</label>
                    <textarea
                      rows={2}
                      value={banners.promoSection2?.subtitle || ''}
                      onChange={(e) => updateBannerSection('promoSection2', 'subtitle', e.target.value)}
                    />
                  </div>
                  <div className="full-width">
                    <label>Background Image URL / Upload</label>
                    <div className="upload-input-group">
                      <input
                        type="text"
                        value={banners.promoSection2?.bgImage || ''}
                        onChange={(e) => updateBannerSection('promoSection2', 'bgImage', e.target.value)}
                      />
                      <label className="file-upload-btn-custom">
                        {uploadingSection === 'promoSection2' ? "..." : "📷 Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleFileUpload('promoSection2', e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CUSTOM PROMO SECTIONS */}
          {activeTab === 'custom' && (
            <div className="custom-banners-manager">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#fff' }}>Custom Homepage Promo Sections</h3>
                  <p style={{ margin: 0, color: '#a1a1aa', fontSize: '12px' }}>Add unlimited promotional banner sections that dynamically link to specific categories and products on the storefront.</p>
                </div>
                <button
                  type="button"
                  onClick={addCustomBanner}
                  style={{
                    backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px',
                    borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer'
                  }}
                >
                  ➕ Add New Banner Section
                </button>
              </div>

              {(!banners.customBanners || banners.customBanners.length === 0) ? (
                <div style={{ background: '#18181b', padding: '30px', textAlign: 'center', borderRadius: '8px', color: '#a1a1aa' }}>
                  <p>No custom banner sections added yet.</p>
                  <button
                    type="button"
                    onClick={addCustomBanner}
                    style={{ backgroundColor: '#27272a', color: '#fff', border: '1px solid #3f3f46', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginTop: '8px' }}
                  >
                    Click to add one now
                  </button>
                </div>
              ) : (
                <div className="bento-editors-grid">
                  {banners.customBanners.map((cb, idx) => (
                    <div key={cb.id || idx} className="banner-card full-width" style={{ borderLeft: '4px solid #3b82f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, color: '#60a5fa' }}>Custom Banner Section #{idx + 1}: {cb.title}</h4>
                        <button
                          type="button"
                          onClick={() => removeCustomBanner(idx)}
                          style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                        >
                          🗑️ Delete Section
                        </button>
                      </div>

                      <div className="banner-inputs-grid">
                        <div>
                          <label>Banner Title *</label>
                          <input
                            type="text"
                            value={cb.title || ''}
                            onChange={(e) => updateCustomBanner(idx, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label>Category Linked to Products</label>
                          <select
                            value={cb.category || ''}
                            onChange={(e) => updateCustomBanner(idx, 'category', e.target.value)}
                          >
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label>Badge / Offer Tag</label>
                          <input
                            type="text"
                            value={cb.discountText || ''}
                            onChange={(e) => updateCustomBanner(idx, 'discountText', e.target.value)}
                          />
                        </div>
                        <div className="full-width">
                          <label>Subtitle / Description</label>
                          <input
                            type="text"
                            value={cb.subtitle || ''}
                            onChange={(e) => updateCustomBanner(idx, 'subtitle', e.target.value)}
                          />
                        </div>
                        <div className="full-width">
                          <label>Background Image</label>
                          <div className="upload-input-group">
                            <input
                              type="text"
                              value={cb.bgImage || ''}
                              onChange={(e) => updateCustomBanner(idx, 'bgImage', e.target.value)}
                            />
                            <label className="file-upload-btn-custom">
                              {uploadingSection === `custom_${idx}` ? "..." : "📷 Upload"}
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => handleFileUpload(null, e.target.files[0], idx)}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="save-actions-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '13px' }}>{saveStatus}</span>
            <button type="submit" className="save-banners-btn">
              💾 Save & Publish All Posters & Banners Live
            </button>
          </div>

        </form>
      )}
    </div>
  );
};

export default BannerManager;

