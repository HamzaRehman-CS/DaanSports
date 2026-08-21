import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, ArrowLeft, ArrowUpDown, Filter, Tag } from 'lucide-react';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';
import SEO from '../Components/SEO/SEO';
import { API_URL } from '../config';
import { loadCatalogProducts, loadCategories, subscribeToGlobalSync, fetchCloudProducts, fetchCloudCategories } from '../Context/defaultCatalog';

const SIZE_OPTIONS = ['All', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

const SORT_OPTIONS = [
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'alpha-az', label: 'Alphabetical: A → Z' },
  { id: 'alpha-za', label: 'Alphabetical: Z → A' },
  { id: 'moq-low', label: 'Lowest MOQ First' },
  { id: 'gsm-high', label: 'Heaviest GSM First' }
];

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [fallbackProducts, setFallbackProducts] = useState(() => loadCatalogProducts());
  const { categoryId, query: searchQuery } = useParams();
  const targetCategoryRaw = props.category || categoryId || "all";
  const [activeCategoryInfo, setActiveCategoryInfo] = useState(() => {
    const cats = loadCategories();
    return cats.find(c => 
      (c.slug || '').toLowerCase() === targetCategoryRaw.toLowerCase() || 
      (c.name || '').toLowerCase() === targetCategoryRaw.toLowerCase()
    ) || null;
  });
  const [sortBy, setSortBy] = useState('price-low');
  const [selectedSize, setSelectedSize] = useState('All');

  const syncData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        fetchCloudProducts(),
        fetchCloudCategories()
      ]);
      if (Array.isArray(prods) && prods.length > 0) setFallbackProducts(prods);
      if (Array.isArray(cats) && cats.length > 0) {
        const found = cats.find(c => 
          (c.slug || '').toLowerCase() === targetCategoryRaw.toLowerCase() || 
          (c.name || '').toLowerCase() === targetCategoryRaw.toLowerCase()
        );
        if (found) setActiveCategoryInfo(found);
      }
    } catch (err) {}
  };

  useEffect(() => {
    syncData();

    const unsubscribe = subscribeToGlobalSync((type, payload) => {
      if (type === 'PRODUCTS_UPDATED' && Array.isArray(payload) && payload.length > 0) {
        setFallbackProducts(payload);
      } else if (type === 'CATEGORIES_UPDATED' && Array.isArray(payload) && payload.length > 0) {
        const found = payload.find(c => 
          (c.slug || '').toLowerCase() === targetCategoryRaw.toLowerCase() || 
          (c.name || '').toLowerCase() === targetCategoryRaw.toLowerCase()
        );
        if (found) setActiveCategoryInfo(found);
      }
    });

    const interval = setInterval(syncData, 3000);
    const handleFocus = () => {
      syncData();
      const storedP = loadCatalogProducts();
      if (storedP && storedP.length > 0) setFallbackProducts(storedP);
      const storedC = loadCategories();
      const found = (storedC || []).find(c => 
        (c.slug || '').toLowerCase() === targetCategoryRaw.toLowerCase() || 
        (c.name || '').toLowerCase() === targetCategoryRaw.toLowerCase()
      );
      if (found) setActiveCategoryInfo(found);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [targetCategoryRaw]);

  const activeProducts = useMemo(() => {
    if (Array.isArray(all_product) && all_product.length > 0) return all_product;
    if (Array.isArray(fallbackProducts) && fallbackProducts.length > 0) return fallbackProducts;
    return loadCatalogProducts();
  }, [all_product, fallbackProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = (activeProducts || []).filter(item => {

      let matchesCategory = true;

      if (targetCategoryRaw && targetCategoryRaw !== 'all') {
        const itemCat = (item.category || '').toLowerCase().trim();
        const targetCat = targetCategoryRaw.toLowerCase().trim();
        const targetSlug = targetCat.replace(/[^a-z0-9]/g, '');
        const itemSlug = itemCat.replace(/[^a-z0-9]/g, '');
        const itemName = (item.name || '').toLowerCase();

        if (targetSlug === 'tshirts' || targetSlug === 'tshirt') {
          matchesCategory = itemCat.includes('tshirt') || itemCat.includes('tee') || itemName.includes('t-shirt') || itemName.includes('jersey');
        } else if (targetSlug === 'poloshirts' || targetSlug === 'polo') {
          matchesCategory = itemCat.includes('polo') || itemName.includes('polo');
        } else if (targetSlug === 'hoodies' || targetSlug === 'hoodie') {
          matchesCategory = itemCat.includes('hoodie') || itemName.includes('hoodie');
        } else if (targetSlug === 'sweatshirts' || targetSlug === 'sweatshirt') {
          matchesCategory = itemCat.includes('sweatshirt') || itemName.includes('sweatshirt') || itemCat.includes('fleece');
        } else if (targetSlug === 'tracksuits' || targetSlug === 'tracksuit') {
          matchesCategory = itemCat.includes('tracksuit') || itemName.includes('tracksuit') || itemName.includes('track suit');
        } else if (targetSlug === 'jackets' || targetSlug === 'jacket' || targetSlug === 'outerwear') {
          matchesCategory = itemCat.includes('jacket') || itemCat.includes('outerwear') || itemName.includes('jacket') || itemName.includes('windbreaker');
        } else if (targetSlug === 'activewear' || targetSlug === 'active') {
          matchesCategory = itemCat.includes('activewear') || itemCat.includes('compression') || itemName.includes('compression') || itemName.includes('gym');
        } else if (targetSlug === 'trousers' || targetSlug === 'trouser' || targetSlug === 'joggers') {
          matchesCategory = itemCat.includes('trouser') || itemCat.includes('pant') || itemCat.includes('jogger') || itemName.includes('jogger') || itemName.includes('pants');
        } else if (targetSlug === 'accessories' || targetSlug === 'accessory') {
          matchesCategory = itemCat.includes('accessor') || itemName.includes('cap') || itemName.includes('bag') || itemName.includes('socks');
        } else {
          matchesCategory = 
            itemCat === targetCat || 
            itemSlug === targetSlug || 
            itemCat.includes(targetCat) || 
            targetCat.includes(itemCat);
        }
      }

      let matchesSize = true;
      if (selectedSize !== 'All') {
        if (Array.isArray(item.sizes) && item.sizes.length > 0) {
          matchesSize = item.sizes.some(s => s.trim().toUpperCase() === selectedSize.toUpperCase());
        }
      }

      let matchesSearch = true;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (item.name || '').toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const catMatch = (item.category || '').toLowerCase().includes(q);
        const gsmMatch = (item.gsm || '').toLowerCase().includes(q);
        matchesSearch = nameMatch || descMatch || catMatch || gsmMatch;
      }

      return matchesCategory && matchesSize && matchesSearch;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (Number(a.new_price) || 0) - (Number(b.new_price) || 0);
        case 'price-high':
          return (Number(b.new_price) || 0) - (Number(a.new_price) || 0);
        case 'alpha-az':
          return (a.name || '').localeCompare(b.name || '');
        case 'alpha-za':
          return (b.name || '').localeCompare(a.name || '');
        case 'moq-low':
          return (Number(a.moq) || 50) - (Number(b.moq) || 50);
        case 'gsm-high': {
          const gsmA = parseInt((a.gsm || '').replace(/\D/g, '')) || 0;
          const gsmB = parseInt((b.gsm || '').replace(/\D/g, '')) || 0;
          return gsmB - gsmA;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [all_product, targetCategoryRaw, selectedSize, searchQuery, sortBy]);

  const categoryTitle = props.title || activeCategoryInfo?.name || targetCategoryRaw.toUpperCase() || "All Wholesale Apparel";
  const categorySubtitle = props.subtitle || activeCategoryInfo?.description || "Engineered fleece, athletic interlock & high-GSM fabric apparel for sports teams & private labeling (MOQ 50 Pcs).";
  const bgBannerImage = activeCategoryInfo?.banner || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="pt-28 pb-24 bg-[#0a0a0a] min-h-screen text-white px-4 md:px-8">
      <SEO 
        title={`${categoryTitle} — Wholesale & Bulk Sportswear | DAAN Sports`}
        description={categorySubtitle}
        keywords={`wholesale ${categoryTitle}, bulk ${categoryTitle}, OEM sports apparel, ${categoryTitle} manufacturer, custom sports apparel`}
        ogImage={bgBannerImage}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: categoryTitle, url: `/category/${targetCategoryRaw}` }
        ]}
      />
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-400 font-bold uppercase tracking-wider">
          <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft size={14} /> Home
          </Link>
          <span>/</span>
          <span className="text-[#dc2626]">{categoryTitle}</span>
        </div>

        {/* Stretched Category Header Banner */}
        <div className="bg-[#18181b] border border-white/10 p-8 md:p-14 rounded-2xl mb-10 relative overflow-hidden shadow-2xl min-h-[220px] flex items-center">
          <img 
            src={bgBannerImage} 
            alt={categoryTitle} 
            className="absolute inset-0 w-full h-full object-cover brightness-50 hover:scale-105 transition-transform duration-1000" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
          
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 transform -skew-x-12">
              <Tag size={12} className="skew-x-12" />
              <span className="skew-x-12 inline-block">DIRECT FACTORY APPAREL CATEGORY</span>
            </span>
            
            <h1 className="text-4xl md:text-6xl font-serif font-black italic uppercase tracking-tight text-white leading-none">
              {searchQuery ? `Search Results: "${searchQuery}"` : categoryTitle}
            </h1>
            
            <p className="text-zinc-300 text-xs md:text-sm leading-relaxed max-w-xl">
              {categorySubtitle}
            </p>

            {activeCategoryInfo?.subcategories && activeCategoryInfo.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {activeCategoryInfo.subcategories.map((sub, i) => (
                  <span key={i} className="text-[10px] bg-white/10 border border-white/10 px-2.5 py-1 rounded text-zinc-200 font-bold uppercase tracking-wider backdrop-blur-md">
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sorting & Filter Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#141416] border border-white/10 px-6 py-4 rounded-xl mb-8 gap-4 text-xs text-zinc-300 shadow-md">
          
          {/* Left: Product Count & Sizes */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[#dc2626]" />
              <span>Showing <strong className="text-white font-bold">{filteredAndSortedProducts.length}</strong> wholesale designs</span>
            </div>

            <div className="flex items-center gap-1.5 border-l border-white/15 pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Size:</span>
              <div className="flex gap-1">
                {SIZE_OPTIONS.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${selectedSize === size ? 'bg-white text-black font-black' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-[#dc2626]" />
            <span className="font-bold uppercase tracking-wider text-zinc-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-white/20 text-white text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:border-[#dc2626] cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id} className="bg-zinc-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-[#141416] border border-white/10 rounded-2xl p-16 text-center max-w-xl mx-auto my-12 shadow-2xl">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-serif font-black italic uppercase text-2xl text-white mb-2">No Products Matched Criteria</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              No products found in <strong>"{categoryTitle}"</strong> with the selected filters.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#dc2626] hover:text-white transition-colors transform -skew-x-6"
            >
              <span>Return to Home Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((item, i) => (
              <Item key={item.id || i} {...item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ShopCategory;
