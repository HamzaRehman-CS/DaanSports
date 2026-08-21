import React, { useEffect, useState } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import { API_URL } from '../../config';

const RelatedProducts = (props) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { product } = props;

  useEffect(() => {
    if (product && product.category) {
      fetch(`${API_URL}/popular-tracksuits`)
        .then(res => res.json())
        .then(data => setRelatedProducts(data))
        .catch(err => console.error("Error fetching related products:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
