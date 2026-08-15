import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();

  const product = (all_product || []).find((e) => e.id === Number(productId));

  if (!product && (!all_product || all_product.length === 0)) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] bg-[#0a0a0a] text-center text-white flex flex-col items-center justify-center">
        <div className="animate-pulse font-serif font-black italic text-2xl mb-2">Loading Product Details...</div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest">Retrieving specifications from factory database</p>
      </div>
    );
  }

  if (!product && all_product && all_product.length > 0) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] bg-[#0a0a0a] text-center text-white flex flex-col items-center justify-center">
        <h2 className="font-serif font-black italic text-3xl text-white mb-2">Product Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6">The requested wholesale product ID #{productId} does not exist in the active catalog.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-white">
      <ProductDisplay product={product} />
    </div>
  );
};

export default Product;
