import React, { useEffect, useState } from 'react';
import './SiteManager.css';
import { API_URL } from '../../config';

const SiteManager = () => {
  const [cms, setCms] = useState({
    announcementText: "",
    heroSlides: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);

  const fetchCms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cms`);
      const data = await res.json();
      if (data) {
        setCms(data);
      }
    } catch (err) {
      console.error("Fetch CMS error:", err);
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

  const handleSlideImageUpload = async (index, file) => {
    if (!file) return;
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('product', file);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        handleSlideChange(index, 'bgImage', data.image_url);
        setSaveMessage(`📷 Slide ${index + 1} background image uploaded! Remember to click "Save & Publish".`);
        setTimeout(() => setSaveMessage(null), 4000);
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
      titleLine1: "NEW ARRIVAL",
      titleLine2: "SPORT COLLECTION",
      title: "NEW ARRIVAL\nSPORT COLLECTION",
      subtitle: "Engineered for maximum athletic comfort and performance.",
      description: "Engineered for maximum athletic comfort and performance.",
      ctaText: "SHOP NOW",
      ctaLink: "/category/all",
      rightTagTop: "NEW ARRIVALS",
      rightTagTopVal: "2026",
      rightTagBottom: "LIMITED TIME",
      rightTagBottomVal: "SPECIAL OFFER",
      bgImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=85&w=2000&auto=format&fit=crop"
    };
    setCms({ ...cms, heroSlides: [...(cms.heroSlides || []), newSlide] });
  };

  const handleDeleteSlide = (index) => {
    if (cms.heroSlides.length <= 1) {
      alert("You must keep at least 1 hero banner slide.");
      return;
    }
    if (!window.confirm(`Delete Slide #${index + 1}?`)) return;
    const updated = cms.heroSlides.filter((_, i) => i !== index);
    setCms({ ...cms, heroSlides: updated });
  };

  const handleMoveSlide = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= cms.heroSlides.length) return;
    const updated = [...cms.heroSlides];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCms({ ...cms, heroSlides: updated });
  };

  const saveCmsChanges = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch(`${API_URL}/update-cms`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(cms)
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage("🎉 Storefront Hero Slider & Announcement Bar Updated Live!");
        setTimeout(() => setSaveMessage(null), 5000);
      } else {
        alert("Failed to update CMS.");
      }
    } catch (err) {
      alert("Error saving CMS: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="site-manager-b2b">
      
      {/* Top Header */}
      <div className="site-manager-header">
        <div>
          <h2>Website CMS & Hero Slider Manager</h2>
          <p>Full control over full-bleed background images, massive headline typography, subtitles, right-side badges, and top announcement text.</p>
        </div>
        <button 
          onClick={saveCmsChanges} 
          disabled={saving} 
          className="save-cms-top-btn"
        >
          {saving ? "⏳ Saving Changes..." : "💾 Save & Publish Site Changes"}
        </button>
      </div>

      {saveMessage && (
        <div className="cms-status-alert">
          {saveMessage}
        </div>
      )}

      {loading ? (
        <div className="loading-box">Loading Site CMS Settings...</div>
      ) : (
        <div className="cms-editor-body">
          
          {/* Top Announcement Bar Section */}
          <div className="cms-section-card">
            <h3>Top Announcement Bar</h3>
            <p className="section-note">This banner appears at the very top of every page above the navbar.</p>
            <div className="input-field">
              <label>Announcement Bar Text</label>
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
                <p className="section-note">
                  Every 5 seconds or on arrow click, the entire background image, headlines, subtitle, CTA button, and right collection tags shift together.
                </p>
              </div>
              <button type="button" onClick={handleAddSlide} className="add-slide-btn">
                ➕ Add New Hero Slide
              </button>
            </div>

            <div className="slides-list">
              {cms.heroSlides && cms.heroSlides.map((slide, idx) => (
                <div key={slide.id || idx} className="slide-editor-card">
                  
                  <div className="slide-card-header">
                    <div className="slide-card-title-wrap">
                      <span className="slide-badge-num">Slide #{idx + 1}</span>
                      <h4>{slide.titleLine1 || "DRESS SHARP"} {slide.titleLine2 || "LIVE STRONG"}</h4>
                    </div>
                    
                    <div className="slide-actions-header">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSlide(idx, -1)}
                        className="move-slide-btn"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === cms.heroSlides.length - 1}
                        onClick={() => handleMoveSlide(idx, 1)}
                        className="move-slide-btn"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteSlide(idx)}
                        className="delete-slide-btn"
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </div>

                  {/* Slide Background Image Preview & Upload */}
                  <div className="slide-preview-banner">
                    <div className="preview-img-container">
                      <img 
                        src={slide.bgImage || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=85&w=1000&auto=format&fit=crop"} 
                        alt="Hero Background Preview" 
                        className="preview-img"
                      />
                      <div className="preview-overlay-info">
                        <span className="preview-tag">{slide.rightTagTop || "NEW COLLECTION"} {slide.rightTagTopVal || "2026"}</span>
                        <h5 className="preview-headline">{slide.titleLine1 || "DRESS SHARP"} {slide.titleLine2 || "LIVE STRONG"}</h5>
                      </div>
                    </div>
                  </div>

                  <div className="slide-inputs-grid">
                    
                    {/* Background Image Input */}
                    <div className="input-field full-width">
                      <label>Background Image URL / File Upload</label>
                      <div className="upload-input-group">
                        <input
                          type="text"
                          value={slide.bgImage || ''}
                          onChange={(e) => handleSlideChange(idx, 'bgImage', e.target.value)}
                          placeholder="https://images.unsplash.com/... or upload local image"
                        />
                        <label className="file-upload-btn-custom">
                          {uploadingIndex === idx ? "Uploading..." : "📷 Upload Image"}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleSlideImageUpload(idx, e.target.files[0])}
                          />
                        </label>
                      </div>
                      <div className="image-spec-guide-badge">
                        📐 <strong>Recommended Size:</strong> 1920 × 800 px (Full-Bleed Widescreen) | High-Resolution Sportswear Photography
                      </div>
                    </div>

                    {/* Headline Line 1 */}
                    <div className="input-field">
                      <label>Headline Line 1 (Upper Big Text)</label>
                      <input
                        type="text"
                        value={slide.titleLine1 !== undefined ? slide.titleLine1 : (slide.title ? slide.title.split('\n')[0] : 'DRESS SHARP')}
                        onChange={(e) => handleSlideChange(idx, 'titleLine1', e.target.value)}
                        placeholder="e.g. DRESS SHARP"
                      />
                    </div>

                    {/* Headline Line 2 */}
                    <div className="input-field">
                      <label>Headline Line 2 (Lower Big Text)</label>
                      <input
                        type="text"
                        value={slide.titleLine2 !== undefined ? slide.titleLine2 : (slide.title ? slide.title.split('\n')[1] || '' : 'LIVE STRONG')}
                        onChange={(e) => handleSlideChange(idx, 'titleLine2', e.target.value)}
                        placeholder="e.g. LIVE STRONG"
                      />
                    </div>

                    {/* Subtitle / Description */}
                    <div className="input-field full-width">
                      <label>Subtitle / Description Text</label>
                      <textarea
                        rows="2"
                        value={slide.subtitle || slide.description || ''}
                        onChange={(e) => {
                          handleSlideChange(idx, 'subtitle', e.target.value);
                          handleSlideChange(idx, 'description', e.target.value);
                        }}
                        placeholder="e.g. Premium quality apparel for every move you make."
                      />
                    </div>

                    {/* CTA Button Text */}
                    <div className="input-field">
                      <label>Button Text</label>
                      <input
                        type="text"
                        value={slide.ctaText || slide.primaryCtaText || 'SHOP NOW'}
                        onChange={(e) => {
                          handleSlideChange(idx, 'ctaText', e.target.value);
                          handleSlideChange(idx, 'primaryCtaText', e.target.value);
                        }}
                        placeholder="e.g. SHOP NOW"
                      />
                    </div>

                    {/* CTA Button Destination */}
                    <div className="input-field">
                      <label>Button Destination Link</label>
                      <input
                        type="text"
                        value={slide.ctaLink || slide.primaryCtaLink || '/category/all'}
                        onChange={(e) => {
                          handleSlideChange(idx, 'ctaLink', e.target.value);
                          handleSlideChange(idx, 'primaryCtaLink', e.target.value);
                        }}
                        placeholder="e.g. /category/all or /tracksuits"
                      />
                    </div>

                    {/* Right Tag Top Label & Value */}
                    <div className="input-field">
                      <label>Right Badge 1 (Small Tag)</label>
                      <input
                        type="text"
                        value={slide.rightTagTop || 'NEW COLLECTION'}
                        onChange={(e) => handleSlideChange(idx, 'rightTagTop', e.target.value)}
                        placeholder="e.g. NEW COLLECTION"
                      />
                    </div>

                    <div className="input-field">
                      <label>Right Badge 1 Value (Big Text)</label>
                      <input
                        type="text"
                        value={slide.rightTagTopVal || '2026'}
                        onChange={(e) => handleSlideChange(idx, 'rightTagTopVal', e.target.value)}
                        placeholder="e.g. 2026"
                      />
                    </div>

                    {/* Right Tag Bottom Label & Value */}
                    <div className="input-field">
                      <label>Right Badge 2 (Small Tag)</label>
                      <input
                        type="text"
                        value={slide.rightTagBottom || 'UP TO'}
                        onChange={(e) => handleSlideChange(idx, 'rightTagBottom', e.target.value)}
                        placeholder="e.g. UP TO"
                      />
                    </div>

                    <div className="input-field">
                      <label>Right Badge 2 Value (Big Text)</label>
                      <input
                        type="text"
                        value={slide.rightTagBottomVal || '30% OFF'}
                        onChange={(e) => handleSlideChange(idx, 'rightTagBottomVal', e.target.value)}
                        placeholder="e.g. 30% OFF"
                      />
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={saveCmsChanges} 
            disabled={saving} 
            className="save-cms-bottom-btn"
          >
            {saving ? "⏳ Publishing Changes..." : "🚀 Publish Changes Live To Storefront"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SiteManager;
