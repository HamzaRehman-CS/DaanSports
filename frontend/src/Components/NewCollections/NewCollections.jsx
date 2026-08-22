import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'
import { API_URL } from '../../config'
import { loadCatalogProducts, fetchCloudProducts, subscribeToGlobalSync } from '../../Context/defaultCatalog'

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState(() => {
    const prods = loadCatalogProducts();
    return prods.slice(0, 8);
  });

  const syncNewCollections = async () => {
    try {
      const data = await fetchCloudProducts();
      if (Array.isArray(data) && data.length > 0) {
        setNew_collection(data.slice(0, 8));
      }
    } catch (err) {}
  };

  useEffect(() => {
    syncNewCollections();

    const unsubscribe = subscribeToGlobalSync((type, payload) => {
      if (type === 'PRODUCTS_UPDATED' && Array.isArray(payload) && payload.length > 0) {
        setNew_collection(payload.slice(0, 8));
      }
    });

    const interval = setInterval(syncNewCollections, 3000);
    const handleFocus = () => {
      syncNewCollections();
      const stored = loadCatalogProducts();
      if (stored && stored.length > 0) setNew_collection(stored.slice(0, 8));
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className='new-collections-b2b'>
      <div className="section-header">
        <span className="section-subtitle">2026 BULK RELEASES</span>
        <h2>New Wholesale Apparel Arrivals</h2>
        <div className="title-divider"></div>
      </div>

      <div className="collections-grid">
        {new_collection.map((item, i) => {
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

export default NewCollections;
