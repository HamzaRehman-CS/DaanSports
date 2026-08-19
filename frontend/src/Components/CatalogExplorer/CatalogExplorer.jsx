import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Filter, Layers, Check, X } from 'lucide-react';
import Item from '../Item/Item';
import './CatalogExplorer.css';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Catalog', slug: 'all' },
  { id: 'tracksuits', label: 'Track Suits', slug: 'tracksuits' },
  { id: 'hoodies', label: 'Hoodies', slug: 'hoodies' },
  { id: 'sweatshirts', label: 'Sweatshirts', slug: 'sweatshirts' },
  { id: 't-shirts', label: 'T-Shirts', slug: 'tshirts' },
  { id: 'polo-shirts', label: 'Polo Shirts', slug: 'polo-shirts' },
  { id: 'jackets', label: 'Jackets', slug: 'jackets' },
  { id: 'activewear', label: 'Activewear', slug: 'activewear' },
  { id: 'trousers', label: 'Trousers & Joggers', slug: 'trousers' },
  { id: 'accessories', label: 'Accessories', slug: 'accessories' }
];

const SIZE_OPTIONS = ['All', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured & Best Sellers' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'alpha-az', label: 'Alphabetical: A → Z' },
  { id: 'alpha-za', label: 'Alphabetical: Z → A' },
  { id: 'moq-low', label: 'Lowest MOQ (Min Order)' },
  { id: 'gsm-high', label: 'Fabric: Heavyweight First' }
];

