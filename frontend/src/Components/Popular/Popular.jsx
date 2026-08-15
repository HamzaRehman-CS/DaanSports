import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'

const Popular = () => {
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/popular-tracksuits')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPopularItems(data);
        } else {
          fetch('http://localhost:4000/all-products')
            .then(r => r.json())
            .then(all => setPopularItems(all.slice(0, 4)));
        }
      })
      .catch(err => console.error(err));
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
