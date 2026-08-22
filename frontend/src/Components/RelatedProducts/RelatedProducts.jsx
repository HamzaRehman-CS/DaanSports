import React, { useEffect, useState } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import { API_URL } from '../../config';
import { loadCatalogProducts, fetchCloudProducts } from '../../Context/defaultCatalog';

const RelatedProducts = (props) => {
  const { product } = props;
  const [relatedProducts, setRelatedProducts] = useState(() => {
    const prods = loadCatalogProducts();
    if (product && product.category) {
      const matched = prods.filter(p => (p.category || '').toLowerCase() === (product.category || '').toLowerCase() && p.id !== product.id);
      return matched.length > 0 ? matched.slice(0, 4) : prods.slice(0, 4);
    }
    return prods.slice(0, 4);
  });

  useEffect(() => {
    if (product && product.category) {
      fetchCloudProducts()
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const matched = data.filter(p => (p.category || '').toLowerCase() === (product.category || '').toLowerCase() && p.id !== product.id);
            setRelatedProducts(matched.length > 0 ? matched.slice(0, 4) : data.slice(0, 4));
          }
        })
        .catch(() => {});
    }
  }, [product]);

  return (
    <div className="relatedproducts">
      <h1>Related Designs</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts.map((item, i) => {
          return (
            <Item 
              key={i} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price}
              category={item.category}
              moq={item.moq}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
