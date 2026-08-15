import React, { useEffect, useState } from 'react'
import './SiteManager.css'

const SiteManager = () => {
  const [cms, setCms] = useState({
    announcementText: "",
    heroSlides: []
  });
  const [loading, setLoading] = useState(true);

  const fetchCms = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/cms");
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

  const handleSlideImageUpload = async (index, file) => {
    if (!file) return;
    try {
      let formData = new FormData();
      formData.append('product', file);
      let res = await fetch("http://localhost:4000/upload", {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      let data = await res.json();
      if (data.success) {
        handleSlideChange(index, 'bgImage', data.image_url);
        alert(`Slide ${index + 1} background image uploaded!`);
      }
    } catch (err) {
      alert("Error uploading image: " + err.message);
    }
  };

  const saveCmsChanges = async () => {
    try {
      const res = await fetch("http://localhost:4000/update-cms", {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(cms)
      });
      const data = await res.json();
      if (data.success) {
        alert("DAAN Sports Website Banners & Hero Slides Updated Live!");
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
          <p>Edit background slider imagery, main headlines, announcement bar text, and call-to-actions dynamically across the entire website.</p>
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
              <label>Announcement Bar Banner</label>
              <input
                type="text"
                value={cms.announcementText || ''}
                onChange={handleAnnouncementChange}
                placeholder="e.g. DIRECT FACTORY MANUFACTURER — Wholesale Custom Sportswear..."
              />
            </div>
          </div>

          {/* Hero Slider Management */}
          <div className="cms-section-card">
            <h3>Homepage Background Slider Entries ({cms.heroSlides ? cms.heroSlides.length : 0})</h3>
            <p className="section-note">Each entry updates the background imagery, titles, and call-to-action buttons on the homepage slider.</p>

            <div className="slides-list">
              {cms.heroSlides && cms.heroSlides.map((slide, idx) => (
                <div key={idx} className="slide-editor-card">
                  <div className="slide-card-header">
                    <h4>Slide #{idx + 1} Entry</h4>
                    <div className="slide-bg-preview-box">
                      <img src={slide.bgImage} alt={`Slide ${idx + 1}`} className="slide-preview-img" />
                      <label htmlFor={`slide-file-${idx}`} className="upload-slide-btn">
                        📷 Upload New Image
                      </label>
                      <input
                        type="file"
                        id={`slide-file-${idx}`}
                        hidden
                        accept="image/*"
                        onChange={(e) => handleSlideImageUpload(idx, e.target.files[0])}
                      />
                    </div>
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
                      <label>Background Image URL</label>
                      <input
                        type="text"
                        value={slide.bgImage || ''}
                        onChange={(e) => handleSlideChange(idx, 'bgImage', e.target.value)}
                      />
                    </div>
                    <div className="input-field full-width">
                      <label>Main Headline Title</label>
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
  )
}

export default SiteManager
