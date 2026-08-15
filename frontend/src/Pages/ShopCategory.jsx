import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';
import { ArrowLeft, Tag, Layers } from 'lucide-react';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const location = useLocation();
  const { categoryId } = useParams();

  const [categoriesList, setCategoriesList] = useState([]);
  const [activeCategoryInfo, setActiveCategoryInfo] = useState(null);

  // Search query support
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  const targetCategoryRaw = props.category || categoryId || '';

  useEffect(() => {
    fetch("http://localhost:4000/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategoriesList(data);
          const found = data.find(c => 
            c.slug === targetCategoryRaw.toLowerCase() || 
            c.name.toLowerCase() === targetCategoryRaw.toLowerCase()
          );
          if (found) setActiveCategoryInfo(found);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, [targetCategoryRaw]);

  const filteredProducts = (all_product || []).filter(item => {
    let matchesCategory = true;

    if (targetCategoryRaw && targetCategoryRaw !== 'all') {
      const itemCat = (item.category || '').toLowerCase().trim();
      const targetCat = targetCategoryRaw.toLowerCase().trim();
      const targetSlug = targetCat.replace(/[^a-z0-9]/g, '');
      const itemSlug = itemCat.replace(/[^a-z0-9]/g, '');

      matchesCategory = 
        itemCat === targetCat || 
        itemSlug === targetSlug || 
        itemCat.includes(targetCat) || 
        targetCat.includes(itemCat) ||
        (targetCat.includes('sweatshirt') && itemCat.includes('hoodie')) ||
        (targetCat.includes('hoodie') && itemCat.includes('sweatshirt')) ||
        (targetCat.includes('trouser') && (itemCat.includes('pant') || itemCat.includes('jogger')));
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

    return matchesCategory && matchesSearch;
  });

  const categoryTitle = props.title || activeCategoryInfo?.name || targetCategoryRaw.toUpperCase() || "All Wholesale Apparel";
  const categorySubtitle = props.subtitle || activeCategoryInfo?.description || "Engineered fleece, athletic interlock & high-GSM fabric apparel for sports teams & private labeling (MOQ 50 Pcs).";
  const bgBannerImage = activeCategoryInfo?.banner || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="pt-28 pb-24 bg-[#0a0a0a] min-h-screen text-white px-4 md:px-8">
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

        {/* Sorting & Filter Indicator */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#141416] border border-white/10 px-6 py-4 rounded-xl mb-8 text-xs text-zinc-400 shadow-md">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[#dc2626]" />
            <span>Showing <strong className="text-white font-bold">{filteredProducts.length}</strong> wholesale designs in <strong className="text-white">{categoryTitle}</strong></span>
          </div>
          <div className="mt-2 sm:mt-0 font-bold uppercase tracking-wider text-zinc-300">
            Sort: <span className="text-white">Low → High Unit Price</span>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#141416] border border-white/10 rounded-2xl p-16 text-center max-w-xl mx-auto my-12 shadow-2xl">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-serif font-black italic uppercase text-2xl text-white mb-2">No Products in this Category Yet</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              No products have been assigned to <strong>"{categoryTitle}"</strong> yet. Go to the Admin Portal to add products to this category!
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
            {filteredProducts.map((item, i) => (
              <Item key={item.id || i} {...item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ShopCategory;
