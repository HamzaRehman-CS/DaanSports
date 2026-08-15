import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Eye } from 'lucide-react';
import { ShopContext } from '../../Context/ShopContext';
import AnimeCardWrapper from '../AnimeScroll/AnimeScroll';

const Item = (props) => {
  const { addToCart } = useContext(ShopContext);
  const { id, name, image, new_price, old_price, moq, category } = props;

  return (
    <AnimeCardWrapper className="group bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-[#dc2626]/50 transition-all duration-500 flex flex-col justify-between shadow-2xl hover:shadow-[0_10px_30px_rgba(220,38,38,0.2)]">
      <div className="relative h-64 sm:h-80 overflow-hidden bg-[#18181b]">
        <img 
          src={image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"} 
          alt={name} 
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-all duration-700 ease-out" 
          referrerPolicy="no-referrer" 
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 flex items-center text-[10px] font-bold uppercase tracking-widest text-white border border-white/20 backdrop-blur-md rounded-md">
          {category || "WHOLESALE SPEC"}
        </div>

        {/* MOQ Badge */}
        <div className="absolute top-3 right-3 bg-[#dc2626] text-white px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest shadow-lg transform -skew-x-6">
          <span className="skew-x-6 inline-block">MOQ: {moq || 50} Pcs</span>
        </div>

        {/* Hover Quick View / Add to Cart Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4 backdrop-blur-xs">
          <Link 
            to={`/product/${id}`} 
            className="bg-white text-[#0a0a0a] px-4 py-2.5 uppercase font-black italic text-xs tracking-wider transform -skew-x-12 hover:bg-[#dc2626] hover:text-white transition-colors flex items-center gap-1.5 shadow-xl"
          >
            <Eye size={14} className="skew-x-12" />
            <span className="skew-x-12 inline-block">Details</span>
          </Link>
          
          <button 
            onClick={() => addToCart(id)} 
            className="bg-[#dc2626] text-white px-4 py-2.5 uppercase font-black italic text-xs tracking-wider transform -skew-x-12 hover:bg-white hover:text-[#0a0a0a] transition-colors flex items-center gap-1.5 shadow-xl cursor-pointer"
          >
            <ShoppingCart size={14} className="skew-x-12" />
            <span className="skew-x-12 inline-block">+ Cart</span>
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between bg-[#141416]">
        <div>
          <p className="text-[10px] text-[#dc2626] uppercase tracking-widest font-black mb-1">
            {category || "Custom Apparel"}
          </p>
          <h3 className="text-base font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-zinc-200 transition-colors">
            {name}
          </h3>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-black text-white font-serif">${Number(new_price).toFixed(2)}</span>
            {old_price && (
              <span className="text-xs text-zinc-500 line-through">${Number(old_price).toFixed(2)}</span>
            )}
            <span className="text-[10px] text-zinc-400 font-bold uppercase ml-auto">/ unit</span>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <Link 
              to={`/product/${id}`} 
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white flex items-center gap-1.5 transition-colors"
            >
              Order Sample <ArrowRight size={13} className="text-[#dc2626]" />
            </Link>
          </div>
        </div>
      </div>
    </AnimeCardWrapper>
  );
};

export default Item;
