import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'
import { API_URL } from '../../config'
import { loadCatalogProducts, subscribeToGlobalSync } from '../../Context/defaultCatalog'

const Popular = () => {
  const [popularItems, setPopularItems] = useState(() => {
    const prods = loadCatalogProducts();
    const tracksuits = prods.filter(p => (p.category || '').toLowerCase().includes('tracksuit'));
    return tracksuits.length > 0 ? tracksuits.slice(0, 4) : prods.slice(0, 4);
  });

  const syncPopular = () => {
    fetch(`${API_URL}/popular-tracksuits`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPopularItems(data);
        } else {
          fetch(`${API_URL}/all-products`)
            .then(r => r.json())
            .then(all => {
              if (Array.isArray(all) && all.length > 0) {
                const tracksuits = all.filter(p => (p.category || '').toLowerCase().includes('tracksuit'));
                setPopularItems(tracksuits.length > 0 ? tracksuits.slice(0, 4) : all.slice(0, 4));
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    syncPopular();

    const unsubscribe = subscribeToGlobalSync((type, payload) => {
      if (type === 'PRODUCTS_UPDATED' && Array.isArray(payload) && payload.length > 0) {
        const tracksuits = payload.filter(p => (p.category || '').toLowerCase().includes('tracksuit'));
        setPopularItems(tracksuits.length > 0 ? tracksuits.slice(0, 4) : payload.slice(0, 4));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className='popular-b2b' id="bulk-popular">
      <div className="section-header">
        <span className="section-subtitle">DIRECT FACTORY SELECTION</span>
        <h2>Top-Selling Wholesale Tracksuits</h2>
        <div className="title-divider"></div>
      </div>
      
      <div className="popular-item-grid">
        {popularItems.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
              moq={item.moq}
              category={item.category}
              colors={item.colors}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Popular;
