import React, { useState, useEffect } from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';
import CategoriesMarquee from '../CategoriesMarquee/CategoriesMarquee';

const Hero = () => {
  const slides = [
    {
      id: 1,
      badgeText: "⚡ DIRECT FACTORY B2B SUPPLIER",
      title: "Monochrome Precision. Unmatched Performance.",
      subtitle: "Custom 330-380 GSM combed cotton tracksuits, heavyweight hoodies, and technical activewear built for elite athletic clubs.",
      priceTag: "Wholesale from $9.80 / pc",
      moqTag: "MOQ 50 Pcs",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=85&w=2000&auto=format&fit=crop",
      primaryLink: "/tracksuits",
      primaryCta: "EXPLORE CATALOG ➔"
    },
    {
      id: 2,
      badgeText: "🔥 STREETWEAR & ATHLEISURE BARS",
      title: "Heavyweight French Terry Hoodies & Sets",
      subtitle: "Drop-shoulder oversized cuts, 350 GSM pre-shrunk cotton, double-lined hoods ready for 3D puff print & damask labeling.",
      priceTag: "Starting at $18.90 / pc",
      moqTag: "MOQ 50 Pcs",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=85&w=2000&auto=format&fit=crop",
      primaryLink: "/sweatshirts",
      primaryCta: "VIEW HOODIES ➔"
    },
    {
      id: 3,
      badgeText: "🌐 SEAMLESS COMPRESSION & TEAM KITS",
      title: "Ergonomic 4-Way Stretch Performance",
      subtitle: "Anti-microbial sweat-wicking compression tops & tights engineered for high-intensity sports and international teams.",
      priceTag: "Starting at $16.50 / pc",
      moqTag: "MOQ 100 Pcs",
      image: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=85&w=2000&auto=format&fit=crop",
      primaryLink: "/activewear",
      primaryCta: "VIEW ACTIVEWEAR ➔"
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlideIndex]);

  const handleNextSlide = () => {
    setSlideDirection('next');
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setSlideDirection('prev');
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="gocart-hero-wrapper">
      <div className="gocart-hero-section max-w-7xl">
        
        {/* Deck Sliding Banner Card */}
        <div key={currentSlide.id} className={`gocart-hero-deck-card slide-animation-${slideDirection}`}>
          
          {/* Left Text & CTAs */}
          <div className="hero-text-content">
            
            <div className="hero-top-badges">
              <span className="gocart-badge gocart-badge-green">{currentSlide.badgeText}</span>
              <span className="gocart-badge gocart-badge-dark">{currentSlide.moqTag}</span>
            </div>

            <h1 className="hero-main-heading">{currentSlide.title}</h1>
            <p className="hero-subtext">{currentSlide.subtitle}</p>

            <div className="hero-pricing-line">
              <span className="price-tag-highlight">{currentSlide.priceTag}</span>
              <span className="turnaround-note">⚡ 12-15 Business Days Production</span>
            </div>

            <div className="hero-cta-buttons">
              <Link to={currentSlide.primaryLink}>
                <button className="gocart-pill-btn gocart-pill-btn-primary hero-btn-large">
                  {currentSlide.primaryCta}
                </button>
              </Link>

              <Link to="/orders">
                <button className="gocart-pill-btn gocart-pill-btn-outline hero-btn-large">
                  Track Live Orders 🚚
                </button>
              </Link>
            </div>

            <div className="hero-value-props-bar">
              <div className="prop-item"><span>🎨</span> Free OEM Proofing</div>
              <div className="prop-item"><span>🧵</span> 330-380 GSM Fabric</div>
              <div className="prop-item"><span>✈️</span> Air Cargo Delivery</div>
            </div>

          </div>

          {/* Right Image Showcase Container */}
          <div className="hero-image-showcase">
            <div className="image-frame-bg">
              <img 
                src={currentSlide.image} 
                alt={currentSlide.title} 
                className="hero-display-img"
              />
              <div className="floating-moq-chip">
                <span>MOQ {currentSlide.moqTag}</span>
              </div>
            </div>
          </div>

          {/* Deck Controls (Previous & Next Arrow Buttons) */}
          <button onClick={handlePrevSlide} className="deck-arrow-btn deck-arrow-prev" aria-label="Previous Slide">
            ❮
          </button>
          <button onClick={handleNextSlide} className="deck-arrow-btn deck-arrow-next" aria-label="Next Slide">
            ❯
          </button>

          {/* Slide Deck Dots */}
          <div className="deck-dots-container">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`deck-dot ${idx === currentSlideIndex ? 'active' : ''}`}
                onClick={() => {
                  setSlideDirection(idx > currentSlideIndex ? 'next' : 'prev');
                  setCurrentSlideIndex(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Animated Categories Marquee Ticker */}
      <CategoriesMarquee />
    </div>
  );
};

export default Hero;
