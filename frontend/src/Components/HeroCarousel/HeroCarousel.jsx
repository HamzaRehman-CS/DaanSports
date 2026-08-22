import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Factory } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';
import { loadCms, fetchCloudCms, subscribeToGlobalSync } from '../../Context/defaultCatalog';

const defaultHeroSlides = [
  {
    id: 1,
    titleLine1: "DRESS SHARP",
    titleLine2: "LIVE STRONG",
    title: "DRESS SHARP\nLIVE STRONG",
    subtitle: "Premium 350 GSM heavyweight tracksuits & custom athletic apparel.",
    description: "Premium 350 GSM heavyweight tracksuits & custom athletic apparel.",
    ctaText: "SHOP NOW",
    ctaLink: "/category/all",
    rightTagTop: "NEW COLLECTION",
    rightTagTopVal: "2026",
    rightTagBottom: "UP TO",
    rightTagBottomVal: "30% OFF",
    bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=85&w=2000&auto=format&fit=crop"
  },
  {
    id: 2,
    titleLine1: "ENGINEERED FOR",
    titleLine2: "PERFORMANCE",
    title: "ENGINEERED FOR\nPERFORMANCE",
    subtitle: "Heavyweight French Terry pullovers & custom athletic apparel ready for OEM branding.",
    description: "Heavyweight French Terry pullovers & custom athletic apparel ready for OEM branding.",
    ctaText: "EXPLORE HOODIES",
    ctaLink: "/category/hoodies",
    rightTagTop: "HEAVYWEIGHT FLEECE",
    rightTagTopVal: "350 GSM",
    rightTagBottom: "BULK WHOLESALE",
    rightTagBottomVal: "SPECIALS",
    bgImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=85&w=2000&auto=format&fit=crop"
  },
  {
    id: 3,
    titleLine1: "DIRECT FACTORY",
    titleLine2: "MANUFACTURING",
    title: "DIRECT FACTORY\nMANUFACTURING",
    subtitle: "Custom private labeling, silicone tags, and worldwide express door-to-door cargo.",
    description: "Custom private labeling, silicone tags, and worldwide express door-to-door cargo.",
    ctaText: "VIEW TRACKSUITS",
    ctaLink: "/category/tracksuits",
    rightTagTop: "LOW MOQ",
    rightTagTopVal: "50 PCS",
    rightTagBottom: "EXPORT READY",
    rightTagBottomVal: "ISO 9001",
    bgImage: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=85&w=2000&auto=format&fit=crop"
  }
];

const parseSlidesData = (slidesArray) => {
  if (!Array.isArray(slidesArray) || slidesArray.length === 0) return defaultHeroSlides;
  return slidesArray.map((s, idx) => {
    const rawTitle = s.titleLine1 && s.titleLine2 
      ? `${s.titleLine1}\n${s.titleLine2}`
      : (s.title || defaultHeroSlides[idx % defaultHeroSlides.length].title);

    const lines = rawTitle.split(/<br\s*\/?>|\n/i);
    const line1 = s.titleLine1 || lines[0] || "DRESS SHARP";
    const line2 = s.titleLine2 || lines[1] || (lines.length > 1 ? lines.slice(1).join(' ') : "LIVE STRONG");

    let image = s.bgImage || s.image || defaultHeroSlides[idx % defaultHeroSlides.length].bgImage;
    if (image.includes("photo-1534438327276-14e5300c3a48")) {
      image = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=85&w=2000&auto=format&fit=crop";
    }

    return {
      id: s.id || idx + 1,
      titleLine1: String(line1).replace(/<[^>]*>?/gm, '').trim(),
      titleLine2: String(line2).replace(/<[^>]*>?/gm, '').trim(),
      subtitle: s.subtitle || s.description || "Premium quality apparel for every move you make.",
      ctaText: s.ctaText || s.primaryCtaText || "SHOP NOW",
      ctaLink: s.ctaLink || s.primaryCtaLink || "/category/all",
      badgeText: s.badgeText || s.badgeTag || "DIRECT FACTORY WHOLESALE",
      rightTagTop: s.rightTagTop || "NEW COLLECTION",
      rightTagTopVal: s.rightTagTopVal || "2026",
      rightTagBottom: s.rightTagBottom || "UP TO",
      rightTagBottomVal: s.rightTagBottomVal || (s.priceText ? s.priceText : "30% OFF"),
      bgImage: image
    };
  });
};

