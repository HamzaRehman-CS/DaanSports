import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Factory, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';

const fallbackSlides = [
  {
    id: 1,
    badgeText: "PREMIUM MANUFACTURER",
    tag: "Premium Manufacturer",
    title: "ENGINEERED<br />FOR <span class='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800 text-[0.82em] tracking-tight inline-block py-2 leading-normal overflow-visible'>EXCELLENCE</span>",
    description: "Custom Manufacturing • Private Label • Global Export Solutions. The trusted partner for global sportswear and activewear brands.",
    subtitle: "Custom Manufacturing • Private Label • Global Export Solutions. The trusted partner for global sportswear and activewear brands.",
    specBadge: "330 GSM FLEECE",
    productName: "Pro Tech Fleece Tracksuit",
    priceText: "From $24.50 /pc",
    bgImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1600&auto=format&fit=crop",
    productImg: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=1000&auto=format&fit=crop",
    primaryCtaText: "Explore Collections",
    primaryCtaLink: "/tracksuits"
  },
  {
    id: 2,
    badgeText: "STREETWEAR & HOODIES",
    tag: "Pro Activewear & Hoodies",
    title: "ELEVATE<br />YOUR <span class='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800 text-[0.82em] tracking-tight inline-block py-2 leading-normal overflow-visible'>BRAND</span>",
    description: "Heavyweight 350 GSM French Terry pullovers, custom drop-shoulder streetwear fits, and high-density 3D embroidery.",
    subtitle: "Heavyweight 350 GSM French Terry pullovers, custom drop-shoulder streetwear fits, and high-density 3D embroidery.",
    specBadge: "350 GSM FRENCH TERRY",
    productName: "Heavyweight Boxy Hoodie",
    priceText: "From $18.90 /pc",
    bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop",
    productImg: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    primaryCtaText: "View Hoodies",
    primaryCtaLink: "/sweatshirts"
  },
  {
    id: 3,
    badgeText: "GLOBAL EXPORT SOLUTIONS",
    tag: "Global Export Solutions",
    title: "WORLDWIDE<br /><span class='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800 text-[0.72em] tracking-tight inline-block py-2 leading-normal overflow-visible'>DISTRIBUTION</span>",
    description: "Full ISO 9001 certified QC assurance, OEM private label silicone tagging, and worldwide door-to-door express cargo.",
    subtitle: "Full ISO 9001 certified QC assurance, OEM private label silicone tagging, and worldwide door-to-door express cargo.",
    specBadge: "ISO 9001 CERTIFIED",
    productName: "Performance Compression Set",
    priceText: "From $16.50 /pc",
    bgImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1600&auto=format&fit=crop",
    productImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    primaryCtaText: "Custom Orders",
    primaryCtaLink: "/custom-orders"
  }
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/cms`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
          setSlides(data.heroSlides);
        }
      })
      .catch(err => console.error("Error fetching Hero CMS:", err));
  }, []);

  return (
    <section className="relative min-h-[640px] lg:min-h-[720px] w-full overflow-hidden bg-[#0a0a0a] flex items-center">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1200}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;
          const bgImg = slide.bgImage || slide.image || fallbackSlides[index % fallbackSlides.length].bgImage;
          const prodImg = slide.productImg || slide.bgImage || fallbackSlides[index % fallbackSlides.length].productImg;
          const badge = slide.badgeText || slide.tag || "PREMIUM MANUFACTURER";
          const titleHtml = slide.title || "ENGINEERED FOR EXCELLENCE";
          const desc = slide.subtitle || slide.description || "Custom Manufacturing • Private Label • Global Export Solutions.";
          const ctaText = slide.primaryCtaText || "Explore Collections";
          const ctaLink = slide.primaryCtaLink || "/tracksuits";
          const spec = slide.specBadge || "PRO APPAREL SPEC";
          const prodName = slide.productName || "Custom OEM Apparel";
          const price = slide.priceText || "From $24.50 /pc";

          return (
            <SwiperSlide key={slide.id || index} className="relative w-full h-full py-20 md:py-24">
              {/* Background Ambient Glow & Texture */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                  src={bgImg} 
                  alt="Background" 
                  className="w-full h-full object-cover opacity-20 scale-105 filter blur-xs"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/75 to-transparent" />
              </div>

              {/* Foreground Grid Container */}
              <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 pt-8 md:pt-12">
                
                {/* Left Column: Headline, Specs & CTAs */}
                <div className="w-full lg:w-[55%] flex flex-col z-30">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={`hero-text-${index}`}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                      >
                        {/* Top Badge */}
                        <motion.div 
                          variants={{
                            hidden: { opacity: 0, y: -20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                          }}
                          className="inline-flex items-center gap-2 bg-[#dc2626] px-3 py-1 mb-4 rounded-sm self-start shadow-lg"
                        >
                          <Sparkles size={13} className="text-[#f59e0b]" />
                          <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-widest block">
                            {badge}
                          </span>
                        </motion.div>

                        {/* Big Headline */}
                        <motion.h1 
                          variants={{
                            hidden: { opacity: 0, x: -50 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                          }}
                          className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase leading-[1.08] tracking-tight text-white mb-4 py-1"
                          dangerouslySetInnerHTML={{ __html: titleHtml }}
                        />

                        {/* Subtitle Description */}
                        <motion.p 
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                          }}
                          className="text-sm md:text-base text-zinc-300 max-w-xl mb-8 leading-relaxed font-normal"
                        >
                          {desc}
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div 
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                          }}
                          className="flex flex-wrap gap-4 items-center"
                        >
                          <Link 
                            to={ctaLink} 
                            className="bg-white text-[#0a0a0a] px-7 py-3.5 font-display font-black italic uppercase text-xs md:text-sm tracking-wider hover:bg-[#dc2626] hover:text-white transition-all transform -skew-x-12 shadow-xl inline-flex items-center gap-2"
                          >
                            <span className="skew-x-12 inline-block">{ctaText}</span>
                            <ArrowRight size={16} className="skew-x-12" />
                          </Link>
                          
                          <Link 
                            to="/custom-orders" 
                            className="border border-white/25 text-white px-7 py-3.5 font-display font-black italic uppercase text-xs md:text-sm tracking-wider hover:bg-white/10 transition-all transform -skew-x-12 text-center"
                          >
                            <span className="skew-x-12 inline-block">Request Tech-Pack</span>
                          </Link>
                        </motion.div>

                        {/* Inline Trust Badges */}
                        <motion.div 
                          variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { delay: 0.4 } }
                          }}
                          className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10 text-zinc-400 text-xs font-semibold uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-1.5">
                            <Factory size={15} className="text-[#dc2626]" />
                            <span>50K+ Monthly Capacity</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck size={15} className="text-[#dc2626]" />
                            <span>MOQ 50 Pcs</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Column: Full-Bleed Athletic Showcase Card (NO EMPTY BLACK BOX) */}
                <div className="w-full lg:w-[45%] flex justify-center items-center">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={`hero-card-${index}`}
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-md"
                      >
                        {/* Glowing Border Background */}
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#dc2626]/40 via-red-900/20 to-[#f59e0b]/30 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000" />
                        
                        {/* High-End Apparel Card */}
                        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#141416] shadow-2xl">
                          
                          {/* Image Box - Proportional 16:9 / 4:3 format with no dead space */}
                          <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#18181b]">
                            <img 
                              src={prodImg} 
                              alt={prodName} 
                              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                            
                            {/* Gradient Overlay on image */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
                            
                            {/* Top Badge: Spec Chip */}
                            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-white/20 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 shadow-md">
                              <Award size={12} className="text-[#f59e0b]" />
                              <span>{spec}</span>
                            </div>

                            {/* Top Right: MOQ Pill */}
                            <div className="absolute top-3 right-3 bg-[#dc2626] text-white px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-md">
                              MOQ 50 PCS
                            </div>

                            {/* Integrated Product Footer Bar ON the Image */}
                            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent flex items-end justify-between gap-4">
                              <div>
                                <span className="text-[10px] font-bold text-[#dc2626] uppercase tracking-widest block mb-0.5">
                                  FEATURED WHOLESALE DESIGN
                                </span>
                                <h3 className="text-lg md:text-xl font-display font-black italic uppercase text-white leading-tight">
                                  {prodName}
                                </h3>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-black text-white bg-white/10 backdrop-blur-md px-3 py-1.5 rounded border border-white/15 block">
                                  {price}
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          transition: 0.3s;
          width: 44px !important;
          height: 44px !important;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 16px !important;
          font-weight: bold;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          color: #fff !important;
          background: #dc2626 !important;
          border-color: #dc2626 !important;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.4;
          width: 24px !important;
          height: 4px !important;
          border-radius: 2px !important;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 36px !important;
          background: #dc2626 !important;
        }
      `}</style>
    </section>
  );
}
