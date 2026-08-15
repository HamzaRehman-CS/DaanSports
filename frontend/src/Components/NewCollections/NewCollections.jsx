import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/new-collection')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setNew_collection(data);
        } else {
          fetch('http://localhost:4000/all-products')
            .then(r => r.json())
            .then(all => setNew_collection(all.slice(0, 8)));
        }
      })
      .catch(err => console.error(err));
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