export default function HeroCarousel() {
  const [slides, setSlides] = useState(() => {
    const initialCms = loadCms();
    return parseSlidesData(initialCms?.heroSlides);
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  const fetchSlides = async () => {
    try {
      const data = await fetchCloudCms();
      if (data && Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
        setSlides(parseSlidesData(data.heroSlides));
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchSlides();

    const unsubscribe = subscribeToGlobalSync((type, payload) => {
      if (type === 'CMS_UPDATED' && payload) {
        if (Array.isArray(payload.heroSlides)) {
          setSlides(parseSlidesData(payload.heroSlides));
        } else {
          fetchSlides();
        }
      }
    });

    const interval = setInterval(fetchSlides, 3000);
    const handleFocus = () => {
      fetchSlides();
      const stored = loadCms();
      if (stored?.heroSlides) setSlides(parseSlidesData(stored.heroSlides));
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <section className="relative w-full h-[390px] xs:h-[410px] sm:h-[480px] md:h-[620px] lg:h-[680px] overflow-hidden bg-[#0a0a0a] select-none">
      
      {/* Desktop Navigation Arrows */}
      <button
        ref={prevRef}
        className="hero-nav-arrow hero-nav-prev hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-black/40 hover:bg-black/90 border border-white/15 hover:border-white text-white/70 hover:text-white items-center justify-center backdrop-blur-md transition-all duration-300 shadow-2xl cursor-pointer opacity-75 hover:opacity-100"
        aria-label="Previous Hero Slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        ref={nextRef}
        className="hero-nav-arrow hero-nav-next hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-black/40 hover:bg-black/90 border border-white/15 hover:border-white text-white/70 hover:text-white items-center justify-center backdrop-blur-sm transition-all duration-300 shadow-2xl cursor-pointer opacity-75 hover:opacity-100"
        aria-label="Next Hero Slide"
      >
        <ChevronRight size={22} />
      </button>

      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={800}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
          setSwiperReady(true);
        }}
        pagination={{
          clickable: true,
          el: '.hero-custom-pagination',
          bulletClass: 'hero-dot',
          bulletActiveClass: 'hero-dot-active'
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;
          const bgImg = slide.bgImage || defaultHeroSlides[index % defaultHeroSlides.length].bgImage;

          return (
            <SwiperSlide key={slide.id || index} className="relative w-full h-full">
              
              {/* Full Background Image Layer */}
              <div 
                className="absolute inset-0 z-0 overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${bgImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 25%'
                }}
              >
                <img 
                  src={bgImg} 
                  alt={`${slide.titleLine1} ${slide.titleLine2}`} 
                  className="w-full h-full object-cover object-[center_25%] md:object-center transform scale-100 transition-transform duration-7000 ease-out"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                
                {/* Athletic Dark Backdrop Gradients */}
                <div className="absolute inset-0 bg-black/40 sm:bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 sm:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

                {/* Subtle DS Watermark in background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] overflow-hidden select-none">
                  <span className="text-[20vw] font-display font-black italic tracking-widest text-white whitespace-nowrap">
                    DAWN SPORTS
                  </span>
                </div>
              </div>

              {/* Foreground Content Container - Snug & Compact */}
              <div className="relative z-20 max-w-7xl mx-auto h-full px-5 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-center pt-14 sm:pt-20 md:pt-0 pb-8 sm:pb-12 md:pb-0 md:flex-row md:items-center md:justify-between">
                
                {/* Left Side: Badge, Bold Headlines, Subtitle, Dual Action Buttons */}
                <div className="max-w-xl xl:max-w-2xl flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={`hero-text-${index}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-2 sm:space-y-3 md:space-y-4"
                      >
                        {/* Pill Badge - Clean White text inside Red rectangle */}
                        <div className="inline-flex items-center bg-[#dc2626] text-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-black uppercase tracking-widest rounded shadow-lg transform -skew-x-6 w-fit">
                          <span className="skew-x-6 inline-block">
                            {(slide.badgeText || "DIRECT FACTORY WHOLESALE").replace(/[✨⭐⚡★*]/g, '').trim()}
                          </span>
                        </div>

                        {/* Heading Line 1 & Line 2 */}
                        <div className="space-y-0.5">
                          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[5.2rem] font-display font-black uppercase tracking-tight text-white leading-[1.02] drop-shadow-2xl">
                            {slide.titleLine1 || "DRESS SHARP"}
                          </h1>
                          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[5.2rem] font-display font-black uppercase tracking-tight text-white leading-[1.02] drop-shadow-2xl">
                            {slide.titleLine2 || "LIVE STRONG"}
                          </h1>
                        </div>

                        {/* Subtitle */}
                        <p className="text-xs xs:text-sm sm:text-base text-zinc-200 font-normal leading-relaxed max-w-xs sm:max-w-md drop-shadow-md">
                          {slide.subtitle || "Premium 350 GSM heavyweight tracksuits & custom athletic apparel."}
                        </p>

                        {/* Dual Action Buttons */}
                        <div className="pt-2 sm:pt-3 flex items-center gap-2.5 sm:gap-3">
                          <Link 
                            to={slide.ctaLink || "/category/all"} 
                            className="inline-flex items-center gap-2 sm:gap-2.5 bg-white text-[#0a0a0a] px-5 sm:px-8 py-3 sm:py-3.5 md:py-4 font-black text-xs sm:text-sm tracking-wider uppercase hover:bg-[#dc2626] hover:text-white transition-all duration-300 shadow-2xl group cursor-pointer"
                          >
                            <span>{slide.ctaText || "SHOP NOW"}</span>
                            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                          </Link>
                          <Link 
                            to="/category/all" 
                            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 sm:px-6 py-3 sm:py-3.5 md:py-4 font-bold text-xs sm:text-sm tracking-wider uppercase backdrop-blur-md transition-all duration-300"
                          >
                            <span>CATALOG</span>
                          </Link>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Side: Collection Year & Discount Highlights on Desktop */}
                <div className="hidden md:flex flex-col items-end text-right z-20 space-y-6 select-none pr-4 lg:pr-8">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={`hero-right-${index}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6"
                      >
                        {/* New Collection Callout */}
                        <div className="space-y-0.5">
                          <span className="text-[11px] lg:text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                            {slide.rightTagTop || "NEW COLLECTION"}
                          </span>
                          <span className="text-3xl lg:text-5xl font-display font-black text-white tracking-tight block">
                            {slide.rightTagTopVal || "2026"}
                          </span>
                        </div>

                        {/* Discount / Special Callout */}
                        <div className="space-y-0.5 pt-2">
                          <span className="text-[11px] lg:text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                            {slide.rightTagBottom || "UP TO"}
                          </span>
                          <span className="text-3xl lg:text-5xl font-display font-black text-white tracking-tight block">
                            {slide.rightTagBottomVal || "30% OFF"}
                          </span>
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

      {/* Pagination Dots at Bottom Center */}
      <div className="hero-custom-pagination absolute bottom-2.5 sm:bottom-4 inset-x-0 z-30 flex items-center justify-center gap-2 pointer-events-auto" />

      <style>{`
        .hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.35);
          transition: all 0.3s ease;
          cursor: pointer;
          display: inline-block;
        }
        .hero-dot-active {
          width: 24px;
          background: #ffffff;
          border-radius: 9999px;
        }
      `}</style>
    </section>
  );
}
