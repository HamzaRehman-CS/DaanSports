import React, { useEffect, useState } from 'react';
import './SiteManager.css';
import { API_URL } from '../../config';

const SiteManager = () => {
  const [cms, setCms] = useState({
    announcementText: "",
    heroSlides: []
  });
  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const fetchCms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cms`);
      const data = await res.json();
      setCms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCms();
  }, []);

  const handleAnnouncementChange = (e) => {
    setCms({ ...cms, announcementText: e.target.value });
  };

  const handleSlideChange = (index, field, value) => {
    const updatedSlides = [...cms.heroSlides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setCms({ ...cms, heroSlides: updatedSlides });
  };

  const handleSlideImageUpload = async (index, file, field = 'bgImage') => {
    if (!file) return;
    setUploadingIndex(`${index}-${field}`);
    try {
      let formData = new FormData();
      formData.append('product', file);
      let res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      let data = await res.json();
      if (data.success) {
        handleSlideChange(index, field, data.image_url);
        alert(`📷 Slide ${index + 1} ${field === 'bgImage' ? 'background' : 'featured product'} image uploaded!`);
      } else {
        alert("Upload error: " + (data.error || "Failed to upload image"));
      }
    } catch (err) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: Date.now(),
      badgeText: "NEW COLLECTION",
      title: "PRO PERFORMANCE<br />SPORTSWEAR",
      subtitle: "Custom athletic apparel engineered for elite performance and comfort.",
      specBadge: "330 GSM SPEC",
      productName: "Custom Athletic Tracksuit",
      priceText: "From $22.00 /pc",
      bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop",
      productImg: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=1000&auto=format&fit=crop",
      primaryCtaText: "Explore Collections",
      primaryCtaLink: "/tracksuits"
    };
    setCms({ ...cms, heroSlides: [...(cms.heroSlides || []), newSlide] });
  };

  const handleDeleteSlide = (index) => {
    if (!window.confirm(`Delete Slide #${index + 1}?`)) return;
    const updated = cms.heroSlides.filter((_, i) => i !== index);
    setCms({ ...cms, heroSlides: updated });
  };

  const saveCmsChanges = async () => {
    try {
      const res = await fetch(`${API_URL}/update-cms`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(cms)
      });
      const data = await res.json();
      if (data.success) {
        alert("🎉 DAAN Sports Website Banners & Hero Slides Updated Live!");
      } else {
        alert("Failed to update CMS.");
      }
    } catch (err) {
      alert("Error saving CMS: " + err.message);
    }
  };

  return (
    <div className="site-manager-b2b">
      <div className="site-manager-header">
        <div>
          <h2>Website CMS & Hero Banner Manager</h2>
          <p>Edit background slider imagery, product showcases, main headlines, announcement bar text, and call-to-actions dynamically across the entire website.</p>
        </div>
        <button onClick={saveCmsChanges} className="save-cms-top-btn">
          💾 Save & Publish Site Changes
        </button>
      </div>

      {loading ? (
        <div className="loading-box">Loading Site CMS Settings...</div>
      ) : (
        <div className="cms-editor-body">
          {/* Announcement Bar Settings */}
          <div className="cms-section-card">
            <h3>Top Announcement Bar Text</h3>
            <div className="input-field">
              <label>Announcement Bar Banner Text</label>
              <input
                type="text"
                value={cms.announcementText || ''}
                onChange={handleAnnouncementChange}
                placeholder="e.g. FREE SHIPPING ON ORDERS OVER $99 | LIMITED TIME ONLY!"
              />
            </div>
          </div>

          {/* Hero Slider Management */}
          <div className="cms-section-card">
            <div className="section-title-row">
              <div>
                <h3>Homepage Hero Banner Slider Entries ({cms.heroSlides ? cms.heroSlides.length : 0})</h3>
                <p className="section-note">Each entry updates the background imagery, titles, and call-to-action buttons on the homepage slider.</p>
              </div>
              <button type="button" onClick={handleAddSlide} className="add-slide-btn">
                ➕ Add New Hero Slide
              </button>
            </div>

            <div className="slides-list">
              {cms.heroSlides && cms.heroSlides.map((slide, idx) => (
                <div key={idx} className="slide-editor-card">
                  <div className="slide-card-header">
                    <h4>Slide #{idx + 1} Entry</h4>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteSlide(idx)}
                      className="delete-slide-btn"
                    >
                      Delete Slide 🗑️
                    </button>
                  </div>

                  <div className="slide-inputs-grid">
                    <div className="input-field">
                      <label>Badge Header Tag</label>
                      <input
                        type="text"
                        value={slide.badgeText || ''}
                        onChange={(e) => handleSlideChange(idx, 'badgeText', e.target.value)}
                      />
                    </div>
                    
                    <div className="input-field">
                      <label>Spec Tag Badge</label>
                      <input
                        type="text"
                        value={slide.specBadge || ''}
                        onChange={(e) => handleSlideChange(idx, 'specBadge', e.target.value)}
                        placeholder="e.g. 330 GSM FLEECE"
                      />
                    </div>

                    <div className="input-field full-width">
                      <label>Background Image</label>
                      <div className="upload-input-group">
                        <input
                          type="text"
                          value={slide.bgImage || ''}
                          onChange={(e) => handleSlideChange(idx, 'bgImage', e.target.value)}
                        />
                        <label className="file-upload-btn-custom">
                          {uploadingIndex === `${idx}-bgImage` ? "..." : "📷 Upload"}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleSlideImageUpload(idx, e.target.files[0], 'bgImage')}
                          />
                        </label>
                      </div>
                      {/* HERO BACKGROUND DIMENSION GUIDELINE NOTICE */}
                      <div className="image-spec-guide-badge">
                        📐 <strong>Recommended Size:</strong> 1920 × 800 px (24:10 Full-Bleed Widescreen) | Max 5MB | WebP, JPG, PNG
                      </div>
                    </div>

                    <div className="input-field full-width">
                      <label>Featured Apparel / Model Image</label>
                      <div className="upload-input-group">
                        <input
                          type="text"
                          value={slide.productImg || ''}
                          onChange={(e) => handleSlideChange(idx, 'productImg', e.target.value)}
                          placeholder="https://..."
                        />
                        <label className="file-upload-btn-custom">
                          {uploadingIndex === `${idx}-productImg` ? "..." : "📷 Upload"}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleSlideImageUpload(idx, e.target.files[0], 'productImg')}
                          />
                        </label>
                      </div>
                      {/* HERO FEATURED PRODUCT DIMENSION GUIDELINE NOTICE */}
                      <div className="image-spec-guide-badge">
                        📐 <strong>Recommended Size:</strong> 800 × 800 px (1:1 Square) or 800 × 1000 px (4:5 Crop) | Max 5MB | WebP, JPG, PNG
                      </div>
                    </div>

                    <div className="input-field">
                      <label>Featured Product Title</label>
                      <input
                        type="text"
                        value={slide.productName || ''}
                        onChange={(e) => handleSlideChange(idx, 'productName', e.target.value)}
                        placeholder="e.g. Pro Tech Fleece Tracksuit"
                      />
                    </div>

                    <div className="input-field">
                      <label>Price Display</label>
                      <input
                        type="text"
                        value={slide.priceText || ''}
                        onChange={(e) => handleSlideChange(idx, 'priceText', e.target.value)}
                        placeholder="e.g. From $24.50 /pc"
                      />
                    </div>

                    <div className="input-field full-width">
                      <label>Main Headline Title (HTML Supported)</label>
                      <input
                        type="text"
                        value={slide.title || ''}
                        onChange={(e) => handleSlideChange(idx, 'title', e.target.value)}
                      />
                    </div>

                    <div className="input-field full-width">
                      <label>Subtitle / Description Text</label>
                      <textarea
                        rows="2"
                        value={slide.subtitle || ''}
                        onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)}
                      />
                    </div>

                    <div className="input-field">
                      <label>Button Text</label>
                      <input
                        type="text"
                        value={slide.primaryCtaText || ''}
                        onChange={(e) => handleSlideChange(idx, 'primaryCtaText', e.target.value)}
                      />
                    </div>

                    <div className="input-field">
                      <label>Button Destination Link</label>
                      <input
                        type="text"
                        value={slide.primaryCtaLink || ''}
                        onChange={(e) => handleSlideChange(idx, 'primaryCtaLink', e.target.value)}
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <button onClick={saveCmsChanges} className="save-cms-bottom-btn">
            🚀 Publish Changes Live To Storefront
          </button>
        </div>
      )}
    </div>
  );
};

export default SiteManager;
