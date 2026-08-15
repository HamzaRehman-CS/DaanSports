import React, { useEffect, useState } from 'react';
import './BannerManager.css';

const BannerManager = () => {
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState({
    topSellers: {
      title: 'TOP SELLERS — FLAGSHIP EDITION',
      subtitle: 'Handpicked Performance Gear & High-Volume Custom Apparel',
      badge: 'BESTSELLER SELECTION',
      bgImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop'
    },
    promoSection1: {
      category: 'Trousers',
      title: 'TROUSERS & JOGGERS — 10% OFF',
      discountText: 'WHOLESALE BULK SPECIAL OFFER',
      subtitle: 'Heavyweight 330 GSM combed cotton fleece & tri-blend warm-up joggers',
      bgImage: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=2070&auto=format&fit=crop'
    },
    promoSection2: {
      category: 'Sweatshirts',
      title: 'HEAVYWEIGHT HOODIES COLLECTION',
      discountText: 'HIGH-DENSITY EMBROIDERY READY',
      subtitle: '350 GSM French Terry pullovers and drop-shoulder streetwear cuts',
      bgImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop'
    },
    customBanners: []
  });

  const [loading, setLoading] = useState(true);

  const fetchBannersAndCategories = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        fetch("http://localhost:4000/promotional-banners"),
        fetch("http://localhost:4000/categories")
      ]);
      const bData = await bRes.json();
      const cData = await cRes.json();

      if (bData && bData.topSellers) {
        setBanners({
          ...bData,
          customBanners: bData.customBanners || []
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

  const handleSaveBanners = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/update-promotional-banners", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(banners)
      });
      const data = await res.json();
      if (data.success) {
        alert("🎉 All Promotional & Category Banners Saved Successfully!");
        fetchBannersAndCategories();
      } else {
        alert("Error saving banners: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleAddCustomBanner = () => {
    const defaultCatName = categories.length > 0 ? categories[0].name : "Tracksuits";
    const newB = {
      id: Date.now(),
      category: defaultCatName,
      title: 'NEW PROMOTIONAL COLLECTION',
      discountText: 'FACTORY DIRECT SPECIAL',
      subtitle: 'Custom OEM sportswear manufacturing with low MOQ.',
      bgImage: 'https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=2070&auto=format&fit=crop'
    };
    setBanners({
      ...banners,
      customBanners: [...(banners.customBanners || []), newB]
    });
  };

  const handleRemoveCustomBanner = (id) => {
    setBanners({
      ...banners,
      customBanners: (banners.customBanners || []).filter(b => b.id !== id)
    });
  };

  const handleCustomBannerChange = (index, field, value) => {
    const updated = [...(banners.customBanners || [])];
    updated[index][field] = value;
    setBanners({
      ...banners,
      customBanners: updated
    });
  };

  return (
    <div className="banner-manager-b2b">
      <div className="banner-manager-header">
        <div>
          <h2>Promotional Banners & Stretched Sections</h2>
          <p>Customize the Top Sellers banner and full-width category discount banners on the main website.</p>
        </div>
        <button type="button" onClick={handleAddCustomBanner} className="add-banner-top-btn">
          ➕ Add Custom Banner
        </button>
      </div>

      {loading ? (
        <div className="loading-box">Loading Banners...</div>
      ) : (
        <form onSubmit={handleSaveBanners} className="banner-sections-form">
          
          {/* Section 1: Top Sellers */}
          <div className="banner-card">
            <h3>🔥 1. Top Sellers Main Banner</h3>
            <div className="banner-inputs-grid">
              <div>
                <label>Title</label>
                <input
                  type="text"
                  value={banners.topSellers?.title || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    topSellers: { ...banners.topSellers, title: e.target.value }
                  })}
                />
              </div>
              <div>
                <label>Badge Tag</label>
                <input
                  type="text"
                  value={banners.topSellers?.badge || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    topSellers: { ...banners.topSellers, badge: e.target.value }
                  })}
                />
              </div>
              <div className="full-width">
                <label>Subtitle / Description</label>
                <input
                  type="text"
                  value={banners.topSellers?.subtitle || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    topSellers: { ...banners.topSellers, subtitle: e.target.value }
                  })}
                />
              </div>
              <div className="full-width">
                <label>Full-Width Stretched Background Image URL</label>
                <input
                  type="text"
                  value={banners.topSellers?.bgImage || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    topSellers: { ...banners.topSellers, bgImage: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Trousers Promo Banner */}
          <div className="banner-card">
            <h3>👖 2. Category Promo Banner 1</h3>
            <div className="banner-inputs-grid">
              <div>
                <label>Target Category</label>
                <select
                  value={banners.promoSection1?.category || 'Trousers'}
                  onChange={(e) => setBanners({
                    ...banners,
                    promoSection1: { ...banners.promoSection1, category: e.target.value }
                  })}
                  className="banner-cat-select"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Trousers">Trousers</option>
                  <option value="Tracksuits">Tracksuits</option>
                  <option value="Sweatshirts">Sweatshirts</option>
                  <option value="Activewear">Activewear</option>
                </select>
              </div>
              <div>
                <label>Discount Ribbon Text</label>
                <input
                  type="text"
                  value={banners.promoSection1?.discountText || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    promoSection1: { ...banners.promoSection1, discountText: e.target.value }
                  })}
                />
              </div>
              <div className="full-width">
                <label>Section Title</label>
                <input
                  type="text"
                  value={banners.promoSection1?.title || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    promoSection1: { ...banners.promoSection1, title: e.target.value }
                  })}
                />
              </div>
              <div className="full-width">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={banners.promoSection1?.subtitle || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    promoSection1: { ...banners.promoSection1, subtitle: e.target.value }
                  })}
                />
              </div>
              <div className="full-width">
                <label>Full-Width Stretched Background Image URL</label>
                <input
                  type="text"
                  value={banners.promoSection1?.bgImage || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    promoSection1: { ...banners.promoSection1, bgImage: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hoodies Promo Banner */}
          <div className="banner-card">
            <h3>🧥 3. Category Promo Banner 2</h3>
            <div className="banner-inputs-grid">
              <div>
                <label>Target Category</label>
                <select
                  value={banners.promoSection2?.category || 'Sweatshirts'}
                  onChange={(e) => setBanners({
                    ...banners,
                    promoSection2: { ...banners.promoSection2, category: e.target.value }
                  })}
                  className="banner-cat-select"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Sweatshirts">Sweatshirts</option>
                  <option value="Tracksuits">Tracksuits</option>
                  <option value="Activewear">Activewear</option>
                  <option value="Trousers">Trousers</option>
                </select>
              </div>
              <div>
                <label>Discount Ribbon Text</label>
                <input
                  type="text"
                  value={banners.promoSection2?.discountText || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    promoSection2: { ...banners.promoSection2, discountText: e.target.value }
                  })}
                />
              </div>
              <div className="full-width">
                <label>Section Title</label>
                <input
                  type="text"
                  value={banners.promoSection2?.title || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    promoSection2: { ...banners.promoSection2, title: e.target.value }
                  })}
                />
              </div>
              <div className="full-width">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={banners.promoSection2?.subtitle || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    promoSection2: { ...banners.promoSection2, subtitle: e.target.value }
                  })}
                />
              </div>
              <div className="full-width">
                <label>Full-Width Stretched Background Image URL</label>
                <input
                  type="text"
                  value={banners.promoSection2?.bgImage || ''}
                  onChange={(e) => setBanners({
                    ...banners,
                    promoSection2: { ...banners.promoSection2, bgImage: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Dynamic Custom Banners */}
          {(banners.customBanners || []).map((cb, idx) => (
            <div key={cb.id || idx} className="banner-card custom-banner-card">
              <div className="banner-card-header-row">
                <h3>🏷️ Custom Stretched Banner #{idx + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomBanner(cb.id)}
                  className="remove-banner-btn"
                >
                  Delete Banner 🗑️
                </button>
              </div>
              <div className="banner-inputs-grid">
                <div>
                  <label>Target Category</label>
                  <select
                    value={cb.category || ''}
                    onChange={(e) => handleCustomBannerChange(idx, 'category', e.target.value)}
                    className="banner-cat-select"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Tracksuits">Tracksuits</option>
                    <option value="Sweatshirts">Sweatshirts</option>
                    <option value="Activewear">Activewear</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Trousers">Trousers</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>
                <div>
                  <label>Ribbon / Tag Text</label>
                  <input
                    type="text"
                    value={cb.discountText || ''}
                    onChange={(e) => handleCustomBannerChange(idx, 'discountText', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Section Title</label>
                  <input
                    type="text"
                    value={cb.title || ''}
                    onChange={(e) => handleCustomBannerChange(idx, 'title', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Subtitle / Description</label>
                  <input
                    type="text"
                    value={cb.subtitle || ''}
                    onChange={(e) => handleCustomBannerChange(idx, 'subtitle', e.target.value)}
                  />
                </div>
                <div className="full-width">
                  <label>Full-Width Background Image URL</label>
                  <input
                    type="text"
                    value={cb.bgImage || ''}
                    onChange={(e) => handleCustomBannerChange(idx, 'bgImage', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button type="submit" className="save-all-banners-btn">
            Save All Banners & Update Homepage ➔
          </button>
        </form>
      )}
    </div>
  );
};

export default BannerManager;
