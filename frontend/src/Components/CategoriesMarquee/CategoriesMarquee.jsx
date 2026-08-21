import React, { useEffect, useState } from 'react';
import './CategoriesMarquee.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';

const defaultCategories = [
  { name: "Tracksuits & Joggers", link: "/tracksuits", icon: "⚡" },
  { name: "Heavyweight Sweatshirts", link: "/sweatshirts", icon: "🔥" },
  { name: "Performance Activewear", link: "/activewear", icon: "🏆" },
  { name: "Athletic Team Jerseys", link: "/tshirts", icon: "🎽" },
  { name: "Weatherproof Outerwear", link: "/outerwear", icon: "🧥" },
  { name: "Custom Trousers", link: "/trousers", icon: "👖" }
];

const CategoriesMarquee = () => {
  const [marqueeList, setMarqueeList] = useState(defaultCategories);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(c => ({
            name: c.name,
            link: `/category/${c.slug || c.name.toLowerCase()}`,
            icon: "⚡"
          }));
          setMarqueeList(formatted);
        }
      })
      .catch(err => console.error("Categories fetch error:", err));
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
