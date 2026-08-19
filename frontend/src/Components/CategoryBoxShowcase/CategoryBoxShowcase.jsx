import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './CategoryBoxShowcase.css';
import { API_URL } from '../../config';

const defaultCategoriesData = [
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
  const [categories, setCategories] = useState(() => {
    if (Array.isArray(initialCategories) && initialCategories.length > 0) {
      return initialCategories.map(c => ({
        id: c.id,
        name: (c.name || '').toUpperCase(),
        slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
        link: `/${c.slug || c.name.toLowerCase().replace(/\s+/g, '-')}`,
        image: c.banner || c.image || defaultCategoriesData[0].image
      }));
    }
    return defaultCategoriesData;
  });

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((c, i) => ({
            id: c.id || (i + 1),
            name: (c.name || '').toUpperCase(),
            slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
            link: `/${c.slug || c.name.toLowerCase().replace(/\s+/g, '-')}`,
            image: c.banner || c.image || defaultCategoriesData[i % defaultCategoriesData.length].image
          }));
          setCategories(mapped);
        }
      })
      .catch(err => {
        console.warn("Using default category presets:", err);
      });
  }, []);

  return (
    <section className="category-showcase-section">
      <div className="category-showcase-container">
        
        {/* Section Header */}
        <div className="category-showcase-header">
          <div>
            <h2 className="category-main-title">
              OUR CATEGORIES
            </h2>
            <div className="w-16 h-1 bg-[#dc2626] mt-2.5 rounded-full" />
          </div>

          {/* Slider Arrow Controls */}
          <div className="category-nav-controls">
            <button ref={prevRef} className="category-nav-btn prev-btn" aria-label="Previous Categories">
              <ChevronLeft size={22} />
            </button>
            <button ref={nextRef} className="category-nav-btn next-btn" aria-label="Next Categories">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="category-swiper-wrapper">
          <Swiper
            modules={[Navigation, Autoplay]}
            observer={true}
            observeParents={true}
            watchOverflow={true}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
              setSwiperReady(true);
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            slidesPerView={3}
            spaceBetween={12}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 8,
              },
              480: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 12,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 14,
              },
              1440: {
                slidesPerView: 6,
                spaceBetween: 16,
              }
            }}
            className="category-boxes-swiper"
          >
            {categories.map((cat, index) => (
              <SwiperSlide key={cat.id || index} className="category-swiper-slide">
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
