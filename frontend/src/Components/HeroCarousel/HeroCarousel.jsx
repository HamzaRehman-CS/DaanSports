import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';

const defaultHeroSlides = [
  {
    id: 1,
    titleLine1: "DRESS SHARP",
    titleLine2: "LIVE STRONG",
    title: "DRESS SHARP\nLIVE STRONG",
    subtitle: "Premium quality apparel for every move you make.",
    description: "Premium quality apparel for every move you make.",
    ctaText: "SHOP NOW",
    ctaLink: "/category/all",
    rightTagTop: "NEW COLLECTION",
    rightTagTopVal: "2026",
    rightTagBottom: "UP TO",
    rightTagBottomVal: "30% OFF",
    bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=85&w=2000&auto=format&fit=crop"
  },
  {
    id: 2,
    titleLine1: "ENGINEERED FOR",
    titleLine2: "PERFORMANCE",
    title: "ENGINEERED FOR\nPERFORMANCE",
    subtitle: "Heavyweight 350 GSM French Terry pullovers & custom athletic apparel.",
    description: "Heavyweight 350 GSM French Terry pullovers & custom athletic apparel.",
    ctaText: "EXPLORE HOODIES",
    ctaLink: "/category/hoodies",
    rightTagTop: "HEAVYWEIGHT FLEECE",
    rightTagTopVal: "350 GSM",
    rightTagBottom: "BULK WHOLESALE",
    rightTagBottomVal: "SPECIALS",
    bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=85&w=2000&auto=format&fit=crop"
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

export default function HeroCarousel() {
  const [slides, setSlides] = useState(defaultHeroSlides);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/cms`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
          const parsed = data.heroSlides.map((s, idx) => {
            const rawTitle = s.titleLine1 && s.titleLine2 
              ? `${s.titleLine1}\n${s.titleLine2}`
              : (s.title || defaultHeroSlides[idx % defaultHeroSlides.length].title);

            const lines = rawTitle.split(/<br\s*\/?>|\n/i);
            const line1 = s.titleLine1 || lines[0] || "DRESS SHARP";
            const line2 = s.titleLine2 || lines[1] || (lines.length > 1 ? lines.slice(1).join(' ') : "LIVE STRONG");

            return {
              id: s.id || idx + 1,
              titleLine1: line1.replace(/<[^>]*>?/gm, '').trim(),
              titleLine2: line2.replace(/<[^>]*>?/gm, '').trim(),
              subtitle: s.subtitle || s.description || "Premium quality apparel for every move you make.",
              ctaText: s.ctaText || s.primaryCtaText || "SHOP NOW",
              ctaLink: s.ctaLink || s.primaryCtaLink || "/category/all",
              rightTagTop: s.rightTagTop || (s.badgeText ? "NEW COLLECTION" : "NEW COLLECTION"),
              rightTagTopVal: s.rightTagTopVal || "2026",
              rightTagBottom: s.rightTagBottom || "UP TO",
              rightTagBottomVal: s.rightTagBottomVal || (s.priceText ? s.priceText : "30% OFF"),
              bgImage: s.bgImage || s.image || defaultHeroSlides[idx % defaultHeroSlides.length].bgImage
            };
          });
          setSlides(parsed);
        }
      })
      .catch(err => console.error("Error fetching Hero CMS:", err));
  }, []);

  return (
    <section className="relative w-full min-h-[520px] h-[85vh] max-h-[660px] sm:h-[640px] md:h-[720px] lg:h-[780px] overflow-hidden bg-[#0a0a0a] select-none pt-14 md:pt-16">
      
      {/* Navigation Custom Arrows - Lower visibility on mobile to prevent obstructing headlines/text */}
      <button
        ref={prevRef}
        className="hero-nav-arrow hero-nav-prev absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/80 border border-white/10 hover:border-white text-white/50 hover:text-white flex items-center justify-center backdrop-blur-sm transition-all duration-300 shadow-lg cursor-pointer opacity-30 sm:opacity-75 hover:opacity-100"
        aria-label="Previous Hero Slide"
      >
        <ChevronLeft size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      <button
        ref={nextRef}
        className="hero-nav-arrow hero-nav-next absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/80 border border-white/10 hover:border-white text-white/50 hover:text-white flex items-center justify-center backdrop-blur-sm transition-all duration-300 shadow-lg cursor-pointer opacity-30 sm:opacity-75 hover:opacity-100"
        aria-label="Next Hero Slide"
      >
        <ChevronRight size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1000}
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
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                  src={bgImg} 
                  alt={`${slide.titleLine1} ${slide.titleLine2}`} 
                  className="w-full h-full object-cover object-center scale-100 transform transition-transform duration-7000 ease-out"
                  referrerPolicy="no-referrer"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                
                {/* Athletic Dark Backdrop Gradients ensuring pristine readability on all screen widths */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/50 sm:to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/70" />

                {/* Subtle DS Watermark in background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] overflow-hidden select-none">
                  <span className="text-[20vw] font-display font-black italic tracking-widest text-white whitespace-nowrap">
                    DAWN SPORTS
                  </span>
                </div>
              </div>

              {/* Foreground Content Container matching Reference Image */}
              <div className="relative z-20 max-w-7xl mx-auto h-full px-5 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
                
                {/* Left Side: Massive Bold Headlines, Subtitle & Button */}
                <div className="max-w-xl xl:max-w-2xl py-8 sm:py-12">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={`hero-text-${index}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-3 sm:space-y-4 md:space-y-6"
                      >
                        {/* Heading Line 1 & Line 2 */}
                        <div className="space-y-0.5 sm:space-y-1">
                          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-display font-black uppercase tracking-tight text-white leading-[1.02] sm:leading-[0.95] drop-shadow-xl">
                            {slide.titleLine1 || "DRESS SHARP"}
                          </h1>
                          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-display font-black uppercase tracking-tight text-white leading-[1.02] sm:leading-[0.95] drop-shadow-xl">
                            {slide.titleLine2 || "LIVE STRONG"}
                          </h1>
                        </div>

                        {/* Subtitle */}
                        <p className="text-xs sm:text-base md:text-lg text-zinc-300 font-normal leading-relaxed max-w-xs sm:max-w-md drop-shadow-md line-clamp-3 sm:line-clamp-none">
                          {slide.subtitle || "Premium quality apparel for every move you make."}
                        </p>

                        {/* CTA White Button matching Reference Design */}
                        <div className="pt-2">
                          <Link 
                            to={slide.ctaLink || "/category/all"} 
                            className="inline-flex items-center gap-2.5 sm:gap-3 bg-white text-[#0a0a0a] px-6 sm:px-8 py-3.5 sm:py-4 font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[#dc2626] hover:text-white transition-all duration-300 shadow-2xl group cursor-pointer"
                          >
                            <span>{slide.ctaText || "SHOP NOW"}</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Side: Collection Year & Discount Highlights matching Reference Image */}
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
      <div className="hero-custom-pagination absolute bottom-4 sm:bottom-6 inset-x-0 z-30 flex items-center justify-center gap-2 pointer-events-auto" />

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
          width: 28px;
          background: #ffffff;
          border-radius: 9999px;
        }
      `}</style>
    </section>
  );
}
