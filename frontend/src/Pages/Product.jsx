import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import SEO from '../Components/SEO/SEO';

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
        <SEO 
          title={`Product Not Found | DAAN Sports B2B`}
          description="The requested wholesale sportswear product could not be located."
        />
        <h2 className="font-serif font-black italic text-3xl text-white mb-2">Product Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6">The requested wholesale product ID #{productId} does not exist in the active catalog.</p>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: product.category || "Apparel", url: `/category/${(product.category || '').toLowerCase()}` },
    { name: product.name, url: `/product/${product.id}` }
  ];

  return (
    <div className="bg-[#0a0a0a] text-white">
      <SEO 
        title={`${product.name} — Wholesale & OEM Custom Manufacturing`}
        description={product.description || `Wholesale ${product.name} with ${product.gsm || 'heavyweight'} fabric, MOQ ${product.moq || 50} pcs, and custom private labeling.`}
        keywords={`${product.name}, wholesale ${product.category}, ${product.material || 'apparel'}, custom OEM sportswear`}
        ogImage={product.image}
        ogType="product"
        product={product}
        breadcrumbs={breadcrumbs}
      />
      <ProductDisplay product={product} />
    </div>
  );
};

export default Product;

