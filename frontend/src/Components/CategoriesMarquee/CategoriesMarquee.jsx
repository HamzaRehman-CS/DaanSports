import React, { useEffect, useState } from 'react';
import './CategoriesMarquee.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';
import { loadCategories, fetchCloudCategories, subscribeToGlobalSync } from '../../Context/defaultCatalog';

const defaultCategories = [
  { name: "Tracksuits & Joggers", link: "/tracksuits", icon: "⚡" },
  { name: "Heavyweight Sweatshirts", link: "/sweatshirts", icon: "🔥" },
  { name: "Performance Activewear", link: "/activewear", icon: "🏆" },
  { name: "Athletic Team Jerseys", link: "/tshirts", icon: "🎽" },
  { name: "Weatherproof Outerwear", link: "/outerwear", icon: "🧥" },
  { name: "Custom Trousers", link: "/trousers", icon: "👖" }
];

const mapMarquee = (cats) => {
  if (!Array.isArray(cats) || cats.length === 0) return defaultCategories;
  return cats.map(c => ({
    name: c.name,
    link: `/category/${c.slug || (c.name || '').toLowerCase()}`,
    icon: "⚡"
  }));
};

const CategoriesMarquee = () => {
  const [marqueeList, setMarqueeList] = useState(() => {
    const stored = loadCategories();
    return mapMarquee(stored);
  });

  const fetchCategories = async () => {
    try {
      const data = await fetchCloudCategories();
      if (Array.isArray(data) && data.length > 0) {
        setMarqueeList(mapMarquee(data));
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchCategories();

    const unsubscribe = subscribeToGlobalSync((type, payload) => {
      if (type === 'CATEGORIES_UPDATED' && Array.isArray(payload) && payload.length > 0) {
        setMarqueeList(mapMarquee(payload));
      }
    });

    const interval = setInterval(fetchCategories, 4000);
    const handleFocus = () => {
      fetchCategories();
      const stored = loadCategories();
      if (stored && stored.length > 0) setMarqueeList(mapMarquee(stored));
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const itemsToRender = marqueeList.concat(marqueeList);

  return (
    <div className="categories-marquee-container">
      <div className="marquee-track">
        {itemsToRender.map((cat, idx) => (
          <Link to={cat.link} key={idx} className="marquee-pill-item">
            <span className="marquee-pill-icon">{cat.icon}</span>
            <span className="marquee-pill-title">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesMarquee;
