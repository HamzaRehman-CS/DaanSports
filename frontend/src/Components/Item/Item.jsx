import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Eye } from 'lucide-react';
import { ShopContext } from '../../Context/ShopContext';
import AnimeCardWrapper from '../AnimeScroll/AnimeScroll';

const Item = (props) => {
  const { addToCart } = useContext(ShopContext);
  const { id, name, image, new_price, old_price, moq, category, gsm } = props;

  return (
    <AnimeCardWrapper className="group bg-[#111113] border border-white/10 rounded-xl overflow-hidden hover:border-[#dc2626]/60 transition-all duration-400 flex flex-col shadow-lg hover:shadow-[0_8px_25px_rgba(220,38,38,0.2)]">
      {/* Strict 16:9 Image Box */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#18181b] shrink-0">
        <img 
          src={image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"} 
          alt={`${name} - DAAN Sports Wholesale OEM`} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out" 
          referrerPolicy="no-referrer" 
          loading="lazy"
          decoding="async"
        />
        
        {/* Category Pill */}
        <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white border border-white/15 backdrop-blur-md rounded">
          {category || "WHOLESALE"}
        </div>

        {/* MOQ Badge */}
        <div className="absolute top-2 right-2 bg-[#dc2626] text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-md rounded-sm">
          MOQ: {moq || 50} Pcs
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center gap-2 p-2 backdrop-blur-xs">
          <Link 
            to={`/product/${id}`} 
            className="bg-white text-[#0a0a0a] px-3 py-1.5 uppercase font-black italic text-[11px] tracking-wider transform -skew-x-12 hover:bg-[#dc2626] hover:text-white transition-colors flex items-center gap-1 shadow-md"
          >
            <Eye size={13} className="skew-x-12" />
            <span className="skew-x-12 inline-block">View</span>
          </Link>
          
          <button 
            onClick={() => addToCart(id)} 
            className="bg-[#dc2626] text-white px-3 py-1.5 uppercase font-black italic text-[11px] tracking-wider transform -skew-x-12 hover:bg-white hover:text-[#0a0a0a] transition-colors flex items-center gap-1 shadow-md cursor-pointer"
          >
            <ShoppingCart size={13} className="skew-x-12" />
            <span className="skew-x-12 inline-block">+ Cart</span>
          </button>
        </div>
      </div>

      {/* Sleek Compact Card Body */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5 bg-[#141416]">
        <div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mb-1">
            <span className="text-zinc-400 font-semibold">{category || "Apparel"}</span>
            {gsm && <span className="text-zinc-500 font-mono text-[9px]">{gsm}</span>}
          </div>
          <Link to={`/product/${id}`} className="block">
            <h3 className="text-sm font-bold text-white leading-snug line-clamp-1 group-hover:text-red-400 transition-colors" title={name}>
              {name}
            </h3>
          </Link>
        </div>

        {/* Compact Bottom Price & Action Row */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-white">${Number(new_price).toFixed(2)}</span>
            {old_price && (
              <span className="text-[11px] text-zinc-500 line-through">${Number(old_price).toFixed(2)}</span>
            )}
            <span className="text-[9px] text-zinc-400 font-medium uppercase">/pc</span>
          </div>

          <Link 
            to={`/product/${id}`} 
            className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            Sample <ArrowRight size={12} className="text-[#dc2626]" />
          </Link>
        </div>
      </div>
    </AnimeCardWrapper>
  );
};


export default Item;
