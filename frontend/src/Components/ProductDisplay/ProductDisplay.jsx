import React, { useContext, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, PackageCheck, Eye, ShoppingCart, CreditCard, ArrowRight, Check } from 'lucide-react';
import CardPaymentModal from '../CardPaymentModal/CardPaymentModal';
import { useUser } from '@clerk/clerk-react';

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const { user } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageList = (product && product.images && product.images.length > 0)
    ? product.images
    : [product?.image, product?.image, product?.image];

  const [mainImage, setMainImage] = useState(product?.image || imageList[0]);
  const [selectedTab, setSelectedTab] = useState('Specs');
  const [selectedColor, setSelectedColor] = useState(
    (product?.colors && product.colors.length > 0) ? product.colors[0] : "Black"
  );
  const [selectedSize, setSelectedSize] = useState("M");

  if (!product) {
    return (
      <div className="py-32 text-center text-white bg-[#0a0a0a]">
        <div className="animate-pulse font-serif text-2xl font-black italic">Loading Wholesale Specifications...</div>
      </div>
    );
  }

  const mrpPrice = product.old_price || product.new_price * 1.3;
  const isAdded = cartItems && cartItems[product.id] > 0;
  const userEmail = user?.primaryEmailAddress?.emailAddress || localStorage.getItem('user-email') || "buyer@sportsbrand.com";

  return (
    <div className="pt-28 pb-24 bg-[#0a0a0a] text-white px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Gallery Column (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3 justify-center">
              {imageList.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-20 bg-[#18181b] border rounded overflow-hidden p-1 transition-all cursor-pointer ${
                    mainImage === img ? 'border-[#dc2626] scale-105 shadow-lg' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>

            <div className="flex-1 bg-[#18181b] border border-white/10 rounded-xl overflow-hidden relative group shadow-2xl h-[420px] sm:h-[500px]">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#dc2626] text-white px-3 py-1 font-black uppercase text-[10px] tracking-widest transform -skew-x-12 shadow-lg">
                <span className="skew-x-12 inline-block">MOQ: {product.moq || 50} Pcs</span>
              </div>
            </div>
          </div>

          {/* Details Column (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="text-golden-small font-bold uppercase tracking-widest text-[#dc2626] mb-2">
                {product.category || "Sportswear & Apparel"}
              </div>

              <h1 className="font-serif font-black italic uppercase text-white mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating Row */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-[#dc2626]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">(4.9 Factory Rating • 86 Reviews)</span>
              </div>

              {/* Price Banner */}
              <div className="bg-[#18181b] border border-white/10 p-5 rounded-xl mb-6 flex flex-wrap items-baseline gap-4 shadow-lg">
                <span className="text-3xl md:text-4xl font-serif font-black text-white italic">${Number(product.new_price).toFixed(2)}</span>
                <span className="text-sm text-zinc-500 line-through">${Number(mrpPrice).toFixed(2)}</span>
                <span className="text-xs text-zinc-400 font-bold uppercase">/ Unit (B2B Bulk Price)</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded ml-auto">
                  Volume Discount Active
                </span>
              </div>

              {/* Quick Specs Pill Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs">
                <div className="bg-[#18181b] border border-white/10 p-3 rounded text-zinc-300">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Material</span>
                  <strong className="text-white">{product.material || "80% Cotton / 20% Fleece"}</strong>
                </div>
                <div className="bg-[#18181b] border border-white/10 p-3 rounded text-zinc-300">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Fabric Weight</span>
                  <strong className="text-white">{product.gsm || "330 GSM Heavyweight"}</strong>
                </div>
                <div className="bg-[#18181b] border border-white/10 p-3 rounded text-zinc-300">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Production Lead</span>
                  <strong className="text-white">{product.leadTime || "12-15 Business Days"}</strong>
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Select Color: <strong className="text-white">{selectedColor}</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(product.colors || ["Black", "Navy", "Gray", "Red"]).map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        selectedColor === col ? 'bg-[#dc2626] border-[#dc2626] text-white shadow-lg' : 'bg-[#18181b] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Size Ratio: <strong className="text-white">{selectedSize}</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                  {["S", "M", "L", "XL", "2XL"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-10 h-10 rounded text-xs font-black uppercase border transition-all cursor-pointer ${
                        selectedSize === sz ? 'bg-white text-[#0a0a0a] border-white shadow-lg' : 'bg-[#18181b] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
              <button
                onClick={() => addToCart(product.id)}
                className="flex-1 bg-white text-[#0a0a0a] py-4 px-6 font-bold uppercase text-xs tracking-wider hover:bg-[#dc2626] hover:text-white transition-all transform -skew-x-12 cursor-pointer shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} className="skew-x-12" />
                <span className="skew-x-12 inline-block">{isAdded ? 'In Cart (Add More)' : '+ Add to Order Cart'}</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 bg-[#dc2626] text-white py-4 px-6 font-bold uppercase text-xs tracking-wider hover:bg-white hover:text-[#0a0a0a] transition-all transform -skew-x-12 cursor-pointer shadow-xl flex items-center justify-center gap-2"
              >
                <CreditCard size={16} className="skew-x-12" />
                <span className="skew-x-12 inline-block">Instant Card Order</span>
              </button>
            </div>

          </div>
        </div>

        {/* Technical Specification Tabs */}
        <div className="bg-[#18181b] border border-white/10 rounded-xl p-6 md:p-8">
          <div className="flex gap-6 border-b border-white/10 pb-4 mb-6">
            <button
              onClick={() => setSelectedTab('Specs')}
              className={`font-serif font-black italic text-lg uppercase tracking-wider transition-colors cursor-pointer ${
                selectedTab === 'Specs' ? 'text-[#dc2626] border-b-2 border-[#dc2626] pb-2' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Factory Specs & Description
            </button>
            <button
              onClick={() => setSelectedTab('Reviews')}
              className={`font-serif font-black italic text-lg uppercase tracking-wider transition-colors cursor-pointer ${
                selectedTab === 'Reviews' ? 'text-[#dc2626] border-b-2 border-[#dc2626] pb-2' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Verified Buyer Reviews (2)
            </button>
          </div>

          {selectedTab === 'Specs' ? (
            <div className="space-y-4 text-xs text-zinc-300">
              <p className="leading-relaxed text-sm text-zinc-200">
                {product.description || "Heavyweight combed cotton fleece set engineered for maximum comfort, durability, and high-density logo customization. Pre-shrunk fabric with double-needle flatlock reinforced seams."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="bg-[#0a0a0a] p-4 rounded border border-white/10">
                  <span className="text-zinc-500 font-bold uppercase text-[10px] block mb-1">Stitching</span>
                  <strong className="text-white text-sm">{product.stitching || "Double-Needle Flatlock Reinforced"}</strong>
                </div>
                <div className="bg-[#0a0a0a] p-4 rounded border border-white/10">
                  <span className="text-zinc-500 font-bold uppercase text-[10px] block mb-1">Branding Options</span>
                  <strong className="text-white text-sm">{product.customization || "3D Embroidery, Screen Print, Damask Tags"}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#0a0a0a] p-4 rounded border border-white/10 text-xs">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Alex Morgan (Team Director)</span>
                  <span className="text-[#dc2626]">★★★★★</span>
                </div>
                <p className="text-zinc-400">"Outstanding fabric density (330 GSM) and precision flatlock stitching. Custom embroidery came out flawless."</p>
              </div>
              <div className="bg-[#0a0a0a] p-4 rounded border border-white/10 text-xs">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>David K. (Retail Apparel)</span>
                  <span className="text-[#dc2626]">★★★★★</span>
                </div>
                <p className="text-zinc-400">"Shipped fast via express cargo. Color consistency across 200 tracksuits was impressive."</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Instant Checkout Modal */}
      <CardPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalAmount={product.new_price * (product.moq || 50)}
        totalUnits={product.moq || 50}
        items={[{ id: product.id, name: product.name, price: product.new_price, quantity: product.moq || 50 }]}
        userEmail={userEmail}
        onSuccess={() => navigate('/orders')}
      />
    </div>
  );
};

export default ProductDisplay;
