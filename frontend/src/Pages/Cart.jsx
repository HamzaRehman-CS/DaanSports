import React from 'react';
import CartItems from '../Components/CartItems/CartItems';
import SEO from '../Components/SEO/SEO';

const Cart = () => {
  return (
    <div>
      <SEO 
        title="Wholesale Order Summary & Cart"
        description="Review your wholesale order details, custom sportswear quantities, volume discounts, and calculate worldwide shipping rates."
      />
      <CartItems/>
    </div>
  );
};

export default Cart;

