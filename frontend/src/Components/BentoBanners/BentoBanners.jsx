import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Tag, Zap, Factory } from 'lucide-react';

const BentoBanners = ({ banners }) => {
  const b = banners || {};

  const tall = b.tallVertical || {
    category: "Tracksuits",
    title: "FLAGSHIP TEAM TRACKSUITS",
    subtitle: "Custom 330 GSM combed fleece & interlock sets engineered for elite athletics.",
    badge: "FLAGSHIP SPEC",
    ctaText: "Explore Tracksuits",
    bgImage: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=1200&auto=format&fit=crop"
  };

  const wide = b.wideFeature || {
    category: "Sweatshirts",
    title: "HEAVYWEIGHT 350 GSM HOODIES",
    subtitle: "100% French Terry pullovers & drop-shoulder streetwear cuts ready for 3D embroidery.",
    discountText: "15% BULK DISCOUNT",
    badge: "HIGH-DENSITY EMBROIDERY",
    ctaText: "View Hoodies",
    bgImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop"
  };

  const compactA = b.compactA || {
    category: "Trousers",
    title: "Tri-Blend Athletic Joggers",
    subtitle: "Reinforced zipper pockets & ribbed cuffs",
    discountText: "10% OFF",
    ctaText: "Shop Joggers",
    bgImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000&auto=format&fit=crop"
  };

  const compactB = b.compactB || {
    category: "Activewear",
    title: "Pro Compression Sets",
    subtitle: "Sweat-wicking 4-way performance stretch",
    discountText: "PRO SPEC",
    ctaText: "Shop Activewear",
    bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop"
  };

  const oem = b.oemStrip || {
    title: "DIRECT OEM / ODM PRIVATE LABEL MANUFACTURING",
    subtitle: "Full custom labeling, silicone tags, custom GSM weaving, and express airway cargo delivery worldwide.",
    badge: "ISO 9001 CERTIFIED",
    ctaText: "Request Tech-Pack Quote",
    bgImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2000&auto=format&fit=crop"
  };

  const getLink = (category) => {
    const cat = (category || "").toLowerCase().trim();
    if (cat.includes("tracksuit")) return "/tracksuits";
    if (cat.includes("polo")) return "/polo-shirts";
    if (cat.includes("hoodie")) return "/hoodies";
    if (cat.includes("sweatshirt")) return "/sweatshirts";
    if (cat.includes("trouser") || cat.includes("jogger") || cat.includes("pant")) return "/trousers";
    if (cat.includes("jacket") || cat.includes("outerwear")) return "/jackets";
    if (cat.includes("activewear") || cat.includes("compression")) return "/activewear";
    if (cat.includes("accessor")) return "/accessories";
    if (cat.includes("t-shirt") || cat.includes("tshirt") || cat.includes("tee") || cat.includes("shirt")) return "/tshirts";
    return `/category/${cat.replace(/\s+/g, '-')}`;
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-8 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-black italic uppercase text-white tracking-tight">
            FACTORY SHOWCASE & BULK OFFERS
          </h2>
          <div className="w-16 h-1 bg-[#dc2626] mt-2.5 rounded-full" />
        </div>
        <p className="text-xs text-zinc-400 max-w-md">
          Direct manufacturer pricing, certified high-tensile stitching, and rapid global supply lines.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bento Tile 1: Vertical Tall Banner (Col Span 5) */}
        <div className="lg:col-span-5 group relative rounded-2xl overflow-hidden border border-white/10 bg-[#141416] flex flex-col justify-between p-6 md:p-8 min-h-[460px] md:min-h-[520px] shadow-2xl transition-all duration-500 hover:border-[#dc2626]/60">
          {/* Background Image with Hover Scale */}
          <div className="absolute inset-0 z-0">
            <img 
              src={tall.bgImage || tall.image} 
              alt={tall.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Multi-layer Dark Gradient for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/40" />
          </div>

          {/* Top Pill / Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg transform -skew-x-6">
              <span className="skew-x-6 inline-block">{tall.badge || "FLAGSHIP SPEC"}</span>
            </span>
            <span className="bg-black/70 backdrop-blur-md border border-white/15 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
              {tall.category || "Tracksuits"}
            </span>
          </div>

          {/* Bottom Content & Action */}
          <div className="relative z-10 space-y-3 mt-auto pt-16">
            <h3 className="text-2xl md:text-3xl font-display font-black italic uppercase text-white leading-tight">
              {tall.title}
            </h3>
            <p className="text-xs md:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
              {tall.subtitle}
            </p>
            <div className="pt-2">
              <Link 
                to={getLink(tall.category)} 
                className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-6 py-3 font-display font-black italic uppercase text-xs tracking-wider transform -skew-x-12 hover:bg-[#dc2626] hover:text-white transition-all shadow-xl"
              >
                <span className="skew-x-12 inline-block">{tall.ctaText || "Explore Tracksuits"}</span>
                <ArrowRight size={14} className="skew-x-12" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bento Column 2: Stacked Right Grid (Col Span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Bento Tile 2: Wide Horizontal Box */}
          <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#141416] p-6 md:p-8 min-h-[240px] flex flex-col justify-between shadow-xl transition-all duration-500 hover:border-[#dc2626]/60">
            <div className="absolute inset-0 z-0">
              <img 
                src={wide.bgImage || wide.image} 
                alt={wide.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-black/75 to-black/30" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-[#f59e0b] text-[#0a0a0a] text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded shadow">
                {wide.discountText || "15% BULK DISCOUNT"}
              </span>
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest bg-black/60 px-2.5 py-0.5 rounded border border-white/10">
                {wide.category || "Sweatshirts"}
              </span>
            </div>

            <div className="relative z-10 space-y-2 mt-auto pt-6 max-w-lg">
              <h3 className="text-xl md:text-2xl font-display font-black italic uppercase text-white leading-tight">
                {wide.title}
              </h3>
              <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                {wide.subtitle}
              </p>
              <div className="pt-1">
                <Link 
                  to={getLink(wide.category)} 
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#dc2626] transition-colors"
                >
                  <span>{wide.ctaText || "View Collection"}</span>
                  <ArrowRight size={13} className="text-[#dc2626]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bento Tiles 3 & 4: Dual Compact Box Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            
            {/* Compact Box A */}
            <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#141416] p-5 min-h-[200px] flex flex-col justify-between shadow-xl transition-all duration-500 hover:border-[#dc2626]/60">
              <div className="absolute inset-0 z-0">
                <img 
                  src={compactA.bgImage || compactA.image} 
                  alt={compactA.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/70 to-black/40" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-[#dc2626] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                  {compactA.discountText || "10% OFF"}
                </span>
                <Tag size={12} className="text-zinc-400" />
              </div>

              <div className="relative z-10 space-y-1 mt-auto pt-6">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">
                  {compactA.category || "Trousers"}
                </span>
                <h4 className="text-base font-bold text-white leading-tight">
                  {compactA.title}
                </h4>
                <p className="text-[11px] text-zinc-300 line-clamp-1">
                  {compactA.subtitle}
                </p>
                <div className="pt-2">
                  <Link 
                    to={getLink(compactA.category)} 
                    className="text-[11px] font-bold uppercase tracking-wider text-[#dc2626] group-hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {compactA.ctaText || "Shop Joggers"} <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Compact Box B */}
            <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#141416] p-5 min-h-[200px] flex flex-col justify-between shadow-xl transition-all duration-500 hover:border-[#dc2626]/60">
              <div className="absolute inset-0 z-0">
                <img 
                  src={compactB.bgImage || compactB.image} 
                  alt={compactB.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/70 to-black/40" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-white text-[#0a0a0a] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                  {compactB.discountText || "PRO SPEC"}
                </span>
                <Zap size={12} className="text-yellow-400" />
              </div>

              <div className="relative z-10 space-y-1 mt-auto pt-6">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">
                  {compactB.category || "Activewear"}
                </span>
                <h4 className="text-base font-bold text-white leading-tight">
                  {compactB.title}
                </h4>
                <p className="text-[11px] text-zinc-300 line-clamp-1">
                  {compactB.subtitle}
                </p>
                <div className="pt-2">
                  <Link 
                    to={getLink(compactB.category)} 
                    className="text-[11px] font-bold uppercase tracking-wider text-white group-hover:text-[#dc2626] flex items-center gap-1 transition-colors"
                  >
                    {compactB.ctaText || "Shop Activewear"} <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bento Tile 5: Direct Factory Innovation Strip */}
      <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#18181b] p-6 md:p-8 mt-6 shadow-2xl transition-all duration-500 hover:border-white/25">
        <div className="absolute inset-0 z-0">
          <img 
            src={oem.bgImage || oem.image} 
            alt={oem.title} 
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-black/85 to-black/60" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#dc2626] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded">
                {oem.badge || "ISO 9001 CERTIFIED"}
              </span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Factory size={13} className="text-[#dc2626]" /> 50K+ Monthly Production Capacity
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-black italic uppercase text-white">
              {oem.title}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {oem.subtitle}
            </p>
          </div>

          <Link 
            to="/custom-orders" 
            className="inline-flex items-center gap-2 bg-[#dc2626] text-white px-7 py-3.5 font-display font-black italic uppercase text-xs tracking-wider transform -skew-x-12 hover:bg-white hover:text-[#0a0a0a] transition-all shadow-xl shrink-0"
          >
            <span className="skew-x-12 inline-block">{oem.ctaText || "Request Tech-Pack Quote"}</span>
            <ArrowRight size={14} className="skew-x-12" />
          </Link>
        </div>
      </div>

    </section>
  );
};

export default BentoBanners;
