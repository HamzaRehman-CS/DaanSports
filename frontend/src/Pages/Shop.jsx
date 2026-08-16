import React, { useContext, useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Globe, ShieldCheck, Zap, Factory, Package, Medal, Star, Flame, Percent, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryBoxShowcase from '../Components/CategoryBoxShowcase/CategoryBoxShowcase';
import FeatureTrustBar from '../Components/FeatureTrustBar/FeatureTrustBar';
import HeroCarousel from '../Components/HeroCarousel/HeroCarousel';
import BentoBanners from '../Components/BentoBanners/BentoBanners';
import CatalogExplorer from '../Components/CatalogExplorer/CatalogExplorer';
import Item from '../Components/Item/Item';
import SEO from '../Components/SEO/SEO';
import { ShopContext } from '../Context/ShopContext';
import { useAnimeReveal } from '../Components/AnimeScroll/AnimeScroll';
import { API_URL } from '../config';

const Shop = () => {
  const { all_product } = useContext(ShopContext);
  const [categories, setCategories] = useState([]);
  const [promotionalBanners, setPromotionalBanners] = useState(null);

  useAnimeReveal('.anime-reveal');

  useEffect(() => {
    // Fetch categories & promotional banners from backend
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Categories fetch error:", err));

    fetch(`${API_URL}/promotional-banners`)
      .then(res => res.json())
      .then(data => {
        if (data) setPromotionalBanners(data);
      })
      .catch(err => console.error("Promotional banners fetch error:", err));
  }, []);

  const promoCategory1Name = promotionalBanners?.promoSection1?.category || 'Trousers';
  const promoCategory2Name = promotionalBanners?.promoSection2?.category || 'Sweatshirts';

  const promo1Products = (all_product || []).filter(p => 
    (p.category || '').toLowerCase().includes(promoCategory1Name.toLowerCase()) ||
    (promoCategory1Name.toLowerCase().includes('trouser') && ((p.category || '').toLowerCase().includes('pant') || (p.category || '').toLowerCase().includes('jogger')))
  ).slice(0, 4);

  const promo2Products = (all_product || []).filter(p => 
    (p.category || '').toLowerCase().includes(promoCategory2Name.toLowerCase()) ||
    (promoCategory2Name.toLowerCase().includes('sweatshirt') && (p.category || '').toLowerCase().includes('hoodie'))
  ).slice(0, 4);

  return (
    <div className="bg-[#0a0a0a] text-white overflow-hidden selection:bg-[#dc2626] selection:text-white">
      <SEO 
        title="DAAN Sports — #1 B2B Wholesale Apparel & Custom OEM Sportswear Manufacturer"
        description="Direct factory manufacturer of premium wholesale tracksuits, 350 GSM heavyweight fleece hoodies, gym activewear, athletic jerseys, and outerwear. Low MOQ 50 pcs, custom OEM private labeling, and fast worldwide express shipping."
        keywords="wholesale sportswear, bulk tracksuits, custom athletic apparel, OEM clothing manufacturer, heavyweight fleece hoodies, gym activewear supplier, private label sports apparel, B2B sportswear export"
      />
      
      {/* 1. Hero Carousel (Shifting Animation Banner) */}
      <HeroCarousel />

      {/* 2. Our Categories: Box-Type Categories Showcase (3-4 on Laptop, 3 on Mobile) */}
      <CategoryBoxShowcase initialCategories={categories} />

      {/* 3. Feature Trust Bar (Free Shipping, Premium Quality, Easy Returns, 24/7 Support) */}
      <FeatureTrustBar />

      {/* 4. Bento-Style Promotional & OEM Banners Showcase */}
      <div className="anime-reveal">
        <BentoBanners banners={promotionalBanners} />
      </div>

      {/* 5. Interactive Wholesale Catalog Explorer (Upper 9 Category Filter + Sizes + Complete Sorting Engine) */}
      <CatalogExplorer 
        products={all_product} 
        title="Wholesale Catalog & Factory Inventory" 
        subtitle="Select from our 9 specialized apparel categories, filter by size, and sort by unit price, MOQ, or fabric GSM weight."
      />


      {/* 3. Edge-to-Edge Stretched Category Banner 1 */}
      <section className="py-16 bg-[#141416] border-y border-white/10">
        <div className="w-full relative h-72 md:h-96 overflow-hidden mb-12 flex items-center border-y border-white/10 shadow-2xl anime-reveal">
          <img 
            src={promotionalBanners?.promoSection1?.bgImage || "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=2070&auto=format&fit=crop"} 
            alt="Promo Banner 1" 
            className="absolute inset-0 w-full h-full object-cover brightness-60 hover:scale-105 transition-transform duration-1000" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 bg-emerald-500 text-[#0a0a0a] text-[10px] font-black uppercase tracking-widest px-3 py-1 transform -skew-x-12">
              <Percent size={14} className="skew-x-12" />
              <span className="skew-x-12 inline-block">{promotionalBanners?.promoSection1?.discountText || "10% OFF WHOLESALE SPECIAL"}</span>
            </span>

            <h2 className="text-4xl md:text-6xl font-serif font-black italic uppercase text-white tracking-tight leading-none">
              {promotionalBanners?.promoSection1?.title || "TROUSERS & JOGGERS"}
            </h2>

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              {promotionalBanners?.promoSection1?.subtitle || "Heavyweight 330 GSM combed cotton fleece & tri-blend warm-up joggers with zippered pockets."}
            </p>

            <Link 
              to={`/category/${promoCategory1Name.toLowerCase().replace(/[^a-z0-9]/g, '')}`} 
              className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#dc2626] hover:text-white transition-colors transform -skew-x-6"
            >
              <span>Explore {promoCategory1Name} Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promo1Products.map(p => (
              <div key={p.id} className="anime-reveal">
                <Item {...p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Edge-to-Edge Stretched Category Banner 2 */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="w-full relative h-72 md:h-96 overflow-hidden mb-12 flex items-center justify-end border-y border-white/10 shadow-2xl anime-reveal">
          <img 
            src={promotionalBanners?.promoSection2?.bgImage || "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop"} 
            alt="Promo Banner 2" 
            className="absolute inset-0 w-full h-full object-cover brightness-60 hover:scale-105 transition-transform duration-1000" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
          
          <div className="relative z-10 px-8 md:px-16 max-w-2xl text-right space-y-4">
            <span className="inline-flex items-center gap-2 bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 transform -skew-x-12">
              <span className="skew-x-12 inline-block">{promotionalBanners?.promoSection2?.discountText || "HEAVYWEIGHT 350 GSM"}</span>
            </span>

            <h2 className="text-4xl md:text-6xl font-serif font-black italic uppercase text-white tracking-tight leading-none">
              {promotionalBanners?.promoSection2?.title || "HEAVYWEIGHT HOODIES"}
            </h2>

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              {promotionalBanners?.promoSection2?.subtitle || "100% French Terry cotton pullover hoodies ready for high-density screen printing & embroidery."}
            </p>

            <Link 
              to={`/category/${promoCategory2Name.toLowerCase().replace(/[^a-z0-9]/g, '')}`} 
              className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#dc2626] hover:text-white transition-colors transform -skew-x-6"
            >
              <span>Explore {promoCategory2Name} Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promo2Products.map(p => (
              <div key={p.id} className="anime-reveal">
                <Item {...p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Additional Custom Banners added by Admin */}
      {promotionalBanners?.customBanners && promotionalBanners.customBanners.length > 0 && promotionalBanners.customBanners.map((cb, idx) => {
        const catTarget = cb.category || 'Tracksuits';
        const cbProducts = (all_product || []).filter(p =>
          (p.category || '').toLowerCase().trim() === catTarget.toLowerCase().trim()
        ).slice(0, 4);

        return (
          <section key={cb.id || idx} className="py-16 bg-[#141416] border-y border-white/10">
            <div className="w-full relative h-72 md:h-96 overflow-hidden mb-12 flex items-center border-y border-white/10 shadow-2xl anime-reveal">
              <img 
                src={cb.bgImage} 
                alt={cb.title} 
                className="absolute inset-0 w-full h-full object-cover brightness-60 hover:scale-105 transition-transform duration-1000" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/75 to-transparent"></div>
              
              <div className="relative z-10 px-8 md:px-16 max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-2 bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 transform -skew-x-12">
                  <Sparkles size={14} className="skew-x-12" />
                  <span className="skew-x-12 inline-block">{cb.discountText || "EXCLUSIVE B2B COLLECTION"}</span>
                </span>

                <h2 className="text-4xl md:text-6xl font-serif font-black italic uppercase text-white tracking-tight leading-none">
                  {cb.title}
                </h2>

                <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                  {cb.subtitle}
                </p>

                <Link 
                  to={`/category/${catTarget.toLowerCase().replace(/[^a-z0-9]/g, '')}`} 
                  className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#dc2626] hover:text-white transition-colors transform -skew-x-6"
                >
                  <span>Explore {catTarget}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {cbProducts.length > 0 && (
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cbProducts.map(p => (
                    <div key={p.id} className="anime-reveal">
                      <Item {...p} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}

      {/* 6. Dynamic Categories Stretched Banners (Created by Admin) */}
      {categories.filter(c => !['tracksuits', 'sweatshirts', 'trousers'].includes(c.slug)).map((cat) => {
        const catProducts = (all_product || []).filter(p => 
          (p.category || '').toLowerCase().trim() === (cat.name || '').toLowerCase().trim()
        ).slice(0, 4);

        return (
          <section key={cat.id} className="py-16 bg-[#0a0a0a] border-y border-white/10">
            <div className="w-full relative h-64 md:h-80 overflow-hidden mb-10 flex items-center border-y border-white/10 shadow-2xl anime-reveal">
              <img 
                src={cat.banner} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover brightness-60 hover:scale-105 transition-transform duration-1000" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent"></div>
              
              <div className="relative z-10 px-8 md:px-16 max-w-xl space-y-3">
                <span className="text-golden-small text-[#dc2626] font-bold block uppercase">WHOLESALE COLLECTION</span>
                <h2 className="text-3xl md:text-5xl font-serif font-black italic uppercase text-white leading-none">
                  {cat.name}
                </h2>
                <p className="text-zinc-300 text-xs md:text-sm">{cat.description}</p>
                <Link 
                  to={`/category/${cat.slug || cat.name.toLowerCase()}`}
                  className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-5 py-2.5 font-bold text-xs uppercase tracking-wider hover:bg-[#dc2626] hover:text-white transition-colors transform -skew-x-6"
                >
                  <span>Explore {cat.name}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {catProducts.length > 0 && (
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {catProducts.map(p => (
                    <div key={p.id} className="anime-reveal">
                      <Item {...p} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}

      {/* 7. Why Choose Us */}
      <WhyChooseUs />

      {/* 8. B2B Inquiry Contact Section */}
      <ContactSnippet />
    </div>
  );
};

// Subcomponent: Why Choose Us
const WhyChooseUs = () => {
  const features = [
    { icon: <ShieldCheck size={32} />, title: "Premium Quality", desc: "Grade A fabrics and double-needle flatlock stitching." },
    { icon: <Factory size={32} />, title: "OEM / ODM", desc: "Full custom labeling, 3D embroidery & custom specs." },
    { icon: <Package size={32} />, title: "Bulk Capacity", desc: "High volume production lines with low MOQ options." },
    { icon: <Globe size={32} />, title: "Global Shipping", desc: "Worldwide door-to-door express airway shipping." },
    { icon: <Zap size={32} />, title: "Fast Turnaround", desc: "Optimized 12-15 business days production timeline." },
    { icon: <CheckCircle size={32} />, title: "Strict QC", desc: "Multi-stage quality assurance before dispatch." }
  ];

  return (
    <section className="py-24 bg-[#09090b] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-center font-serif text-3xl md:text-5xl font-black italic uppercase tracking-tight text-white mb-16 anime-reveal">
          Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800 py-1 inline-block leading-normal overflow-visible">DAAN Sports</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          {features.map((f, i) => (
            <div key={i} className="flex gap-6 group anime-reveal">
              <div className="text-white bg-[#141416] w-16 h-16 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[#dc2626] group-hover:text-[#dc2626] transition-colors duration-300 transform group-hover:-translate-y-2 rounded-lg shadow-lg">
                {f.icon}
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider mb-2">{f.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Subcomponent: Contact Form
const ContactSnippet = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-0 flex flex-col lg:flex-row bg-[#0a0a0a] border-t border-white/10">
      <div className="lg:w-1/2 bg-[#141416] p-12 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 anime-reveal">
        <h2 className="text-4xl md:text-6xl font-serif font-black italic uppercase text-white mb-6">
          Let's <span className="text-[#dc2626]">Talk Business</span>
        </h2>
        <p className="text-zinc-400 mb-10 max-w-md text-sm leading-relaxed">
          Ready to manufacture premium apparel? Fill out the inquiry form or contact our B2B desk directly. We reply to all wholesale tech-pack inquiries within 24 hours.
        </p>
        <div className="space-y-6 text-sm">
          <div className="flex flex-col">
            <span className="text-golden-small text-[#dc2626] font-bold mb-1">EMAIL INQUIRY</span>
            <a href="mailto:export@daansports.com" className="text-lg text-white hover:text-[#dc2626] font-bold">export@daansports.com</a>
          </div>
          <div className="flex flex-col">
            <span className="text-golden-small text-[#dc2626] font-bold mb-1">B2B PHONE DESK</span>
            <a href="tel:+18003777678" className="text-lg text-white hover:text-[#dc2626] font-bold">+1 (800) DS-SPORT</a>
          </div>
        </div>
      </div>
      
      <div className="lg:w-1/2 p-8 lg:p-24 bg-[#0a0a0a] anime-reveal">
        {submitted ? (
          <div className="bg-[#141416] border border-emerald-500/50 p-8 rounded-lg text-center animate-fade-up">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-serif font-black italic uppercase text-2xl text-white mb-2">Inquiry Received!</h3>
            <p className="text-zinc-400 text-sm">Thank you for submitting your custom apparel project. Our export manager will email your custom tech-pack quote shortly.</p>
          </div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="FULL NAME *" className="bg-transparent border-b border-white/20 text-white p-3 font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-[#dc2626]" required />
              <input type="text" placeholder="COMPANY NAME" className="bg-transparent border-b border-white/20 text-white p-3 font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-[#dc2626]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="email" placeholder="BUSINESS EMAIL ADDRESS *" className="bg-transparent border-b border-white/20 text-white p-3 font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-[#dc2626]" required />
              <input type="tel" placeholder="PHONE NUMBER" className="bg-transparent border-b border-white/20 text-white p-3 font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-[#dc2626]" />
            </div>
            <select defaultValue="" className="bg-[#0a0a0a] border-b border-white/20 text-zinc-400 p-3 font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-[#dc2626] focus:text-white cursor-pointer" required>
              <option value="" disabled>PRODUCT INTEREST *</option>
              <option value="tracksuits">TRACKSUITS & JOGGERS</option>
              <option value="hoodies">HOODIES & SWEATSHIRTS</option>
              <option value="activewear">PRO ACTIVEWEAR & COMPRESSION</option>
              <option value="trousers">TROUSERS & SWEATPANTS</option>
              <option value="jerseys">ATHLETIC JERSEYS & TEES</option>
            </select>
            <textarea placeholder="PROJECT DETAILS / TARGET MOQ / CUSTOM SPECS *" rows={4} className="bg-transparent border-b border-white/20 text-white p-3 font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-[#dc2626] resize-none" required></textarea>
            
            <button type="submit" className="mt-6 bg-white text-[#0a0a0a] py-4 px-8 font-bold text-xs uppercase tracking-wider hover:bg-[#dc2626] hover:text-white transition-colors self-start flex items-center gap-2 transform -skew-x-12 shadow-xl cursor-pointer">
              <span className="skew-x-12 inline-block">Submit B2B Tech-Pack Inquiry</span> <ArrowRight size={16} className="skew-x-12" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Shop;