export default function CatalogExplorer({ products = [], title = "Explore Wholesale Catalog", subtitle = "Filter by any of our 9 sportswear categories, sort by price, sizes, or fabric specs." }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter
    if (activeCategory !== 'all') {
      const targetCat = activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
      result = result.filter(item => {
        const itemCat = (item.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const itemName = (item.name || '').toLowerCase();
        
        if (targetCat === 'tshirts' || targetCat === 'tshirt') {
          return itemCat.includes('tshirt') || itemCat.includes('tee') || itemName.includes('t-shirt') || itemName.includes('jersey');
        }
        if (targetCat === 'poloshirts' || targetCat === 'polo') {
          return itemCat.includes('polo') || itemName.includes('polo');
        }
        if (targetCat === 'hoodies' || targetCat === 'hoodie') {
          return itemCat.includes('hoodie') || itemName.includes('hoodie');
        }
        if (targetCat === 'sweatshirts' || targetCat === 'sweatshirt') {
          return itemCat.includes('sweatshirt') || itemName.includes('sweatshirt') || itemCat.includes('fleece');
        }
        if (targetCat === 'tracksuits' || targetCat === 'tracksuit') {
          return itemCat.includes('tracksuit') || itemName.includes('tracksuit') || itemName.includes('track suit');
        }
        if (targetCat === 'jackets' || targetCat === 'jacket' || targetCat === 'outerwear') {
          return itemCat.includes('jacket') || itemCat.includes('outerwear') || itemName.includes('jacket') || itemName.includes('windbreaker');
        }
        if (targetCat === 'activewear' || targetCat === 'active') {
          return itemCat.includes('activewear') || itemCat.includes('compression') || itemName.includes('compression') || itemName.includes('gym');
        }
        if (targetCat === 'trousers' || targetCat === 'trouser' || targetCat === 'joggers') {
          return itemCat.includes('trouser') || itemCat.includes('pant') || itemCat.includes('jogger') || itemName.includes('jogger') || itemName.includes('pants');
        }
        if (targetCat === 'accessories' || targetCat === 'accessory') {
          return itemCat.includes('accessor') || itemName.includes('cap') || itemName.includes('bag') || itemName.includes('socks');
        }

        return itemCat.includes(targetCat) || targetCat.includes(itemCat);
      });
    }

    // 2. Size Filter
    if (selectedSize !== 'All') {
      result = result.filter(item => {
        if (Array.isArray(item.sizes) && item.sizes.length > 0) {
          return item.sizes.some(s => s.trim().toUpperCase() === selectedSize.toUpperCase());
        }
        // Fallback if sizes string or default sizing
        return true;
      });
    }

    // 3. Search Term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.name || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        (item.material || '').toLowerCase().includes(q) ||
        (item.gsm || '').toLowerCase().includes(q)
      );
    }

    // 4. Sorting
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
        case 'featured':
        default:
          return (a.id || 0) - (b.id || 0);
      }
    });

    return result;
  }, [products, activeCategory, selectedSize, searchTerm, sortBy]);

  const activeCategoryObj = CATEGORY_TABS.find(c => c.slug === activeCategory) || CATEGORY_TABS[0];

  const resetFilters = () => {
    setActiveCategory('all');
    setSelectedSize('All');
    setSortBy('featured');
    setSearchTerm('');
  };

  const isFiltered = activeCategory !== 'all' || selectedSize !== 'All' || sortBy !== 'featured' || searchTerm !== '';

  return (
    <section className="catalog-explorer-section" id="wholesale-catalog">
      <div className="catalog-explorer-container">

        {/* Explorer Header */}
        <div className="catalog-explorer-header">
          <div className="header-left">
            <h2 className="explorer-title uppercase">{title}</h2>
            <div className="w-16 h-1 bg-[#dc2626] mt-2 mb-2 rounded-full" />
            <p className="explorer-subtitle">{subtitle}</p>
          </div>

          <div className="header-right">
            {/* Search Input */}
            <div className="catalog-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search models, fabric, GSM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="clear-search-btn" title="Clear Search">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 1. UPPER CATEGORIES SELECTOR (9 Categories + All) */}
        <div className="category-pills-bar">
          <div className="category-pills-scroll">
            {CATEGORY_TABS.map(tab => {
              const isActive = activeCategory === tab.slug;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.slug)}
                  className={`category-pill-btn ${isActive ? 'active' : ''}`}
                >
                  <span>{tab.label}</span>
                  {isActive && <span className="active-dot" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. CONTROLS BAR: SORTING & SIZES & STATUS */}
        <div className="catalog-controls-bar">
          
          {/* Left: Size Selector Pills */}
          <div className="size-filter-group">
            <span className="control-label">
              <Filter size={13} /> Size:
            </span>
            <div className="size-pills-wrap">
              {SIZE_OPTIONS.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-pill-btn ${selectedSize === size ? 'active' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sort By Dropdown */}
          <div className="sort-filter-group">
            <span className="control-label">
              <ArrowUpDown size={13} /> Sort By:
            </span>
            <div className="custom-select-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown-select"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Status Strip */}
        <div className="catalog-status-strip">
          <div className="status-info">
            <Layers size={15} className="text-[#dc2626]" />
            <span>
              Showing <strong className="text-white font-bold">{filteredAndSortedProducts.length}</strong> wholesale designs in <strong className="text-white font-bold">{activeCategoryObj.label}</strong>
              {selectedSize !== 'All' && <span> • Size: <strong className="text-[#dc2626] font-bold">{selectedSize}</strong></span>}
            </span>
          </div>

          {isFiltered && (
            <button onClick={resetFilters} className="reset-filter-btn">
              <X size={13} /> Reset Filters
            </button>
          )}
        </div>

        {/* 3. PRODUCT GRID */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="catalog-empty-state">
            <div className="empty-icon">📦</div>
            <h3>No Products Found</h3>
            <p>
              No wholesale models matched your current filter criteria 
              {activeCategory !== 'all' ? ` for "${activeCategoryObj.label}"` : ''} 
              {selectedSize !== 'All' ? ` in size ${selectedSize}` : ''}.
            </p>
            <button onClick={resetFilters} className="empty-reset-btn">
              View All Wholesale Catalog
            </button>
          </div>
        ) : (
          <div className="catalog-products-grid">
            {filteredAndSortedProducts.map(product => (
              <Item key={product.id} {...product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
