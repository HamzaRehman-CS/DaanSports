import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import './CategoryBoxShowcase.css';
import { API_URL } from '../../config';

const fallbackCategories = [
  { id: 1, name: "T-SHIRTS", slug: "tshirts", link: "/tshirts", image: "https://images.unsplash.com/photo-1553775282-20af80779df7?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, name: "POLO SHIRTS", slug: "polo-shirts", link: "/polo-shirts", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, name: "HOODIES", slug: "hoodies", link: "/hoodies", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, name: "JACKETS", slug: "jackets", link: "/jackets", image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop" },
  { id: 5, name: "TRACK SUITS", slug: "tracksuits", link: "/tracksuits", image: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=1000&auto=format&fit=crop" },
  { id: 6, name: "ACCESSORIES", slug: "accessories", link: "/accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop" },
  { id: 7, name: "SWEATSHIRTS", slug: "sweatshirts", link: "/sweatshirts", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop" },
  { id: 8, name: "ACTIVEWEAR", slug: "activewear", link: "/activewear", image: "https://images.unsplash.com/photo-1550026593-f369f98df0af?q=80&w=1000&auto=format&fit=crop" },
  { id: 9, name: "TROUSERS", slug: "trousers", link: "/trousers", image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000&auto=format&fit=crop" }
];

export default function CategoryBoxShowcase({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories || fallbackCategories);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(c => ({
            id: c.id,
            name: (c.name || '').toUpperCase(),
            slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
            link: `/${c.slug || c.name.toLowerCase().replace(/\s+/g, '-')}`,
            image: c.banner || c.image || fallbackCategories[0].image
          }));
          setCategories(mapped);
        }
      })
      .catch(err => console.error("Error loading categories showcase:", err));
  }, []);

  return (
    <section className="category-showcase-section">
      <div className="category-showcase-container">
        
        {/* Section Header */}
        <div className="category-showcase-header">
          <div>
            <span className="category-sub-badge">
              <Sparkles size={13} className="text-[#f59e0b]" />
              CURATED PRODUCT LINES
            </span>
            <h2 className="category-main-title">
              OUR CATEGORIES
            </h2>
          </div>

          {/* Slider Arrow Controls */}
          <div className="category-nav-controls">
            <button ref={prevRef} className="category-nav-btn prev-btn" aria-label="Previous Categories">
              <ChevronLeft size={20} />
            </button>
            <button ref={nextRef} className="category-nav-btn next-btn" aria-label="Next Categories">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="category-swiper-wrapper">
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            slidesPerView={3}
            spaceBetween={14}
            breakpoints={{
              320: {
                slidesPerView: 3, // Mobile: 3 boxes visible as requested
                spaceBetween: 8,
              },
              640: {
                slidesPerView: 3, // Small Tablet: 3 boxes
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 4, // Laptop / Desktop: 4 boxes visible at a time
                spaceBetween: 18,
              },
              1440: {
                slidesPerView: 4, // Large screens: 4 boxes
                spaceBetween: 22,
              }
            }}
            className="category-boxes-swiper"
          >
            {categories.map((cat, index) => (
              <SwiperSlide key={cat.id || index}>
                <Link to={cat.link || `/category/${cat.slug}`} className="category-box-card group">
                  {/* Background Image */}
                  <div className="category-box-image-wrap">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="category-box-img"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {/* Dark gradient for text visibility */}
                    <div className="category-box-overlay" />
                  </div>

                  {/* Bottom Text Content */}
                  <div className="category-box-content">
                    <h3 className="category-box-title">
                      {cat.name}
                    </h3>
                    <div className="category-box-cta">
                      <span>SHOP NOW</span>
                      <ArrowRight size={13} className="cta-arrow" />
                    </div>
                  </div>

                  {/* Hover Border Glow */}
                  <div className="category-box-border-highlight" />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}
