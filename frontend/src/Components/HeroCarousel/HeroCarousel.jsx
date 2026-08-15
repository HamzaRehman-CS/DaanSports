import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultSlides = [
  {
    id: 1,
    bgImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=70&w=1200&auto=format&fit=crop",
    tag: "Premium Manufacturer",
    title: "ENGINEERED<br />FOR <span class='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800 text-[0.82em] tracking-tight inline-block py-2 leading-normal overflow-visible'>EXCELLENCE</span>",
    description: "Custom Manufacturing • Private Label • Global Export Solutions. The trusted partner for global sportswear and activewear brands.",
    productImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=70&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=70&w=1200&auto=format&fit=crop",
    tag: "Pro Activewear & Hoodies",
    title: "ELEVATE<br />YOUR <span class='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800 text-[0.82em] tracking-tight inline-block py-2 leading-normal overflow-visible'>BRAND</span>",
    description: "Grade A fabrics and flawless stitching. Expand your collection with our high-volume production lines.",
    productImg: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=70&w=600&auto=format&fit=crop" 
  },
  {
    id: 3,
    bgImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=70&w=1200&auto=format&fit=crop",
    tag: "Global Export Solutions",
    title: "WORLDWIDE<br /><span class='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800 text-[0.72em] tracking-tight inline-block py-2 leading-normal overflow-visible'>DISTRIBUTION</span>",
    description: "Multi-stage quality assurance and worldwide door-to-door delivery. Minimum Order Quantity starting at 50 pcs.",
    productImg: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=70&w=600&auto=format&fit=crop" 
  }
];

export default function HeroCarousel({ slides = defaultSlides }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative h-[100svh] min-h-[720px] md:min-h-[600px] w-full overflow-hidden bg-[#0a0a0a]">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;

          return (
            <SwiperSlide key={slide.id || index} className="relative w-full h-full">
              <div className="absolute inset-0 z-0">
                <img 
                  src={slide.bgImage || slide.image} 
                  alt="bg" 
                  className="w-full h-full object-cover opacity-20"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent"></div>

              <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-8 w-full flex flex-col md:flex-row items-center justify-center pt-20 sm:pt-24 md:pt-0">
                
                <div className="max-w-3xl transform md:-skew-x-6 w-full md:w-[55%] flex flex-col z-40 mt-0 md:mt-12">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={`text-${index}`}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                      >
                        <motion.div 
                          variants={{
                            hidden: { opacity: 0, x: -50 },
                            visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } }
                          }}
                          className="inline-block bg-[#dc2626] px-2 py-1 md:px-3 md:py-1 mb-3 md:mb-6 transform -skew-x-12 self-start"
                        >
                          <span className="text-white text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest block skew-x-12">{slide.tag || slide.badgeText || "DAAN SPORTS B2B"}</span>
                        </motion.div>

                        <motion.h1 
                          variants={{
                            hidden: { opacity: 0, x: -80 },
                            visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                          }}
                          className="text-3xl sm:text-4xl md:text-5xl lg:text-[5.2rem] font-display uppercase leading-[1.1] tracking-tight text-white mb-3 md:mb-6 py-2 overflow-visible"
                          dangerouslySetInnerHTML={{ __html: slide.title }}
                        />

                        <motion.p 
                          variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                          }}
                          className="text-xs sm:text-sm md:text-xl text-zinc-300 max-w-xl mb-6 md:mb-10 md:skew-x-6 leading-relaxed"
                        >
                          {slide.description || slide.subtitle}
                        </motion.p>

                        <motion.div 
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                          }}
                          className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 md:skew-x-6 w-full sm:w-auto"
                        >
                          <Link to="/tracksuits" className="bg-white text-[#0a0a0a] px-4 py-3 md:px-8 md:py-4 font-display text-xs md:text-lg uppercase tracking-wider hover:bg-zinc-200 transition-colors duration-300 text-center w-full sm:w-auto font-black italic">
                            Explore Collections
                          </Link>
                          <Link to="/contact" className="border border-white/30 text-white px-4 py-3 md:px-8 md:py-4 font-display text-xs md:text-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/10 transition-colors duration-300 text-center w-full sm:w-auto font-black italic">
                            Request Quote <ArrowRight size={16} />
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex w-full md:w-[45%] justify-center items-center mt-8 sm:mt-12 md:mt-0 perspective-[1000px]">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={`img-${index}`}
                        initial={{ opacity: 0, x: 100, scale: 0.9, rotateY: 15 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0, 
                          scale: 1,
                          rotateY: 0,
                          y: [0, -10, 0]
                        }}
                        exit={{ opacity: 0, x: -50, transition: { duration: 0.5 } }}
                        transition={{ 
                          opacity: { duration: 1.0, ease: "easeOut", delay: 0.2 },
                          x: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
                          scale: { duration: 1.2, ease: "easeOut", delay: 0.2 },
                          rotateY: { duration: 1.2, ease: "easeOut", delay: 0.2 },
                          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
                        }}
                        className="relative z-30"
                        style={{ willChange: "transform, opacity" }}
                      >
                        <div className="relative transform md:-skew-x-6 border border-white/10 bg-[#18181b] shadow-2xl p-2 md:p-3">
                          <div className="relative overflow-hidden w-[220px] h-[280px] sm:w-[320px] sm:h-[380px] md:w-[350px] md:h-[450px] lg:w-[420px] lg:h-[550px]">
                            <img 
                              src={slide.productImg || slide.bgImage} 
                              alt="Featured product" 
                              className="w-full h-full object-cover transition-all duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                            
                            <div className="absolute bottom-6 left-6 skew-x-6">
                              <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Featured Edition</span>
                              <div className="text-white font-display text-2xl tracking-widest uppercase italic font-black">Premium Spec</div>
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
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          color: #dc2626 !important;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: #dc2626 !important;
        }
      `}</style>
    </section>
  );
}
